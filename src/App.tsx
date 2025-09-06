import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureIcons from './components/FeatureIcons';
import FeaturePreview from './components/FeaturePreview';
import BackgroundElements from './components/BackgroundElements';
import ChatBot from './components/ChatBot';
import AIChatPage from './components/AIChatPage';

function App() {
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

  const handleOpenAIChatPage = () => {
    setIsAIChatPageOpen(true);
  };

  return (
    <div className="relative">
      <BackgroundElements scrollY={scrollY} />
      <Header />
      <Hero scrollY={scrollY} onStartJourney={handleStartJourney} />
      <FeatureIcons />
      <FeaturePreview />
      
      {/* Temporary button to test AI Chat Page */}
      <button
        onClick={handleOpenAIChatPage}
        className="fixed bottom-6 right-6 bg-gradient-primary text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform z-40"
      >
        Open AI Chat Page
      </button>
      
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <AIChatPage isOpen={isAIChatPageOpen} onClose={() => setIsAIChatPageOpen(false)} />
    </div>
  );
}

export default App;