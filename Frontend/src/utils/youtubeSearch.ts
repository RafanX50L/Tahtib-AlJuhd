import axios from 'axios';
import { env } from '@/config/env';

const searchYouTube = async (query) => {
  console.log('env', env.YOUTUBE_API_KEY); // Debug
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      maxResults: 1,
      q: query,
      type: 'video',
      key: env.YOUTUBE_API_KEY,
    },
  });

  console.log('data',response.data.items[0]);
  return response.data.items[0];
};

export default searchYouTube;
