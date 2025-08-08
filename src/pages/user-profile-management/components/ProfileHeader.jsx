import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ProfileHeader = ({ user, stats }) => {
  return (
    <div className="bg-surface rounded-lg p-6 poker-shadow-interactive">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-primary/20">
            {user?.avatar ? (
              <Image
                src={user?.avatar}
                alt={user?.name || 'Пользователь'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <Icon name="User" size={32} className="text-primary" />
              </div>
            )}
          </div>
          {/* Online Status */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
            <div className="w-2 h-2 bg-background rounded-full" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-xl font-bold text-foreground truncate">
              {user?.name || '@username'}
            </h1>
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={16} className="text-primary" />
              <span className="text-xs text-primary font-medium">Telegram</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Игрок с {new Date(user?.joinDate || '2024-01-01')?.toLocaleDateString('ru-RU')}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{stats?.gamesPlayed || 0}</div>
              <div className="text-xs text-muted-foreground">Игр</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">{stats?.winRate || 0}%</div>
              <div className="text-xs text-muted-foreground">Побед</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">{stats?.totalEarnings || 0}</div>
              <div className="text-xs text-muted-foreground">USDT</div>
            </div>
          </div>
        </div>
      </div>
      {/* Achievement Badges */}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-1 bg-warning/10 px-2 py-1 rounded-full">
          <Icon name="Trophy" size={14} className="text-warning" />
          <span className="text-xs font-medium text-warning">Новичок</span>
        </div>
        <div className="flex items-center space-x-1 bg-primary/10 px-2 py-1 rounded-full">
          <Icon name="Star" size={14} className="text-primary" />
          <span className="text-xs font-medium text-primary">Активный</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;