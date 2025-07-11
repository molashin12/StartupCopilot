'use client';

import React from 'react';
import { Loader2, Database, Wifi } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingFallbackProps {
  type?: 'dashboard' | 'projects' | 'generic';
  message?: string;
  showIcon?: boolean;
}

export function LoadingFallback({ 
  type = 'generic', 
  message,
  showIcon = true 
}: LoadingFallbackProps) {
  const getLoadingMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'dashboard':
        return 'Loading your dashboard...';
      case 'projects':
        return 'Loading your projects...';
      default:
        return 'Loading...';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'dashboard':
        return <Database className="h-6 w-6 text-blue-600" />;
      case 'projects':
        return <Wifi className="h-6 w-6 text-emerald-600" />;
      default:
        return <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />;
    }
  };

  if (type === 'dashboard') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (type === 'projects') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Generic loading
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      {showIcon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20">
          {getIcon()}
        </div>
      )}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-foreground">{getLoadingMessage()}</p>
        <p className="text-xs text-muted-foreground">
          This should only take a moment...
        </p>
      </div>
    </div>
  );
}

export default LoadingFallback;