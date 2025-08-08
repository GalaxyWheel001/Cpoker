import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';


const TelegramLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTelegramLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Telegram WebApp SDK authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful authentication
      const mockUser = {
        id: 123456789,
        username: "poker_player_2025",
        first_name: "Алексей",
        last_name: "Петров",
        photo_url: "https://randomuser.me/api/portraits/men/32.jpg"
      };
      
      // Store user data in localStorage
      localStorage.setItem('telegram_user', JSON.stringify(mockUser));
      localStorage.setItem('chip_balance', '10000');
      localStorage.setItem('usdt_balance', '100.50');
      
      // Navigate to game lobby
      navigate('/game-lobby');
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Button
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        onClick={handleTelegramLogin}
        iconName="MessageCircle"
        iconPosition="left"
        className="bg-primary hover:bg-primary/90 text-primary-foreground poker-shadow-interactive poker-transition hover:scale-105 active:scale-95 mb-4"
      >
        {isLoading ? 'Подключение...' : 'Войти через Telegram'}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Нажимая кнопку, вы соглашаетесь с условиями использования
      </p>
    </div>
  );
};

export default TelegramLoginButton;