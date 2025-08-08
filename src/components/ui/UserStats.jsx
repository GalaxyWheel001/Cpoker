import React from 'react';
import { cn } from '../../utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import { Progress, CircularProgress } from './Progress';
import { Avatar } from './Avatar';
import Icon from '../AppIcon';

const UserStats = React.forwardRef(({
  className,
  user,
  variant = 'default', // 'default', 'glass', 'minimal', 'premium'
  size = 'default', // 'sm', 'default', 'lg'
  showAvatar = true,
  showLevel = true,
  showBalance = true,
  showStats = true,
  showAchievements = true,
  ...props
}, ref) => {
  const {
    id,
    name,
    avatar,
    level = 1,
    experience = 0,
    experienceToNext = 1000,
    balance = { chips: 0, usdt: 0 },
    stats = {},
    achievements = [],
    rank,
    status = 'online',
  } = user;

  const sizes = {
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
  };

  const getLevelColor = (level) => {
    if (level >= 50) return 'text-yellow-400';
    if (level >= 30) return 'text-purple-400';
    if (level >= 20) return 'text-blue-400';
    if (level >= 10) return 'text-green-400';
    return 'text-gray-400';
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) return 'trophy';
    if (rank <= 10) return 'medal';
    if (rank <= 50) return 'star';
    return 'award';
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    if (rank <= 10) return 'text-purple-400';
    if (rank <= 50) return 'text-blue-400';
    return 'text-muted-foreground';
  };

  const formatCurrency = (amount, currency) => {
    if (currency === 'usdt') {
      return `${amount.toFixed(2)} USDT`;
    }
    return `${amount.toLocaleString()} фишек`;
  };

  const experienceProgress = (experience / experienceToNext) * 100;

  return (
    <Card
      ref={ref}
      variant={variant}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      {...props}
    >
      <CardHeader className={cn("pb-4", sizes[size])}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {showAvatar && (
            <Avatar
              src={avatar}
              alt={name}
              size="xl"
              status={status}
              ring
              ringColor="primary"
            />
          )}

          {/* User info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-foreground truncate">
                {name}
              </h2>
              {rank && (
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  getRankColor(rank)
                )}>
                  <Icon name={getRankIcon(rank)} size={16} />
                  #{rank}
                </div>
              )}
            </div>

            {/* Level and experience */}
            {showLevel && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-lg font-bold",
                    getLevelColor(level)
                  )}>
                    Уровень {level}
                  </span>
                  <Badge variant="outline" size="sm">
                    {experience.toLocaleString()} / {experienceToNext.toLocaleString()} XP
                  </Badge>
                </div>
                <Progress
                  value={experience}
                  max={experienceToNext}
                  variant="gradient"
                  size="sm"
                  showLabel={false}
                />
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0", sizes[size])}>
        {/* Balance section */}
        {showBalance && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-muted/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon name="coins" size={20} className="text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Фишки
                </span>
              </div>
              <div className="text-xl font-bold text-foreground">
                {formatCurrency(balance.chips, 'chips')}
              </div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon name="dollar-sign" size={20} className="text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  USDT
                </span>
              </div>
              <div className="text-xl font-bold text-foreground">
                {formatCurrency(balance.usdt, 'usdt')}
              </div>
            </div>
          </div>
        )}

        {/* Stats section */}
        {showStats && stats && Object.keys(stats).length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Статистика
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {stats.gamesPlayed !== undefined && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon name="gamepad-2" size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Игр сыграно</div>
                    <div className="text-lg font-bold text-foreground">
                      {stats.gamesPlayed.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {stats.gamesWon !== undefined && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Icon name="trophy" size={16} className="text-success" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Побед</div>
                    <div className="text-lg font-bold text-foreground">
                      {stats.gamesWon.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {stats.winRate !== undefined && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Icon name="trending-up" size={16} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Винрейт</div>
                    <div className="text-lg font-bold text-foreground">
                      {stats.winRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              {stats.totalWinnings !== undefined && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Icon name="dollar-sign" size={16} className="text-warning" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Общий выигрыш</div>
                    <div className="text-lg font-bold text-foreground">
                      {formatCurrency(stats.totalWinnings, 'usdt')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Achievements section */}
        {showAchievements && achievements && achievements.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Достижения
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {achievements.slice(0, 6).map((achievement, index) => (
                <div
                  key={index}
                  className="text-center p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={achievement.icon || 'award'} size={20} className="text-primary" />
                  </div>
                  <div className="text-xs font-medium text-foreground truncate">
                    {achievement.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.points} очков
                  </div>
                </div>
              ))}
            </div>

            {achievements.length > 6 && (
              <div className="text-center">
                <Badge variant="outline" size="sm">
                  +{achievements.length - 6} еще
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

UserStats.displayName = "UserStats";

export default UserStats;
