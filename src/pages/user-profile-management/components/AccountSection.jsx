import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountSection = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface rounded-lg poker-shadow-interactive overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/5 poker-transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Данные аккаунта</h3>
            <p className="text-sm text-muted-foreground">Интеграция с Telegram</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-border">
          {/* Telegram Integration */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Icon name="MessageCircle" size={18} className="text-primary" />
              <div>
                <div className="text-sm font-medium text-foreground">Telegram</div>
                <div className="text-xs text-muted-foreground">@{user?.username || 'username'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-xs text-success font-medium">Подключен</span>
            </div>
          </div>

          {/* Verification Status */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={18} className="text-success" />
              <div>
                <div className="text-sm font-medium text-foreground">Верификация</div>
                <div className="text-xs text-muted-foreground">Аккаунт подтвержден</div>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-success/10 px-2 py-1 rounded-full">
              <Icon name="Check" size={12} className="text-success" />
              <span className="text-xs text-success font-medium">Готово</span>
            </div>
          </div>

          {/* Player ID */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Icon name="Hash" size={18} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">ID игрока</div>
                <div className="text-xs text-muted-foreground font-mono">#{user?.playerId || '123456'}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" iconName="Copy">
              Копировать
            </Button>
          </div>

          {/* Registration Date */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={18} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Регистрация</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(user?.joinDate || '2024-01-01')?.toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSection;