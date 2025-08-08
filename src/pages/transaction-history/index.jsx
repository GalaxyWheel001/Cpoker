import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import BottomTabBar from '../../components/ui/BottomTabBar';
import TransactionCard from './components/TransactionCard';
import FilterChips from './components/FilterChips';
import MonthlySummary from './components/MonthlySummary';
import SearchBar from './components/SearchBar';
import ExportButton from './components/ExportButton';
import BalanceSummary from './components/BalanceSummary';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    dateRange: 'month'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock user data
  const mockUser = {
    id: 'user_123',
    name: 'Алексей Петров',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  // Mock balance data
  const [balanceData, setBalanceData] = useState({
    chipBalance: 125000,
    usdtBalance: 1250.75
  });

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'tx_001',
      type: 'win',
      amount: 15000,
      currency: 'Chips',
      timestamp: new Date('2025-01-07T14:30:00'),
      status: 'completed',
      gameId: 'game_456',
      tableName: 'Высокие ставки #1',
      players: ['Мария К.', 'Дмитрий С.', 'Анна В.'],
      description: 'Выигрыш в игре Texas Hold\'em',
      fee: 0
    },
    {
      id: 'tx_002',
      type: 'deposit',
      amount: 500.00,
      currency: 'USDT',
      timestamp: new Date('2025-01-07T10:15:00'),
      status: 'completed',
      description: 'Пополнение через Telegram Wallet',
      fee: 2.50
    },
    {
      id: 'tx_003',
      type: 'loss',
      amount: -8500,
      currency: 'Chips',
      timestamp: new Date('2025-01-06T20:45:00'),
      status: 'completed',
      gameId: 'game_455',
      tableName: 'Средние ставки #3',
      players: ['Игорь М.', 'Светлана Р.'],
      description: 'Проигрыш в игре Texas Hold\'em',
      fee: 0
    },
    {
      id: 'tx_004',
      type: 'withdrawal',
      amount: -200.00,
      currency: 'USDT',
      timestamp: new Date('2025-01-06T16:20:00'),
      status: 'pending',
      description: 'Вывод на внешний кошелек',
      fee: 5.00
    },
    {
      id: 'tx_005',
      type: 'transfer',
      amount: 25000,
      currency: 'Chips',
      timestamp: new Date('2025-01-05T12:00:00'),
      status: 'completed',
      description: 'Конвертация USDT в фишки',
      fee: 0
    },
    {
      id: 'tx_006',
      type: 'win',
      amount: 750.50,
      currency: 'USDT',
      timestamp: new Date('2025-01-05T09:30:00'),
      status: 'completed',
      gameId: 'game_454',
      tableName: 'USDT Турнир #12',
      players: ['Владимир К.', 'Елена П.', 'Сергей Н.', 'Ольга Т.'],
      description: 'Выигрыш в турнире',
      fee: 37.53
    },
    {
      id: 'tx_007',
      type: 'loss',
      amount: -300.00,
      currency: 'USDT',
      timestamp: new Date('2025-01-04T18:15:00'),
      status: 'completed',
      gameId: 'game_453',
      tableName: 'USDT Кэш #5',
      players: ['Максим Л.', 'Татьяна Ж.'],
      description: 'Проигрыш в кэш-игре',
      fee: 0
    },
    {
      id: 'tx_008',
      type: 'deposit',
      amount: 1000.00,
      currency: 'USDT',
      timestamp: new Date('2025-01-03T14:45:00'),
      status: 'completed',
      description: 'Первоначальное пополнение',
      fee: 5.00
    }
  ];

  // Mock monthly summary data
  const mockSummaryData = {
    chips: {
      startBalance: 100000,
      currentBalance: 125000,
      netResult: 25000,
      trend: 12.5
    },
    usdt: {
      startBalance: 1000.00,
      currentBalance: 1250.75,
      netResult: 250.75,
      trend: 8.3
    },
    games: {
      totalGames: 24,
      wins: 15,
      losses: 9
    }
  };

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(transaction =>
        transaction?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        transaction?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        transaction?.amount?.toString()?.includes(searchTerm)
      );
    }

    // Apply type filter
    if (activeFilters?.type !== 'all') {
      switch (activeFilters?.type) {
        case 'chips':
          filtered = filtered?.filter(t => t?.currency === 'Chips');
          break;
        case 'usdt':
          filtered = filtered?.filter(t => t?.currency === 'USDT');
          break;
        case 'deposits':
          filtered = filtered?.filter(t => t?.type === 'deposit');
          break;
        case 'withdrawals':
          filtered = filtered?.filter(t => t?.type === 'withdrawal');
          break;
        case 'games':
          filtered = filtered?.filter(t => t?.type === 'win' || t?.type === 'loss');
          break;
      }
    }

    // Apply date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (activeFilters?.dateRange) {
      case 'today':
        filtered = filtered?.filter(t => new Date(t.timestamp) >= today);
        break;
      case 'week':
        filtered = filtered?.filter(t => new Date(t.timestamp) >= weekAgo);
        break;
      case 'month':
        filtered = filtered?.filter(t => new Date(t.timestamp) >= monthAgo);
        break;
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, activeFilters]);

  // Handle pull to refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update balance (simulate real-time changes)
    setBalanceData(prev => ({
      chipBalance: prev?.chipBalance + Math.floor(Math.random() * 1000),
      usdtBalance: prev?.usdtBalance + (Math.random() * 10)
    }));
    
    setIsRefreshing(false);
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setActiveFilters({ type: 'all', dateRange: 'month' });
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle export
  const handleExport = (format, data) => {
    console.log(`Экспорт ${data?.length} транзакций в формате ${format}`);
    // Here you would implement actual export functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={mockUser}
        chipBalance={balanceData?.chipBalance}
        usdtBalance={balanceData?.usdtBalance}
        notifications={2}
      />
      <div className="pb-16 lg:pb-0 lg:pl-64">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">История транзакций</h1>
              <p className="text-muted-foreground">
                Отслеживайте все операции с фишками и USDT
              </p>
            </div>
            <ExportButton 
              transactions={filteredTransactions}
              onExport={handleExport}
            />
          </div>

          {/* Balance Summary */}
          <BalanceSummary
            chipBalance={balanceData?.chipBalance}
            usdtBalance={balanceData?.usdtBalance}
            isLoading={isLoading}
          />

          {/* Search and Filters */}
          <div className="space-y-4">
            <SearchBar onSearch={handleSearch} />
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg text-foreground hover:bg-surface/80 poker-transition"
              >
                <Icon name="Filter" size={16} />
                <span>Фильтры</span>
                <Icon 
                  name={showFilters ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                />
              </button>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground poker-transition"
              >
                <Icon 
                  name="RefreshCw" 
                  size={16} 
                  className={isRefreshing ? 'animate-spin' : ''}
                />
                <span>Обновить</span>
              </button>
            </div>

            {showFilters && (
              <div className="bg-surface border border-border rounded-lg p-4">
                <FilterChips
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
          </div>

          {/* Monthly Summary */}
          <MonthlySummary summaryData={mockSummaryData} />

          {/* Transaction List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Транзакции
                {filteredTransactions?.length !== transactions?.length && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({filteredTransactions?.length} из {transactions?.length})
                  </span>
                )}
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)]?.map((_, index) => (
                  <div key={index} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-background rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-background rounded w-1/3" />
                        <div className="h-3 bg-background rounded w-1/2" />
                      </div>
                      <div className="w-20 h-4 bg-background rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTransactions?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Receipt" size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Транзакции не найдены
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || activeFilters?.type !== 'all' || activeFilters?.dateRange !== 'month' ?'Попробуйте изменить фильтры или поисковый запрос' :'У вас пока нет транзакций'
                  }
                </p>
                {(searchTerm || activeFilters?.type !== 'all' || activeFilters?.dateRange !== 'month') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilters({ type: 'all', dateRange: 'month' });
                    }}
                    className="text-primary hover:text-primary/80 poker-transition"
                  >
                    Очистить фильтры
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions?.map((transaction) => (
                  <TransactionCard
                    key={transaction?.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Быстрые действия</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/usdt-deposit')}
                className="flex items-center space-x-3 p-3 bg-background border border-border rounded-lg hover:bg-surface/80 poker-transition"
              >
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                  <Icon name="Plus" size={16} className="text-success" />
                </div>
                <span className="text-foreground font-medium">Пополнить USDT</span>
              </button>
              
              <button
                onClick={() => navigate('/game-lobby')}
                className="flex items-center space-x-3 p-3 bg-background border border-border rounded-lg hover:bg-surface/80 poker-transition"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Icon name="Spade" size={16} className="text-primary" />
                </div>
                <span className="text-foreground font-medium">Играть</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
};

export default TransactionHistory;