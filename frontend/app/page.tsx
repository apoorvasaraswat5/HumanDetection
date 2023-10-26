"use client"
import Card from "@/components/Card";
import { useState } from "react";
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
  const images = [
    "https://i.imgur.com/XgbZdeA.jpeg",
    "https://i.imgur.com/3FVUanX.jpeg",
  ];
  const [imgIndex, setImgIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const onClick = () => {
    setImgIndex((imgIndex + 1) % images.length);
  };
  const openAudio = () => {
    console.log(`open:`);
    setOpen(!open);
  }
  return (
    <div className="main-content flex h-screen">
      <div className="sidebar w-1/4 space-y-3 bg-gray-300 overflow-scroll">
        {Videos.map((video) => {
          return <Card onClick={onClick} fileName={video} key={video} size="100MB"/>;
        })}
      </div>
      <div className="content w-3/4 flex flex-col p-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Images
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          {Array(4)
            .fill(0)
            .map((_, index) => {
              return (
                <img
                  className="h-[200px] w-[250px] max-w-lg rounded-lg"
                  alt=""
                  src={images[imgIndex]}
                  key={index}
                />
              );
            })}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Audio
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          {Array(4)
            .fill(0)
            .map((_, index) => {
              return (
                <img
                  onClick={openAudio}
                  className="h-[200px] w-[250px] max-w-lg rounded-lg"
                  alt=""
                  src={images[imgIndex]}
                  key={index}
                />
              );
            })}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          People
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          {Array(4).fill(0).map((_, index) => {
            return (
              <img
            className="h-[200px] w-[200px] max-w-lg rounded-full"
            alt=""
            src={images[imgIndex]}
            key={index}
          />
            )
          })}
        </div>
      </div>
      {/* <Dialog>
    <DialogTrigger>Dialog trigger</DialogTrigger>
    <DialogContent>Dialog Content</DialogContent>
  </Dialog> */}
    </div>
  );
}
