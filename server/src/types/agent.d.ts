export interface AskRequest {
  question: string;
}

export interface WeatherToolInput {
  city: string;
  units?: 'metric' | 'imperial';
}

export interface ToolCallLog {
  tool: string;
  input: WeatherToolInput;
  result: string;
}

export interface AskResponse {
  answer: string;
  toolCalls?: ToolCallLog[];
}

export interface ErrorResponse {
  error: string;
}
