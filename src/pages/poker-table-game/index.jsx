import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

import PokerTable from './components/PokerTable';
import PlayerActionControls from './components/PlayerActionControls';
import GameInfoPanel from './components/GameInfoPanel';
import ChatOverlay from './components/ChatOverlay';
import WinnerModal from './components/WinnerModal';

const PokerTableGame = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('playing'); // playing, paused, finished
  const [gamePhase, setGamePhase] = useState('preflop'); // preflop, flop, turn, river, showdown
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [pot, setPot] = useState(450);
  const [showChat, setShowChat] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);

  // Mock game data
  const [players] = useState([
    {
      id: 1,
      name: 'Алексей',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      chips: 2500,
      cards: [
        { rank: 'A', suit: '♠' },
        { rank: 'K', suit: '♥' }
      ],
      currentBet: 50,
      status: 'waiting',
      timeLeft: 25
    },
    {
      id: 2,
      name: 'Мария',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      chips: 1800,
      cards: [
        { rank: 'Q', suit: '♦', hidden: true },
        { rank: 'J', suit: '♣', hidden: true }
      ],
      currentBet: 50,
      status: 'call'
    },
    {
      id: 3,
      name: 'Дмитрий',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      chips: 3200,
      cards: [
        { rank: '10', suit: '♠', hidden: true },
        { rank: '9', suit: '♠', hidden: true }
      ],
      currentBet: 100,
      status: 'raise'
    },
    {
      id: 4,
      name: 'Елена',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      chips: 950,
      cards: [
        { rank: '7', suit: '♥', hidden: true },
        { rank: '6', suit: '♥', hidden: true }
      ],
      currentBet: 0,
      status: 'fold'
    },
    {
      id: 5,
      name: 'Игорь',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      chips: 2100,
      cards: [
        { rank: 'K', suit: '♣', hidden: true },
        { rank: 'Q', suit: '♠', hidden: true }
      ],
      currentBet: 50,
      status: 'check'
    },
    {
      id: 6,
      name: 'Анна',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      chips: 1750,
      cards: [
        { rank: '8', suit: '♦', hidden: true },
        { rank: '8', suit: '♣', hidden: true }
      ],
      currentBet: 50,
      status: 'waiting'
    }
  ]);

  const [communityCards] = useState([
    { rank: 'A', suit: '♣' },
    { rank: 'K', suit: '♦' },
    { rank: 'Q', suit: '♠' },
    { rank: 'J', suit: '♥' },
    null // River card not dealt yet
  ]);

  const [gameInfo] = useState({
    gameType: 'Texas Hold\'em',
    smallBlind: 25,
    bigBlind: 50,
    activePlayers: 5,
    maxPlayers: 6,
    handNumber: 23
  });

  const [handStrength] = useState({
    strength: 8,
    description: 'У вас очень сильная рука - туз-король одномастные!'
  });

  const [gameStats] = useState({
    handsPlayed: 45,
    handsWon: 12,
    vpip: 28,
    pfr: 15
  });

  const [chatMessages] = useState([
    {
      userId: 2,
      username: 'Мария',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      text: 'Удачи всем!',
      timestamp: Date.now() - 300000
    },
    {
      userId: 3,
      username: 'Дмитрий',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      text: 'Хорошая игра получается',
      timestamp: Date.now() - 120000
    }
  ]);

  const currentUser = players?.[0]; // Player is first in array

  // Game timer effect
  useEffect(() => {
    if (gameState === 'playing' && players?.[currentPlayer]?.timeLeft > 0) {
      const timer = setInterval(() => {
        setGameState(prev => {
          const updatedPlayers = [...players];
          if (updatedPlayers?.[currentPlayer]?.timeLeft > 0) {
            updatedPlayers[currentPlayer].timeLeft -= 1;
          }
          return prev;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPlayer, gameState, players]);

  const handlePlayerAction = (action, amount = 0) => {
    console.log(`Player action: ${action}`, amount);
    
    // Simulate moving to next player
    const nextPlayer = (currentPlayer + 1) % players?.length;
    setCurrentPlayer(nextPlayer);
    
    // Reset timer for next player
    if (players?.[nextPlayer]) {
      players[nextPlayer].timeLeft = 30;
    }
  };

  const handleFold = () => handlePlayerAction('fold');
  const handleCheck = () => handlePlayerAction('check');
  const handleCall = () => handlePlayerAction('call');
  const handleRaise = (amount) => handlePlayerAction('raise', amount);

  const handleSendMessage = (message) => {
    console.log('Sending message:', message);
    // In real app, this would send to WebSocket
  };

  const handleLeaveGame = () => {
    navigate('/game-lobby');
  };

  const handleShowWinner = () => {
    setShowWinner(true);
  };

  const winnerData = {
    id: 1,
    name: 'Алексей',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  };

  const winningHand = {
    type: 'straight',
    description: 'Стрит от десятки до туза',
    cards: [
      { rank: 'A', suit: '♠' },
      { rank: 'K', suit: '♥' },
      { rank: 'Q', suit: '♠' },
      { rank: 'J', suit: '♥' },
      { rank: '10', suit: '♣' }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Компактный заголовок */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLeaveGame}
            iconName="ArrowLeft"
            className="lg:h-10 lg:w-10 h-8 w-8"
          />
          <div className="min-w-0">
            <h1 className="font-bold text-foreground text-sm lg:text-base truncate">Стол #1247</h1>
            <p className="text-xs text-muted-foreground">
              {gameInfo?.smallBlind}/{gameInfo?.bigBlind} • {gameInfo?.activePlayers}/{gameInfo?.maxPlayers} игроков
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 lg:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowChat(true)}
            iconName="MessageCircle"
            className="lg:h-10 lg:w-10 h-8 w-8"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGameInfo(!showGameInfo)}
            iconName="Info"
            className="lg:hidden h-8 w-8"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShowWinner}
            iconName="Trophy"
            className="lg:h-10 lg:w-10 h-8 w-8"
          />
        </div>
      </div>

      {/* Основная игровая область */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Игровой стол */}
        <div className="flex-1 p-2 lg:p-4">
          <div className="h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            <PokerTable
              players={players}
              communityCards={communityCards}
              pot={pot}
              currentPlayer={currentPlayer}
              dealerPosition={2}
              smallBlindPosition={0}
              bigBlindPosition={1}
              gamePhase={gamePhase}
            />
          </div>
        </div>

        {/* Боковая панель для десктопа */}
        <div className={`hidden lg:block w-80 border-l border-border bg-surface/30 p-4 ${
          showGameInfo ? 'block' : 'hidden'
        }`}>
          <GameInfoPanel
            gameInfo={gameInfo}
            handStrength={handStrength}
            gameStats={gameStats}
            showHandStrength={true}
          />
        </div>
      </div>

      {/* Панель управления игрока */}
      <div className="p-2 lg:p-4 border-t border-border bg-background/95 backdrop-blur-sm">
        <PlayerActionControls
          currentBet={100}
          minRaise={150}
          maxRaise={currentUser?.chips}
          playerChips={currentUser?.chips}
          canCheck={true}
          canCall={true}
          canRaise={true}
          canFold={true}
          onFold={handleFold}
          onCheck={handleCheck}
          onCall={handleCall}
          onRaise={handleRaise}
          disabled={currentPlayer !== 0}
        />
      </div>

      {/* Мобильная панель информации об игре */}
      {showGameInfo && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-end">
          <div className="w-full bg-background border-t border-border rounded-t-lg p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Информация об игре</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowGameInfo(false)}
                iconName="X"
                className="h-8 w-8"
              />
            </div>
            <GameInfoPanel
              gameInfo={gameInfo}
              handStrength={handStrength}
              gameStats={gameStats}
              showHandStrength={true}
            />
          </div>
        </div>
      )}

      {/* Чат */}
      <ChatOverlay
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
      />

      {/* Модальное окно победителя */}
      <WinnerModal
        isOpen={showWinner}
        onClose={() => setShowWinner(false)}
        winner={winnerData}
        winningHand={winningHand}
        potAmount={pot}
        showCards={true}
      />
    </div>
  );
};

export default PokerTableGame;