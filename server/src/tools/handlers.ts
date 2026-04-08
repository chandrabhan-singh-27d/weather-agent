import { ENV } from '../config/env.js';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface CurrentWeatherResponse {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string }[];
  wind: { speed: number };
}

interface ForecastResponse {
  city: { name: string };
  list: {
    dt_txt: string;
    main: { temp: number; humidity: number };
    weather: { description: string }[];
    wind: { speed: number };
  }[];
}

async function fetchWeatherAPI<T>(endpoint: string, city: string, units: string): Promise<T> {
  const url = `${BASE_URL}/${endpoint}?q=${encodeURIComponent(city)}&units=${units}&appid=${ENV.WEATHER_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenWeather API error (${res.status}): ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const city = input.city as string;
  const units = (input.units as string) || 'metric';
  const unitLabel = units === 'imperial' ? 'F' : 'C';
  const speedLabel = units === 'imperial' ? 'mph' : 'm/s';

  switch (name) {
    case 'get_current_weather': {
      const data = await fetchWeatherAPI<CurrentWeatherResponse>('weather', city, units);
      return JSON.stringify({
        city: data.name,
        temperature: `${data.main.temp}°${unitLabel}`,
        feels_like: `${data.main.feels_like}°${unitLabel}`,
        humidity: `${data.main.humidity}%`,
        conditions: data.weather[0]?.description ?? 'unknown',
        wind_speed: `${data.wind.speed} ${speedLabel}`,
      });
    }

    case 'get_forecast': {
      const data = await fetchWeatherAPI<ForecastResponse>('forecast', city, units);
      // Summarize: pick one entry per day (noon slot or first available)
      const dailyMap = new Map<string, (typeof data.list)[number]>();
      for (const entry of data.list) {
        const date = entry.dt_txt.split(' ')[0];
        const hour = entry.dt_txt.split(' ')[1];
        if (!dailyMap.has(date) || hour === '12:00:00') {
          dailyMap.set(date, entry);
        }
      }
      const forecast = [...dailyMap.values()].slice(0, 5).map((entry) => ({
        date: entry.dt_txt.split(' ')[0],
        temperature: `${entry.main.temp}°${unitLabel}`,
        humidity: `${entry.main.humidity}%`,
        conditions: entry.weather[0]?.description ?? 'unknown',
        wind_speed: `${entry.wind.speed} ${speedLabel}`,
      }));
      return JSON.stringify({ city: data.city.name, forecast });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
