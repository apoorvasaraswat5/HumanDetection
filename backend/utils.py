
import boto3
import sqlalchemy
from sql_app.database import SessionLocal
from sql_app.models import VideoFileRecord




AWS_ACCESS_KEY = "AKIA5YYJRHCZQMIIFD45"
AWS_SECRET_KEY = "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"
REGION_NAME = "us-east-1"
BUCKET_NAME = "human-detection-video-files"


def upload_S3(file,filename):
    s3_client = boto3.client("s3",aws_access_key_id= AWS_ACCESS_KEY,
                             aws_secret_access_key=AWS_SECRET_KEY,
                             region_name=REGION_NAME)
    
    s3_key = f"videos/{filename}"
    s3_client.upload_fileobj(file,BUCKET_NAME,s3_key)
    return s3_key
            
            
def save_file_record(filename,s3_key):
    db = SessionLocal()
    db_record = VideoFileRecord(filename=filename,s3_key=s3_key)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    db.close()