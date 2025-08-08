import React from 'react';
import { cn } from '../../utils/cn';
import { Card, CardContent, CardHeader } from './Card';
import { Badge, StatusBadge } from './Badge';
import { Progress } from './Progress';
import Button from './Button';
import Icon from '../AppIcon';

const TournamentCard = React.forwardRef(({
  className,
  tournament,
  onJoin,
  onRegister,
  loading = false,
  variant = 'default', // 'default', 'glass', 'minimal', 'premium'
  size = 'default', // 'sm', 'default', 'lg'
  showDetails = true,
  showPrizes = true,
  showActions = true,
  ...props
}, ref) => {
  const {
    id,
    name,
    type, // 'sit-and-go', 'scheduled', 'satellite', 'bounty'
    status, // 'upcoming', 'registering', 'starting', 'active', 'finished'
    buyIn,
    prizePool,
    guaranteedPrize,
    maxPlayers,
    currentPlayers,
    registeredPlayers,
    startTime,
    endTime,
    blindStructure,
    isGuaranteed,
    isBounty,
    isSatellite,
    satelliteTo,
    bountyAmount,
    prizes = [],
    features = [],
  } = tournament;

  const sizes = {
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sit-and-go':
        return 'play';
      case 'scheduled':
        return 'clock';
      case 'satellite':
        return 'rocket';
      case 'bounty':
        return 'target';
      default:
        return 'trophy';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'sit-and-go':
        return 'text-primary';
      case 'scheduled':
        return 'text-blue-400';
      case 'satellite':
        return 'text-purple-400';
      case 'bounty':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'secondary';
      case 'registering':
        return 'warning';
      case 'starting':
        return 'primary';
      case 'active':
        return 'success';
      case 'finished':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Скоро';
      case 'registering':
        return 'Регистрация';
      case 'starting':
        return 'Запуск';
      case 'active':
        return 'Идет';
      case 'finished':
        return 'Завершен';
      default:
        return 'Неизвестно';
    }
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} USDT`;
  };

  const formatTime = (date) => {
    if (!date) return 'Не указано';
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return 'Не указано';
    const duration = new Date(end) - new Date(start);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  const canJoin = status === 'registering' || status === 'upcoming';
  const isFull = currentPlayers >= maxPlayers;

  return (
    <Card
      ref={ref}
      variant={variant}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isGuaranteed && "ring-2 ring-warning/20",
        className
      )}
      {...props}
    >
      {/* Guaranteed indicator */}
      {isGuaranteed && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-warning/20" />
      )}

      {/* Guaranteed badge */}
      {isGuaranteed && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="warning" size="sm" icon="shield">
            Гарантированный
          </Badge>
        </div>
      )}

      <CardHeader className={cn("pb-4", sizes[size])}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "p-2 rounded-lg bg-muted/20",
                getTypeColor(type)
              )}>
                <Icon name={getTypeIcon(type)} size={16} />
              </div>
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
                <Icon name="users" size={14} />
                {currentPlayers}/{maxPlayers}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="dollar-sign" size={14} />
                {formatCurrency(buyIn)}
              </span>
              {isBounty && bountyAmount && (
                <span className="flex items-center gap-1">
                  <Icon name="target" size={14} />
                  {formatCurrency(bountyAmount)}
                </span>
              )}
            </div>
          </div>

          {/* Prize pool */}
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(prizePool)}
            </div>
            <div className="text-xs text-muted-foreground">Призовой фонд</div>
            {guaranteedPrize && guaranteedPrize > prizePool && (
              <div className="text-xs text-warning">
                Гарантировано: {formatCurrency(guaranteedPrize)}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0", sizes[size])}>
        {/* Registration progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Регистрация ({registeredPlayers}/{maxPlayers})
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((registeredPlayers / maxPlayers) * 100)}%
            </span>
          </div>
          <Progress 
            value={registeredPlayers} 
            max={maxPlayers} 
            size="sm" 
            variant="gradient"
            color="primary"
          />
        </div>

        {/* Tournament details */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Начало:</span>
                <span className="font-medium">{formatTime(startTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Длительность:</span>
                <span className="font-medium">{formatDuration(startTime, endTime)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Блайнды:</span>
                <span className="font-medium">{blindStructure || 'Не указаны'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Статус:</span>
                <span className="font-medium">{getStatusText(status)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Prize structure */}
        {showPrizes && prizes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Призовая структура
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {prizes.slice(0, 3).map((prize, index) => (
                <div
                  key={index}
                  className="text-center p-2 rounded-lg bg-muted/10"
                >
                  <div className="text-xs text-muted-foreground">
                    {index + 1} место
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {formatCurrency(prize)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {features.map((feature, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant={canJoin ? 'gradient' : 'outline'}
              size="sm"
              fullWidth
              disabled={!canJoin || isFull || loading}
              loading={loading}
              onClick={() => canJoin ? onRegister?.(tournament) : onJoin?.(tournament)}
              iconName={canJoin ? 'user-plus' : 'eye'}
            >
              {canJoin ? (isFull ? 'Полный турнир' : 'Зарегистрироваться') : 'Наблюдать'}
            </Button>
            
            {status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onJoin?.(tournament)}
                iconName="play"
              >
                Присоединиться
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

TournamentCard.displayName = "TournamentCard";

export default TournamentCard;
