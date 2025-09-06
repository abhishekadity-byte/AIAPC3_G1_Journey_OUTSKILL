import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Maximize2, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface AIChatPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatPage: React.FC<AIChatPageProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI travel assistant. I can help you plan your perfect journey, find destinations, create itineraries, and answer any travel questions you have.\n\nHere are some things you can ask me:\n• \"Plan a 7-day trip to Japan\"\n• \"What's the best time to visit Bali?\"\n• \"Create a budget itinerary for Europe\"\n• \"Suggest romantic destinations for couples\"\n• \"Help me pack for a winter trip to Iceland\"\n\nHow can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // N8N webhook URL - replace with your actual n8n webhook URL
  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

  const quickSuggestions = [
    "Plan a 7-day trip to Japan",
    "Best time to visit Bali?",
    "Budget Europe itinerary",
    "Romantic destinations for couples"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setShowSuggestions(false);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const formatMessage = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle empty lines as spacing
      if (trimmedLine === '') {
        return <div key={index} className="h-3" />;
      }
      
      // Handle bullet points
      if (trimmedLine.startsWith('•')) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-2">
            <span className="text-purple-300 mt-1 flex-shrink-0">✨</span>
            <span className="text-gray-200">{trimmedLine.substring(1).trim()}</span>
          </div>
        );
      }
      
      // Handle questions (ending with ?)
      if (trimmedLine.endsWith('?') && trimmedLine.length > 10) {
        return (
          <div key={index} className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-3 mb-3 flex items-start space-x-2">
            <span className="text-purple-300 mt-0.5">❓</span>
            <span className="text-purple-100 font-medium">{trimmedLine}</span>
          </div>
        );
      }
      
      // Handle destinations/locations (common travel destinations)
      const destinations = ['Tokyo', 'Kyoto', 'Osaka', 'Japan', 'Bali', 'Europe', 'Romania', 'Hungary', 'Prague', 'Athens', 'Bucharest', 'Budapest', 'Vienna', 'Greece', 'Czech Republic'];
      const hasDestination = destinations.some(dest => trimmedLine.includes(dest));
      
      if (hasDestination && trimmedLine.length > 20) {
        return (
          <div key={index} className="bg-cyan-500/20 border border-cyan-400/30 rounded-lg p-3 mb-3 flex items-start space-x-2">
            <span className="text-cyan-300 mt-0.5">📍</span>
            <span className="text-cyan-100">{trimmedLine}</span>
          </div>
        );
      }
      
      // Handle recommendations/tips
      const recommendationWords = ['recommend', 'suggest', 'tip', 'advice', 'consider', 'try'];
      const isRecommendation = recommendationWords.some(word => trimmedLine.toLowerCase().includes(word));
      
      if (isRecommendation && trimmedLine.length > 15) {
        return (
          <div key={index} className="bg-lime-500/20 border border-lime-400/30 rounded-lg p-3 mb-3 flex items-start space-x-2">
            <span className="text-lime-300 mt-0.5">💡</span>
            <span className="text-lime-100">{trimmedLine}</span>
          </div>
        );
      }
      
      // Handle enthusiastic responses
      const enthusiasticStarters = ['Absolutely!', 'Fantastic!', 'Excellent!', 'Perfect!', 'Great!', 'Wonderful!'];
      const isEnthusiastic = enthusiasticStarters.some(starter => trimmedLine.startsWith(starter));
      
      if (isEnthusiastic) {
        return (
          <div key={index} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-3 mb-3 flex items-start space-x-2">
            <span className="text-yellow-300 mt-0.5">🎉</span>
            <span className="text-white font-semibold">{trimmedLine}</span>
          </div>
        );
      }
      
      // Handle headings (lines ending with : and shorter than 50 chars)
      if (trimmedLine.endsWith(':') && trimmedLine.length < 50) {
        return (
          <div key={index} className="font-bold text-purple-200 mb-3 mt-4 first:mt-0 text-lg border-b border-purple-400/30 pb-2">
            {trimmedLine}
          </div>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="mb-3 last:mb-0 text-gray-200 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });
  };

  const sendMessageToN8N = async (message: string): Promise<string> => {
    // Check if webhook URL is configured
    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes('your-n8n-instance.com') || N8N_WEBHOOK_URL.includes('your-actual-n8n-instance.com')) {
      console.warn('n8n webhook URL not configured. Using fallback response.');
      const fallbackResponses = [
        "I can help you with that! Let me suggest some options based on your preferences. What's your ideal travel style - adventure, relaxation, cultural exploration, or a mix?",
        "Excellent choice! I can provide recommendations for accommodations, activities, and local experiences. What's most important to you for this trip?"
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Journey-AI-Travel-Agent/1.0',
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          sessionId: `travel_agent_${Date.now()}`,
          agentType: 'travel_agent',
          context: 'journey_app'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.message || "I'm here to help with your travel planning!";
    } catch (error) {
      console.warn('n8n webhook not accessible, using fallback response:', error.message);
      // Fallback responses for demo purposes
      const fallbackResponses = [
        "I can help you with that! Let me suggest some options based on your preferences. What's your ideal travel style - adventure, relaxation, cultural exploration, or a mix?",
        "Excellent choice! I can provide recommendations for accommodations, activities, and local experiences. What's most important to you for this trip?"
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const botResponse = await sendMessageToN8N(userMessage.text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 ${
      isMaximized 
        ? 'inset-0' 
        : 'inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
    }`}>
      <div className={`${
        isMaximized 
          ? 'w-full h-full bg-dark' 
          : 'w-full max-w-2xl h-[600px] bg-dark/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl'
      } flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Travel Agent</h3>
              <p className="text-sm text-gray-400">Connected to n8n Travel Workflow</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMaximize}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? (
                <Minimize2 size={16} className="text-white" />
              ) : (
                <Maximize2 size={16} className="text-white" />
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className={`mx-auto ${isMaximized ? 'max-w-4xl' : 'max-w-full'}`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 mb-6 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-secondary' 
                    : 'bg-gradient-primary'
                }`}>
                  {message.sender === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
                <div className={`max-w-[85%] ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-primary text-white'
                      : 'bg-white/10 text-white backdrop-blur-sm'
                  }`}>
                    <div className="text-sm leading-relaxed">
                      {message.sender === 'bot' ? formatMessage(message.text) : message.text}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="text-white animate-spin" />
                    <span className="text-sm text-white">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Suggestions */}
        {showSuggestions && messages.length === 1 && (
          <div className="px-6 pb-4">
            <div className={`mx-auto ${isMaximized ? 'max-w-4xl' : 'max-w-full'}`}>
              <p className="text-sm text-gray-400 mb-3">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-full text-white transition-all duration-200 hover:scale-105"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-white/10">
          <div className={`mx-auto ${isMaximized ? 'max-w-4xl' : 'max-w-full'}`}>
            <div className="flex items-center space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about travel planning..."
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Connected to n8n AI Travel Agent workflow • Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;