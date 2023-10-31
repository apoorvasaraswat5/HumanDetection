import os
import shutil
import tempfile
from PIL import Image
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv
from moviepy.editor import VideoFileClip
from io import BytesIO


load_dotenv()

BUCKET_NAME = "human-detection-video-files"

TABLE_NAME = "video-files"


supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


def get_supabase():
    return supabase


def upload_file(file):
    uuid_val = uuid.uuid4()
    s3_key_video = f"videos/{file.filename}_{uuid_val}"
    user_data = supabase.auth.get_user()
    # in the future throw auth error if user doesn't exist
    user_id = 0
    if user_data:
        user_id = user_data.user.id

    thumbnail = create_thumbnail(file)
    s3_key_thumbnail = f"thumbnails/{file.filename}_{uuid_val}_thumbnail"
    file.file.seek(0)
    video_content = file.file.read()
    supabase.storage.from_(BUCKET_NAME).upload(
        path=s3_key_video,
        file=video_content,
        file_options={"content-type": file.content_type},
    )
    supabase.storage.from_(BUCKET_NAME).upload(
        path=s3_key_thumbnail,
        file=thumbnail,
        file_options={"content-type": "image/x-png"},
    )
    data, count = (
        supabase.table(TABLE_NAME)
        .insert(
            {
                "filename": file.filename,
                "video_path": s3_key_video,
                "thumbnail_path": s3_key_thumbnail,
                "user_id": user_id,
            }
        )
        .execute()
    )
    return data


def create_thumbnail(file):
    temp_file_path = tempfile.NamedTemporaryFile(delete=False).name
    with open(temp_file_path, "wb") as temp_file:
        shutil.copyfileobj(file.file, temp_file)

    with BytesIO() as thumbnail_buffer:
        with VideoFileClip(temp_file_path) as video:
            thumbnail = video.get_frame(0)
            thumbnail_image = Image.fromarray(thumbnail)
            thumbnail_image.save(thumbnail_buffer, format="PNG")
            thumbnail_buffer.seek(0)
        os.remove(temp_file_path)
        return thumbnail_buffer.getvalue()


def download_file_by_key(s3_key):
    return supabase.storage.from_(BUCKET_NAME).download(s3_key)


def get_keys_for_user(user_id):
    data, count = (
        supabase.table(TABLE_NAME).select("s3_key").eq("user_id", user_id).execute()
    )
    return data


def get_data():
    data, count = supabase.table(TABLE_NAME).select("*").execute()
    return data


# audio helper functions
def convert_to_wav(filename: str):
    name, ext = os.path.splitext(filename)
    path = f"{name}.wav"

    if ext != ".wav":
        # convert to wav it is not already in the format
        os.system(f"ffmpeg -i {filename} {name}.wav")
    return path
