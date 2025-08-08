import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BalanceCard = ({ chipBalance, usdtBalance }) => {
  const navigate = useNavigate();

  const formatBalance = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000)?.toFixed(1)}М`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000)?.toFixed(1)}К`;
    }
    return amount?.toLocaleString('ru-RU');
  };

  return (
    <div className="bg-surface rounded-lg p-6 poker-shadow-interactive">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Баланс</h2>
        <Button
          variant="outline"
          size="sm"
          iconName="History"
          iconPosition="left"
          onClick={() => navigate('/transaction-history')}
        >
          История
        </Button>
      </div>

      <div className="space-y-4">
        {/* Chip Balance */}
        <div className="flex items-center justify-between p-4 bg-warning/5 rounded-lg border border-warning/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
              <Icon name="Coins" size={20} color="var(--color-background)" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Фишки</div>
              <div className="text-xl font-bold text-foreground font-mono">
                {formatBalance(chipBalance || 0)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Виртуальная валюта</div>
            <div className="text-sm text-warning font-medium">Бесплатно</div>
          </div>
        </div>

        {/* USDT Balance */}
        <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg border border-success/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-background">$</span>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">USDT</div>
              <div className="text-xl font-bold text-foreground font-mono">
                {formatBalance(usdtBalance || 0)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Криптовалюта</div>
            <div className="text-sm text-success font-medium">Реальные деньги</div>
          </div>
        </div>

        {/* Deposit Button */}
        <Button
          variant="default"
          fullWidth
          iconName="Plus"
          iconPosition="left"
          onClick={() => navigate('/usdt-deposit')}
          className="mt-4"
        >
          Пополнить USDT
        </Button>
      </div>
    </div>
  );
};

export default BalanceCard;