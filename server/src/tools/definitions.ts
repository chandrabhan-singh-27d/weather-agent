import Anthropic from '@anthropic-ai/sdk';

export const weatherTools: Anthropic.Tool[] = [
  {
    name: 'get_current_weather',
    description:
      'Get the current weather for a city. Returns temperature, humidity, wind speed, and conditions.',
    input_schema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'City name, e.g. "London", "New Delhi", "San Francisco"',
        },
        units: {
          type: 'string',
          enum: ['metric', 'imperial'],
          description:
            'Temperature units. metric = Celsius, imperial = Fahrenheit. Default: metric',
        },
      },
      required: ['city'],
    },
  },
  {
    name: 'get_forecast',
    description:
      'Get a 5-day weather forecast for a city. Returns forecast data in 3-hour intervals.',
    input_schema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'City name, e.g. "London", "New Delhi", "San Francisco"',
        },
        units: {
          type: 'string',
          enum: ['metric', 'imperial'],
          description:
            'Temperature units. metric = Celsius, imperial = Fahrenheit. Default: metric',
        },
      },
      required: ['city'],
    },
  },
];
