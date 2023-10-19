
import os

import uuid
from supabase import create_client, Client
from dotenv import load_dotenv



load_dotenv()

BUCKET_NAME = "human-detection-video-files"

TABLE_NAME = "video-files"

TEMPORARY_USER_ID = "temp_user"

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))



def upload_file(file):
    s3_key = f"videos/{file.filename}_{uuid.uuid4()}"
    video_content = file.file.read()
    supabase.storage.from_(BUCKET_NAME).upload(path=s3_key,file=video_content,file_options={"content-type": file.content_type})
    data,count = supabase.table(TABLE_NAME).insert({"filename": file.filename,"s3_key":s3_key, "user_id": TEMPORARY_USER_ID}).execute()
    return data
            
def download_file_by_key(s3_key):
    return supabase.storage.from_(BUCKET_NAME).download(s3_key)


def get_keys_for_user(user_id):
    data,count = supabase.table(TABLE_NAME).select('s3_key').eq('user_id',user_id).execute()
    return data