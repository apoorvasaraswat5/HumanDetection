from typing import Union
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv  # Corrected import statement
import requests
import utils
import os


load_dotenv()

app = FastAPI()
        
app.mount("/static", StaticFiles(directory="../basic_frontend/src"), name="static")


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
    
    
@app.post("/upload/")
async def upload_file(file: UploadFile):
    try:
        s3_key = utils.upload_file(file)
           
    except Exception as e:
        return HTTPException(
            status_code=500,
            detail=f"Failed to upload file {file.filename} to s3.\nError that occured: {str(e)}",
        )
    return {"message": "File uploaded successfully","s3_key": s3_key}
