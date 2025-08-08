import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFooter = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-12 text-center space-y-4">
      {/* Security Features */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={16} color="var(--color-success)" />
          <span className="text-xs text-muted-foreground">256-bit SSL</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} color="var(--color-primary)" />
          <span className="text-xs text-muted-foreground">Telegram API</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={16} color="var(--color-warning)" />
          <span className="text-xs text-muted-foreground">Blockchain</span>
        </div>
      </div>

      {/* Support Info */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Поддержка USDT и виртуальных фишек
        </p>
        <p className="text-xs text-muted-foreground">
          Лицензированная игровая платформа
        </p>
      </div>

      {/* Copyright */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {currentYear} Poker Room. Все права защищены.
        </p>
      </div>
    </div>
  );
};

export default SecurityFooter;