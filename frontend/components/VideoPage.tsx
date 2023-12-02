"use client";
import { useRef, useState } from "react";
import VideoPlayer from '@/components/VideoPlayer';
import CustomSeekBar from "@/components/SeekBar";
import { placeholderVideo } from "@/utils/api-mocks";
import { VideoArtifacts } from "@/utils/api";

export default function VideoPage({src=placeholderVideo, VideoArtifacts} : {src?: string, VideoArtifacts?: VideoArtifacts}) {

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
  const videoRef = useRef(null);

  const setPlayerTime = (time: number) => {
    if (videoRef?.current) {
      videoRef.current.currentTime = time;
    }
  }
  return (
    <div className="main-content flex flex-col h-2/3 ">
        <VideoPlayer
        ref={videoRef}
        setVideoDuration={setVideoDuration}
        setCurrentTime={setCurrentTime}
        options={videoOptions}
          
        />
        <CustomSeekBar
          duration={videoDuration}
          currentTime={currentTime}
          onSeek={setPlayerTime}
          markers={VideoArtifacts?.peopleDetectedFrames}
        />
    </div>
  );
}
