from typing import Union
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv  # Corrected import statement
import requests
import os

# Start backend inside file
import uvicorn
if __name__ == '__main__':
    uvicorn.run("main:app", reload=True)

load_dotenv()

app = FastAPI()
        
app.mount("/static", StaticFiles(directory="../basic_frontend/src"), name="static")

@app.get("/favicon.ico")
async def favicon() -> FileResponse:
    return FileResponse("../basic_frontend/src/icon-park-outline_video.png", media_type="png")

@app.get("/")
async def index() -> FileResponse:
    return FileResponse("../basic_frontend/pages/main.html", media_type="html")

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
