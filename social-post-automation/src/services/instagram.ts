import axios from 'axios';

const pageId = process.env.INSTAGRAM_PAGE_ID;
const token = process.env.INSTAGRAM_TOKEN;

export async function postToInstagram(message: string) {
  if (!pageId || !token) throw new Error('Missing Instagram credentials');
  const url = `https://graph.facebook.com/${pageId}/media`;
  const createRes = await axios.post(
    url,
    {
      caption: message,
    },
    {
      params: { access_token: token },
    }
  );
  await axios.post(
    `https://graph.facebook.com/${pageId}/media_publish`,
    {
      creation_id: createRes.data.id,
    },
    {
      params: { access_token: token },
    }
  );
}
