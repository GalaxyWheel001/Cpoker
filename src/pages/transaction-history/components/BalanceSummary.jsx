import React from 'react';
import Icon from '../../../components/AppIcon';

const BalanceSummary = ({ chipBalance, usdtBalance, isLoading = false }) => {
  const formatBalance = (amount, currency) => {
    if (isLoading) return '---';
    
    const formattedAmount = amount?.toLocaleString('ru-RU', {
      minimumFractionDigits: currency === 'USDT' ? 2 : 0,
      maximumFractionDigits: currency === 'USDT' ? 2 : 0
    });
    
    const symbol = currency === 'USDT' ? '$' : '';
    return `${symbol}${formattedAmount} ${currency}`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Текущий баланс</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Chip Balance */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-warning/30 border-t-warning rounded-full animate-spin" />
            ) : (
              <Icon name="Coins" size={20} className="text-warning" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Фишки</p>
            <p className="font-mono font-semibold text-foreground truncate">
              {formatBalance(chipBalance, 'Chips')}
            </p>
          </div>
        </div>

        {/* USDT Balance */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-success/30 border-t-success rounded-full animate-spin" />
            ) : (
              <Icon name="DollarSign" size={20} className="text-success" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">USDT</p>
            <p className="font-mono font-semibold text-foreground truncate">
              {formatBalance(usdtBalance, 'USDT')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;