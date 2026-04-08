import { Router, Request, Response } from 'express';
import agentRoutes from './agent.routes.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Weather Agent API is running' });
});

router.use('/', agentRoutes);

export default router;
