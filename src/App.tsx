import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureIcons from './components/FeatureIcons';
import FeaturePreview from './components/FeaturePreview';
import BackgroundElements from './components/BackgroundElements';
import ChatBot from './components/ChatBot';
import AIChatPage from './components/AIChatPage';
import DatabaseSetup from './components/DatabaseSetup';
import { MessageCircle } from 'lucide-react';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAIChatPageOpen, setIsAIChatPageOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAIChatPage = () => {
    setIsAIChatPageOpen(true);
  };

  const closeAIChatPage = () => {
    setIsAIChatPageOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark text-white relative">
      <BackgroundElements scrollY={scrollY} />
      
      <Header />
      
      <main className="relative z-10">
        <Hero onStartJourney={openAIChatPage} />
        <FeatureIcons />
        <FeaturePreview />
      </main>

      {/* Floating AI Travel Assistant Button */}
      <button
        onClick={openAIChatPage}
        className="fixed bottom-6 right-6 z-40 bg-gradient-primary hover:bg-gradient-secondary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center space-x-2"
      >
        <MessageCircle size={24} />
        <span className="hidden md:inline font-semibold">AI Travel Assistant</span>
      </button>

      {/* Chat Components */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <AIChatPage isOpen={isAIChatPageOpen} onClose={closeAIChatPage} />
      
      {/* Database Setup Component */}
      <DatabaseSetup />
    </div>
  );
}

export default App;