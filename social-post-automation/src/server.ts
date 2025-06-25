import express from 'express';
import dotenv from 'dotenv';
import { schedulePost } from './services/scheduler';
import { recordMetrics, getMetrics } from './services/analytics';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/newsletter', (req, res) => {
  // In a real application you would generate a newsletter here
  const post = {
    message: req.body.message as string,
    platforms: req.body.platforms as string[],
    schedule: req.body.schedule as string,
  };
  schedulePost(post);
  res.json({ status: 'scheduled', post });
});

app.get('/analytics', async (_req, res) => {
  const metrics = await getMetrics();
  res.json(metrics);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
