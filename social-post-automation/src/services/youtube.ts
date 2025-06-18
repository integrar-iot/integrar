import { google } from '@googleapis/youtube';
import fs from 'fs';

const youtube = google.youtube('v3');

export async function postToYouTube(title: string) {
  const auth = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
  );
  auth.setCredentials({ refresh_token: process.env.YT_REFRESH_TOKEN });

  await youtube.videos.insert({
    auth,
    part: ['snippet', 'status'],
    requestBody: {
      snippet: { title, description: title },
      status: { privacyStatus: 'public' },
    },
    media: {
      body: fs.createReadStream('video.mp4'), // placeholder
    },
  });
}
