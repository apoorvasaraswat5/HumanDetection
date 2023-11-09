from fastapi import APIRouter, HTTPException
from transformers import pipeline
import requests
import os
from utils import convert_to_wav
from pyannote.audio import Pipeline
from whisper_diarization import whisper_diarization


router = APIRouter()


@router.post("/")
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


@router.post("/diarize")
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


@router.post("/transcribe")
def transcribe(filename: str):
    return whisper_diarization(filename)
