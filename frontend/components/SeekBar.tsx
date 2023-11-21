import { PeopleDetectedFrame } from '@/utils/api';
import React, { useRef } from 'react';

type CustomSeekBarProps = {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  markers?: PeopleDetectedFrame[]; // Array of objects with timestamps and thumbnail URLs
};

const CustomSeekBar: React.FC<CustomSeekBarProps> = ({
  duration,
  currentTime,
  onSeek,
  markers,
}) => {
  const seekBarRef = useRef<HTMLDivElement>(null);

  const calculateTimeFromMouseEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarRef.current) return 0;
    
    const rect = seekBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedPercentage = x / rect.width;
    return clickedPercentage * duration;
  };

  const timestampToSeconds = (timestamp: string): number => {
    const hms = timestamp.split(':'); // split it at the colons
    // Hours are worth 60 minutes.
    const seconds = (+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2]); 
    return seconds;
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newTime = calculateTimeFromMouseEvent(e);
    onSeek(newTime);
  };

  const progressBarWidth = (currentTime / duration) * 100;

  return (
    <div
      ref={seekBarRef}
      style={{ width: '100%', height: '20px', background: '#ccc', position: 'relative' }}
      onClick={handleMouseClick}
    >
      <div
        style={{ width: `${progressBarWidth}%`, height: '100%', background: '#007bff' }}
      ></div>
      {/* Render markers */}
      {markers?.map((marker, index) => {
        const leftPosition = (timestampToSeconds(marker.timestamp) / duration) * 100;
        return (
          <img
            key={index}
            src={marker.thumbnail}
            style={{
              height: '50px', // Thumbnail height, can be adjusted
              width: 'auto', // Keep aspect ratio
              position: 'absolute',
              left: `${leftPosition}%`,
              transform: 'translateX(-50%)', // Center align the thumbnail
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the seek bar's click event from firing
              onSeek(timestampToSeconds(marker.timestamp));
            }}
            alt={`Thumbnail at ${marker.timestamp}`}
          />
        );
      })}
    </div>
  );
};

export default CustomSeekBar;
