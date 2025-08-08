import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionFeeBreakdown = ({ amount, networkFee = 1, processingFee = 0, estimatedTime = '2-5' }) => {
  const totalAmount = amount + networkFee + processingFee;
  const netAmount = amount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Детали транзакции
        </label>
        <div className="flex items-center space-x-1 text-xs text-success">
          <Icon name="Clock" size={12} />
          <span>{estimatedTime} мин</span>
        </div>
      </div>
      <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
        {/* Amount Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Сумма депозита:</span>
            <div className="flex items-center space-x-1">
              <span className="font-mono font-medium text-foreground">
                ${netAmount?.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">USDT</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-muted-foreground">Комиссия сети:</span>
              <Icon name="Info" size={12} className="text-muted-foreground" />
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-mono font-medium text-foreground">
                ${networkFee?.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">USDT</span>
            </div>
          </div>

          {processingFee > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Комиссия обработки:</span>
              <div className="flex items-center space-x-1">
                <span className="font-mono font-medium text-foreground">
                  ${processingFee?.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">USDT</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Итого к отправке:</span>
            <div className="flex items-center space-x-1">
              <span className="font-mono font-bold text-lg text-primary">
                ${totalAmount?.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">USDT</span>
            </div>
          </div>
        </div>
      </div>
      {/* Processing Time Info */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Clock" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-medium text-primary mb-1">Время обработки</p>
            <p className="text-primary/80">
              Депозит будет зачислен в течение {estimatedTime} минут после подтверждения в сети.
            </p>
          </div>
        </div>
      </div>
      {/* Limits Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface/50 border border-border rounded-lg p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Минимум</p>
            <p className="font-mono font-medium text-foreground">$10 USDT</p>
          </div>
        </div>
        <div className="bg-surface/50 border border-border rounded-lg p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Максимум</p>
            <p className="font-mono font-medium text-foreground">$10,000 USDT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFeeBreakdown;