import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ENV } from './config/env.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);

const { PORT = '3000' } = ENV;

// Check the health of API Key

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
