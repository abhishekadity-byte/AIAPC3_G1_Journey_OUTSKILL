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
  additional_kwargs?: Record<string, any>;
  response_metadata?: Record<string, any>;
}

export interface N8NWebhookResponse {
  response?: string;
  message?: string;
  error?: string;
}