import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Heart, MapPin, Mic, Volume2, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  hasMap?: boolean;
  hasImages?: boolean;
  relatedQuestions?: string[];
}

interface AIChatPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatPage: React.FC<AIChatPageProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Best Time to Visit Bali for Ideal Weather and Fewer Crowds",
      sender: 'bot',
      timestamp: new Date(),
      hasMap: true,
      hasImages: true,
      relatedQuestions: [
        "What are the average temperatures in Bali during the low tourist season?",
        "Which months have the lowest rainfall and pleasant humidity in Bali?",
        "How does crowd density vary between the dry and wet seasons in Bali?",
        "What are the best months for family-friendly activities with fewer tourists in Bali?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

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

  const sendMessageToN8N = async (message: string): Promise<string> => {
    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes('your-n8n-instance.com')) {
      const fallbackResponses = [
        "Based on your query, I can provide detailed travel insights. The best time to visit most tropical destinations is during the shoulder seasons when you'll find ideal weather conditions with fewer crowds and better prices.",
        "Great question! I can help you plan the perfect timing for your trip. Weather patterns, local events, and tourist seasons all play important roles in determining the ideal travel dates."
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          sessionId: `session_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.message || "I'm here to help with your travel planning!";
    } catch (error) {
      console.warn('n8n webhook not accessible, using fallback response:', error);
      return "I can help you with that! Let me provide some travel insights based on your query.";
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

    try {
      const botResponse = await sendMessageToN8N(userMessage.text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        hasMap: Math.random() > 0.5,
        hasImages: Math.random() > 0.3,
        relatedQuestions: Math.random() > 0.5 ? [
          "What's the weather like during peak season?",
          "Are there any local festivals to consider?",
          "What are the accommodation prices like?",
          "How crowded are the main attractions?"
        ] : undefined
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

  const handleRelatedQuestion = (question: string) => {
    setInputText(question);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Travel Assistant</h3>
            <p className="text-sm text-gray-500">Powered by Journey AI</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Chat */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.map((message) => (
              <div key={message.id} className="mb-8">
                {message.sender === 'bot' ? (
                  <div className="space-y-6">
                    {/* Bot Message Header */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{message.text}</h2>
                        <div className="flex items-center space-x-4 mb-4">
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                            <Heart size={16} />
                            <span className="text-sm">Add to trip</span>
                          </button>
                          <div className="flex items-center space-x-2 text-gray-500">
                            <MapPin size={16} />
                            <span className="text-sm">Bali, Indonesia</span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="prose prose-gray max-w-none">
                          <p className="text-gray-700 leading-relaxed">
                            The best time to visit <span className="inline-flex items-center space-x-1">
                              <Heart size={14} className="text-red-500" />
                              <span>Bali</span>
                            </span> for good weather and fewer crowds is during the shoulder seasons of April to June and September to early October. These months offer pleasant, dry weather ideal for exploring <span className="inline-flex items-center space-x-1">
                              <Heart size={14} className="text-red-500" />
                              <span>Bali's</span>
                            </span> nature, beaches, waterfalls, and cultural sites, while avoiding the peak tourist influx seen in July and August. Traveling during these periods allows for a more peaceful experience on the island, with comfortable temperatures and less congestion at popular points of interest.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Images Grid */}
                    {message.hasImages && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-11">
                        <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 rounded-lg relative overflow-hidden">
                          <img 
                            src="https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400" 
                            alt="Bali temple" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">ℹ</span>
                          </div>
                        </div>
                        <div className="aspect-video bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg relative overflow-hidden">
                          <img 
                            src="https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400" 
                            alt="Bali beach" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">ℹ</span>
                          </div>
                        </div>
                        <div className="aspect-video bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg relative overflow-hidden">
                          <img 
                            src="https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400" 
                            alt="Bali rice terraces" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">ℹ</span>
                          </div>
                        </div>
                        <div className="aspect-video bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg relative overflow-hidden">
                          <img 
                            src="https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg?auto=compress&cs=tinysrgb&w=400" 
                            alt="Bali temple architecture" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">ℹ</span>
                          </div>
                        </div>
                        <div className="aspect-video bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg relative overflow-hidden">
                          <img 
                            src="https://images.pexels.com/photos/2166650/pexels-photo-2166650.jpeg?auto=compress&cs=tinysrgb&w=400" 
                            alt="Bali sunset" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">ℹ</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Related Questions */}
                    {message.relatedQuestions && (
                      <div className="ml-11">
                        <div className="flex items-center space-x-2 mb-4">
                          <User size={16} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">People like you also asked</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {message.relatedQuestions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleRelatedQuestion(question)}
                              className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 text-sm text-gray-700 hover:text-gray-900"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="max-w-[80%] text-right">
                      <div className="inline-block p-3 rounded-2xl bg-blue-500 text-white">
                        <div className="text-sm leading-relaxed">{message.text}</div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <HelpCircle size={18} className="text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="I'm listening"
                  className="w-full bg-gray-100 border-0 rounded-full px-6 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button
                    onClick={toggleListening}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                    <Volume2 size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Support • Connected to n8n workflow
            </p>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="w-96 bg-gray-200 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-500 opacity-20"></div>
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
              Best Time to Visit Bali for Good Weather and Fewer Crowds
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-600 text-center">
              <MapPin size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Interactive Map</p>
              <p className="text-xs opacity-75">Bali, Indonesia</p>
            </div>
          </div>
          {/* Map controls */}
          <div className="absolute top-20 right-4 space-y-2">
            <button className="w-8 h-8 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <span className="text-sm font-bold">+</span>
            </button>
            <button className="w-8 h-8 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <span className="text-sm font-bold">−</span>
            </button>
          </div>
          <div className="absolute bottom-4 right-4">
            <button className="w-8 h-8 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <MapPin size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;