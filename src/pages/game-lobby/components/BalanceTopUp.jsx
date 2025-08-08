import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BalanceTopUp = ({ chipBalance, usdtBalance }) => {
  const navigate = useNavigate();

  const formatBalance = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000)?.toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000)?.toFixed(1)}K`;
    }
    return amount?.toLocaleString();
  };

  const handleChipTopUp = () => {
    // Mock chip purchase - in real app would open payment modal
    console.log('Opening chip purchase modal');
  };

  const handleUsdtDeposit = () => {
    navigate('/usdt-deposit');
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-foreground flex items-center space-x-2">
        <Icon name="Wallet" size={20} className="text-primary" />
        <span>Баланс</span>
      </h3>

      <div className="space-y-3">
        {/* Chip Balance */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
              <Icon name="Coins" size={16} color="var(--color-background)" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Фишки</p>
              <p className="text-xs text-muted-foreground">Игровая валюта</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono font-semibold text-foreground">
              {formatBalance(chipBalance)}
            </p>
            <Button
              variant="outline"
              size="xs"
              onClick={handleChipTopUp}
              iconName="Plus"
              iconPosition="left"
              className="mt-1"
            >
              Купить
            </Button>
          </div>
        </div>

        {/* USDT Balance */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-background">$</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">USDT</p>
              <p className="text-xs text-muted-foreground">Криптовалюта</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono font-semibold text-foreground">
              ${formatBalance(usdtBalance)}
            </p>
            <Button
              variant="outline"
              size="xs"
              onClick={handleUsdtDeposit}
              iconName="ArrowUp"
              iconPosition="left"
              className="mt-1"
            >
              Пополнить
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Быстрые действия</p>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/transaction-history')}
            iconName="History"
            iconPosition="left"
            className="flex-1"
          >
            История
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/user-profile-management')}
            iconName="Settings"
            iconPosition="left"
            className="flex-1"
          >
            Настройки
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopUp;