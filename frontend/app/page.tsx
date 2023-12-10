"use client";
import Card from "@/components/Card";
import VideoPage from "@/components/VideoPage";
import VideoPreview from "@/components/VideoPreview";
import {
  VideoArtifacts,
  fetchData,
  fetchVideoArtifacts,
  getAllVideosResponse,
} from "@/utils/api";
import { getAllVideos, getVideoArtifacts } from "@/utils/api-mocks";
import { get } from "http";
import { useEffect, useState } from "react";
export default function Home() {
  const [Videos, setVideos] = useState<getAllVideosResponse>([] as any);
  const [currentVideo, setcurrentVideo] = useState("1");
  const [currentVideoArtifacts, setcurrentVideoArtifacts] =
    useState<VideoArtifacts>({} as any);
  const [isPlaying, setIsPlaying] = useState(false);

  const activatePlayer = () => {
    setIsPlaying(true);
  };
  const onSidebarClick = (currentVideo: string) => () => {
    setcurrentVideo(currentVideo);
    setIsPlaying(false);
  };
  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     const res: any =  await getAllVideos();
  //     setVideos(res);
  //   }
  //   fetchVideos();
  // },[])
  // useEffect(() => {
  //   const fetchVideoArtifacts = async () => {
  //     const res: any = await getVideoArtifacts(currentVideo);
  //     setcurrentVideoArtifacts(res);
  //   }
  //   fetchVideoArtifacts();
  // },[Videos, currentVideo])

  useEffect(() => {
    const getData = async () => {
      const res = await fetchData();
      setVideos(res);
    };
    getData();
  }, []);

  useEffect(() => {
    const getVideoArtifacts = async () => {
      const res: any = await fetchVideoArtifacts(currentVideo);
      setcurrentVideoArtifacts(res);
    };
    getVideoArtifacts();
  }, [Videos, currentVideo]);
  return (
    <>
      <div className="navbar justify-between flex bg-white text-gray-900">
        <div></div>
        <div className="gap-10">
          <a className="" href="/">
            Home
          </a>
          <a href="upload">Upload</a>
        </div>
        <a className="">Login</a>
      </div>
      <div className="main-content flex h-screen">
        <div className="sidebar w-1/4 space-y-3 bg-gray-300 overflow-scroll">
          {Videos.map((video) => {
            return (
              <Card
                onClick={onSidebarClick(video.id)}
                activatePlayer={activatePlayer}
                isPlaying={isPlaying}
                fileName={video.title}
                key={video.id}
                size={video.size}
                thumbnail={video.thumbnail}
                date={video.dateCreated}
              />
            );
          })}
        </div>
        <div className="content w-3/4 flex flex-col p-2 bg-white">
          {isPlaying ? (
            <VideoPage
              src={currentVideoArtifacts.videoURL}
              VideoArtifacts={currentVideoArtifacts}
            />
          ) : (
            <VideoPreview currentVideoArtifacts={currentVideoArtifacts} />
          )}
        </div>
      </div>
    </>
  );
}
