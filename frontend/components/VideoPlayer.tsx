'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import "video.js/dist/video-js.css";

const VideoPlayer = ({ options, setCurrentTime, setVideoDuration } : {
    options: any,
    setCurrentTime: any
    setVideoDuration: any
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let player : any;
    if (videoRef.current) {
        player = videojs(videoRef.current, options, () => {
          console.log('Player is ready');
        });
        player.on("timeupdate", () => {
            setCurrentTime(player.currentTime());
          });
        player.on("durationchange", () => {
            setVideoDuration(player.duration());
        });

    }

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  return (
      <video ref={videoRef} className="video-js"></video>
  );
};

export default VideoPlayer;
