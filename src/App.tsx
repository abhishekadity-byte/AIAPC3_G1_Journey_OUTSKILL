import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturePreview from './components/FeaturePreview';
import FeatureIcons from './components/FeatureIcons';
import BackgroundElements from './components/BackgroundElements';
import ChatBot from './components/ChatBot';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartJourney = () => {
    setIsChatBotOpen(true);
  };

  const handleCloseChatBot = () => {
    setIsChatBotOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <BackgroundElements scrollY={scrollY} />
      <Header />
      <Hero scrollY={scrollY} onStartJourney={handleStartJourney} />
      <FeaturePreview />
      <FeatureIcons />
      <ChatBot isOpen={isChatBotOpen} onClose={handleCloseChatBot} />
    </div>
  );
}

export default App;