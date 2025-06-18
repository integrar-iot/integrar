import cron from 'node-cron';
import { postToLinkedIn } from './linkedin';
import { postToTwitter } from './twitter';
import { postToInstagram } from './instagram';
import { postToYouTube } from './youtube';
import { recordMetrics } from './analytics';

export interface ScheduledPost {
  message: string;
  platforms: string[];
  schedule: string; // cron expression
}

export function schedulePost(post: ScheduledPost) {
  cron.schedule(post.schedule, async () => {
    for (const platform of post.platforms) {
      try {
        switch (platform) {
          case 'linkedin':
            await postToLinkedIn(post.message);
            break;
          case 'twitter':
            await postToTwitter(post.message);
            break;
          case 'instagram':
            await postToInstagram(post.message);
            break;
          case 'youtube':
            await postToYouTube(post.message);
            break;
        }
        recordMetrics(platform, true);
      } catch (err) {
        console.error(`Failed to post to ${platform}`, err);
        recordMetrics(platform, false);
      }
    }
  });
}
