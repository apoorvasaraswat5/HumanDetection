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
from gotrue.errors import AuthApiError
from utils import convert_to_wav
from whisper_diarization import whisper_diarization
from transformers import AutoFeatureExtractor, AutoModelForObjectDetection
from PIL import Image

# Start backend inside file
import uvicorn

if __name__ == "__main__":
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
        raise HTTPException(status_code=401, detail=str(e))


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
    return {"message": "File uploaded successfully", "data": data}


@app.get("/fetchData")
def fetch_data(user_id=0):
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

    video_results = detect_person(temp_video_path,file_path)
    audio_results = whisper_diarization(temp_wav_path)
    
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


@app.post("/video")
def detect_person(local_file_path: str, s3_key_video: str):
    # this needs s3_key_video to identify which video we need to add the output for
    video_path, images_path = humanDetector(local_file_path)
    raw_data = utils.upload_output_video_and_images(video_path, images_path, s3_key_video)
    data = raw_data[1][0]
    remove_temp_files(video_path, images_path)
    return {"output": data}


def humanDetector(local_file_path):
    print("inside humanDetector")
    # Initialize the object detection model (change the model name)
    model_name = "facebook/detr-resnet-50"
    feature_extractor = AutoFeatureExtractor.from_pretrained(model_name)
    model = AutoModelForObjectDetection.from_pretrained(model_name)

    object_detection = pipeline("object-detection", model=model, feature_extractor=feature_extractor)

    # Initialize the face detection model (use your own pre-trained model)
    cap = cv2.VideoCapture(local_file_path)

    # Initialize variables for face tracking
    faces = []
    face_id = 0

    # Create a VideoWriter object to save the output videos
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    video_path = os.path.join(os.getcwd(), "output_video.mp4")
    images_path = os.path.join(os.getcwd(), "images")

    if not os.path.exists("images"):
        os.mkdir("images")

    output_video = cv2.VideoWriter(video_path, fourcc, 20.0, (640, 480))

    while cap.isOpened():
        ret, frame = cap.read()

        if not ret:
            break

        # Resize the frame for faster processing
        frame = cv2.resize(frame, (640, 480))
        color_converted = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(color_converted)

        # Detect objects in the frame using the object detection model
        results = object_detection(pil_image)

        # Extract human objects from detected objects
        humans = [obj for obj in results if obj['label'] == 'person']
        print("human detected")
        for human in humans:
            x1, y1, x2, y2 = human['box'].values()
            # Draw a rectangle around the detected human
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            # Extract the human face from the region
            face = frame[y1:y2, x1:x2]
            try:
                face = cv2.resize(face, (640, 480))
            except Exception:
                continue

            is_unique = True
            for existing_face in faces:
                print("checking face similarity..")
                similarity = cv2.matchTemplate(face, existing_face, cv2.TM_CCOEFF_NORMED)
                if similarity.max(initial=None) > 0.25:  # Adjust the threshold as needed
                    print("not unique")
                    is_unique = False
                    break
            # Check if the face is unique by comparing with previously detected faces

            if is_unique:
                print("unique")
                faces.append(face)
                face_id += 1
                cv2.imwrite(os.path.join("images", f"unique_face_{face_id}.jpg"), face)

        print("writing frame")
        # Write the frame to the output videos
        output_video.write(frame)

    print("done")
    cap.release()
    output_video.release()
    cv2.destroyAllWindows()
    return video_path, images_path


def remove_temp_files(video_path, images_path):
    print("Removing temporary files")
    try:
        os.remove(video_path)
        shutil.rmtree(images_path)
    except OSError as e:
        print("Error: %s - %s." % (e.filename, e.strerror))
        raise e
