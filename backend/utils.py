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


def upload_audio(audio,video_path):
    audio_res = {"audio": audio}
    supabase.table(TABLE_NAME).update({'audio': audio_res}).eq('video_path',video_path).execute()

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

def extract_audio(video):
    temp_video = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
    temp_video.write(video)
    temp_video_path = temp_video.name
    temp_video.close()
    
    video_clip = VideoFileClip(temp_video_path)
    audio_clip = video_clip.audio
    
    temp_wav = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    temp_wav_path = temp_wav.name
   
    audio_clip.write_audiofile(temp_wav_path)
    temp_wav.close()

    
    video_clip.close()
    audio_clip.close()
    
    
    return temp_wav_path,temp_video_path

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
            
def download_file_by_path(file_path):
    return supabase.storage.from_(BUCKET_NAME).download(file_path)



def get_keys_for_user(user_id):
    data, count = (
        supabase.table(TABLE_NAME).select("s3_key").eq("user_id", user_id).execute()
    )
    return data



def get_data(user_id):
    data,count = supabase.table(TABLE_NAME).select('*').eq("user_id",user_id).execute()
    return data


# audio helper functions
def convert_to_wav(filename: str):
    name, ext = os.path.splitext(filename)
    path = f"{name}.wav"

    if ext != ".wav":
        # convert to wav it is not already in the format
        os.system(f"ffmpeg -i {filename} {name}.wav")
    return path


def upload_output_video_and_images(video_path, images_path, s3_key_video):

    user_data = supabase.auth.get_user()
    #in the future throw auth error if user doesn't exist
    user_id = 0
    if user_data:
        user_id = user_data.user.id

    # upload output video

    video_file_name = s3_key_video.split("/")[1] + "_output_video.mp4"  # videos/videoplayback.mp4_b748dfaf-369b-4fc5-9a93-7d7d5a31e694
    video_path_on_supastorage = f"videos/{video_file_name}"

    with open(video_path, "rb") as file:
        supabase.storage.from_(BUCKET_NAME).upload(
            path=video_path_on_supastorage,
            file=file,
            file_options={"content-type": "video/mp4"}
        )

    # upload images

    images_path_on_supastorage = list()
    images_directory = os.fsencode(images_path)

    for file in os.listdir(images_directory):
         filename = os.fsdecode(file)
         if filename.endswith(".jpg"):
            filepath = os.path.join(images_path, filename)
            image_file_path_on_supastorage = f"images/{video_file_name}/{filename}"

            with open(filepath, "rb") as file:
                supabase.storage.from_(BUCKET_NAME).upload(
                    path=image_file_path_on_supastorage,
                    file=file,
                    file_options={"content-type": "image/jpg"}
                )
            images_path_on_supastorage.append(image_file_path_on_supastorage)

    data,count = supabase.table(TABLE_NAME).update({"image_path": images_path_on_supastorage, "output_video_path": video_path_on_supastorage}).eq('user_id', user_id).eq('video_path', s3_key_video).execute()
    return data
