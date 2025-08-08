import React from 'react';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const StatCard = React.forwardRef(({
  className,
  title,
  value,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon,
  iconColor = 'primary',
  variant = 'default', // 'default', 'glass', 'gradient'
  size = 'default', // 'sm', 'default', 'lg'
  trend,
  ...props
}, ref) => {
  const variants = {
    default: "card-modern",
    glass: "card-glass",
    gradient: "bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl",
  };

  const sizes = {
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
  };

  const iconColors = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-error",
    accent: "text-accent",
  };

  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-muted-foreground",
  };

  const changeIcons = {
    positive: "trending-up",
    negative: "trending-down",
    neutral: "minus",
  };

  return (
    <div
      ref={ref}
      className={cn(
        variants[variant],
        sizes[size],
        "hover-lift transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && (
              <div className={cn(
                "p-2 rounded-lg bg-muted/20",
                iconColors[iconColor]
              )}>
                <Icon name={icon} size={20} />
              </div>
            )}
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {value}
            </span>
            
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                changeColors[changeType]
              )}>
                <Icon 
                  name={changeIcons[changeType]} 
                  size={14} 
                />
                <span>{change}</span>
              </div>
            )}
          </div>

          {trend && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Тренд:</span>
                <span className={cn(
                  "font-medium",
                  changeColors[changeType]
                )}>
                  {trend}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";

export default StatCard;
