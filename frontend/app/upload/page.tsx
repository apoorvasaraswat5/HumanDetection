"use client"
import Card from "@/components/Card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { useRef, useState, useEffect, useCallback } from "react";
import style from 'app/upload/upload.module.css';
import RecentUpload from "./components/RecentUpload";
import { json } from "stream/consumers";
import CurrentUpload from "./components/CurrentUpload";
import axios from "axios";
import { stat } from "fs";

interface Video {
  name: string;
  date: string;
  size: number;
}

interface VideoUpload extends Video{
  status: string;
}

export default function page() {

  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [currentUpload, setCurrentUpload] = useState<VideoUpload>(null);
  const [allUploads, setAllUploads] = useState<VideoUpload[]>([]);

  const getRecent = () => {
    let vals: any[] = []
    fetch('http://127.0.0.1:8000/fetchData', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(body => {
        body.data.forEach((video: { filename: string; created_at: string }) => 
        {
          vals.push({
            "name":video.filename,
            "date":video.created_at,
            "size":0
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
        size: file.size,
        status: "0%"
      }
    })
    const res = await axios.post('http://127.0.0.1:8000/upload',formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: progressEvent => {
        setCurrentUpload((currUpload) => {
          currUpload.status = (Math.floor((progressEvent.loaded/progressEvent.total)*100)-1).toString() + '%';
          const newCurr = JSON.parse(JSON.stringify(currUpload))
          console.log(progressEvent.loaded)
          console.log(progressEvent.total)
          return newCurr;
        })
      }
    })
    console.log(res)
    if (res.data.status_code == 500){
      status = 'Error!'
      setCurrentUpload((currUpload) => {
        currUpload.status = res.data.detail;
        const newCurr = JSON.parse(JSON.stringify(currUpload))
        return newCurr;
      })      
    } else {
      status = '100%'
      setCurrentUpload((currUpload) => {
        currUpload.status = "100%";
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

  const handleClick = (event: any) => {
    const target = event.target.id;
    if(target=='upload'){
      setUploadIsActive(current => true);
      setRecentIsActive(current => false);
    }else if(target=='recent'){
      setUploadIsActive(current => false);
      setRecentIsActive(current => true);
      getRecent();
    }else{
      console.log('TO BE IMPLEMENTED');
    }
  };

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

  const inputFile = useRef(null);
  const browseFiles = (event: any) => {
    console.log(inputFile)
    inputFile?.current.click();
  };

  const handleInput = (event: any) => {
    sendFiles(event.target.files);
  }
  return (
    <div className="main-content flex h-screen">
        <div className={style.topnav}>
            <div className={style.selector}>
                <div id="recent" className={recentIsActive ? style.active : ''} onClick={handleClick}>Recent</div>
                <div id="upload" className={uploadIsActive ? style.active : ''} onClick={handleClick}>Upload</div>
            </div>
        </div>
        {recentIsActive ?(
          <div id="recentlist" style={{marginTop: 40}} className="w-full">
              {
                recentVideos.sort((a,b) =>{
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
                }).map((video) => {
                  return <RecentUpload onClick={handleClick} fileName={video.name} size={video.size + ' GB'} date={video.date} key={video.name}/>;
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
                  <CurrentUpload onClick={handleClick} fileName={currentUpload.name} size={currentUpload.size + ' GB'} date={currentUpload.date} key={currentUpload.name} status={currentUpload.status}/>
                ):(null)
              }
              {
                allUploads ? (
                  allUploads.map((video) => {
                    return <CurrentUpload onClick={handleClick} fileName={video.name} size={video.size + ' GB'} date={video.date} key={video.name} status={video.status}/> 
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
