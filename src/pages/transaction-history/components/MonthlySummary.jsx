import React from 'react';
import Icon from '../../../components/AppIcon';

const MonthlySummary = ({ summaryData }) => {
  const formatAmount = (amount, currency) => {
    const formattedAmount = Math.abs(amount)?.toLocaleString('ru-RU', {
      minimumFractionDigits: currency === 'USDT' ? 2 : 0,
      maximumFractionDigits: currency === 'USDT' ? 2 : 0
    });
    
    const symbol = currency === 'USDT' ? '$' : '';
    return `${symbol}${formattedAmount} ${currency}`;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'TrendingUp', color: 'text-success' };
    if (trend < 0) return { name: 'TrendingDown', color: 'text-error' };
    return { name: 'Minus', color: 'text-muted-foreground' };
  };

  const getTrendText = (trend) => {
    if (trend > 0) return `+${trend?.toFixed(1)}%`;
    if (trend < 0) return `${trend?.toFixed(1)}%`;
    return '0%';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Месячная сводка</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chips Summary */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <Icon name="Coins" size={16} className="text-warning" />
              </div>
              <h4 className="font-medium text-foreground">Фишки</h4>
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={getTrendIcon(summaryData?.chips?.trend)?.name} 
                size={14} 
                className={getTrendIcon(summaryData?.chips?.trend)?.color}
              />
              <span className={`text-xs font-medium ${getTrendIcon(summaryData?.chips?.trend)?.color}`}>
                {getTrendText(summaryData?.chips?.trend)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Начальный баланс:</span>
              <span className="font-mono text-foreground">
                {formatAmount(summaryData?.chips?.startBalance, 'Chips')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Текущий баланс:</span>
              <span className="font-mono text-foreground">
                {formatAmount(summaryData?.chips?.currentBalance, 'Chips')}
              </span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">Чистый результат:</span>
              <span className={`font-mono ${
                summaryData?.chips?.netResult >= 0 ? 'text-success' : 'text-error'
              }`}>
                {summaryData?.chips?.netResult >= 0 ? '+' : ''}
                {formatAmount(summaryData?.chips?.netResult, 'Chips')}
              </span>
            </div>
          </div>
        </div>

        {/* USDT Summary */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <Icon name="DollarSign" size={16} className="text-success" />
              </div>
              <h4 className="font-medium text-foreground">USDT</h4>
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={getTrendIcon(summaryData?.usdt?.trend)?.name} 
                size={14} 
                className={getTrendIcon(summaryData?.usdt?.trend)?.color}
              />
              <span className={`text-xs font-medium ${getTrendIcon(summaryData?.usdt?.trend)?.color}`}>
                {getTrendText(summaryData?.usdt?.trend)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Начальный баланс:</span>
              <span className="font-mono text-foreground">
                {formatAmount(summaryData?.usdt?.startBalance, 'USDT')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Текущий баланс:</span>
              <span className="font-mono text-foreground">
                {formatAmount(summaryData?.usdt?.currentBalance, 'USDT')}
              </span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">Чистый результат:</span>
              <span className={`font-mono ${
                summaryData?.usdt?.netResult >= 0 ? 'text-success' : 'text-error'
              }`}>
                {summaryData?.usdt?.netResult >= 0 ? '+' : ''}
                {formatAmount(summaryData?.usdt?.netResult, 'USDT')}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Game Statistics */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Игровая статистика</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{summaryData?.games?.totalGames}</p>
            <p className="text-muted-foreground">Всего игр</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{summaryData?.games?.wins}</p>
            <p className="text-muted-foreground">Побед</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-error">{summaryData?.games?.losses}</p>
            <p className="text-muted-foreground">Поражений</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {summaryData?.games?.totalGames > 0 
                ? ((summaryData?.games?.wins / summaryData?.games?.totalGames) * 100)?.toFixed(1)
                : 0}%
            </p>
            <p className="text-muted-foreground">Винрейт</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;