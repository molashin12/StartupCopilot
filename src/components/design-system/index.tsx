import React from 'react';
import { cn } from '@/lib/utils';

// Design System Colors
export const designTokens = {
  colors: {
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Primary purple
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    secondary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899', // Primary pink
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
  },
  gradients: {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500',
    primaryHover: 'hover:from-purple-600 hover:to-pink-600',
    glass: 'bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60',
    glow: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500',
  },
  shadows: {
    glow: 'shadow-lg shadow-purple-500/25',
    glowHover: 'hover:shadow-xl hover:shadow-purple-500/30',
    glass: 'shadow-2xl',
  },
  animations: {
    scale: 'hover:scale-105 active:scale-95',
    float: 'animate-float',
    glow: 'animate-glow',
    gradient: 'animate-gradient-x',
    shimmer: 'animate-shimmer',
  },
};

// Gradient Background Component
interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'glass' | 'glow';
}

export function GradientBackground({ children, className, variant = 'primary' }: GradientBackgroundProps) {
  const variants = {
    primary: 'bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950 dark:via-gray-900 dark:to-pink-950',
    glass: 'bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-md',
    glow: 'bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10',
  };

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  );
}

// Floating Elements Component
interface FloatingElementsProps {
  className?: string;
}

export function FloatingElements({ className }: FloatingElementsProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
}

// Glass Card Component
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div className={cn(
      'backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 text-white',
      hover && 'transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl',
      '[&_*]:drop-shadow-sm', // Add text shadow to all child elements
      className
    )}>
      {children}
    </div>
  );
}

// Gradient Text Component
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glow';
}

export function GradientText({ children, className, variant = 'primary' }: GradientTextProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    secondary: 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent',
    glow: 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg',
  };

  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  );
}

// Animated Border Component
interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedBorder({ children, className }: AnimatedBorderProps) {
  return (
    <div className={cn('relative p-[2px] rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 animate-gradient-x', className)}>
      <div className="bg-background rounded-2xl p-6 h-full">
        {children}
      </div>
    </div>
  );
}

// Icon with Glow Effect
interface GlowIconProps {
  children: React.ReactNode;
  className?: string;
  color?: 'purple' | 'pink' | 'blue';
}

export function GlowIcon({ children, className, color = 'purple' }: GlowIconProps) {
  const colors = {
    purple: 'text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]',
    pink: 'text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]',
    blue: 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]',
  };

  return (
    <div className={cn(colors[color], 'animate-glow', className)}>
      {children}
    </div>
  );
}

// Utility Classes
export const designClasses = {
  // Gradients
  gradientPrimary: 'bg-gradient-to-r from-purple-500 to-pink-500',
  gradientSecondary: 'bg-gradient-to-r from-pink-500 to-purple-500',
  gradientGlass: 'bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60',
  
  // Hover Effects
  hoverScale: 'transition-transform duration-300 hover:scale-105 active:scale-95',
  hoverGlow: 'transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25',
  
  // Glass Effects
  glass: 'backdrop-blur-md bg-white/10 border border-white/20',
  glassHover: 'hover:bg-white/20 hover:shadow-2xl',
  
  // Text Effects
  textGradient: 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
  textGlow: 'drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]',
};

export default {
  designTokens,
  GradientBackground,
  FloatingElements,
  GlassCard,
  GradientText,
  AnimatedBorder,
  GlowIcon,
  designClasses,
};