import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { fetchTournaments, joinTournament } from '../../store/slices/tournamentSlice';
import { useToast } from '../../contexts/ToastContext';
import Header from '../../components/ui/Header';
import BottomTabBar from '../../components/ui/BottomTabBar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { motion } from 'framer-motion';

const TournamentsPage = () => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const { tournaments, isLoading, userTournaments } = useAppSelector(state => state.tournament);
  const { user } = useAppSelector(state => state.auth);

  const [activeTab, setActiveTab] = useState('all');
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);

  const handleJoinTournament = async (tournament) => {
    try {
      await dispatch(joinTournament({
        tournamentId: tournament.id,
        buyIn: tournament.buyIn
      })).unwrap();
      showSuccess('Вы успешно присоединились к турниру!');
    } catch (error) {
      showError('Ошибка при присоединении к турниру: ' + error);
    }
  };

  const getTournamentStatus = (tournament) => {
    const now = new Date();
    const startTime = new Date(tournament.startTime);
    const endTime = new Date(tournament.endTime);

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'active';
    return 'completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-500 bg-blue-100';
      case 'active':
        return 'text-green-500 bg-green-100';
      case 'completed':
        return 'text-gray-500 bg-gray-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Скоро';
      case 'active':
        return 'Идет';
      case 'completed':
        return 'Завершен';
      default:
        return 'Неизвестно';
    }
  };

  const formatPrizePool = (prizePool) => {
    if (prizePool >= 1000000) {
      return `${(prizePool / 1000000).toFixed(1)}M`;
    }
    if (prizePool >= 1000) {
      return `${(prizePool / 1000).toFixed(1)}K`;
    }
    return prizePool.toLocaleString();
  };

  const filteredTournaments = tournaments.filter(tournament => {
    if (activeTab === 'all') return true;
    if (activeTab === 'my') {
      return userTournaments.active.includes(tournament.id) ||
             userTournaments.upcoming.includes(tournament.id);
    }
    return getTournamentStatus(tournament) === activeTab;
  });

  const TournamentCard = ({ tournament }) => {
    const status = getTournamentStatus(tournament);
    const isJoined = userTournaments.active.includes(tournament.id) ||
                    userTournaments.upcoming.includes(tournament.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{tournament.name}</h3>
            <p className="text-sm text-muted-foreground">{tournament.description}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {tournament.currentPlayers}/{tournament.maxPlayers}
            </div>
            <div className="text-xs text-muted-foreground">Игроки</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {formatPrizePool(tournament.prizePool)} {tournament.currency}
            </div>
            <div className="text-xs text-muted-foreground">Призовой фонд</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Бай-ин:</span>
            <span className="font-medium">{tournament.buyIn} {tournament.currency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Начало:</span>
            <span>{new Date(tournament.startTime).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Тип:</span>
            <span className="capitalize">{tournament.type}</span>
          </div>
        </div>

        {status === 'upcoming' && !isJoined && (
          <Button
            onClick={() => handleJoinTournament(tournament)}
            className="w-full"
            size="sm"
          >
            Присоединиться
          </Button>
        )}

        {isJoined && (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Icon name="CheckCircle" size={16} />
            <span className="text-sm font-medium">Вы участвуете</span>
          </div>
        )}

        {status === 'active' && isJoined && (
          <Button
            onClick={() => setSelectedTournament(tournament)}
            className="w-full"
            size="sm"
            variant="outline"
          >
            Войти в игру
          </Button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <div className="pb-16 lg:pb-0 lg:pl-64">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Турниры</h1>
            <p className="text-muted-foreground">
              Участвуйте в турнирах и выигрывайте призы
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-surface rounded-lg p-1">
              {[
                { id: 'all', label: 'Все турниры', icon: 'List' },
                { id: 'upcoming', label: 'Скоро', icon: 'Clock' },
                { id: 'active', label: 'Идут', icon: 'Play' },
                { id: 'my', label: 'Мои', icon: 'User' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tournaments Grid */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTournaments.map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="Trophy" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Турниры не найдены
              </h3>
              <p className="text-muted-foreground">
                {activeTab === 'my' 
                  ? 'Вы не участвуете ни в одном турнире'
                  : 'В данный момент нет доступных турниров'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default TournamentsPage;
