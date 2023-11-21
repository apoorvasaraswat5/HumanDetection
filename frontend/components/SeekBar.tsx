import React, { useRef } from 'react';

type CustomSeekBarProps = {
  duration: number; // Total duration of the video in seconds
  currentTime: number; // Current time of the video in seconds
  onSeek: (time: number) => void; // Callback for when the user seeks to a different time
};

const CustomSeekBar: React.FC<CustomSeekBarProps> = ({ duration, currentTime, onSeek }) => {
  const seekBarRef = useRef<HTMLDivElement>(null);

  const calculateTimeFromMouseEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarRef.current) return 0;
    
    const rect = seekBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedPercentage = x / rect.width;
    return clickedPercentage * duration;
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newTime = calculateTimeFromMouseEvent(e);
    onSeek(newTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const hoverTime = calculateTimeFromMouseEvent(e);
  };

  const progressBarWidth = (currentTime / duration) * 100;

  return (
    <div
      ref={seekBarRef}
      style={{ width: '100%', height: '20px', background: '#ccc' }}
      onClick={handleMouseClick}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{ width: `${progressBarWidth}%`, height: '100%', background: '#007bff' }}
      ></div>
    </div>
  );
};

export default CustomSeekBar;
