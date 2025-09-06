import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';
import UserProfile from './UserProfile';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'signup'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openLoginModal = () => {
    setLoginModalMode('login');
    setIsLoginModalOpen(true);
  };

  const openSignupModal = () => {
    setLoginModalMode('signup');
    setIsLoginModalOpen(true);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark/80 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="logo text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Journey
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="nav-link">Travel Guides</a>
              <a href="#" className="nav-link">Hotels</a>
              <a href="#" className="nav-link">Experiences</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center space-x-2 btn-secondary"
              >
                <User size={18} />
                <span className="hidden md:inline">
                  {user.first_name} {user.last_name}
                </span>
              </button>
            ) : (
              <>
                <button 
                  onClick={openLoginModal}
                  className="btn-secondary"
                >
                  Log In
                </button>
                <button 
                  onClick={openSignupModal}
                  className="btn-primary"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        initialMode={loginModalMode}
        onClose={() => setIsLoginModalOpen(false)} 
      />
      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </header>
  );
};

export default Header;