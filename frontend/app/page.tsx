"use client"
import Card from "@/components/Card";
import VideoPage from "@/components/VideoPage";
import VideoPreview from "@/components/VideoPreview";
import { VideoArtifacts, getAllVideosResponse } from "@/utils/api";
import { getAllVideos, getVideoArtifacts } from "@/utils/api-mocks";
import { useEffect, useState } from "react";
export default function Home() {
  const [Videos, setVideos] = useState<getAllVideosResponse>([] as any);
  const [currentVideo, setcurrentVideo] = useState('1');
  const [currentVideoArtifacts, setcurrentVideoArtifacts] = useState<VideoArtifacts>({} as any)
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }
  const onSidebarClick = (currentVideo: string) => (e: any) => {
    e.stopPropagation();
    setcurrentVideo(currentVideo);
  };
  useEffect(() => {
    const fetchVideos = async () => {
      const res: any =  await getAllVideos();
      setVideos(res);
    }
    fetchVideos();
  },[])
  useEffect(() => {
    const fetchVideoArtifacts = async () => {
      const res: any = await getVideoArtifacts(currentVideo);
      setcurrentVideoArtifacts(res);
    }
    fetchVideoArtifacts();
  },[Videos, currentVideo])

  return (
    <div className="main-content flex h-screen">
      <div className="sidebar w-1/4 space-y-3 bg-gray-300 overflow-scroll">
        {Videos.map((video) => {
          return <Card onClick={onSidebarClick(video.id)} togglePlay={togglePlay} fileName={video.title} key={video.id} size={video.size} thumbnail={video.thumbnail} date={video.dateCreated}/>;
        })}
      </div>
      <div className="content w-3/4 flex flex-col p-2 bg-white">
      {
        isPlaying ? <VideoPage src={currentVideoArtifacts.videoURL}/> :
        <VideoPreview currentVideoArtifacts={currentVideoArtifacts}/>
      }
      </div>
      
    </div>
  );
}
