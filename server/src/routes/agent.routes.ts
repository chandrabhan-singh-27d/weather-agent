import { Router, Request, Response } from 'express';
import { ENV } from '../config/env.js';
import { askAgent } from '../controllers/agent.controller.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    weatherKeyConfigured: !!ENV.WEATHER_KEY,
    anthropicKeyConfigured: !!ENV.ANTHROPIC_KEY,
    timestamp: new Date().toISOString(),
  });
});

router.post('/ask', askAgent);

export default router;
