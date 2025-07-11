'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GradientBackground } from '@/components/design-system';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  withGradient?: boolean;
  gradientVariant?: 'primary' | 'secondary' | 'accent';
}

export function MainLayout({ 
  children, 
  className, 
  withGradient = false, 
  gradientVariant = 'primary' 
}: MainLayoutProps) {
  if (withGradient) {
    return (
      <div className={cn('min-h-screen font-sans antialiased', className)}>
        <GradientBackground variant={gradientVariant === 'secondary' ? 'glass' : gradientVariant === 'accent' ? 'glow' : 'primary'} className="min-h-screen">
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </GradientBackground>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-background font-sans antialiased', className)}>
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 md:py-16 lg:py-20', className)}>
      {children}
    </section>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function PageHeader({ title, description, children, className, gradient = false }: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <h1 className={cn(
          'text-3xl font-bold tracking-tight sm:text-4xl',
          gradient && 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
        )}>
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// Navigation Component
interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface NavigationProps {
  items: NavItem[];
  className?: string;
}

export function Navigation({ items, className }: NavigationProps) {
  return (
    <nav className={cn('flex space-x-8', className)}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            item.active
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted hover:shadow-md'
          )}
        >
          {item.icon && <span className="w-4 h-4">{item.icon}</span>}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

// Header Component
interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export function Header({ title, subtitle, children, className, glass = false }: HeaderProps) {
  return (
    <header className={cn(
      'border-b transition-all duration-200',
      glass 
        ? 'bg-white/10 backdrop-blur-md border-white/20 shadow-lg' 
        : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {title && (
              <div>
                <h1 className="text-xl font-semibold">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
          </div>
          {children && (
            <div className="flex items-center space-x-4">
              {children}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}

// Footer Component
interface FooterProps {
  className?: string;
  glass?: boolean;
}

export function Footer({ className, glass = false }: FooterProps) {
  return (
    <footer className={cn(
      'border-t transition-all duration-200',
      glass 
        ? 'bg-white/10 backdrop-blur-md border-white/20' 
        : 'bg-background',
      className
    )}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 Startup Copilot. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Support
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// Page Layout with Header and Footer
interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  showFooter?: boolean;
  className?: string;
  withGradient?: boolean;
  glass?: boolean;
}

export function PageLayout({
  children,
  title,
  subtitle,
  headerActions,
  showFooter = true,
  className,
  withGradient = false,
  glass = false
}: PageLayoutProps) {
  return (
    <MainLayout className={className} withGradient={withGradient}>
      {(title || headerActions) && (
        <Header title={title} subtitle={subtitle} glass={glass}>
          {headerActions}
        </Header>
      )}
      <div className="flex-1">
        {children}
      </div>
      {showFooter && <Footer glass={glass} />}
    </MainLayout>
  );
}