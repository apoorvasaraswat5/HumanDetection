const supabase_url = 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/public/human-detection-video-files/';
export const fetchData = async (videoId=0): Promise<getAllVideosResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchData?user_id=${videoId}`);
  const json : any = await res.json();
  const data: getAllVideosResponse = 
    json.data.map((x : any, index : any) =>{
      return {
        id: index.toString(),
        title: x.filename,
        size: '0MB',
        dateCreated: x.created_at.split('T')[0],
        thumbnail: `${supabase_url}${x.thumbnail_path}`,
      }
    })
    return data;
};

export const fetchVideoArtifacts = async (videoId: string): Promise<VideoArtifacts> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchData?user_id=0`);
  const json : any = await res.json();
  const data = json.data[Number(videoId)];
  console.log(data)
  return {
    videoURL: `${supabase_url}${data?.video_path}`,
    //TODO: fix this
    peopleDetectedFrames: !data.image_path ? [] : data.image_path.map((x: string, index: number) => {
      try{
        const image = JSON.parse(x);
        let time = image.timestamp;
        const hours = Math.floor(time / 3600);
        time %= 3600;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return {        
          thumbnail: 'http://127.0.0.1:8000/download?file_path=' + encodeURIComponent(image.path),
          timestamp: `${(hours).toString().padStart(2,'0')}:${(minutes).toString().padStart(2,'0')}:${(seconds).toString().padStart(2,'0')}` //Simulates timestamp
        }
      } catch {
        return {        
          thumbnail: 'http://127.0.0.1:8000/download?file_path=' + encodeURIComponent(x),
          timestamp: `00:00:${(index * 10 % 5).toString().padStart(2,'0')}` //Simulates timestamp
        }
      }
    }),
    distinctPeopleDetected: [],
    voiceDetectedFrames: !data.audio_results ? [] : data.audio_results.audio.map((x: any, index: number) => {
      let time = x[0];
      const hours = Math.floor(time / 3600);
      time %= 3600;
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return {        
        transcript: `${x[2]}: ${x[3]}`,
        timestamp: `${(hours).toString().padStart(2,'0')}:${(minutes).toString().padStart(2,'0')}:${(seconds).toString().padStart(2,'0')}` //Simulates timestamp
      }
    }),
  }
};


export type FetchDataResponse = {
  message: string;
  data: any;
}
export type getAllVideosResponse = VideoResponse[];
export type VideoResponse = {
  id: string;
  title: string;
  size: string;
  dateCreated: string;
  thumbnail: string;
}

export type PeopleDetectedFrame = {
  thumbnail: string;
  timestamp: string;
}
export type VoiceDetectedFrame = {
  transcript: string;
  timestamp: string;
}
export type DistinctPersonDetected = {
  thumbnail: string;
  personId: string;
}
export type VideoArtifacts = {
  videoURL: string;
  peopleDetectedFrames: PeopleDetectedFrame[];
  voiceDetectedFrames: VoiceDetectedFrame[];
  distinctPeopleDetected: DistinctPersonDetected[];
}