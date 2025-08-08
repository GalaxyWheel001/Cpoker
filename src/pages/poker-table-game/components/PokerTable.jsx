import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PokerTable = ({ 
  players, 
  communityCards, 
  pot, 
  currentPlayer, 
  dealerPosition, 
  smallBlindPosition, 
  bigBlindPosition,
  gamePhase 
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

  // Компактные позиции для игроков с адаптацией под мобильные устройства
  const getPlayerPosition = (index, totalPlayers) => {
    // Для мобильных устройств используем более компактное расположение
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Мобильная версия: игроки по краям экрана
      const mobilePositions = [
        { bottom: '5%', left: '50%', transform: 'translate(-50%, 0)' }, // Нижний центр (текущий игрок)
        { top: '5%', left: '50%', transform: 'translate(-50%, 0)' }, // Верхний центр
        { top: '50%', right: '5%', transform: 'translate(0, -50%)' }, // Правый центр
        { bottom: '50%', right: '5%', transform: 'translate(0, 50%)' }, // Правый низ
        { top: '50%', left: '5%', transform: 'translate(0, -50%)' }, // Левый центр
        { bottom: '50%', left: '5%', transform: 'translate(0, 50%)' } // Левый низ
      ];
      return mobilePositions[index] || mobilePositions[0];
    } else {
      // Десктопная версия: более традиционное расположение
      const desktopPositions = [
        { bottom: '8%', left: '50%', transform: 'translate(-50%, 0)' }, // Нижний центр
        { bottom: '25%', right: '8%', transform: 'translate(0, 0)' }, // Правый низ
        { top: '25%', right: '8%', transform: 'translate(0, 0)' }, // Правый верх
        { top: '8%', left: '50%', transform: 'translate(-50%, 0)' }, // Верхний центр
        { top: '25%', left: '8%', transform: 'translate(0, 0)' }, // Левый верх
        { bottom: '25%', left: '8%', transform: 'translate(0, 0)' } // Левый низ
      ];
      return desktopPositions[index] || desktopPositions[0];
    }
  };

  const renderCard = (card, index, isDealing = false) => {
    const isMobile = window.innerWidth < 768;
    const cardSize = isMobile ? 'w-8 h-10' : 'w-10 h-13';
    const textSize = isMobile ? 'text-xs' : 'text-sm';
    
    if (!card || card?.hidden) {
      return (
        <div 
          key={index}
          className={`${cardSize} bg-gradient-to-br from-blue-900 to-purple-900 rounded-md border border-border flex items-center justify-center ${
            isDealing ? 'animate-pulse' : ''
          }`}
        >
          <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} bg-primary/20 rounded-full`} />
        </div>
      );
    }

    const getSuitColor = (suit) => {
      return suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-foreground';
    };

    return (
      <div 
        key={`${card?.rank}${card?.suit}`}
        className={`${cardSize} bg-white rounded-md border border-gray-300 flex flex-col items-center justify-center text-black font-bold shadow-lg ${
          isDealing ? 'animate-bounce' : ''
        }`}
      >
        <span className={`${textSize} font-bold`}>{card?.rank}</span>
        <span className={`${isMobile ? 'text-sm' : 'text-base'} ${getSuitColor(card?.suit)}`}>{card?.suit}</span>
      </div>
    );
  };

  const renderPlayerCards = (player, index) => {
    const isMobile = window.innerWidth < 768;
    const cardSize = isMobile ? 'w-6 h-7' : 'w-7 h-9';
    const textSize = isMobile ? 'text-xs' : 'text-sm';
    
    if (!player?.cards || player?.cards?.length === 0) {
      return (
        <div className="flex space-x-0.5">
          <div className={`${cardSize} bg-surface rounded border border-border`} />
          <div className={`${cardSize} bg-surface rounded border border-border`} />
        </div>
      );
    }

    return (
      <div className="flex space-x-0.5">
        {player?.cards?.map((card, cardIndex) => (
          <div key={cardIndex} className={`${cardSize} bg-white rounded border border-gray-300 flex flex-col items-center justify-center text-black ${textSize} font-bold`}>
            {card?.hidden ? (
              <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-primary/20 rounded-full`} />
            ) : (
              <>
                <span className={textSize}>{card?.rank}</span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} ${card?.suit === '♥' || card?.suit === '♦' ? 'text-red-500' : 'text-black'}`}>
                  {card?.suit}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPlayer = (player, index) => {
    if (!player) return null;
    
    const position = getPlayerPosition(index, players?.length);
    const isActive = currentPlayer === index;
    const isDealer = dealerPosition === index;
    const isSmallBlind = smallBlindPosition === index;
    const isBigBlind = bigBlindPosition === index;
    const isMobile = window.innerWidth < 768;

    return (
      <div
        key={player?.id}
        className="absolute z-20"
        style={position}
      >
        <div className={`flex flex-col items-center space-y-1 ${
          isActive ? 'animate-pulse' : ''
        }`}>
          {/* Компактная карточка игрока */}
          <div className={`relative p-1.5 rounded-lg bg-background/95 backdrop-blur-sm border-2 shadow-lg ${
            isActive ? 'border-primary glow-primary' : 'border-border'
          } ${isMobile ? 'min-w-[80px]' : 'min-w-[100px]'}`}>
            <div className="flex flex-col items-center space-y-1">
              {/* Аватар с индикаторами */}
              <div className="relative">
                <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full overflow-hidden border-2 border-border`}>
                  <Image
                    src={player?.avatar}
                    alt={player?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Компактные индикаторы позиций */}
                {isDealer && (
                  <div className={`absolute -top-0.5 -right-0.5 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'} bg-warning rounded-full flex items-center justify-center border border-background`}>
                    <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-bold text-background`}>D</span>
                  </div>
                )}
                {isSmallBlind && (
                  <div className={`absolute -top-0.5 -left-0.5 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'} bg-primary rounded-full flex items-center justify-center border border-background`}>
                    <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-bold text-primary-foreground`}>S</span>
                  </div>
                )}
                {isBigBlind && (
                  <div className={`absolute -bottom-0.5 -left-0.5 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'} bg-secondary rounded-full flex items-center justify-center border border-background`}>
                    <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-bold text-secondary-foreground`}>B</span>
                  </div>
                )}
              </div>

              {/* Имя игрока */}
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-foreground truncate max-w-full text-center`}>
                {player?.name}
              </p>

              {/* Фишки */}
              <div className="flex items-center space-x-1">
                <Icon name="Coins" size={isMobile ? 10 : 12} className="text-warning" />
                <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-mono font-bold text-foreground`}>
                  {formatChips(player?.chips)}
                </span>
              </div>

              {/* Статус игрока */}
              {player?.status && (
                <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                  player?.status === 'fold' ? 'bg-destructive/20 text-destructive' :
                  player?.status === 'call' ? 'bg-success/20 text-success' :
                  player?.status === 'raise' ? 'bg-warning/20 text-warning' :
                  player?.status === 'check'? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {player?.status === 'fold' && 'Пас'}
                  {player?.status === 'call' && 'Колл'}
                  {player?.status === 'raise' && 'Рейз'}
                  {player?.status === 'check' && 'Чек'}
                  {player?.status === 'waiting' && 'Ожидание'}
                </div>
              )}
            </div>
          </div>

          {/* Карты игрока */}
          <div className={`${player?.status === 'fold' ? 'opacity-50' : ''}`}>
            {renderPlayerCards(player, index)}
          </div>

          {/* Текущая ставка */}
          {player?.currentBet > 0 && (
            <div className="bg-primary/90 backdrop-blur-sm px-1.5 py-0.5 rounded border border-primary">
              <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-mono font-bold text-primary-foreground`}>
                {formatChips(player?.currentBet)}
              </span>
            </div>
          )}

          {/* Таймер для активного игрока */}
          {isActive && player?.timeLeft && (
            <div className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} relative`}>
              <svg className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} transform -rotate-90`} viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - player?.timeLeft / 30)}`}
                  className="text-primary poker-transition"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-bold text-primary`}>
                  {Math.ceil(player?.timeLeft)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-2xl border-4 border-yellow-600 overflow-hidden">
      {/* Узор стола */}
      <div className="absolute inset-4 bg-gradient-to-br from-green-700 to-green-800 rounded-xl opacity-90" />
      
      {/* Центральная область с общими картами */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col items-center space-y-3">
          {/* Банк */}
          <div className="bg-background/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary shadow-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Банк</p>
              <p className="text-lg font-bold text-primary font-mono">
                {formatChips(pot)} ₽
              </p>
            </div>
          </div>

          {/* Общие карты */}
          <div className="flex space-x-1">
            {Array.from({ length: 5 })?.map((_, index) => {
              const card = communityCards?.[index];
              const isDealing = gamePhase === 'dealing' && index === communityCards?.length;
              return renderCard(card, index, isDealing);
            })}
          </div>

          {/* Индикатор фазы игры */}
          <div className="text-center">
            <p className="text-sm font-medium text-accent bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
              {gamePhase === 'preflop' && 'Префлоп'}
              {gamePhase === 'flop' && 'Флоп'}
              {gamePhase === 'turn' && 'Тёрн'}
              {gamePhase === 'river' && 'Ривер'}
              {gamePhase === 'showdown' && 'Вскрытие'}
            </p>
          </div>
        </div>
      </div>

      {/* Игроки */}
      {players?.map((player, index) => renderPlayer(player, index))}

      {/* Анимация фишек */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Здесь будут анимированные фишки, движущиеся к банку */}
      </div>
    </div>
  );
};

export default PokerTable;