import React from 'react';
import { cn } from '../../utils/cn';
import { Card, CardContent, CardHeader } from './Card';
import { Badge, StatusBadge } from './Badge';
import { Avatar, AvatarGroup } from './Avatar';
import { Progress } from './Progress';
import Button from './Button';
import Icon from '../AppIcon';

const TableCard = React.forwardRef(({
  className,
  table,
  onJoin,
  onSpectate,
  loading = false,
  variant = 'default', // 'default', 'glass', 'minimal', 'premium'
  size = 'default', // 'sm', 'default', 'lg'
  showDetails = true,
  showPlayers = true,
  showActions = true,
  ...props
}, ref) => {
  const {
    id,
    name,
    gameType,
    currency,
    buyIn,
    currentPlayers,
    maxPlayers,
    status,
    pot,
    isRecommended,
    players = [],
    blinds,
    timeBank,
    avgStack,
  } = table;

  const sizes = {
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
  };

  const variants = {
    default: "card-modern",
    glass: "card-glass",
    minimal: "bg-card/50 border border-border/50 rounded-xl",
    premium: "card-modern border-2 border-primary/20 glow-primary",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'waiting':
        return 'warning';
      case 'full':
        return 'secondary';
      case 'starting':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Игра идет';
      case 'waiting':
        return 'Ожидание';
      case 'full':
        return 'Полный';
      case 'starting':
        return 'Запуск';
      default:
        return 'Неизвестно';
    }
  };

  const formatCurrency = (amount, curr) => {
    if (curr === 'usdt') {
      return `${amount} USDT`;
    }
    return `${amount.toLocaleString()} фишек`;
  };

  const formatBlinds = (blinds) => {
    if (!blinds) return 'Не указаны';
    return `${blinds.small}/${blinds.big}`;
  };

  return (
    <Card
      ref={ref}
      variant={variant === 'premium' ? 'elevated' : 'default'}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isRecommended && "ring-2 ring-primary/20",
        className
      )}
      {...props}
    >
      {/* Premium indicator */}
      {variant === 'premium' && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary/20" />
      )}

      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="gradient" size="sm" icon="star">
            Рекомендуется
          </Badge>
        </div>
      )}

      <CardHeader className={cn("pb-4", sizes[size])}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {name}
              </h3>
              <StatusBadge 
                status={getStatusColor(status)} 
                size="sm"
              />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="gamepad-2" size={14} />
                {gameType}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="coins" size={14} />
                {formatCurrency(buyIn, currency)}
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(pot, currency)}
            </div>
            <div className="text-xs text-muted-foreground">Банк</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0", sizes[size])}>
        {/* Players section */}
        {showPlayers && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="users" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">
                  Игроки ({currentPlayers}/{maxPlayers})
                </span>
              </div>
              <Progress 
                value={currentPlayers} 
                max={maxPlayers} 
                size="sm" 
                variant="gradient"
                className="w-20"
              />
            </div>

            {/* Player avatars */}
            {players.length > 0 && (
              <div className="flex items-center justify-between">
                <AvatarGroup max={6} size="sm">
                  {players.map((player) => (
                    <Avatar
                      key={player.id}
                      src={player.avatar}
                      alt={player.name}
                      status={player.status || 'online'}
                      size="sm"
                    />
                  ))}
                </AvatarGroup>
                
                <div className="text-xs text-muted-foreground">
                  {players.length} игроков
                </div>
              </div>
            )}
          </div>
        )}

        {/* Table details */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Блайнды:</span>
                <span className="font-medium">{formatBlinds(blinds)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Время банк:</span>
                <span className="font-medium">{timeBank || 'Не указано'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Средний стек:</span>
                <span className="font-medium">{avgStack ? formatCurrency(avgStack, currency) : 'Не указано'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Статус:</span>
                <span className="font-medium">{getStatusText(status)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant={status === 'full' ? 'outline' : 'gradient'}
              size="sm"
              fullWidth
              disabled={status === 'full' || loading}
              loading={loading}
              onClick={() => onJoin?.(table)}
              iconName={status === 'full' ? 'users' : 'play'}
            >
              {status === 'full' ? 'Полный стол' : 'Присоединиться'}
            </Button>
            
            {status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSpectate?.(table)}
                iconName="eye"
              >
                Наблюдать
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

TableCard.displayName = "TableCard";

export default TableCard;
