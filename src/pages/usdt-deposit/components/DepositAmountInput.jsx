import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const DepositAmountInput = ({ amount, onAmountChange, conversionRate = 100 }) => {
  const [inputValue, setInputValue] = useState(amount?.toString() || '');

  const handleAmountChange = (e) => {
    const value = e?.target?.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/?.test(value)) {
      setInputValue(value);
      const numericValue = parseFloat(value) || 0;
      onAmountChange(numericValue);
    }
  };

  const quickAmounts = [10, 50, 100, 500];

  const handleQuickAmount = (quickAmount) => {
    setInputValue(quickAmount?.toString());
    onAmountChange(quickAmount);
  };

  const chipEquivalent = (parseFloat(inputValue) || 0) * conversionRate;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Сумма депозита
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-background">$</span>
            </div>
            <span className="text-sm font-medium text-foreground">USDT</span>
          </div>
          <Input
            type="text"
            value={inputValue}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="pl-20 pr-4 text-right font-mono text-lg"
          />
        </div>
        
        {chipEquivalent > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Эквивалент в фишках:</span>
            <div className="flex items-center space-x-1">
              <Icon name="Coins" size={16} className="text-warning" />
              <span className="font-mono font-medium text-foreground">
                {chipEquivalent?.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Quick Amount Buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Быстрый выбор
        </label>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts?.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleQuickAmount(quickAmount)}
              className={`px-3 py-2 rounded-lg border poker-transition text-sm font-medium ${
                parseFloat(inputValue) === quickAmount
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-foreground border-border hover:bg-surface/80'
              }`}
            >
              ${quickAmount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepositAmountInput;