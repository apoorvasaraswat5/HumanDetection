"use client"
import Card from "@/components/Card";
import Image from "@/components/Image";
import TranscriptCard from "@/components/TranscriptCard";
import { VideoArtifacts, getAllVideosResponse } from "@/utils/api";
import { getAllVideos, getVideoArtifacts } from "@/utils/api-mocks";
import { useEffect, useState } from "react";
export default function Home() {
  const [Videos, setVideos] = useState<getAllVideosResponse>([] as any);
  const [currentVideo, setcurrentVideo] = useState('');
  const [currentVideoArtifacts, setcurrentVideoArtifacts] = useState<VideoArtifacts>({} as any)
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
          return <Card onClick={onSidebarClick(video.id)} fileName={video.title} key={video.id} size={video.size}/>;
        })}
      </div>
      <div className="content w-3/4 flex flex-col p-2 bg-white">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Images
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          {
            currentVideoArtifacts.peopleDetectedFrames?.map((frame) => {
              return <img
              className="h-[200px] w-[250px] max-w-lg rounded-lg"
              alt=""
              src={frame.thumbnail}
              key={frame.thumbnail}
            />
            })
          }
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Audio
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          {
            currentVideoArtifacts.voiceDetectedFrames?.map((frame) => {
              return <TranscriptCard content={frame.transcript} key={frame.timestamp}/>
            })
          }
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          People
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          {
            currentVideoArtifacts.distinctPeopleDetected?.map((person) => {
              return <img
              className="h-[200px] w-[250px] max-w-lg rounded-lg"
              alt=""
              src={person.thumbnail}
              key={person.thumbnail}
              />
            })
          }
        </div>
      </div>
    </div>
  );
}
