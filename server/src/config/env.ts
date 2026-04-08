import dotenv from 'dotenv';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '3000');
const WEATHER_KEY: string | undefined = process.env.OPENWEATHER_KEY;
const ANTHROPIC_KEY: string | undefined = process.env.ANTHROPIC_API_KEY;

if (!WEATHER_KEY) {
  console.error('OPENWEATHER_KEY not found in environment variables');
  console.log('Please add your API key to .env file: OPENWEATHER_KEY=your_api_key_here');
} else {
  console.info('OpenWeather API key loaded');
}

if (!ANTHROPIC_KEY) {
  console.error('ANTHROPIC_API_KEY not found in environment variables');
  console.log('Please add your API key to .env file: ANTHROPIC_API_KEY=your_api_key_here');
} else {
  console.info('Anthropic API key loaded');
}

export const ENV = {
  PORT,
  WEATHER_KEY,
  ANTHROPIC_KEY,
};
