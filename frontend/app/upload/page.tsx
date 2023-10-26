"use client"
import Card from "@/components/Card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { useState } from "react";
import style from 'app/upload/upload.module.css';
import RecentUpload from "./components/RecentUpload";

export default function page() {
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
  const [uploadIsActive, setUploadIsActive] = useState(false);
  const [recentIsActive, setRecentIsActive] = useState(true);

  const handleClick = (event: any) => {
    const target = event.target.id;
    if(target=='upload'){
        setUploadIsActive(current => true);
        setRecentIsActive(current => false);
    }else if(target=='recent'){
        setUploadIsActive(current => false);
        setRecentIsActive(current => true);
    }else{

    }
  };

  const onClick = () => {};

  return (
    <div className="main-content flex h-screen">
        <div className={style.topnav}>
            <div className={style.selector}>
                <div id="recent" className={recentIsActive ? style.active : ''} onClick={handleClick}>Recent</div>
                <div id="upload" className={uploadIsActive ? style.active : ''} onClick={handleClick}>Upload</div>
            </div>
        </div>
        {/* <div style="height: 40px;"></div> */}
        <div id="recentlist" className="w-full">
            {Videos.map((video) => {
                return <RecentUpload onClick={onClick} fileName={video} key={video} size="100MB"/>;
            })}
        </div>
        <div id={style.uploadarea}>
            <div id={style.droparea}>
                <form className={style.dropform}>
                    {/* <input type="file" id="fileElem" multiple accept="video/*" onchange="sendFiles(this.files)"> */}
                    {/* <label for="fileElem" className="prompttext">Click to browse or drag and drop files</div> */}
                </form>
            </div>
        </div>
    </div>
  );
}
