import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import {
  AskRequest,
  AskResponse,
  ErrorResponse,
  WeatherToolInput,
  ToolCallLog,
} from '../types/agent.js';
import { ENV } from '../config/env.js';
import { weatherTools } from '../tools/definitions.js';
import { executeTool } from '../tools/handlers.js';

const MAX_TOOL_ROUNDS = 5;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: ENV.ANTHROPIC_KEY });
  }
  return client;
}

const SYSTEM_PROMPT = `You are a helpful weather assistant. When users ask about weather, use the available tools to fetch real data. Be conversational and concise. Include relevant details like temperature, humidity, and conditions. If the user asks about multiple cities, fetch data for each. If a tool call fails, explain the error to the user.`;

export const askAgent = async (
  req: Request<object, AskResponse | ErrorResponse, AskRequest>,
  res: Response<AskResponse | ErrorResponse>,
) => {
  const { question } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ error: 'Please provide a question' });
  }

  if (!ENV.ANTHROPIC_KEY) {
    return res.status(500).json({ error: 'Anthropic API key is not configured' });
  }

  if (!ENV.WEATHER_KEY) {
    return res.status(500).json({ error: 'Weather API key is not configured' });
  }

  try {
    const anthropic = getClient();
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: question }];
    const toolCallLog: ToolCallLog[] = [];

    // Agentic loop: keep going until Claude stops calling tools
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: weatherTools,
        messages,
      });

      // If Claude is done, extract the final text
      if (response.stop_reason === 'end_turn') {
        const text = response.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('');

        return res.json({ answer: text, toolCalls: toolCallLog });
      }

      // Claude wants to call tools
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
      );

      if (toolUseBlocks.length === 0) {
        // No tools and not end_turn — extract whatever text we have
        const text = response.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('');
        return res.json({ answer: text || 'No response generated.', toolCalls: toolCallLog });
      }

      // Append assistant response to message history
      messages.push({ role: 'assistant', content: response.content });

      // Execute each tool and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const tool of toolUseBlocks) {
        let result: string;
        let isError = false;

        try {
          result = await executeTool(tool.name, tool.input as WeatherToolInput);
        } catch (err) {
          result = `Error: ${err instanceof Error ? err.message : String(err)}`;
          isError = true;
        }

        toolCallLog.push({
          tool: tool.name,
          input: tool.input as WeatherToolInput,
          result,
        });

        toolResults.push({
          type: 'tool_result',
          tool_use_id: tool.id,
          content: result,
          is_error: isError,
        });
      }

      // Append tool results as a user message
      messages.push({ role: 'user', content: toolResults });
    }

    return res.json({
      answer: 'Reached maximum tool call rounds. Please try again.',
      toolCalls: toolCallLog,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Agent error:', message);
    return res.status(500).json({ error: message });
  }
};
