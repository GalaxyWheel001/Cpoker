import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingAnimation = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Poker Chips */}
        <div className="relative">
          <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center animate-bounce">
            <Icon name="Coins" size={24} color="var(--color-background)" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-success rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xs font-bold text-background">$</span>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Подключение к Telegram
          </h3>
          <p className="text-sm text-muted-foreground">
            Проверяем ваши данные...
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-48 h-2 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" 
               style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;