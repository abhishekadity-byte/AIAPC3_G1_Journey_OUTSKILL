import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartJourney: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartJourney }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      {/* Floating particles */}
      <div className="floating-particles">
        <div className="floating-particle floating-particle-1" />
        <div className="floating-particle floating-particle-2" />
        <div className="floating-particle floating-particle-3" />
        <div className="floating-particle floating-particle-4" />
        <div className="floating-particle floating-particle-5" />
        <div className="floating-particle floating-particle-6" />
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-sm font-medium">AI-Powered Travel Planning</span>
          </div>
          
          {/* Main heading */}
          <h1 className="hero-title mb-6">
            Your Perfect Journey
            <br />
            Starts Here
          </h1>
          
          {/* Subtitle */}
          <p className="hero-subtitle mb-12 max-w-2xl mx-auto">
            Discover amazing destinations, plan unforgettable experiences, and create memories that last a lifetime with our AI-powered travel companion.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={onStartJourney}
              className="btn-hero group"
            >
              Start Your Journey
              <ArrowRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary">
              Explore Destinations
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-gray-400 text-sm">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                200+
              </div>
              <div className="text-gray-400 text-sm">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                4.9★
              </div>
              <div className="text-gray-400 text-sm">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;