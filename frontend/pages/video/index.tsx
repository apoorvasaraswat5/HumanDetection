'use client';
import { useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import Card from '@/components/Card';
import CustomSeekBar from '@/components/SeekBar';

const videoOptions = {
  controls: true,
  fill: true,
  sources: [
    {
      src: "https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/sign/demo/public/Me%20at%20the%20zoo.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vL3B1YmxpYy9NZSBhdCB0aGUgem9vLm1wNCIsImlhdCI6MTY5ODM1Mzg4NiwiZXhwIjoxNzI5ODg5ODg2fQ.dfwfj6lM8rujyFmeLOJWsG-rRRwSHMLabOtwGCJhgR4&t=2023-10-26T20%3A58%3A07.114Z",
      type: "video/mp4"
    }
  ]
};

export default function Home() {
  const [Videos, setVideos] = useState([
    "Video1.mp4",
    "Video2.mp4",
    "Video3.mp4",
    "Video4.mp4",
    "Video5.mp4",
    "Video6.mp4",
    "Video7.mp4",
  ]);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  return (
    <div className="main-content flex h-screen">
      <div className="sidebar w-1/4 space-y-3 bg-gray-300 overflow-scroll">
          {Videos.map((video) => {
            return <Card onClick={() => null} fileName={video} key={video} size="100MB"/>;
          })}
        </div>
      <div className="content w-3/4 flex flex-col h-2/3">
      <VideoPlayer setVideoDuration={setVideoDuration} setCurrentTime={setCurrentTime} options={videoOptions} />
       <CustomSeekBar duration={videoDuration} currentTime={currentTime} onSeek={() => null} />
       </div>
       </div>
  )
}
