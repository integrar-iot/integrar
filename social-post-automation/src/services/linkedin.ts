import axios from 'axios';

const token = process.env.LINKEDIN_TOKEN;
const userId = process.env.LINKEDIN_USER_ID;

export async function postToLinkedIn(message: string) {
  if (!token || !userId) throw new Error('Missing LinkedIn credentials');
  const url = `https://api.linkedin.com/v2/ugcPosts`;
  await axios.post(
    url,
    {
      author: `urn:li:person:${userId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: message },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'CONNECTIONS' },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
    }
  );
}
