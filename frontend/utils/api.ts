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
      const {path, timestamp} = JSON.parse(x);
      return {
        thumbnail: `${supabase_url}${path}`,
        timestamp: new Date(timestamp * 1000).toISOString().split('T')[0],
      }
    }),
    distinctPeopleDetected: [],
    voiceDetectedFrames: [],
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

export type PeopleDetectedFrame = [number, number, string, string]

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