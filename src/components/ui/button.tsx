import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25',
        outline: 'border-2 border-blue-200 bg-background hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 dark:border-blue-800 dark:hover:from-blue-950 dark:hover:to-emerald-950 hover:scale-105 hover:border-blue-300 dark:hover:border-blue-700',
        secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 dark:from-gray-800 dark:to-gray-700 dark:text-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-105',
        ghost: 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 dark:hover:from-blue-950 dark:hover:to-emerald-950 hover:scale-105',
        link: 'text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
        gradient: 'bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 text-white hover:from-blue-600 hover:via-emerald-600 hover:to-blue-600 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 animate-gradient-x',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white drop-shadow-sm hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:text-white',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };