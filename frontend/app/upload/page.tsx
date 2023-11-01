"use client"
import Card from "@/components/Card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { useRef, useState, useEffect, useCallback } from "react";
import style from 'app/upload/upload.module.css';
import RecentUpload from "./components/RecentUpload";
import { json } from "stream/consumers";
import CurrentUpload from "./components/CurrentUpload";
import FileUpload from "./components/FileUpload";

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
  const [currentUpload, setCurrentUpload] = useState<VideoUpload[]>([]);

  const fileUpload = new FileUpload(null);

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

    console.log(files)
    for(const file of files){
        var formData = new FormData();
        formData.append('file',file);
        console.log('Starting ' + file.name)

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Origin','http://localhost:3000');

        fetch('http://127.0.0.1:8000/upload', {
            method: 'POST',
            body: formData
        }).then((res) => {
            res.json().then(body => {
              if(body?.status_code !== 200){
                alert('Error ' +body?.status_code + ': ' + body?.detail)
              }
            })
        }).catch((err) => {
            alert('Error: ' + err)
        })
        console.log('End ' + file.name)
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
                currentUpload.map((video) => {
                  return <CurrentUpload onClick={handleClick} fileName={video.name} size={video.size + ' GB'} date={video.date} key={video.name} status={video.status}/> 
                })
              }
            </div>              
          </div>
        ) : ( 
          null
        )}
    </div>
  );
}
