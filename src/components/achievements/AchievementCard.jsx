import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const AchievementCard = ({ 
  achievement, 
  isUnlocked = false, 
  isClaimed = false, 
  onClaim,
  showProgress = false,
  progress = 0 
}) => {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'epic':
        return 'border-purple-500 bg-purple-500/10';
      case 'rare':
        return 'border-blue-500 bg-blue-500/10';
      case 'common':
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return 'Star';
      case 'epic':
        return 'Zap';
      case 'rare':
        return 'Award';
      case 'common':
      default:
        return 'CheckCircle';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'gameplay':
        return 'Gamepad2';
      case 'social':
        return 'Users';
      case 'tournament':
        return 'Trophy';
      case 'special':
        return 'Gift';
      default:
        return 'Target';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative p-4 rounded-lg border-2 transition-all duration-300",
        isUnlocked 
          ? getRarityColor(achievement.rarity)
          : "border-gray-300 bg-gray-100 opacity-60"
      )}
    >
      {/* Rarity indicator */}
      <div className="absolute top-2 right-2">
        <Icon 
          name={getRarityIcon(achievement.rarity)} 
          size={16} 
          className={cn(
            "text-muted-foreground",
            isUnlocked && "text-yellow-500"
          )}
        />
      </div>

      {/* Achievement icon */}
      <div className="flex items-center space-x-3 mb-3">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          isUnlocked 
            ? "bg-primary/20 text-primary" 
            : "bg-gray-200 text-gray-400"
        )}>
          <Icon 
            name={getCategoryIcon(achievement.category)} 
            size={24} 
          />
        </div>
        
        <div className="flex-1">
          <h3 className={cn(
            "font-semibold text-sm",
            isUnlocked ? "text-foreground" : "text-gray-500"
          )}>
            {achievement.title}
          </h3>
          <p className={cn(
            "text-xs",
            isUnlocked ? "text-muted-foreground" : "text-gray-400"
          )}>
            {achievement.description}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Прогресс</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Points and status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Coins" size={14} className="text-yellow-500" />
          <span className="text-sm font-medium text-foreground">
            {achievement.points} очков
          </span>
        </div>

        {isUnlocked && !isClaimed && (
          <button
            onClick={() => onClaim(achievement.id)}
            className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-md hover:bg-primary/90 transition-colors"
          >
            Получить
          </button>
        )}

        {isClaimed && (
          <div className="flex items-center space-x-1 text-green-600">
            <Icon name="CheckCircle" size={14} />
            <span className="text-xs">Получено</span>
          </div>
        )}

        {!isUnlocked && (
          <div className="text-xs text-muted-foreground">
            Заблокировано
          </div>
        )}
      </div>

      {/* Unlock date */}
      {isUnlocked && achievement.unlockedAt && (
        <div className="mt-2 text-xs text-muted-foreground">
          Разблокировано: {new Date(achievement.unlockedAt).toLocaleDateString()}
        </div>
      )}
    </motion.div>
  );
};

export default AchievementCard;
