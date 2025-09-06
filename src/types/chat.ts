export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface N8NWebhookPayload {
  message: string;
  timestamp: string;
  sessionId: string;
  userId: string | null;
}

export interface N8NWebhookResponse {
  response?: string;
  message?: string;
  error?: string;
}