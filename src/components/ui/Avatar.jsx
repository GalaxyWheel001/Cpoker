import React from 'react';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const Avatar = React.forwardRef(({
  className,
  src,
  alt,
  size = 'default', // 'xs', 'sm', 'default', 'lg', 'xl', '2xl'
  status, // 'online', 'offline', 'away', 'busy', 'playing'
  fallback,
  variant = 'default', // 'default', 'rounded', 'square'
  ring = false,
  ringColor = 'primary',
  animated = false,
  shimmer = false,
  ...props
}, ref) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    default: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    '2xl': "w-20 h-20 text-xl",
  };

  const variants = {
    default: "rounded-full",
    rounded: "rounded-lg",
    square: "rounded-none",
  };

  const statusColors = {
    online: "bg-success",
    offline: "bg-muted",
    away: "bg-warning",
    busy: "bg-error",
    playing: "bg-primary",
  };

  const ringColors = {
    primary: "ring-2 ring-primary ring-offset-2 ring-offset-background",
    success: "ring-2 ring-success ring-offset-2 ring-offset-background",
    warning: "ring-2 ring-warning ring-offset-2 ring-offset-background",
    danger: "ring-2 ring-error ring-offset-2 ring-offset-background",
    accent: "ring-2 ring-accent ring-offset-2 ring-offset-background",
  };

  const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    default: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
    '2xl': "w-5 h-5",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return 'circle';
      case 'offline':
        return 'circle-off';
      case 'away':
        return 'clock';
      case 'busy':
        return 'minus-circle';
      case 'playing':
        return 'play';
      default:
        return null;
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden bg-muted text-muted-foreground",
          sizes[size],
          variants[variant],
          ring && ringColors[ringColor],
          animated && "animate-pulse",
          shimmer && "shimmer",
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={cn(
              "h-full w-full object-cover",
              variants[variant]
            )}
          />
        ) : fallback ? (
          <span className="font-medium">{fallback}</span>
        ) : (
          <Icon name="user" size={size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'default' ? 20 : size === 'lg' ? 24 : size === 'xl' ? 32 : 40} />
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <div className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-background",
          statusColors[status],
          statusSizes[size]
        )}>
          {getStatusIcon(status) && (
            <Icon 
              name={getStatusIcon(status)} 
              size={size === 'xs' ? 6 : size === 'sm' ? 8 : size === 'default' ? 10 : size === 'lg' ? 12 : size === 'xl' ? 16 : 20}
              className="text-white"
            />
          )}
        </div>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

// Avatar Group Component
const AvatarGroup = React.forwardRef(({
  className,
  children,
  max = 5,
  size = 'default',
  spacing = 'tight', // 'tight', 'normal', 'loose'
  ...props
}, ref) => {
  const spacingClasses = {
    tight: "-space-x-2",
    normal: "-space-x-3",
    loose: "-space-x-4",
  };

  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const hiddenCount = childrenArray.length - max;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {visibleAvatars.map((child, index) => (
        <div
          key={index}
          className="relative"
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {React.cloneElement(child, { size })}
        </div>
      ))}
      
      {hiddenCount > 0 && (
        <div
          className={cn(
            "relative flex items-center justify-center bg-muted text-muted-foreground border-2 border-background",
            size === 'xs' ? "w-6 h-6 text-xs" :
            size === 'sm' ? "w-8 h-8 text-sm" :
            size === 'default' ? "w-10 h-10 text-sm" :
            size === 'lg' ? "w-12 h-12 text-base" :
            size === 'xl' ? "w-16 h-16 text-lg" :
            "w-20 h-20 text-xl",
            "rounded-full font-medium"
          )}
          style={{ zIndex: 0 }}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  );
});

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };
