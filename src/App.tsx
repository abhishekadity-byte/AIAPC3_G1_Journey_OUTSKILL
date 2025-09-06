import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureIcons from './components/FeatureIcons';
import FeaturePreview from './components/FeaturePreview';
import BackgroundElements from './components/BackgroundElements';
import ChatBot from './components/ChatBot';
import AIChatPage from './components/AIChatPage';

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAIChatPageOpen, setIsAIChatPageOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartJourney = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="relative">
      <BackgroundElements scrollY={scrollY} />
      <Header />
      <Hero scrollY={scrollY} onStartJourney={handleStartJourney} />
      <FeatureIcons />
      <FeaturePreview />
      
      {/* AI Travel Assistant Button */}
      <button
        onClick={() => setIsAIChatPageOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-primary hover:bg-gradient-secondary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
      >
        AI Travel Assistant
      </button>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <AIChatPage isOpen={isAIChatPageOpen} onClose={() => setIsAIChatPageOpen(false)} />
    </div>
  );
};

export default App;