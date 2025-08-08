import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';

import PokerTable from './components/PokerTable';
import PlayerActionControls from './components/PlayerActionControls';
import GameInfoPanel from './components/GameInfoPanel';
import ChatOverlay from './components/ChatOverlay';
import WinnerModal from './components/WinnerModal';
import { TableConnection } from '../../services/tableApi';

const PokerTableGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tableId = location.state?.tableId || 'demo';
  const wsUrl = import.meta.env.VITE_WS_URL;
  const wsRef = useRef(null);

  const inviteToken = location.state?.inviteToken || null;
  const tablePassword = location.state?.password || null;

  const [gameState, setGameState] = useState('playing');
  const [gamePhase, setGamePhase] = useState('preflop');
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [pot, setPot] = useState(450);
  const [remainingMs, setRemainingMs] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);

  const [players, setPlayers] = useState([]);
  const [communityCards, setCommunityCards] = useState([null, null, null, null, null]);

  const [gameInfo] = useState({
    gameType: 'Texas Hold\'em',
    smallBlind: 25,
    bigBlind: 50,
    activePlayers: 0,
    maxPlayers: 6,
    handNumber: 1
  });

  const [handStrength] = useState({ strength: 0, description: '' });
  const [gameStats] = useState({ handsPlayed: 0, handsWon: 0, vpip: 0, pfr: 0 });
  const [chatMessages, setChatMessages] = useState([]);

  const currentUser = { id: 1, name: 'Вы', avatar: 'https://picsum.photos/100' };

  useEffect(() => {
    if (!wsUrl) {
      const fallbackPlayers = [
        { id: 1, name: 'Вы', avatar: 'https://picsum.photos/100', chips: 2500, currentBet: 0, status: 'waiting', timeLeft: 30 },
        { id: 2, name: 'Мария', avatar: 'https://picsum.photos/101', chips: 1800, currentBet: 0, status: 'waiting', timeLeft: 30 },
      ];
      setPlayers(fallbackPlayers);
      setCommunityCards([{ rank: 'A', suit: '♣' }, { rank: 'K', suit: '♦' }, { rank: 'Q', suit: '♠' }, null, null]);
      return;
    }

    const conn = new TableConnection({ tableId, token: localStorage.getItem('token') });
    wsRef.current = conn;
    conn.connect({
      onState: (table) => {
        setPlayers(table.players || []);
        setPot(table.pot || 0);
        setGamePhase(table.phase || 'waiting');
        setGameState(table.phase === 'waiting' ? 'paused' : 'playing');
        setRemainingMs(table.remainingMs || 0);
        setCommunityCards(table.communityCards || []);
      },
      onChat: (msg) => setChatMessages(prev => [...prev, msg]),
      onJoin: () => {},
      onLeave: () => {},
    });
    setTimeout(() => conn.client?.send('join_table', { player: currentUser, inviteToken, password: tablePassword }), 200);
    return () => conn.disconnect();
  }, [tableId, wsUrl, inviteToken, tablePassword]);

  useEffect(() => {
    if (!wsUrl && players?.[currentPlayer]?.timeLeft > 0) {
      const timer = setInterval(() => {
        setPlayers(prev => {
          const updated = [...prev];
          if (updated?.[currentPlayer]?.timeLeft > 0) {
            updated[currentPlayer] = { ...updated[currentPlayer], timeLeft: updated[currentPlayer].timeLeft - 1 };
          }
          return updated;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPlayer, players, wsUrl]);

  const moveToNextPlayer = () => {
    const next = (currentPlayer + 1) % Math.max(1, players.length);
    setCurrentPlayer(next);
    if (!wsUrl) {
      setPlayers(prev => {
        const updated = [...prev];
        if (updated[next]) updated[next] = { ...updated[next], timeLeft: 30 };
        return updated;
      });
    }
  };

  const sendAction = (action, amount = 0) => {
    if (wsRef.current) {
      wsRef.current.action({ playerId: currentUser.id, action, amount });
    } else {
      if (action === 'call') setPot(p => p + 100);
      if (action === 'raise') setPot(p => p + Math.max(150, amount || 150));
      moveToNextPlayer();
    }
  };

  const handleFold = () => sendAction('fold');
  const handleCheck = () => sendAction('check');
  const handleCall = () => sendAction('call');
  const handleRaise = (amount) => sendAction('raise', amount);

  const handleSendMessage = (message) => {
    if (wsRef.current) wsRef.current.chat({ playerId: currentUser.id, message });
    else setChatMessages(prev => [...prev, { playerId: currentUser.id, message, at: Date.now() }]);
  };

  const handleLeaveGame = () => {
    if (wsRef.current) wsRef.current.leave(currentUser.id);
    navigate('/game-lobby');
  };

  const handleShowWinner = () => setShowWinner(true);

  const winnerData = { id: 1, name: 'Алексей', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' };
  const winningHand = { type: 'straight', description: 'Стрит от десятки до туза', cards: [
    { rank: 'A', suit: '♠' }, { rank: 'K', suit: '♥' }, { rank: 'Q', suit: '♠' }, { rank: 'J', suit: '♥' }, { rank: '10', suit: '♣' }
  ]};

  const formatTime = (ms) => Math.ceil(Math.max(0, ms) / 1000);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleLeaveGame} iconName="ArrowLeft" className="lg:h-10 lg:w-10 h-8 w-8" />
          <div className="min-w-0">
            <h1 className="font-bold text-foreground text-sm lg:text-base truncate">Стол #{tableId}</h1>
            <p className="text-xs text-muted-foreground">{gameInfo?.smallBlind}/{gameInfo?.bigBlind} • {players.length}/{gameInfo?.maxPlayers} игроков • Ход: {formatTime(remainingMs)}с</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 lg:space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setShowChat(true)} iconName="MessageCircle" className="lg:h-10 lg:w-10 h-8 w-8" />
          <Button variant="ghost" size="icon" onClick={() => setShowGameInfo(!showGameInfo)} iconName="Info" className="lg:hidden h-8 w-8" />
          <Button variant="ghost" size="icon" onClick={handleShowWinner} iconName="Trophy" className="lg:h-10 lg:w-10 h-8 w-8" />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-2 lg:p-4">
          <div className="h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            <PokerTable players={players} communityCards={communityCards} pot={pot} currentPlayer={currentPlayer} dealerPosition={2} smallBlindPosition={0} bigBlindPosition={1} gamePhase={gamePhase} />
          </div>
        </div>
        <div className={`hidden lg:block w-80 border-l border-border bg-surface/30 p-4 ${showGameInfo ? 'block' : 'hidden'}`}>
          <GameInfoPanel gameInfo={gameInfo} handStrength={{ strength: 0, description: '' }} gameStats={{ handsPlayed: 0, handsWon: 0, vpip: 0, pfr: 0 }} showHandStrength={true} />
        </div>
      </div>

      <div className="p-2 lg:p-4 border-t border-border bg-background/95 backdrop-blur-sm">
        <PlayerActionControls currentBet={100} minRaise={150} maxRaise={players?.[0]?.chips || 0} playerChips={players?.[0]?.chips || 0} canCheck={true} canCall={true} canRaise={true} canFold={true} onFold={handleFold} onCheck={handleCheck} onCall={handleCall} onRaise={handleRaise} disabled={currentPlayer !== 0} />
      </div>

      {showGameInfo && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items=end">
          <div className="w-full bg-background border-t border-border rounded-t-lg p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Информация об игре</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowGameInfo(false)} iconName="X" className="h-8 w-8" />
            </div>
            <GameInfoPanel gameInfo={gameInfo} handStrength={{ strength: 0, description: '' }} gameStats={{ handsPlayed: 0, handsWon: 0, vpip: 0, pfr: 0 }} showHandStrength={true} />
          </div>
        </div>
      )}

      <ChatOverlay isOpen={showChat} onClose={() => setShowChat(false)} messages={chatMessages} onSendMessage={handleSendMessage} currentUser={{ id: 1, name: 'Вы', avatar: 'https://picsum.photos/100' }} />

      <WinnerModal isOpen={showWinner} onClose={() => setShowWinner(false)} winner={winnerData} winningHand={winningHand} potAmount={pot} showCards={true} />
    </div>
  );
};

export default PokerTableGame;