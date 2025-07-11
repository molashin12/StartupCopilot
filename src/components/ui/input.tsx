import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'h-10 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:border-purple-500 hover:border-purple-300',
        gradient: 'h-10 rounded-lg border-2 border-transparent bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 focus-visible:outline-none focus-visible:from-purple-200 focus-visible:to-pink-200 dark:focus-visible:from-purple-800/30 dark:focus-visible:to-pink-800/30 focus-visible:shadow-lg focus-visible:shadow-purple-500/25',
        glass: 'h-10 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:bg-white/20',
        outline: 'h-10 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-transparent focus-visible:outline-none focus-visible:border-purple-500 focus-visible:shadow-lg focus-visible:shadow-purple-500/25 hover:border-purple-300 dark:hover:border-purple-700',
        filled: 'h-10 rounded-lg border-0 bg-gray-100 dark:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:bg-purple-50 dark:focus-visible:bg-purple-900/20',
      },
      size: {
        default: 'h-10',
        sm: 'h-8 text-xs',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };