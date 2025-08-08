import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TransactionCard = ({ transaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': case'win':
        return { name: 'TrendingUp', color: 'text-success' };
      case 'withdrawal': case'loss':
        return { name: 'TrendingDown', color: 'text-error' };
      case 'transfer':
        return { name: 'ArrowLeftRight', color: 'text-primary' };
      default:
        return { name: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const formatAmount = (amount, currency) => {
    const formattedAmount = Math.abs(amount)?.toLocaleString('ru-RU', {
      minimumFractionDigits: currency === 'USDT' ? 2 : 0,
      maximumFractionDigits: currency === 'USDT' ? 2 : 0
    });
    
    const sign = amount >= 0 ? '+' : '-';
    const symbol = currency === 'USDT' ? '$' : '';
    
    return `${sign}${symbol}${formattedAmount} ${currency}`;
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'failed':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'pending':
        return 'В обработке';
      case 'failed':
        return 'Неудачно';
      default:
        return 'Неизвестно';
    }
  };

  const getTransactionTypeText = (type) => {
    switch (type) {
      case 'deposit':
        return 'Пополнение';
      case 'withdrawal':
        return 'Вывод';
      case 'win':
        return 'Выигрыш';
      case 'loss':
        return 'Проигрыш';
      case 'transfer':
        return 'Перевод';
      default:
        return 'Транзакция';
    }
  };

  const icon = getTransactionIcon(transaction?.type);

  return (
    <div className="bg-surface border border-border rounded-lg p-4 poker-transition hover:bg-surface/80">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center ${icon?.color}`}>
            <Icon name={icon?.name} size={20} />
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              {getTransactionTypeText(transaction?.type)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(transaction?.timestamp)} в {formatTime(transaction?.timestamp)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className={`font-mono font-medium ${
              transaction?.amount >= 0 ? 'text-success' : 'text-error'
            }`}>
              {formatAmount(transaction?.amount, transaction?.currency)}
            </p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
              {getStatusText(transaction?.status)}
            </div>
          </div>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="text-muted-foreground"
          />
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">ID транзакции</p>
              <p className="font-mono text-foreground">{transaction?.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Комиссия</p>
              <p className="font-mono text-foreground">
                {transaction?.fee ? `${transaction?.fee} ${transaction?.currency}` : 'Без комиссии'}
              </p>
            </div>
          </div>

          {transaction?.gameId && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">ID игры</p>
                <p className="font-mono text-foreground">{transaction?.gameId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Стол</p>
                <p className="text-foreground">{transaction?.tableName}</p>
              </div>
            </div>
          )}

          {transaction?.players && transaction?.players?.length > 0 && (
            <div>
              <p className="text-muted-foreground text-sm mb-2">Другие игроки</p>
              <div className="flex flex-wrap gap-2">
                {transaction?.players?.map((player, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-background border border-border rounded-full text-xs text-foreground"
                  >
                    {player}
                  </span>
                ))}
              </div>
            </div>
          )}

          {transaction?.description && (
            <div>
              <p className="text-muted-foreground text-sm">Описание</p>
              <p className="text-foreground text-sm">{transaction?.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCard;