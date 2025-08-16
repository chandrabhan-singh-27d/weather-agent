import { Router, Request, Response } from 'express';
import { ENV } from '../config/env.js';
import { askAgent } from '../controllers/agent.controller.js';

const router = Router();
const { WEATHER_KEY = '' } = ENV;

router.get('/health', (req: Request, res: Response) => {
  const hasAPIKey = !!WEATHER_KEY;
  res.json({
    status: 'ok',
    apiKeyConfigured: hasAPIKey,
    timestamp: new Date().toISOString(),
  });
});

router.post('/ask', askAgent);

export default router;
