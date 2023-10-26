from typing import Union
from fastapi import FastAPI, HTTPException, UploadFile, Depends
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
from gotrue.errors import AuthApiError

# Start backend inside file
import uvicorn
if __name__ == '__main__':
    uvicorn.run("main:app", reload=True)


load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
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
    return FileResponse("../basic_frontend/src/icon-park-outline_video.png", media_type="png")

@app.get("/")
async def index() -> FileResponse:
    return FileResponse("../basic_frontend/pages/main.html", media_type="html")

@app.post("/register")
async def register_user(email: str, password:str,supabase = Depends(utils.get_supabase)):
    user_credentials = {"email":email, "password": password}
    
    try:
        response = supabase.auth.sign_up(user_credentials)
        return {"message": "Registration successful", "response": response}
    except AuthApiError as e:
        raise HTTPException(status_code=400,detail = str(e))

@app.post("/login")
async def login(email: str, password:str,supabase = Depends(utils.get_supabase)):
    user_credentials = {"email":email, "password": password}
    try:
        response = supabase.auth.sign_in_with_password(user_credentials)
        return {"message": "Login successful","response":response}
    except AuthApiError as e:
        raise HTTPException(status_code=401,detail = str(e))

@app.post("/logout")
async def logout(supabase = Depends(utils.get_supabase)):
    try:
        response = supabase.auth.sign_out()
        return {"message": "User signed out successfully"}
    except AuthApiError as e:
        raise HTTPException(status_code=400,detail = str(e))
    
@app.post("/upload/")
async def upload_file(file: UploadFile):
    try:
        raw_data = utils.upload_file(file)
        data = raw_data[1][0]
           
    except Exception as e:
        return HTTPException(
            status_code=500,
            detail=f"Failed to upload file {file.filename} to s3.\nError that occurred: {str(e)}",
        )
    return {"message": "File uploaded successfully","data": data}


@app.post("/fetchData")
def fetch_data():
    try:
        data = utils.get_data()

    except Exception as e:
        return HTTPException(
            status_code=500,
            detail=f"Failed to fetch data.\nError that occurred: {str(e)}",
        )
    return {"message": "Fetched data successfully","data": data}


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


@app.post("/diarize")
def diarize(filename: str):
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.0",
        use_auth_token=os.getenv("HF_KEY"),
    )
    # use pretrained pipeline
    diarization = pipeline(filename)

    rttm_content = diarization.to_rttm()
    return {"rttm": rttm_content}


@app.post("/video")
def detect_person(local_file_path: str):
    output_path = humanDetector(local_file_path)
    print("local path: ", local_file_path)
    return {"output_path": output_path}


def detect(frame):
    HOGCV = cv2.HOGDescriptor()
    HOGCV.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
    bounding_box_cordinates, weights = HOGCV.detectMultiScale(frame, winStride=(4, 4), padding=(8, 8), scale=1.03)

    person = 1
    for x, y, w, h in bounding_box_cordinates:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(frame, f'person {person}', (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        person += 1

    cv2.putText(frame, 'Status : Detecting ', (40, 40), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 0, 0), 2)
    cv2.putText(frame, f'Total Persons : {person-1}', (40, 70), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 0, 0), 2)
    cv2.imshow('output', frame)

    return frame


def humanDetector(local_file_path):
    # image_path = args["image"]
    video_path = local_file_path
    output_path = os.getcwd() + "\\..\\output\\output.mp4"
    print("output: ", output_path)
    writer = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'MJPG'), 10, (600, 600))

    if video_path is not None:
        print('[INFO] Opening Video from path.')
        return detectByPathVideo(video_path, writer, output_path)


def detectByPathVideo(path, writer, output_path):
    video = cv2.VideoCapture(path)
    check, frame = video.read()
    if not check:
        print('Video Not Found. Please Enter a Valid Path (Full path of Video Should be Provided).')
        print("path: ", path)
        return

    print('Detecting people...')
    while video.isOpened():
        # check is True if reading was successful
        check, frame = video.read()

        if check:
            frame = imutils.resize(frame, width=min(800, frame.shape[1]))
            frame = detect(frame)

            if writer is not None:
                writer.write(frame)

            key = cv2.waitKey(1)
            if key == ord('q'):
                break
        else:
            break
    video.release()
    cv2.destroyAllWindows()
    return output_path
