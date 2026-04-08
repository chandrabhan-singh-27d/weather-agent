export interface AskRequest {
  question: string;
}

export interface AskResponse {
  answer: string;
  toolCalls?: { tool: string; input: Record<string, unknown>; result: string }[];
}

export interface ErrorResponse {
  error: string;
}
