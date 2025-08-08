import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import BottomTabBar from '../../components/ui/BottomTabBar';
import ProfileHeader from './components/ProfileHeader';
import BalanceCard from './components/BalanceCard';
import AccountSection from './components/AccountSection';
import GamePreferences from './components/GamePreferences';
import PrivacyControls from './components/PrivacyControls';
import StatisticsChart from './components/StatisticsChart';

const UserProfileManagement = () => {
  const [user, setUser] = useState(null);
  const [balances, setBalances] = useState({
    chips: 0,
    usdt: 0
  });

  useEffect(() => {
    // Mock user data
    const mockUser = {
      id: 'user_123456',
      name: 'Александр Петров',
      username: 'alex_poker_pro',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      playerId: '123456',
      joinDate: '2024-01-15T10:30:00Z',
      isOnline: true,
      telegramId: '@alex_poker_pro'
    };

    const mockBalances = {
      chips: 25000,
      usdt: 1250.50
    };

    setUser(mockUser);
    setBalances(mockBalances);
  }, []);

  const mockStats = {
    gamesPlayed: 147,
    winRate: 68,
    totalEarnings: 2450,
    weeklyEarnings: 520,
    totalGames: 73,
    bestDay: 520,
    avgSession: 45
  };

  return (
    <>
      <Helmet>
        <title>Профиль игрока - Poker Room</title>
        <meta name="description" content="Управление профилем игрока в покер-руме Telegram" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          user={user}
          chipBalance={balances?.chips}
          usdtBalance={balances?.usdt}
          notifications={2}
        />

        <div className="lg:ml-64">
          <main className="container mx-auto px-4 py-6 pb-20 lg:pb-6 max-w-4xl">
            {/* Profile Header */}
            <div className="mb-6">
              <ProfileHeader user={user} stats={mockStats} />
            </div>

            {/* Balance Card */}
            <div className="mb-6">
              <BalanceCard 
                chipBalance={balances?.chips}
                usdtBalance={balances?.usdt}
              />
            </div>

            {/* Statistics Chart */}
            <div className="mb-6">
              <StatisticsChart stats={mockStats} />
            </div>

            {/* Settings Sections */}
            <div className="space-y-4">
              <AccountSection user={user} />
              <GamePreferences />
              <PrivacyControls />
            </div>

            {/* Footer Info */}
            <div className="mt-8 p-4 bg-surface/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">
                Poker Room v1.0 • Безопасная игра через Telegram
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                © {new Date()?.getFullYear()} Все права защищены
              </p>
            </div>
          </main>
        </div>

        <BottomTabBar />
      </div>
    </>
  );
};

export default UserProfileManagement;