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
  // Array format from n8n
  0?: {
    output: {
      response?: string;
      message?: string;
      metadata?: {
        confidence?: number;
        sources?: string[];
      };
    };
  };
  // Direct format (fallback)
  response?: string;
  message?: string;
  error?: string;
}