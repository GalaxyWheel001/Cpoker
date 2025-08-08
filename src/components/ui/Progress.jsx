import React from 'react';
import { cn } from '../../utils/cn';

const Progress = React.forwardRef(({
  className,
  value = 0,
  max = 100,
  variant = 'default', // 'default', 'gradient', 'glow', 'animated'
  size = 'default', // 'sm', 'default', 'lg'
  showLabel = false,
  label,
  color = 'primary', // 'primary', 'success', 'warning', 'danger', 'accent'
  animated = false,
  shimmer = false,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-2",
    default: "h-3",
    lg: "h-4",
  };

  const colors = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-error",
    accent: "bg-accent",
  };

  const gradients = {
    primary: "bg-gradient-to-r from-primary to-accent",
    success: "bg-gradient-to-r from-success to-emerald-400",
    warning: "bg-gradient-to-r from-warning to-amber-400",
    danger: "bg-gradient-to-r from-error to-red-400",
    accent: "bg-gradient-to-r from-accent to-cyan-400",
  };

  const variants = {
    default: colors[color],
    gradient: gradients[color],
    glow: cn(colors[color], "glow-primary"),
    animated: cn(gradients[color], "animate-pulse"),
  };

  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    >
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            {label || `${value}/${max}`}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden",
        sizes[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variants[variant],
            shimmer && "shimmer",
            animated && "animate-pulse"
          )}
          style={{
            width: `${percentage}%`,
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

// Circular Progress Component
const CircularProgress = React.forwardRef(({
  className,
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'default',
  color = 'primary',
  showValue = true,
  animated = false,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    primary: "stroke-primary",
    success: "stroke-success",
    warning: "stroke-warning",
    danger: "stroke-error",
    accent: "stroke-accent",
  };

  const gradients = {
    primary: "stroke-primary",
    success: "stroke-success",
    warning: "stroke-warning",
    danger: "stroke-error",
    accent: "stroke-accent",
  };

  const variants = {
    default: colors[color],
    gradient: gradients[color],
  };

  return (
    <div
      ref={ref}
      className={cn("relative inline-flex items-center justify-center", className)}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className={cn(
          "transform -rotate-90",
          animated && "animate-spin"
        )}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className={cn(
            "transition-all duration-500 ease-out",
            variants[variant]
          )}
          style={{
            strokeDasharray,
            strokeDashoffset,
          }}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
});

CircularProgress.displayName = "CircularProgress";

export { Progress, CircularProgress };
