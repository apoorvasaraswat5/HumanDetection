import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchImage = async (path: string): Promise<Blob | null> => {
  try {
    const { data, error } = await supabase.storage.from('your-bucket-name').download(path);

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

// Usage example
const fetchAndDisplayImage = async () => {
  const imagePath = 'path/to/your/image.png';
  const imageBlob = await fetchImage(imagePath);

  if (imageBlob) {
    const objectURL = URL.createObjectURL(imageBlob);
    // Now you can use this objectURL to display the image
  }
};
