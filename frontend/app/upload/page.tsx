"use client"
import { useRef, useState, useEffect, useCallback } from "react";
import style from 'app/upload/upload.module.css';
import RecentUpload from "./components/RecentUpload";
import CurrentUpload from "./components/CurrentUpload";
import VideoPage from "@/components/VideoPage";
import { VideoArtifacts, fetchData, fetchVideoArtifacts, getAllVideosResponse } from "@/utils/api";
import axios from "axios";

interface Video {
  name: string;
  date: string;
  processed: string;
  thumbnail_path: string;
  video_path: string;
  image_path: string[];
}

interface VideoUpload extends Video{
  status: string;
}

export default function page() {

  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [currentUpload, setCurrentUpload] = useState<VideoUpload | null>(null);
  const [allUploads, setAllUploads] = useState<VideoUpload[]>([]);
  const [currentVideoArtifacts, setcurrentVideoArtifacts] = useState<VideoArtifacts>({} as any)

  const getRecent = () => {
    let vals: any[] = []
    const user_id = '0'
    fetch('http://127.0.0.1:8000/fetchData?user_id=' + user_id, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(body => {
        body.data.forEach((video: any) => 
        {
          let process = []
          if(video.audio_results){
            process.push('Audio')
          }
          if(video.image_path){
            process.push('Video')
          }
          vals.push({
            "name":video.filename,
            "date":video.created_at,
            "processed":process.length === 0 ? 'Not Processed':process.join(', '),
            "thumbnail_path":video.thumbnail_path,
            "video_path":video.video_path,
            "image_path":video.image_path
          });
        });
        setRecentVideos(() => vals);
      })
      .catch(rejected => {
        console.log(rejected)
      });
    return vals;
  };

  useEffect(() => {
    const vals = getRecent();
  },[])

  async function uploadFile(file:any) {
    var formData = new FormData();
    let status = '';
    formData.append('file',file);
    setCurrentUpload(() => {
      return {
        name: file.name,
        date: file.lastModifiedDate.toUTCString(),
        processed: 'Not Processed',
        status: "0%",
        thumbnail_path: "",
        video_path: "",
        image_path: []
      }
    })
    const res = await axios.post('http://127.0.0.1:8000/upload',formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: progressEvent => {
        setCurrentUpload((currUpload) => {
          if(progressEvent.total){
            if(currUpload){
              currUpload.status = (Math.floor((progressEvent.loaded/progressEvent.total)*100)-1).toString() + '%';
            }
          } else {
            if(currUpload){
              currUpload.status = 'UNK';
            }
          }
          const newCurr = JSON.parse(JSON.stringify(currUpload))
          console.log(progressEvent.loaded)
          console.log(progressEvent.total)
          return newCurr;
        })
      }
    })
    if (res.data.status_code == 500){
      status = 'Error!'
      setCurrentUpload((currUpload) => {
        if(currUpload){
          currUpload.status = res.data.detail;
        }
        const newCurr = JSON.parse(JSON.stringify(currUpload))
        return newCurr;
      })      
    } else {
      status = '100%'
      setCurrentUpload((currUpload) => {
        if(currUpload){
          currUpload.status = "100%";
        }
        const video_path = res.data.data.video_path
        fetch('http://127.0.0.1:8000/process?file_path=' + videoPath, {
          method: 'POST'
        })
        const newCurr = JSON.parse(JSON.stringify(currUpload))
        return newCurr;
      })  
    }
    return {
      name: file.name,
      date: file.lastModifiedDate.toUTCString(),
      size: file.size,
      status: status
    };
  }

  async function sendFiles(files: any){
    console.log(files)
    for(const file of files){
        const curr = await uploadFile(file);
        setAllUploads((temp) => JSON.parse(JSON.stringify([curr, ...temp])));
        setCurrentUpload(() => null);
    }
  };

  const [uploadIsActive, setUploadIsActive] = useState(false);
  const [recentIsActive, setRecentIsActive] = useState(true);
  const [videoPlayerActive, setVideoPlayerActive] = useState(false);
  const [videoPath, setVideoPath] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [asc, setAscDesc] = useState(false);

  const handleClick = (event: any) => {
    const target = event.target.id;
    if(target=='upload'){
      setUploadIsActive(current => true);
      setRecentIsActive(current => false);
      setVideoPlayerActive(current => false);
    }else if(target=='recent'){
      setUploadIsActive(current => false);
      setRecentIsActive(current => true);
      setVideoPlayerActive(current => false);
      getRecent();
    }else{
      console.log('TO BE IMPLEMENTED');
    }
  };

  const startVideo = (video: VideoArtifacts) => {
    return (event: any) => {
      setUploadIsActive(current => false);
      setRecentIsActive(current => false);
      setVideoPlayerActive(current => true);
      setVideoPath(current => video.videoURL);
      setcurrentVideoArtifacts(current => video)
    }
  }

  const [highlight, setHighlight] = useState(false);
  const fileDragHighlight = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(event)
    setHighlight(current => true);
  };

  const fileDragUnHighlight = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(event)
    setHighlight(current => false)
  };

  const filesDropped = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(event)
    setHighlight(current => false);
    if(event.dataTransfer.items){
      sendFiles(event.dataTransfer.files)
    }
  }

  const inputFile = useRef<any>();
  const browseFiles = (event: any) => {
    if(inputFile.current){
      inputFile.current.click();
    }
  };

  const handleInput = (event: any) => {
    sendFiles(event.target.files);
  }
  return (
    <div className="main-content flex h-screen">
        <div className={style.topnav}>
          <div className={style.selector}>
              <a href='/'>Home</a>
              <div id="recent" className={recentIsActive ? style.active : 'border-black border-x'} onClick={handleClick}>Recent</div>
              <div id="upload" className={uploadIsActive ? style.active : ''} onClick={handleClick}>Upload</div>
          </div>
      </div>
        {videoPlayerActive ?(
            <div className="content w-full flex flex-col p-20 bg-white mt-[50px]">
              <VideoPage src={videoPath} VideoArtifacts={currentVideoArtifacts}/>
            </div>
        ):(
          null
        )}
        {recentIsActive ?(
          <div id="recentlist" style={{marginTop: 40}} className="w-full">
            <form className="my-10">
                <span className="ml-96">Sort By</span>
                <select defaultValue={'time'} onChange={(e) => setSortBy(current => e.target.value)}>
                  <option value="time">Timestamp</option>
                  <option value="title">Title</option>
                  <option value="processed">Processed</option>
                </select>
              
                <span className="ml-96">Sort By</span>
                <select defaultValue={'descending'} onChange={(e) => setAscDesc(e.target.value === 'ascending')}>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
            </form>
              {
                recentVideos.sort((a,b) =>{
                  if(asc){
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                  } else {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                  }
                }).map((video) => {
                  return <RecentUpload onClick={startVideo} fileName={video.name} processed={video.processed} date={video.date} key={video.video_path} thumbnail={video.thumbnail_path} video_path={video.video_path} image_path={video.image_path}/>;
                })
              }
          </div>
        ) : (
          null
        )}
        {uploadIsActive ? (
          <div className="w-full">
            <div id={style.uploadarea}>
                <div id={style.droparea} 
                className={highlight ? style.highlight : ''}
                onDragEnter={fileDragHighlight}
                onDragLeave={fileDragUnHighlight}
                onDrop={filesDropped}
                onClick={browseFiles}>
                  <div className={style.dropform}>
                    <input type="file" id={style.fileElem} ref={inputFile} multiple accept="video/*" onChange={handleInput}/>
                    <div className={style.prompttext}>
                      Click to browse or drag and drop files
                    </div>
                  </div>
                </div>
            </div>
            <div className="bg-black w-full">
              {
                currentUpload ? (
                  <CurrentUpload onClick={handleClick} fileName={currentUpload.name} date={currentUpload.date} key={currentUpload.name} status={currentUpload.status}/>
                ):(null)
              }
              {
                allUploads ? (
                  allUploads.map((video) => {
                    return <CurrentUpload onClick={handleClick} fileName={video.name} date={video.date} key={video.name} status={video.status}/> 
                  })
                ):(null)
              }
            </div>              
          </div>
        ) : ( 
          null
        )}
    </div>
  );
}
