import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TableCard = ({ table, onJoin, isJoining }) => {
  const formatBalance = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000)?.toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000)?.toFixed(1)}K`;
    }
    return amount?.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'waiting':
        return 'text-warning';
      case 'full':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'В игре';
      case 'waiting':
        return 'Ожидание';
      case 'full':
        return 'Стол полный';
      default:
        return 'Доступен';
    }
  };

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 poker-transition hover:border-primary/50 ${
      table?.isRecommended ? 'poker-border-active poker-pulse' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-foreground">{table?.name}</h3>
          {table?.isRecommended && (
            <div className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">
              Рекомендуется
            </div>
          )}
        </div>
        <div className={`text-sm font-medium ${getStatusColor(table?.status)}`}>
          {getStatusText(table?.status)}
        </div>
      </div>
      {/* Game Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">
              {table?.currentPlayers}/{table?.maxPlayers}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {table?.currency === 'chips' ? (
              <Icon name="Coins" size={16} className="text-warning" />
            ) : (
              <span className="text-sm font-bold text-success">$</span>
            )}
            <span className="text-sm text-foreground">
              {formatBalance(table?.buyIn)}
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {table?.gameType}
        </div>
      </div>
      {/* Players Avatars */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex -space-x-2">
          {table?.players?.slice(0, 4)?.map((player, index) => (
            <div
              key={player?.id}
              className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-surface"
              style={{ zIndex: 10 - index }}
            >
              {player?.avatar ? (
                <Image
                  src={player?.avatar}
                  alt={player?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary">
                  <Icon name="User" size={12} color="var(--color-primary-foreground)" />
                </div>
              )}
            </div>
          ))}
          {table?.currentPlayers > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                +{table?.currentPlayers - 4}
              </span>
            </div>
          )}
        </div>
        
        {table?.pot > 0 && (
          <div className="flex items-center space-x-1">
            <Icon name="Target" size={14} className="text-accent" />
            <span className="text-sm font-medium text-foreground">
              {formatBalance(table?.pot)}
            </span>
          </div>
        )}
      </div>
      {/* Action Button */}
      <Button
        variant={table?.status === 'full' ? 'outline' : 'default'}
        fullWidth
        disabled={table?.status === 'full' || isJoining}
        loading={isJoining}
        onClick={() => onJoin(table)}
        className="h-10"
      >
        {table?.status === 'full' ? 'Стол полный' : 'Присоединиться'}
      </Button>
    </div>
  );
};

export default TableCard;