import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariants = cva(
  'animate-spin rounded-full',
  {
    variants: {
      variant: {
        default: 'border-2 border-current border-t-transparent',
        gradient: 'border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full',
        dots: 'border-4 border-purple-200 border-t-purple-500 dark:border-purple-800 dark:border-t-purple-400',
        glow: 'border-4 border-purple-500/30 border-t-purple-500 shadow-lg shadow-purple-500/50',
      },
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function LoadingSpinner({ size = 'md', variant = 'default', className }: LoadingSpinnerProps) {
  if (variant === 'gradient') {
    return (
      <div
        className={cn(
          'relative animate-spin',
          size === 'sm' && 'h-4 w-4',
          size === 'md' && 'h-6 w-6',
          size === 'lg' && 'h-8 w-8',
          size === 'xl' && 'h-12 w-12',
          className
        )}
        role="status"
        aria-label="Loading"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-75" />
        <div className="absolute inset-1 rounded-full bg-background" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(spinnerVariants({ variant, size }), className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
  variant?: 'default' | 'gradient' | 'glow';
}

export function LoadingDots({ className, variant = 'default' }: LoadingDotsProps) {
  const dotClasses = {
    default: 'h-2 w-2 bg-current rounded-full animate-pulse',
    gradient: 'h-2 w-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce',
    glow: 'h-2 w-2 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50',
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      <div className={dotClasses[variant]} />
      <div className={dotClasses[variant]} style={{ animationDelay: '0.1s' }} />
      <div className={dotClasses[variant]} style={{ animationDelay: '0.2s' }} />
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'default' | 'gradient' | 'shimmer';
}

export function LoadingSkeleton({ className, lines = 3, variant = 'default' }: LoadingSkeletonProps) {
  const skeletonClasses = {
    default: 'h-4 bg-muted rounded animate-pulse',
    gradient: 'h-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded animate-pulse',
    shimmer: 'h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse bg-[length:200%_100%] animate-shimmer',
  };

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={skeletonClasses[variant]}
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
}

export function LoadingCard({ className, variant = 'default' }: LoadingCardProps) {
  const cardClasses = {
    default: 'p-6 border rounded-xl space-y-4 bg-card',
    gradient: 'p-6 border rounded-xl space-y-4 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-md border-white/20 dark:border-gray-700/30',
    glass: 'p-6 border border-white/20 rounded-xl space-y-4 bg-white/10 backdrop-blur-md',
  };

  const skeletonClasses = {
    default: 'bg-muted rounded animate-pulse',
    gradient: 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded animate-pulse',
    glass: 'bg-white/20 rounded animate-pulse',
  };

  return (
    <div className={cn(cardClasses[variant], className)}>
      <div className={cn('h-6 w-3/4', skeletonClasses[variant])} />
      <div className="space-y-2">
        <div className={cn('h-4', skeletonClasses[variant])} />
        <div className={cn('h-4 w-5/6', skeletonClasses[variant])} />
        <div className={cn('h-4 w-4/6', skeletonClasses[variant])} />
      </div>
      <div className="flex space-x-2">
        <div className={cn('h-8 w-20 rounded-lg', skeletonClasses[variant])} />
        <div className={cn('h-8 w-16 rounded-lg', skeletonClasses[variant])} />
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
}

export function LoadingOverlay({ isLoading, children, message, className, variant = 'default' }: LoadingOverlayProps) {
  const overlayClasses = {
    default: 'absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50',
    gradient: 'absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md flex items-center justify-center z-50',
    glass: 'absolute inset-0 bg-white/10 backdrop-blur-lg flex items-center justify-center z-50',
  };

  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className={overlayClasses[variant]}>
          <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/20 shadow-2xl">
            <LoadingSpinner size="lg" variant={variant === 'default' ? 'gradient' : 'glow'} />
            {message && (
              <p className="text-sm text-foreground text-center max-w-xs font-medium">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export function LoadingButton({ isLoading, children, loadingText, className }: LoadingButtonProps) {
  return (
    <button disabled={isLoading} className={cn('flex items-center space-x-2', className)}>
      {isLoading && <LoadingSpinner size="sm" />}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  );
}