from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv  # Corrected import statement
import requests
import os

load_dotenv()

app = FastAPI()


@app.post("/audio")
def query(filename: str):
    API_URL = "https://api-inference.huggingface.co/models/openai/whisper-small"
    headers = {"Authorization": os.getenv("HF_KEY")}

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
