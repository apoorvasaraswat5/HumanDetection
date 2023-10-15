
import os

import uuid
from supabase import create_client, Client
from dotenv import load_dotenv



load_dotenv()

BUCKET_NAME = "human-detection-video-files"


supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))



def upload_file(file):
    s3_key = f"videos/{file.filename}_{uuid.uuid4()}"
    video_content = file.file.read()
    supabase.storage.from_(BUCKET_NAME).upload(path=s3_key,file=video_content,file_options={"content-type": file.content_type})
    data,count = supabase.table('video-files').insert({"filename": file.filename,"s3_key":s3_key}).execute()
    return s3_key
            