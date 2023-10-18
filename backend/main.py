import shutil
import tempfile
from typing import Union
from fastapi import FastAPI, HTTPException, UploadFile, Depends, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv  # Corrected import statement
import requests
import utils
import os
import torch
import cv2
import imutils
from pyannote.audio import Pipeline
from transformers import pipeline
from speechbox import ASRDiarizationPipeline
from datasets import load_dataset


# Start backend inside file
import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)


load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "*" #We may want to remove this in the future
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="../basic_frontend/src"), name="static")


@app.get("/favicon.ico")
async def favicon() -> FileResponse:
    return FileResponse(
        "../basic_frontend/src/icon-park-outline_video.png", media_type="png"
    )


@app.get("/")
async def index() -> FileResponse:
    return FileResponse("../basic_frontend/pages/main.html", media_type="html")


@app.post("/register")
async def register_user(
    email: str, password: str, supabase=Depends(utils.get_supabase)
):
    user_credentials = {"email": email, "password": password}

    try:
        response = supabase.auth.sign_up(user_credentials)
        return {"message": "Registration successful", "response": response}
    except AuthApiError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/login")
async def login(email: str, password: str, supabase=Depends(utils.get_supabase)):
    user_credentials = {"email": email, "password": password}
    try:
        response = supabase.auth.sign_in_with_password(user_credentials)
        return {"message": "Login successful", "response": response}
    except AuthApiError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.post("/logout")
async def logout(supabase=Depends(utils.get_supabase)):
    try:
        response = supabase.auth.sign_out()
        return {"message": "User signed out successfully"}
    except AuthApiError as e:
        raise HTTPException(status_code=400,detail = str(e))
    
@app.post("/upload")
async def upload_file(file: UploadFile):
    try:
        raw_data = utils.upload_file(file)
        data = raw_data[1][0]

    except Exception as e:
        return HTTPException(
            status_code=500,
            detail=f"Failed to upload file {file.filename} to s3.\nError that occurred: {str(e)}",
        )
    return {"message": "File uploaded successfully","file-name": file.filename}


@app.get("/fetchData")
def fetch_data():
    try:
        raw_data = utils.get_data(user_id)
        data = raw_data[1]

    except Exception as e:
        return HTTPException(
            status_code=500,
            detail=f"Failed to fetch data.\nError that occurred: {str(e)}",
        )
    return {"message": "Fetched data successfully", "data": data}

@app.get("/download")
def download_file(file_path):
    
    content_types = {"videos": "video/mp4", "thumbnails": "image/x-png", "images":"image/jpg"}
   
    file = utils.download_file_by_path(file_path)
    key = file_path.split("/")[0]
    content_type = content_types[key]
    return Response(file,media_type=content_type)


@app.post("/audio")
def query(filename: str, local=True):
    if local:
        # use speech pipeline hosted locally
        with open(filename, "rb") as f:
            data = f.read()
        pipe = pipeline("automatic-speech-recognition", model="openai/whisper-small")
        res = pipe(data)
        return res
    else:
        API_URL = "https://api-inference.huggingface.co/models/openai/whisper-small"
        headers = {"Authorization": "Bearer " + os.getenv("HF_KEY")}

        try:
            with open(filename, "rb") as f:
                data = f.read()
            response = requests.post(API_URL, headers=headers, data=data)
            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            return HTTPException(
                status_code=500,
                detail=f"Failed to connect to huggingface inference API: {e}",
            )

@app.post("/process")
def process_video(file_path):
    video = utils.download_file_by_path(file_path)
    temp_wav_path,temp_video_path = utils.extract_audio(video)

    audio_results = whisper_diarization(temp_wav_path)
    utils.upload_audio(audio_results,file_path)
    video_results = detect_person(temp_video_path,file_path)

    os.remove(temp_wav_path)
    os.remove(temp_video_path)
    return {"audio": audio_results, "video": video_results}
    
    

@app.post("/diarize")
def diarize(filename: str):
    filename = convert_to_wav(filename)
    diarization_pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.0",
        use_auth_token=os.getenv("HF_KEY"),
    )
    outputs = diarization_pipeline(filename)

    starts = []
    ends = []
    speakers = []

    for turn, _, speaker in outputs.itertracks(yield_label=True):
        starts.append(turn.start)
        ends.append(turn.end)
        speakers.append(speaker)

    return [{"starts": starts}, {"ends": ends}, {"speakers": speakers}]



@app.post("/transcribe")
def transcribe(filename: str):
    return whisper_diarization(filename)


@app.post("/transcribe")
def transcribe(filename: str):
    # get pretrained diarization pipeline
    diarization_pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.0",
        use_auth_token=os.getenv("HF_KEY"),
    )

    # get pretrained asr pipeline
    asr_pipeline = pipeline(
        "automatic-speech-recognition",
        model="openai/whisper-base",
    )

    # load dataset of concatenated LibriSpeech samples
    concatenated_librispeech = load_dataset(
        "sanchit-gandhi/concatenated_librispeech", split="train", streaming=True
    )
    # get first sample
    sample = next(iter(concatenated_librispeech))

    # get composite pipeline
    comp_pipeline = ASRDiarizationPipeline(
        asr_pipeline=asr_pipeline, diarization_pipeline=diarization_pipeline
    )

    output = comp_pipeline(sample["audio"])

    return output
