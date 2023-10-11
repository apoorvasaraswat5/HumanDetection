import datetime
from sqlalchemy import Column, Integer, String, DateTime

from .database import Base

class VideoFileRecord(Base):
    __tablename__ = "video_metadata"
    id = Column(Integer, primary_key= True, index=True)
    filename = Column(String,index=True)
    s3_key = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    