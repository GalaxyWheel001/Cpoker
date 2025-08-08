import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomTabBar from '../../components/ui/BottomTabBar';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import ModalOverlay from '../../components/ui/ModalOverlay';
import TableCard from './components/TableCard';
import FilterChips from './components/FilterChips';
import CreateTableModal from './components/CreateTableModal';
import BalanceTopUp from './components/BalanceTopUp';
import SearchBar from './components/SearchBar';
import TableSkeleton from './components/TableSkeleton';
import Icon from '../../components/AppIcon';

const GameLobby = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [joiningTableId, setJoiningTableId] = useState(null);

  // Mock user data
  const currentUser = {
    id: 1,
    name: "Алексей Петров",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    chipBalance: 125000,
    usdtBalance: 450.75
  };

  // Mock tables data
  const [tables, setTables] = useState([
    {
      id: 1,
      name: "Высокие ставки",
      gameType: "Кэш игра",
      currency: "usdt",
      buyIn: 100,
      currentPlayers: 4,
      maxPlayers: 6,
      status: "active",
      pot: 250,
      isRecommended: true,
      players: [
        { id: 1, name: "Игрок 1", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
        { id: 2, name: "Игрок 2", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" },
        { id: 3, name: "Игрок 3", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
        { id: 4, name: "Игрок 4", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
      ]
    },
    {
      id: 2,
      name: "Новички",
      gameType: "Кэш игра",
      currency: "chips",
      buyIn: 5000,
      currentPlayers: 2,
      maxPlayers: 6,
      status: "waiting",
      pot: 0,
      isRecommended: false,
      players: [
        { id: 5, name: "Игрок 5", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
        { id: 6, name: "Игрок 6", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" }
      ]
    },
    {
      id: 3,
      name: "Турнир Sit&Go",
      gameType: "Турнир",
      currency: "usdt",
      buyIn: 25,
      currentPlayers: 6,
      maxPlayers: 6,
      status: "full",
      pot: 150,
      isRecommended: false,
      players: [
        { id: 7, name: "Игрок 7", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" },
        { id: 8, name: "Игрок 8", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
        { id: 9, name: "Игрок 9", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
        { id: 10, name: "Игрок 10", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
        { id: 11, name: "Игрок 11", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
        { id: 12, name: "Игрок 12", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" }
      ]
    },
    {
      id: 4,
      name: "Средние ставки",
      gameType: "Кэш игра",
      currency: "chips",
      buyIn: 25000,
      currentPlayers: 3,
      maxPlayers: 6,
      status: "active",
      pot: 75000,
      isRecommended: true,
      players: [
        { id: 13, name: "Игрок 13", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
        { id: 14, name: "Игрок 14", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
        { id: 15, name: "Игрок 15", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" }
      ]
    },
    {
      id: 5,
      name: "Быстрая игра",
      gameType: "Кэш игра",
      currency: "chips",
      buyIn: 1000,
      currentPlayers: 1,
      maxPlayers: 4,
      status: "waiting",
      pot: 0,
      isRecommended: false,
      players: [
        { id: 16, name: "Игрок 16", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" }
      ]
    }
  ]);

  // Filter options
  const filterOptions = [
    {
      id: 'currency',
      label: 'Валюта',
      options: [
        { value: 'chips', label: 'Фишки', icon: 'Coins' },
        { value: 'usdt', label: 'USDT', icon: 'DollarSign' }
      ]
    },
    {
      id: 'gameType',
      label: 'Тип игры',
      options: [
        { value: 'Кэш игра', label: 'Кэш игра', icon: 'Target' },
        { value: 'Турнир', label: 'Турнир', icon: 'Trophy' }
      ]
    },
    {
      id: 'status',
      label: 'Статус',
      options: [
        { value: 'active', label: 'В игре', icon: 'Play' },
        { value: 'waiting', label: 'Ожидание', icon: 'Clock' }
      ]
    },
    {
      id: 'buyIn',
      label: 'Бай-ин',
      options: [
        { value: 'low', label: 'Низкий (до 10K)', icon: 'TrendingDown' },
        { value: 'medium', label: 'Средний (10K-50K)', icon: 'Minus' },
        { value: 'high', label: 'Высокий (50K+)', icon: 'TrendingUp' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleJoinTable = async (table) => {
    if (table?.status === 'full') return;
    
    setJoiningTableId(table?.id);
    
    // Simulate join delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to poker table
    navigate('/poker-table-game', { state: { tableId: table?.id, table } });
    
    setJoiningTableId(null);
  };

  const handleCreateTable = (tableData) => {
    const newTable = {
      id: tables?.length + 1,
      name: tableData?.name,
      gameType: tableData?.gameType === 'cash' ? 'Кэш игра' : 'Турнир',
      currency: tableData?.currency,
      buyIn: tableData?.buyIn,
      currentPlayers: 1,
      maxPlayers: tableData?.maxPlayers,
      status: 'waiting',
      pot: 0,
      isRecommended: false,
      players: [
        {
          id: currentUser?.id,
          name: currentUser?.name,
          avatar: currentUser?.avatar
        }
      ]
    };

    setTables(prev => [newTable, ...prev]);
    
    // Navigate to the created table
    navigate('/poker-table-game', { state: { tableId: newTable?.id, table: newTable } });
  };

  const handleFilterChange = (filterId, values) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: values
    }));
  };

  const getFilteredTables = () => {
    let filtered = tables;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(table =>
        table?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply active filters
    Object.entries(activeFilters)?.forEach(([filterId, values]) => {
      if (values?.length === 0) return;

      filtered = filtered?.filter(table => {
        switch (filterId) {
          case 'currency':
            return values?.includes(table?.currency);
          case 'gameType':
            return values?.includes(table?.gameType);
          case 'status':
            return values?.includes(table?.status);
          case 'buyIn':
            const buyIn = table?.currency === 'chips' ? table?.buyIn : table?.buyIn * 1000;
            return values?.some(range => {
              switch (range) {
                case 'low':
                  return buyIn < 10000;
                case 'medium':
                  return buyIn >= 10000 && buyIn <= 50000;
                case 'high':
                  return buyIn > 50000;
                default:
                  return true;
              }
            });
          default:
            return true;
        }
      });
    });

    return filtered;
  };

  const hasActiveFilters = Object.values(activeFilters)?.some(values => values?.length > 0);
  const filteredTables = getFilteredTables();

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={currentUser}
        chipBalance={currentUser?.chipBalance}
        usdtBalance={currentUser?.usdtBalance}
        notifications={2}
      />
      <div className="pb-16 lg:pb-0 lg:pl-64">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Search and Balance Section */}
          <div className="space-y-4">
            <SearchBar
              onSearch={setSearchQuery}
              onFilterToggle={() => setShowFilters(true)}
              hasActiveFilters={hasActiveFilters}
            />
            
            <BalanceTopUp
              chipBalance={currentUser?.chipBalance}
              usdtBalance={currentUser?.usdtBalance}
            />
          </div>

          {/* Tables Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Доступные столы
              </h2>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-muted-foreground hover:text-foreground poker-transition rounded-lg hover:bg-surface"
              >
                <Icon
                  name="RefreshCw"
                  size={20}
                  className={isRefreshing ? 'animate-spin' : ''}
                />
              </button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Filter" size={16} className="text-primary" />
                <span className="text-muted-foreground">
                  Активные фильтры: {Object.values(activeFilters)?.flat()?.length}
                </span>
                <button
                  onClick={() => setActiveFilters({})}
                  className="text-primary hover:text-primary/80 poker-transition"
                >
                  Очистить
                </button>
              </div>
            )}

            {/* Tables Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {isLoading ? (
                // Loading skeletons
                ([...Array(6)]?.map((_, index) => (
                  <TableSkeleton key={index} />
                )))
              ) : filteredTables?.length > 0 ? (
                // Table cards
                (filteredTables?.map((table) => (
                  <TableCard
                    key={table?.id}
                    table={table}
                    onJoin={handleJoinTable}
                    isJoining={joiningTableId === table?.id}
                  />
                )))
              ) : (
                // Empty state
                (<div className="col-span-full text-center py-12">
                  <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Столы не найдены
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || hasActiveFilters
                      ? 'Попробуйте изменить параметры поиска или фильтры' :'В данный момент нет доступных столов'
                    }
                  </p>
                  {(searchQuery || hasActiveFilters) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilters({});
                      }}
                      className="text-primary hover:text-primary/80 poker-transition"
                    >
                      Сбросить фильтры
                    </button>
                  )}
                </div>)
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setShowCreateModal(true)}
        disabled={isLoading}
      />
      {/* Bottom Tab Bar */}
      <BottomTabBar />
      {/* Create Table Modal */}
      <CreateTableModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTable={handleCreateTable}
      />
      {/* Filters Modal */}
      <ModalOverlay
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Фильтры"
        size="default"
      >
        <div className="p-6">
          <FilterChips
            filters={filterOptions}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
          
          <div className="flex space-x-3 pt-6 mt-6 border-t border-border">
            <button
              onClick={() => setActiveFilters({})}
              className="flex-1 px-4 py-2 text-muted-foreground hover:text-foreground poker-transition rounded-lg hover:bg-surface"
            >
              Сбросить
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg poker-transition hover:bg-primary/90"
            >
              Применить
            </button>
          </div>
        </div>
      </ModalOverlay>
    </div>
  );
};

export default GameLobby;