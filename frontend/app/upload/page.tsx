"use client"
import Card from "@/components/Card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { useRef, useState } from "react";
import style from 'app/upload/upload.module.css';
import RecentUpload from "./components/RecentUpload";

export default function page() {

  const getRecent = () => {
    // TODO
    // Temp values currently 
    const tempValues = [
        {"name":"MaurisLaoreet.mp3","date":"11/03/2022","size":11.4},
        {"name":"MontesNasceturRidiculus.mp3","date":"07/30/2023","size":21.7},
        {"name":"Vel.ppt","date":"09/27/2023","size":32.2},
        {"name":"PenatibusEt.mp3","date":"07/29/2023","size":8.0},
        {"name":"NecSed.jpeg","date":"11/14/2022","size":20.7},
        {"name":"VenenatisNon.xls","date":"03/27/2023","size":0.9},
        {"name":"SuscipitA.avi","date":"09/26/2023","size":9.7},
        {"name":"QuamPedeLobortis.ppt","date":"02/05/2023","size":13.1},
        {"name":"VulputateVitae.xls","date":"04/05/2023","size":5.7},
        {"name":"ErosViverra.tiff","date":"01/25/2023","size":15.6},
        {"name":"VitaeNislAenean.xls","date":"12/26/2022","size":22.6},
        {"name":"EuOrci.gif","date":"12/14/2022","size":13.7},
        {"name":"AcNulla.jpeg","date":"04/02/2023","size":3.4},
        {"name":"ArcuSedAugue.mov","date":"07/08/2023","size":12.3},
        {"name":"LacusMorbi.mp3","date":"04/29/2023","size":31.6},
        {"name":"EuTincidunt.ppt","date":"10/06/2023","size":16.9},
        {"name":"Cras.avi","date":"09/05/2023","size":16.9},
        {"name":"Id.png","date":"09/01/2023","size":30.0},
        {"name":"Pellentesque.mp3","date":"10/28/2022","size":33.1},
        {"name":"Sapien.mov","date":"09/01/2023","size":12.1},
        {"name":"Faucibus.png","date":"11/09/2022","size":30.5},
        {"name":"Praesent.xls","date":"11/27/2022","size":33.3},
        {"name":"OdioDonecVitae.ppt","date":"10/01/2023","size":14.5},
        {"name":"NecCondimentum.avi","date":"01/15/2023","size":7.9},
        {"name":"JustoIn.avi","date":"01/24/2023","size":3.4}
    ];
    return tempValues;
  }

  const sendFiles = (files: any) => {
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
            console.log(res.json().then(body => console.log(body)))
        }).catch((err) => {
            console.log('Error: ' + err)
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
    console.log(inputFile)
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
                getRecent().sort((a,b) =>{
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
          <div id={style.uploadarea}>
              <div id={style.droparea} 
              className={highlight ? style.highlight : ''}
              onDragEnter={fileDragHighlight}
              onDragLeave={fileDragUnHighlight}
              onDrop={filesDropped}
              onClick={browseFiles}>
                <div className={style.dropform}>
                  <input type="file" id={style.fileElem} ref={inputFile} accept="video/*" onChange={handleInput}/>
                  <div className={style.prompttext}>
                    Click to browse or drag and drop files
                  </div>
                </div>
              </div>
          </div>
        ) : ( 
          null
        )}
    </div>
  );
}
