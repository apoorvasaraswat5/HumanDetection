"use client";
import { useState } from "react";
import VideoPlayer from '@/components/VideoPlayer';
import CustomSeekBar from "@/components/SeekBar";
import { placeholderVideo } from "@/utils/api-mocks";

export default function VideoPage({src=placeholderVideo} : {src?: string}) {

const videoOptions = {
    controls: true,
    fill: true,
    sources: [
        {
        src:src,
        type: "video/mp4",
        },
    ],
    };
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  return (
    <div className="main-content flex flex-col h-2/3">
        <VideoPlayer
          setVideoDuration={setVideoDuration}
          setCurrentTime={setCurrentTime}
          options={videoOptions}
        />
        <CustomSeekBar
          duration={videoDuration}
          currentTime={currentTime}
          onSeek={() => null}
        />
    </div>
  );
}
