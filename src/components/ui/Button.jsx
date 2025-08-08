import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 hover-lift",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover-lift",
                outline: "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent hover-lift",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover-lift",
                ghost: "hover:bg-accent hover:text-accent-foreground hover-lift",
                link: "text-primary underline-offset-4 hover:underline",
                success: "bg-success text-success-foreground hover:bg-success/90 hover-lift",
                warning: "bg-warning text-warning-foreground hover:bg-warning/90 hover-lift",
                danger: "bg-error text-error-foreground hover:bg-error/90 hover-lift",
                gradient: "btn-gradient text-primary-foreground font-semibold hover-lift",
                gradient-secondary: "bg-gradient-secondary text-white font-semibold hover-lift",
                gradient-success: "bg-gradient-success text-white font-semibold hover-lift",
                gradient-danger: "bg-gradient-danger text-white font-semibold hover-lift",
                glass: "glass text-white border border-white/20 hover:bg-white/10 hover-lift",
                glow: "bg-primary text-primary-foreground glow-primary hover:glow-primary/80 hover-lift",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 rounded-lg px-4 py-2",
                lg: "h-14 rounded-xl px-10 py-4 text-base",
                icon: "h-12 w-12 rounded-xl",
                xs: "h-8 rounded-lg px-3 py-1 text-xs",
                xl: "h-16 rounded-2xl px-12 py-5 text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({
    className,
    variant,
    size,
    asChild = false,
    children,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    iconSize = null,
    fullWidth = false,
    disabled = false,
    shimmer = false,
    pulse = false,
    ...props
}, ref) => {
    const Comp = asChild ? Slot : "button";

    // Icon size mapping based on button size
    const iconSizeMap = {
        xs: 12,
        sm: 14,
        default: 16,
        lg: 18,
        xl: 20,
        icon: 16,
    };

    const calculatedIconSize = iconSize || iconSizeMap?.[size] || 16;

    // Enhanced loading spinner with gradient
    const LoadingSpinner = () => (
        <div className="relative">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                />
                <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                />
            </svg>
            {pulse && (
                <div className="absolute inset-0 rounded-full pulse-glow"></div>
            )}
        </div>
    );

    // Icon rendering with enhanced styling
    const renderIcon = () => {
        if (!iconName) return null;

        return (
            <Icon
                name={iconName}
                size={calculatedIconSize}
                className={cn(
                    "transition-transform duration-200",
                    children && iconPosition === 'left' && "mr-3",
                    children && iconPosition === 'right' && "ml-3",
                    "group-hover:scale-110"
                )}
            />
        );
    };

    return (
        <Comp
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full",
                shimmer && "shimmer",
                pulse && "pulse-glow",
                "group"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            <span className="relative z-10">{children}</span>
            {iconName && iconPosition === 'right' && renderIcon()}
        </Comp>
    );
});

Button.displayName = "Button";

export default Button;