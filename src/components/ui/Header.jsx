import React, { useState } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';

const Header = ({ user, chipBalance = 0, usdtBalance = 0, notifications = 0 }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const formatBalance = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000)?.toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000)?.toFixed(1)}K`;
    }
    return amount?.toLocaleString();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-14 items-center px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg">
            <Icon name="Spade" size={20} color="var(--color-background)" />
          </div>
          <span className="font-bold text-lg text-foreground">Poker Room</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Balance Display */}
        <div className="flex items-center space-x-4 mr-4">
          {/* Chip Balance */}
          <div className="flex items-center space-x-2 bg-surface px-3 py-1.5 rounded-lg">
            <div className="w-5 h-5 bg-warning rounded-full flex items-center justify-center">
              <Icon name="Coins" size={12} color="var(--color-background)" />
            </div>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatBalance(chipBalance)}
            </span>
          </div>

          {/* USDT Balance */}
          <div className="flex items-center space-x-2 bg-surface px-3 py-1.5 rounded-lg">
            <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-background">$</span>
            </div>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatBalance(usdtBalance)}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative mr-3">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-muted-foreground hover:text-foreground poker-transition rounded-lg hover:bg-surface"
          >
            <Icon name="Bell" size={20} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg poker-shadow-modal z-60">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications > 0 ? (
                  <div className="p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground">New game available</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground">USDT deposit confirmed</p>
                        <p className="text-xs text-muted-foreground">5 minutes ago</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center">
          <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-surface poker-transition">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface border border-border">
              {user?.avatar ? (
                <Image
                  src={user?.avatar}
                  alt={user?.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary">
                  <Icon name="User" size={16} color="var(--color-primary-foreground)" />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default Header;