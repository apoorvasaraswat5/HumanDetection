'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import "video.js/dist/video-js.css";

const VideoPlayer = React.forwardRef(function VideoPlayer<any,any>(props, videoRef) {
  useEffect(() => {
    let player : any;
    if (videoRef?.current) {
        player = videojs(videoRef.current, props.options, () => {
          console.log('Player is ready');
        });
        player.on("timeupdate", () => {
            props.setCurrentTime(player.currentTime());
          });
        player.on("durationchange", () => {
            props.setVideoDuration(player.duration());
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
}
);

export default VideoPlayer;
