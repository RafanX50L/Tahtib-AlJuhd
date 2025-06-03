import axios from 'axios';
import { env } from '@/config/env';


const searchYouTube = async (query) => {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      maxResults: 1,
      q: query,
      type: 'video',
      key: env.YOUTUBE_API_KEY,
    },
  });

  return response.data.items[0]; // return the first video result
};

export default searchYouTube;