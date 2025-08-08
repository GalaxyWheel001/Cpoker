import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PlayerActionControls = ({ 
  currentBet, 
  minRaise, 
  maxRaise, 
  playerChips, 
  canCheck, 
  canCall, 
  canRaise, 
  canFold,
  onFold, 
  onCheck, 
  onCall, 
  onRaise,
  disabled = false 
}) => {
  const [raiseAmount, setRaiseAmount] = useState(minRaise);
  const [showRaiseSlider, setShowRaiseSlider] = useState(false);

  const formatChips = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000)?.toFixed(1)}М`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000)?.toFixed(1)}К`;
    }
    return amount?.toLocaleString();
  };

  const handleRaiseSliderChange = (e) => {
    setRaiseAmount(parseInt(e?.target?.value));
  };

  const handleQuickBet = (multiplier) => {
    const amount = Math.min(currentBet * multiplier, maxRaise);
    setRaiseAmount(amount);
  };

  const handleRaiseConfirm = () => {
    onRaise(raiseAmount);
    setShowRaiseSlider(false);
  };

  if (disabled) {
    return (
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-3 lg:p-4">
        <div className="text-center">
          <Icon name="Clock" size={20} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Ожидание хода</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 lg:p-4 space-y-3 lg:space-y-4">
      {/* Слайдер рейза */}
      {showRaiseSlider && (
        <div className="space-y-3 border-b border-border pb-3 lg:pb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Размер ставки</span>
            <span className="text-base lg:text-lg font-bold text-primary font-mono">
              {formatChips(raiseAmount)} ₽
            </span>
          </div>
          
          <div className="space-y-2">
            <input
              type="range"
              min={minRaise}
              max={maxRaise}
              value={raiseAmount}
              onChange={handleRaiseSliderChange}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((raiseAmount - minRaise) / (maxRaise - minRaise)) * 100}%, var(--color-surface) ${((raiseAmount - minRaise) / (maxRaise - minRaise)) * 100}%, var(--color-surface) 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatChips(minRaise)}</span>
              <span>{formatChips(maxRaise)}</span>
            </div>
          </div>

          {/* Быстрые ставки */}
          <div className="grid grid-cols-4 gap-1 lg:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickBet(2)}
              className="text-xs lg:text-sm"
            >
              2x
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickBet(3)}
              className="text-xs lg:text-sm"
            >
              3x
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickBet(5)}
              className="text-xs lg:text-sm"
            >
              5x
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRaiseAmount(maxRaise)}
              className="text-xs lg:text-sm"
            >
              Все
            </Button>
          </div>

          {/* Кнопки подтверждения */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowRaiseSlider(false)}
              className="flex-1 text-sm"
            >
              Отмена
            </Button>
            <Button
              variant="default"
              onClick={handleRaiseConfirm}
              className="flex-1 text-sm"
            >
              Поставить {formatChips(raiseAmount)}
            </Button>
          </div>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="grid grid-cols-2 gap-2 lg:gap-3">
        {/* Кнопка паса */}
        {canFold && (
          <Button
            variant="destructive"
            onClick={onFold}
            iconName="X"
            iconPosition="left"
            className="h-10 lg:h-12 text-sm lg:text-base"
          >
            Пас
          </Button>
        )}

        {/* Кнопка чека */}
        {canCheck && (
          <Button
            variant="outline"
            onClick={onCheck}
            iconName="Check"
            iconPosition="left"
            className="h-10 lg:h-12 text-sm lg:text-base"
          >
            Чек
          </Button>
        )}

        {/* Кнопка колла */}
        {canCall && (
          <Button
            variant="success"
            onClick={onCall}
            iconName="Phone"
            iconPosition="left"
            className="h-10 lg:h-12 text-sm lg:text-base"
          >
            Колл {formatChips(currentBet)}
          </Button>
        )}

        {/* Кнопка рейза */}
        {canRaise && !showRaiseSlider && (
          <Button
            variant="warning"
            onClick={() => setShowRaiseSlider(true)}
            iconName="TrendingUp"
            iconPosition="left"
            className="h-10 lg:h-12 text-sm lg:text-base"
          >
            Рейз
          </Button>
        )}
      </div>

      {/* Отображение фишек игрока */}
      <div className="flex items-center justify-center space-x-2 pt-2 border-t border-border">
        <Icon name="Coins" size={14} className="text-warning" />
        <span className="text-xs lg:text-sm text-muted-foreground">Ваши фишки:</span>
        <span className="font-mono font-bold text-foreground text-sm lg:text-base">
          {formatChips(playerChips)} ₽
        </span>
      </div>
    </div>
  );
};

export default PlayerActionControls;