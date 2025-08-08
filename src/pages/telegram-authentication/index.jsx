import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeCard from './components/WelcomeCard';
import TelegramLoginButton from './components/TelegramLoginButton';
import LoadingAnimation from './components/LoadingAnimation';
import SecurityFooter from './components/SecurityFooter';
import BackgroundGraphics from './components/BackgroundGraphics';

const TelegramAuthentication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const telegramUser = localStorage.getItem('telegram_user');
    if (telegramUser) {
      navigate('/game-lobby');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Graphics */}
      <BackgroundGraphics />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Welcome Card */}
          <div className="mb-8">
            <WelcomeCard />
          </div>
          
          {/* Login Button */}
          <div className="mb-8">
            <TelegramLoginButton />
          </div>
          
          {/* Security Footer */}
          <SecurityFooter />
        </div>
      </div>
      
      {/* Loading Animation Overlay */}
      <LoadingAnimation isVisible={isLoading} />
    </div>
  );
};

export default TelegramAuthentication;