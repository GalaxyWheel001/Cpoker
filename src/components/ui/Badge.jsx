import React from 'react';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const Badge = React.forwardRef(({
  className,
  variant = 'default', // 'default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'gradient', 'glow'
  size = 'default', // 'sm', 'default', 'lg'
  children,
  icon,
  iconPosition = 'left',
  animated = false,
  pulse = false,
  shimmer = false,
  dot = false,
  ...props
}, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    success: "bg-success text-success-foreground hover:bg-success/80",
    warning: "bg-warning text-warning-foreground hover:bg-warning/80",
    gradient: "bg-gradient-primary text-primary-foreground font-semibold",
    glow: "bg-primary text-primary-foreground glow-primary",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  const iconSizes = {
    sm: 12,
    default: 14,
    lg: 16,
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        sizes[size],
        animated && "animate-pulse",
        pulse && "pulse-glow",
        shimmer && "shimmer",
        className
      )}
      {...props}
    >
      {dot && (
        <div className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          variant === 'default' ? "bg-primary-foreground" :
          variant === 'secondary' ? "bg-secondary-foreground" :
          variant === 'destructive' ? "bg-destructive-foreground" :
          variant === 'success' ? "bg-success-foreground" :
          variant === 'warning' ? "bg-warning-foreground" :
          "bg-current"
        )} />
      )}
      
      {icon && iconPosition === 'left' && (
        <Icon
          name={icon}
          size={iconSizes[size]}
          className="mr-1"
        />
      )}
      
      <span>{children}</span>
      
      {icon && iconPosition === 'right' && (
        <Icon
          name={icon}
          size={iconSizes[size]}
          className="ml-1"
        />
      )}
    </div>
  );
});

Badge.displayName = "Badge";

// Status Badge Component
const StatusBadge = React.forwardRef(({
  className,
  status, // 'online', 'offline', 'away', 'busy', 'playing', 'waiting', 'ready'
  size = 'default',
  showIcon = true,
  ...props
}, ref) => {
  const statusConfig = {
    online: {
      variant: 'success',
      icon: 'circle',
      text: 'Онлайн',
    },
    offline: {
      variant: 'secondary',
      icon: 'circle-off',
      text: 'Офлайн',
    },
    away: {
      variant: 'warning',
      icon: 'clock',
      text: 'Отошел',
    },
    busy: {
      variant: 'destructive',
      icon: 'minus-circle',
      text: 'Занят',
    },
    playing: {
      variant: 'default',
      icon: 'play',
      text: 'Играет',
    },
    waiting: {
      variant: 'outline',
      icon: 'hourglass',
      text: 'Ожидает',
    },
    ready: {
      variant: 'success',
      icon: 'check-circle',
      text: 'Готов',
    },
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <Badge
      ref={ref}
      variant={config.variant}
      size={size}
      icon={showIcon ? config.icon : null}
      className={className}
      {...props}
    >
      {config.text}
    </Badge>
  );
});

StatusBadge.displayName = "StatusBadge";

// Notification Badge Component
const NotificationBadge = React.forwardRef(({
  className,
  count = 0,
  max = 99,
  size = 'default',
  variant = 'destructive',
  showZero = false,
  ...props
}, ref) => {
  const displayCount = count > max ? `${max}+` : count;
  
  if (count === 0 && !showZero) {
    return null;
  }

  return (
    <Badge
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "min-w-[1.2em] justify-center",
        className
      )}
      {...props}
    >
      {displayCount}
    </Badge>
  );
});

NotificationBadge.displayName = "NotificationBadge";

export { Badge, StatusBadge, NotificationBadge };
