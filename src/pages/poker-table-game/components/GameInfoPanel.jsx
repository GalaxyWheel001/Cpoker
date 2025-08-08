import React from 'react';
import Icon from '../../../components/AppIcon';

const GameInfoPanel = ({ 
  gameInfo, 
  handStrength, 
  gameStats, 
  showHandStrength = true 
}) => {
  const formatChips = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000)?.toFixed(1)}М`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000)?.toFixed(1)}К`;
    }
    return amount?.toLocaleString();
  };

  const getHandStrengthColor = (strength) => {
    if (strength >= 8) return 'text-success';
    if (strength >= 6) return 'text-warning';
    if (strength >= 4) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getHandStrengthText = (strength) => {
    if (strength >= 9) return 'Стрит-флеш';
    if (strength >= 8) return 'Каре';
    if (strength >= 7) return 'Фулл-хаус';
    if (strength >= 6) return 'Флеш';
    if (strength >= 5) return 'Стрит';
    if (strength >= 4) return 'Тройка';
    if (strength >= 3) return 'Две пары';
    if (strength >= 2) return 'Пара';
    return 'Старшая карта';
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Информация об игре */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-3 lg:p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2 lg:mb-3 flex items-center">
          <Icon name="Info" size={14} className="mr-2" />
          Информация об игре
        </h3>
        
        <div className="space-y-1.5 lg:space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Тип игры:</span>
            <span className="text-foreground font-medium">{gameInfo?.gameType || 'Texas Hold\'em'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Блайнды:</span>
            <span className="text-foreground font-medium">
              {formatChips(gameInfo?.smallBlind || 10)}/{formatChips(gameInfo?.bigBlind || 20)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Игроков:</span>
            <span className="text-foreground font-medium">
              {gameInfo?.activePlayers || 0}/{gameInfo?.maxPlayers || 6}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Раунд:</span>
            <span className="text-foreground font-medium">#{gameInfo?.handNumber || 1}</span>
          </div>
        </div>
      </div>

      {/* Сила руки */}
      {showHandStrength && handStrength && (
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-3 lg:p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2 lg:mb-3 flex items-center">
            <Icon name="Target" size={14} className="mr-2" />
            Сила руки
          </h3>
          
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Комбинация:</span>
              <span className={`text-sm font-medium ${getHandStrengthColor(handStrength?.strength)}`}>
                {getHandStrengthText(handStrength?.strength)}
              </span>
            </div>
            
            <div className="w-full bg-surface rounded-full h-1.5 lg:h-2">
              <div 
                className={`h-1.5 lg:h-2 rounded-full poker-transition ${
                  handStrength?.strength >= 8 ? 'bg-success' :
                  handStrength?.strength >= 6 ? 'bg-warning' :
                  handStrength?.strength >= 4 ? 'bg-primary': 'bg-muted'
                }`}
                style={{ width: `${(handStrength?.strength / 10) * 100}%` }}
              />
            </div>
            
            <div className="text-xs text-muted-foreground">
              {handStrength?.description || 'Оценка силы вашей руки'}
            </div>
          </div>
        </div>
      )}

      {/* Статистика */}
      {gameStats && (
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-3 lg:p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2 lg:mb-3 flex items-center">
            <Icon name="BarChart3" size={14} className="mr-2" />
            Статистика
          </h3>
          
          <div className="space-y-1.5 lg:space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Рук сыграно:</span>
              <span className="text-foreground font-medium">{gameStats?.handsPlayed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Выиграно:</span>
              <span className="text-success font-medium">{gameStats?.handsWon || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VPIP:</span>
              <span className="text-foreground font-medium">
                {gameStats?.vpip ? `${gameStats?.vpip}%` : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PFR:</span>
              <span className="text-foreground font-medium">
                {gameStats?.pfr ? `${gameStats?.pfr}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Быстрые действия */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-3 lg:p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2 lg:mb-3 flex items-center">
          <Icon name="Zap" size={14} className="mr-2" />
          Быстрые действия
        </h3>
        
        <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
          <button className="flex items-center justify-center space-x-1 p-1.5 lg:p-2 bg-background/50 hover:bg-background/70 rounded border border-border poker-transition">
            <Icon name="Eye" size={12} />
            <span className="text-xs">Показать</span>
          </button>
          <button className="flex items-center justify-center space-x-1 p-1.5 lg:p-2 bg-background/50 hover:bg-background/70 rounded border border-border poker-transition">
            <Icon name="EyeOff" size={12} />
            <span className="text-xs">Скрыть</span>
          </button>
          <button className="flex items-center justify-center space-x-1 p-1.5 lg:p-2 bg-background/50 hover:bg-background/70 rounded border border-border poker-transition">
            <Icon name="MessageCircle" size={12} />
            <span className="text-xs">Чат</span>
          </button>
          <button className="flex items-center justify-center space-x-1 p-1.5 lg:p-2 bg-background/50 hover:bg-background/70 rounded border border-border poker-transition">
            <Icon name="Settings" size={12} />
            <span className="text-xs">Настройки</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInfoPanel;