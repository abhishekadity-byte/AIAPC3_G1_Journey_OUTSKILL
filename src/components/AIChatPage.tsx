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

  // Create persistent session ID that remains the same until component unmounts
  const [sessionId] = useState(() => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `travel_agent_${timestamp}_${randomString}`;
  });

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
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle bullet points
      if (trimmedLine.startsWith('•')) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-2">
            <span className="text-purple-300 mt-1 flex-shrink-0">✨</span>
            <span className="text-gray-200">{trimmedLine.substring(1).trim()}</span>
          </div>
        );
      }
      
      // Handle empty lines as spacing
      if (trimmedLine === '') {
        return <div key={index} className="h-3" />;
      }
      
      // Handle questions (lines ending with ?)
      if (trimmedLine.endsWith('?') && trimmedLine.length > 10) {
        return (
          <div key={index} className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 mb-3 flex items-start space-x-2">
            <span className="text-purple-300 mt-0.5 flex-shrink-0">❓</span>
            <p className="text-purple-100 font-medium">{trimmedLine}</p>
          </div>
        );
      }
      
      // Handle destinations/locations (containing place names)
      const locationKeywords = ['Tokyo', 'Kyoto', 'Osaka', 'Japan', 'Bali', 'Europe', 'Romania', 'Hungary', 'Prague', 'Athens', 'Bucharest', 'Budapest', 'Vienna', 'Greece', 'Czech Republic'];
      if (locationKeywords.some(keyword => trimmedLine.includes(keyword)) && trimmedLine.length > 20) {
        return (
          <div key={index} className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-3 mb-3 flex items-start space-x-2">
            <span className="text-cyan-300 mt-0.5 flex-shrink-0">📍</span>
            <p className="text-cyan-100">{trimmedLine}</p>
          </div>
        );
      }
      
      // Handle recommendations/tips
      const tipKeywords = ['recommend', 'suggest', 'tip', 'advice', 'consider', 'try'];
      if (tipKeywords.some(keyword => trimmedLine.toLowerCase().includes(keyword)) && trimmedLine.length > 15) {
        return (
          <div key={index} className="bg-lime-500/20 border border-lime-500/30 rounded-lg p-3 mb-3 flex items-start space-x-2">
            <span className="text-lime-300 mt-0.5 flex-shrink-0">💡</span>
            <p className="text-lime-100">{trimmedLine}</p>
          </div>
        );
      }
      
      // Handle enthusiastic responses
      const enthusiasticStarters = ['Absolutely!', 'Fantastic!', 'Excellent!', 'Perfect!', 'Great!', 'Wonderful!'];
      if (enthusiasticStarters.some(starter => trimmedLine.startsWith(starter))) {
        return (
          <div key={index} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 mb-3 flex items-start space-x-2">
            <span className="text-yellow-300 mt-0.5 flex-shrink-0">🎉</span>
            <p className="text-white font-medium">{trimmedLine}</p>
          </div>
        );
      }
      
      // Handle headings (lines ending with : and shorter than 50 chars)
      if (trimmedLine.endsWith(':') && trimmedLine.length < 50) {
        return (
          <div key={index} className="font-bold text-purple-200 mb-2 mt-4 first:mt-0 border-b border-purple-500/30 pb-1">
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
    if (!N8N_WEBHOOK_URL || 
        N8N_WEBHOOK_URL.includes('your-n8n-instance.com') || 
        N8N_WEBHOOK_URL.includes('your-actual-n8n-instance.com') ||
        N8N_WEBHOOK_URL.includes('localhost') ||
        N8N_WEBHOOK_URL.includes('127.0.0.1')) {
      console.warn('n8n webhook URL not configured. Using fallback response.');
      return getIntelligentFallbackResponse(message);
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
          sessionId: sessionId, // Use persistent session ID
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
      return getIntelligentFallbackResponse(message);
    }
  };

  const getIntelligentFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Trip planning responses
    if (message.includes('plan') || message.includes('trip') || message.includes('itinerary')) {
      if (message.includes('japan')) {
        return "🇯🇵 **Japan Travel Plan**\n\nFantastic choice! Japan offers an incredible blend of ancient traditions and modern innovation.\n\n**7-Day Japan Highlights:**\n• **Days 1-3: Tokyo** - Explore Shibuya, visit Senso-ji Temple, experience Harajuku culture\n• **Days 4-5: Kyoto** - Discover Fushimi Inari Shrine, Bamboo Grove, traditional tea ceremonies\n• **Days 6-7: Osaka** - Enjoy street food in Dotonbori, visit Osaka Castle\n\n**Best Time to Visit:** Spring (March-May) for cherry blossoms or Fall (September-November) for autumn colors\n\n**Budget Estimate:** $150-300 per day including accommodation, meals, and activities\n\nWould you like specific recommendations for accommodations or must-try experiences?";
      }
      if (message.includes('europe')) {
        return "🇪🇺 **Europe Adventure Plan**\n\nEurope offers incredible diversity! Here's a suggested route:\n\n**2-Week Europe Highlights:**\n• **Days 1-3: Paris, France** - Eiffel Tower, Louvre, Seine River cruise\n• **Days 4-6: Amsterdam, Netherlands** - Canals, museums, bike tours\n• **Days 7-9: Prague, Czech Republic** - Historic Old Town, castle tours\n• **Days 10-12: Vienna, Austria** - Imperial palaces, coffee culture\n• **Days 13-14: Budapest, Hungary** - Thermal baths, Danube views\n\n**Budget-Friendly Tips:**\n• Use Eurail passes for train travel\n• Stay in hostels or budget hotels\n• Eat at local markets and cafes\n\n**Estimated Budget:** $100-200 per day\n\nWhat type of experiences interest you most - history, art, nightlife, or cuisine?";
      }
      return "✈️ **Let's Plan Your Perfect Trip!**\n\nI'd love to help you create an amazing itinerary! To give you the best recommendations, could you tell me:\n\n• **Destination:** Where would you like to go?\n• **Duration:** How many days do you have?\n• **Budget:** What's your approximate budget range?\n• **Interests:** What do you enjoy most - culture, adventure, relaxation, food?\n• **Travel Style:** Luxury, mid-range, or budget-friendly?\n\nOnce I know more about your preferences, I can create a detailed day-by-day plan with specific recommendations for accommodations, activities, and local experiences!";
    }
    
    // Destination-specific responses
    if (message.includes('bali')) {
      return "🏝️ **Bali Travel Guide**\n\n**Best Time to Visit:** April-October (dry season)\n\n**Must-Visit Areas:**\n• **Ubud** - Rice terraces, yoga retreats, art galleries\n• **Seminyak** - Beautiful beaches, upscale dining, nightlife\n• **Canggu** - Surf spots, beach clubs, digital nomad scene\n• **Nusa Penida** - Stunning cliffs, crystal clear waters\n\n**Budget Estimates:**\n• Budget: $30-50/day\n• Mid-range: $75-150/day\n• Luxury: $200+/day\n\n**Pro Tips:**\n• Rent a scooter for easy transportation\n• Try local warungs for authentic Indonesian food\n• Book accommodations in advance during peak season\n\nWhat type of Bali experience are you looking for - relaxation, adventure, or cultural immersion?";
    }
    
    // Budget-related responses
    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
      return "💰 **Budget Travel Tips**\n\n**Money-Saving Strategies:**\n• **Accommodation:** Hostels, guesthouses, or Airbnb\n• **Transportation:** Public transport, budget airlines, train passes\n• **Food:** Local markets, street food, cooking facilities\n• **Activities:** Free walking tours, public beaches, hiking trails\n\n**Budget-Friendly Destinations:**\n• **Southeast Asia:** Thailand, Vietnam, Cambodia ($25-50/day)\n• **Eastern Europe:** Poland, Hungary, Czech Republic ($40-80/day)\n• **Central America:** Guatemala, Nicaragua, Mexico ($30-60/day)\n• **South America:** Peru, Bolivia, Ecuador ($35-70/day)\n\n**Budget Planning Tools:**\n• Set daily spending limits\n• Track expenses with apps\n• Book flights and accommodation in advance\n• Consider travel insurance\n\nWhat's your target daily budget and preferred region?";
    }
    
    // Romantic/couples responses
    if (message.includes('romantic') || message.includes('couple') || message.includes('honeymoon')) {
      return "💕 **Romantic Destinations for Couples**\n\n**Top Romantic Getaways:**\n\n🇮🇹 **Tuscany, Italy**\n• Wine tastings in Chianti region\n• Sunset dinners in Florence\n• Countryside villa stays\n\n🇬🇷 **Santorini, Greece**\n• Iconic blue-domed churches\n• Spectacular sunset views in Oia\n• Private infinity pool suites\n\n🇫🇷 **Paris, France**\n• Seine river cruises\n• Picnics in Luxembourg Gardens\n• Cozy bistros in Montmartre\n\n🏝️ **Maldives**\n• Overwater bungalows\n• Private beach dinners\n• Couples spa treatments\n\n**Romantic Activities:**\n• Hot air balloon rides\n• Cooking classes together\n• Private guided tours\n• Sunset photography sessions\n\nWhat's your ideal romantic setting - beach, mountains, city, or countryside?";
    }
    
    // Packing responses
    if (message.includes('pack') || message.includes('luggage') || message.includes('what to bring')) {
      return "🎒 **Smart Packing Guide**\n\n**Essential Items:**\n• **Documents:** Passport, visas, travel insurance, copies\n• **Electronics:** Phone, chargers, power bank, adapters\n• **Health:** Medications, first aid kit, sunscreen\n• **Clothing:** Weather-appropriate, comfortable walking shoes\n\n**Packing Tips:**\n• Roll clothes to save space\n• Use packing cubes for organization\n• Wear heaviest items on the plane\n• Pack one outfit in carry-on\n\n**Climate-Specific Additions:**\n• **Tropical:** Lightweight, breathable fabrics, insect repellent\n• **Cold Weather:** Layers, waterproof jacket, warm accessories\n• **City Travel:** Dressier options, comfortable walking shoes\n• **Adventure:** Quick-dry clothing, sturdy boots, gear\n\nWhat's your destination and travel style? I can create a specific packing checklist for you!";
    }
    
    // General travel advice
    if (message.includes('advice') || message.includes('tips') || message.includes('help')) {
      return "🌟 **Essential Travel Tips**\n\n**Before You Go:**\n• Research visa requirements and vaccinations\n• Notify banks of travel plans\n• Make copies of important documents\n• Check weather and pack accordingly\n\n**While Traveling:**\n• Stay connected with local SIM or international plan\n• Keep emergency contacts handy\n• Respect local customs and dress codes\n• Try local cuisine and experiences\n\n**Safety Tips:**\n• Share itinerary with someone at home\n• Keep valuables secure\n• Trust your instincts\n• Have backup payment methods\n\n**Cultural Immersion:**\n• Learn basic local phrases\n• Use public transportation\n• Shop at local markets\n• Connect with locals through tours or activities\n\nWhat specific aspect of travel would you like more detailed advice on?";
    }
    
    // Default response
    return "🌍 **Welcome to Your AI Travel Assistant!**\n\nI'm here to help make your travel dreams come true! I can assist you with:\n\n✈️ **Trip Planning:** Custom itineraries for any destination\n🏨 **Accommodations:** Hotel and lodging recommendations\n🍽️ **Local Experiences:** Food, culture, and activities\n💰 **Budget Planning:** Cost estimates and money-saving tips\n🎒 **Packing Guides:** What to bring for any climate\n📍 **Destination Guides:** Insider tips for popular locations\n\n**Popular Questions:**\n• \"Plan a 10-day trip to Thailand\"\n• \"Best time to visit Iceland?\"\n• \"Romantic destinations in Europe\"\n• \"Budget backpacking through South America\"\n\nWhat adventure can I help you plan today? Just tell me where you'd like to go or what kind of experience you're looking for!";
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
    <div className={`fixed inset-0 z-50 ${
      isMaximized 
        ? 'bg-dark' 
        : 'flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
    }`}>
      <div className={`${
        isMaximized 
          ? 'w-full h-full' 
          : 'w-full max-w-2xl h-[600px] rounded-3xl border border-white/10 shadow-2xl'
      } bg-dark/95 backdrop-blur-xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-dark/80 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Travel Assistant</h3>
              <p className="text-sm text-gray-400">Powered by Journey AI</p>
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
        <div className="flex-1 overflow-y-auto">
          <div className={`p-6 space-y-4 ${isMaximized ? 'max-w-4xl mx-auto' : ''}`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
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
                <div className={`max-w-[80%] ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-primary text-white'
                      : 'bg-white/10 text-white backdrop-blur-sm'
                  }`}>
                    <div className="text-sm leading-relaxed">
                      {message.sender === 'bot' ? formatMessage(message.text) : (
                        <p className="text-white">{message.text}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
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
          <div className={`px-6 pb-4 ${isMaximized ? 'max-w-4xl mx-auto w-full' : ''}`}>
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
        )}

        {/* Input */}
        <div className="p-6 border-t border-white/10 bg-dark/80 backdrop-blur-xl">
          <div className={`flex items-center space-x-3 ${isMaximized ? 'max-w-4xl mx-auto' : ''}`}>
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
            Session ID: {sessionId.split('_')[2]} • Connected to n8n workflow • Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;