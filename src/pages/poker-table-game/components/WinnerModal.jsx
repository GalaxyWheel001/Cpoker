import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WinnerModal = ({ 
  isOpen, 
  onClose, 
  winner, 
  winningHand, 
  potAmount, 
  showCards = true 
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

  const getHandName = (handType) => {
    const handNames = {
      'royal_flush': 'Роял-флеш',
      'straight_flush': 'Стрит-флеш',
      'four_of_a_kind': 'Каре',
      'full_house': 'Фулл-хаус',
      'flush': 'Флеш',
      'straight': 'Стрит',
      'three_of_a_kind': 'Тройка',
      'two_pair': 'Две пары',
      'pair': 'Пара',
      'high_card': 'Старшая карта'
    };
    return handNames?.[handType] || handType;
  };

  const renderCard = (card) => {
    if (!card) return null;

    const getSuitColor = (suit) => {
      return suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-black';
    };

    return (
      <div className="w-12 h-16 bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-center text-black font-bold shadow-lg">
        <span className="text-sm">{card?.rank}</span>
        <span className={`text-lg ${getSuitColor(card?.suit)}`}>{card?.suit}</span>
      </div>
    );
  };

  if (!isOpen || !winner) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      {/* Modal */}
      <div className="relative w-full max-w-md bg-background border border-border rounded-lg poker-shadow-modal animate-bounce-in">
        {/* Celebration Header */}
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-warning via-primary to-accent p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-warning/20 via-primary/20 to-accent/20 animate-pulse" />
          <div className="relative z-10">
            <Icon name="Trophy" size={48} className="text-background mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-background mb-1">Победитель!</h2>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Coins" size={20} className="text-background" />
              <span className="text-xl font-bold text-background font-mono">
                +{formatChips(potAmount)} ₽
              </span>
            </div>
          </div>
        </div>

        {/* Winner Info */}
        <div className="p-6 space-y-4">
          {/* Winner Avatar and Name */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary">
              <Image
                src={winner?.avatar}
                alt={winner?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{winner?.name}</h3>
              <p className="text-sm text-muted-foreground">Выиграл банк</p>
            </div>
          </div>

          {/* Winning Hand */}
          {winningHand && (
            <div className="space-y-3">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-primary mb-2">
                  {getHandName(winningHand?.type)}
                </h4>
                {winningHand?.description && (
                  <p className="text-sm text-muted-foreground">
                    {winningHand?.description}
                  </p>
                )}
              </div>

              {/* Winning Cards */}
              {showCards && winningHand?.cards && (
                <div className="flex justify-center space-x-2">
                  {winningHand?.cards?.map((card, index) => (
                    <div key={index} className="animate-flip-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      {renderCard(card)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Statistics */}
          <div className="bg-surface rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Размер банка:</span>
              <span className="font-mono font-bold text-foreground">
                {formatChips(potAmount)} ₽
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Комиссия дома:</span>
              <span className="font-mono text-foreground">
                {formatChips(Math.floor(potAmount * 0.05))} ₽
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-2">
              <span className="text-muted-foreground">Чистый выигрыш:</span>
              <span className="font-mono font-bold text-success">
                +{formatChips(Math.floor(potAmount * 0.95))} ₽
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              iconName="RotateCcw"
              iconPosition="left"
            >
              Новая рука
            </Button>
            <Button
              variant="default"
              onClick={onClose}
              className="flex-1"
              iconName="Play"
              iconPosition="left"
            >
              Продолжить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;