import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const PaymentMethodSelector = ({ selectedMethod, onMethodSelect }) => {
  const paymentMethods = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Подключить кошелек MetaMask',
      icon: 'Wallet',
      badge: 'Популярный',
      available: true
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      description: 'Мобильный криптокошелек',
      icon: 'Smartphone',
      badge: 'Мобильный',
      available: true
    },
    {
      id: 'binance',
      name: 'Binance Pay',
      description: 'Оплата через Binance',
      icon: 'CreditCard',
      badge: 'Быстро',
      available: true
    },
    {
      id: 'manual',
      name: 'Ручной перевод',
      description: 'Перевод на адрес кошелька',
      icon: 'Copy',
      badge: 'Универсальный',
      available: true
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Способ оплаты
        </label>
        <div className="flex items-center space-x-1 text-xs text-success">
          <Icon name="Shield" size={12} />
          <span>Безопасно</span>
        </div>
      </div>
      <div className="space-y-3">
        {paymentMethods?.map((method) => (
          <button
            key={method?.id}
            onClick={() => onMethodSelect(method)}
            disabled={!method?.available}
            className={`w-full p-4 rounded-lg border poker-transition text-left ${
              selectedMethod?.id === method?.id
                ? 'bg-primary/10 border-primary text-foreground'
                : method?.available
                ? 'bg-surface border-border hover:bg-surface/80 text-foreground'
                : 'bg-surface/50 border-border/50 text-muted-foreground cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedMethod?.id === method?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-foreground'
                }`}>
                  <Icon name={method?.icon} size={20} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{method?.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      method?.badge === 'Популярный' ? 'bg-primary/20 text-primary' :
                      method?.badge === 'Мобильный' ? 'bg-accent/20 text-accent' :
                      method?.badge === 'Быстро'? 'bg-success/20 text-success' : 'bg-secondary/20 text-secondary'
                    }`}>
                      {method?.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{method?.description}</p>
                </div>
              </div>
              
              {selectedMethod?.id === method?.id && (
                <Icon name="Check" size={20} className="text-primary" />
              )}
            </div>
          </button>
        ))}
      </div>
      {/* Security Notice */}
      <div className="bg-surface/50 border border-border rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Безопасность транзакций</p>
            <p>Все платежи защищены SSL-шифрованием. Мы не храним данные ваших кошельков.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;