import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const StatisticsChart = ({ stats }) => {
  const chartData = [
    { date: '01.08', winnings: 150, games: 5 },
    { date: '02.08', winnings: 280, games: 8 },
    { date: '03.08', winnings: 190, games: 6 },
    { date: '04.08', winnings: 420, games: 12 },
    { date: '05.08', winnings: 350, games: 9 },
    { date: '06.08', winnings: 480, games: 15 },
    { date: '07.08', winnings: 520, games: 18 }
  ];

  return (
    <div className="bg-surface rounded-lg p-6 poker-shadow-interactive">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Статистика за неделю</h3>
            <p className="text-sm text-muted-foreground">Выигрыши в USDT</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-success">+{stats?.weeklyEarnings || 520}</div>
          <div className="text-xs text-muted-foreground">USDT</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full" aria-label="Weekly Earnings Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A3A3A3', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A3A3A3', fontSize: 12 }}
            />
            <Line 
              type="monotone" 
              dataKey="winnings" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{stats?.totalGames || 73}</div>
          <div className="text-xs text-muted-foreground">Всего игр</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-success">{stats?.bestDay || 520}</div>
          <div className="text-xs text-muted-foreground">Лучший день</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{stats?.avgSession || 45}</div>
          <div className="text-xs text-muted-foreground">Мин/сессия</div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;