import { Request, Response } from 'express';
import { BasicRequest, BasicResponse } from '../types/agent.js';
import { ENV } from '../config/env.js';

const { WEATHER_KEY = '' } = ENV;

export const askAgent = (
  req: Request<{}, BasicResponse, BasicRequest>,
  res: Response<BasicResponse>,
) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: 'Please provide a question',
    });
  }

  if (!WEATHER_KEY) {
    return res.status(500).json({
      error: 'Weather API Key is not configured',
    });
  }

  const answer = `You asked: "${question}". This is a placeholder response from agent.`;
  return res.status(200).json({
    message: answer,
  });
};
