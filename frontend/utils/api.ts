import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchImage = async (path: string, bucket='public/demo'): Promise<Blob | null> => {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) {
      throw error;
    }

    if (data) {
      return data as any;
    }

    return null;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

// // Usage example
// const fetchAndDisplayImage = async () => {
//   const imagePath = 'path/to/your/image.png';
//   const imageBlob = await fetchImage(imagePath);

//   if (imageBlob) {
//     const objectURL = URL.createObjectURL(imageBlob);
//     // Now you can use this objectURL to display the image
//   }
// };

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