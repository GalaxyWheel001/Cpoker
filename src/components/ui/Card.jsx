import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({
  className,
  variant = 'default',
  children,
  hover = true,
  glow = false,
  shimmer = false,
  border = false,
  glass = false,
  ...props
}, ref) => {
  const variants = {
    default: "card-modern",
    glass: "card-glass",
    minimal: "bg-card/50 border border-border/50 rounded-xl",
    elevated: "card-modern shadow-2xl",
    gradient: "bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl",
  };

  return (
    <div
      ref={ref}
      className={cn(
        variants[variant],
        hover && "hover-lift",
        glow && "glow-primary",
        shimmer && "shimmer",
        border && "border-animate",
        glass && "glass",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
