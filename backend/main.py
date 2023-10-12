from typing import Union
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv  # Corrected import statement
import requests
import os
import torch
from pyannote.audio import Pipeline
from transformers import pipeline


# Start backend inside file
import uvicorn
if __name__ == '__main__':
    uvicorn.run("main:app", reload=True)

load_dotenv()

app = FastAPI()

app.mount("/static", StaticFiles(directory="../basic_frontend/src"), name="static")


@app.get("/")
async def index() -> FileResponse:
    return FileResponse("../basic_frontend/pages/main.html", media_type="html")


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
