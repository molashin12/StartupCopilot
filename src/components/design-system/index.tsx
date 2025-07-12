import React from 'react';
import { cn } from '@/lib/utils';

// Design System Colors - Professional & Eye-friendly
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Professional blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Professional emerald
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Professional slate
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  gradients: {
    primary: 'bg-gradient-to-r from-blue-500 to-emerald-500',
    primaryHover: 'hover:from-blue-600 hover:to-emerald-600',
    glass: 'bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60',
    glow: 'bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500',
    subtle: 'bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950 dark:to-emerald-950',
  },
  shadows: {
    glow: 'shadow-lg shadow-blue-500/25',
    glowHover: 'hover:shadow-xl hover:shadow-blue-500/30',
    glass: 'shadow-2xl',
    emerald: 'shadow-lg shadow-emerald-500/25',
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
    primary: 'bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-950 dark:via-blue-950 dark:to-emerald-950',
    glass: 'bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-md',
    glow: 'bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10',
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
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-slate-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
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
    primary: 'bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent',
    secondary: 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent',
    glow: 'bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg',
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
    <div className={cn('relative p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 animate-gradient-x', className)}>
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
  color?: 'blue' | 'emerald' | 'slate';
}

export function GlowIcon({ children, className, color = 'blue' }: GlowIconProps) {
  const colors = {
    blue: 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    emerald: 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    slate: 'text-slate-500 drop-shadow-[0_0_10px_rgba(100,116,139,0.5)]',

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
  gradientPrimary: 'bg-gradient-to-r from-blue-500 to-emerald-500',
  gradientSecondary: 'bg-gradient-to-r from-emerald-500 to-blue-500',
  gradientGlass: 'bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60',
  gradientSubtle: 'bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950 dark:to-emerald-950',
  
  // Hover Effects
  hoverScale: 'transition-transform duration-300 hover:scale-105 active:scale-95',
  hoverGlow: 'transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25',
  hoverGlowEmerald: 'transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25',
  
  // Glass Effects
  glass: 'backdrop-blur-md bg-white/10 border border-white/20',
  glassHover: 'hover:bg-white/20 hover:shadow-2xl',
  
  // Text Effects
  textGradient: 'bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent',
  textGlow: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]',
  textGlowEmerald: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]',
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