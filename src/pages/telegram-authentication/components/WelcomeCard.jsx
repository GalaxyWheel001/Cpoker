import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeCard = () => {
  return (
    <div className="bg-surface border border-border rounded-2xl p-8 poker-shadow-modal max-w-sm w-full mx-auto">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 poker-shadow-interactive">
          <Icon name="Spade" size={40} color="var(--color-background)" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Poker Room</h1>
        <p className="text-muted-foreground text-center text-sm">
          Премиальная игровая платформа
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-lg">
          <Icon name="Shield" size={16} color="var(--color-primary)" />
          <span className="text-xs font-medium text-primary">Безопасно</span>
        </div>
        <div className="flex items-center space-x-2 bg-success/10 px-3 py-1.5 rounded-lg">
          <Icon name="Zap" size={16} color="var(--color-success)" />
          <span className="text-xs font-medium text-success">USDT</span>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
          <span className="text-sm text-muted-foreground">Техасский Холдем</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
          <span className="text-sm text-muted-foreground">Криптовалютные игры</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
          <span className="text-sm text-muted-foreground">Турниры и кэш-игры</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;