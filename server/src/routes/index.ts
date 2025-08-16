import { Router, Request, Response } from 'express';
import { BasicResponse } from '../types/agent.js';
import agentRoutes from './agent.routes.js';

const router = Router();

router.get('/', (req: Request, res: Response<BasicResponse>) => {
  res.json({ message: 'Agentic AI server is running 🚀' });
});

router.use('/', agentRoutes);

export default router;
