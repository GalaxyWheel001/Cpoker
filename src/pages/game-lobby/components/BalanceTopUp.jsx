import React from 'react';
import Icon from '../../../components/AppIcon';

const BalanceTopUp = ({ chipBalance = 0, usdtBalance = 0 }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-surface/50 border border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Фишки</div>
            <Icon name="Coins" size={16} className="text-warning" />
          </div>
          <div className="mt-1 text-lg font-mono font-bold">{chipBalance.toLocaleString()}</div>
        </div>
        <div className="p-3 rounded-lg bg-surface/50 border border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">USDT</div>
            <Icon name="DollarSign" size={16} className="text-success" />
          </div>
          <div className="mt-1 text-lg font-mono font-bold">{usdtBalance}</div>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopUp;