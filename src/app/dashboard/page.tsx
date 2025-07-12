'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectService, ProjectData } from '@/lib/firebase-service';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageLayout, Container, Section, Navigation } from '@/components/layout/main-layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingFallback from '@/components/LoadingFallback';
import ProjectCard from '@/components/ProjectCard';
import { formatRelativeTime, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  GradientBackground,
  FloatingElements,
  GlassCard,
  GradientText,
  AnimatedBorder,
  GlowIcon,
  designClasses
} from '@/components/design-system';
import {
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import {
  Plus,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  Settings,
  Bell,
  Home,
  PieChart,
  Activity,
  Menu,
  ChevronLeft,
  Eye,
  ShoppingCart
} from 'lucide-react';

// Navigation items for consistent header navigation
const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', active: true },
    { label: 'Projects', href: '/projects', active: false },
    { label: 'Report and Analytics', href: '/reports', active: false }
  ];

const quickActions = [
  {
    title: 'New Project',
    description: 'Create a new startup project',
    icon: Plus,
    color: 'purple' as const,
    href: '/projects/create'
  },
  {
    title: 'Business Plan',
    description: 'Generate comprehensive business plans within projects',
    icon: DocumentTextIcon,
    color: 'blue' as const,
    href: '/projects'
  },
  {
    title: 'Pitch Deck',
    description: 'Create compelling investor presentations within projects',
    icon: RocketLaunchIcon,
    color: 'emerald' as const,
    href: '/projects'
  },
  {
    title: 'Market Analysis',
    description: 'Analyze your target market within projects',
    icon: ChartBarIcon,
    color: 'blue' as const,
    href: '/projects'
  }
];

// Dynamic stats will be calculated from user data
interface DashboardStats {
  label: string;
  value: string;
  change: string;
  icon: any;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  // Fetch user projects and calculate stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        setError(null);
        
        // Fetch user projects
        const userProjects = await ProjectService.getProjectsByUser(user.uid);
        setProjects(userProjects);
        
        // Calculate stats
        const projectStats = await ProjectService.getProjectStats(user.uid);
        const calculatedStats: DashboardStats[] = [
          {
            label: 'Projects Created',
            value: projectStats.totalProjects.toString(),
            change: projectStats.totalProjects > 0 ? '+100%' : '0%',
            icon: DocumentTextIcon
          },
          {
            label: 'Completed',
            value: projectStats.completedProjects.toString(),
            change: projectStats.totalProjects > 0 ? `${Math.round((projectStats.completedProjects / projectStats.totalProjects) * 100)}%` : '0%',
            icon: ArrowTrendingUpIcon
          },
          {
            label: 'In Progress',
            value: projectStats.inProgressProjects.toString(),
            change: projectStats.totalProjects > 0 ? `${Math.round((projectStats.inProgressProjects / projectStats.totalProjects) * 100)}%` : '0%',
            icon: ClockIcon
          },
          {
            label: 'Draft Projects',
            value: projectStats.draftProjects.toString(),
            change: projectStats.totalProjects > 0 ? `${Math.round((projectStats.draftProjects / projectStats.totalProjects) * 100)}%` : '0%',
            icon: UserGroupIcon
          }
        ];
        
        setStats(calculatedStats);
        setIsFirebaseConnected(true);
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        
        // Check if it's a Firebase connection error
        if (error.name === 'FirebaseConnectionError') {
          // Handle specific error codes
          switch (error.code) {
            case 'session-invalid':
              // Automatically refresh the page for session errors
              console.log('Session invalid, refreshing page...');
              setTimeout(() => {
                window.location.reload();
              }, 2000);
              setError('Session expired. Refreshing page to restore connection...');
              break;
            case 'network-error':
              setError('Network connection error. Please check your internet connection and try again.');
              break;
            case 'service-unavailable':
              setError('Firebase service is temporarily unavailable. Please try again in a moment.');
              break;
            case 'permission-denied':
              setError('Access denied. Please check your authentication and permissions.');
              break;
            case 'unauthenticated':
              setError('Authentication required. Please sign in again.');
              break;
            case 'quota-exceeded':
              setError('Service quota exceeded. Please try again later.');
              break;
            case 'firebase-not-configured':
              setError('Firebase is not properly configured. Please check your environment variables.');
              break;
            default:
              setError(error.message || 'Firebase connection error. Please try again.');
          }
          setIsFirebaseConnected(false);
        } else if (error.code === 'unavailable' || error.message?.includes('network')) {
          setError('Unable to connect to the database. Please check your internet connection.');
          setIsFirebaseConnected(false);
        } else {
          setError('An error occurred while loading your data. Please try again.');
        }
        
        // Set empty data for error state
        setProjects([]);
        setStats([]);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [user]);





  // Memoized stats calculation
  const memoizedStats = useMemo(() => stats, [stats]);

  // Callback handlers for better performance
  const handleProjectEdit = useCallback((project: ProjectData) => {
    // TODO: Implement edit functionality
    console.log('Edit project:', project.id);
  }, []);

  const handleProjectDelete = useCallback(async (projectId: string) => {
    try {
      await ProjectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }, []);

  const handleProjectDuplicate = useCallback((project: ProjectData) => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate project:', project.id);
  }, []);

  // Show loading state while fetching data
  if (loadingData) {
    return (
      <ProtectedRoute>
        <ErrorBoundary>
          <PageLayout title="Dashboard" subtitle="Monitor health of your business">
            <Container className="relative py-12">
              <LoadingFallback type="dashboard" />
            </Container>
          </PageLayout>
        </ErrorBoundary>
      </ProtectedRoute>
    );
  }

  // Show error state if Firebase connection failed
  if (error && !isFirebaseConnected) {
    const isSessionError = error.includes('Session expired');
    const isAutoRefreshing = isSessionError;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-slate-200/50 dark:border-slate-700/50">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
            isSessionError 
              ? 'bg-blue-100 dark:bg-blue-900/30' 
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {isSessionError ? (
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            {isSessionError ? 'Refreshing Connection' : 'Connection Error'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          
          {isAutoRefreshing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600 dark:text-blue-400">Auto-refreshing...</span>
            </div>
          ) : (
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <PageLayout 
          title="Dashboard"
          headerActions={
            <div className="flex items-center space-x-4">
              <Navigation items={navigationItems} />
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          }
        >
              <Container className="relative">
          {/* Welcome Section */}
          <Section className="pt-6 pb-4">
            <div className="text-left space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-black">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Entrepreneur</span>
              </h1>
              <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
                Transform your ideas into successful startups with AI-powered insights and professional tools
              </p>
            </div>
          </Section>

              {/* Dashboard Stats */}
              {!loadingData && !error && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Projects Created Card */}
                  <Card className="bg-blue-50 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-700 text-sm font-medium mb-1">Projects Created</p>
                          <p className="text-3xl font-bold mb-1 text-blue-900">{memoizedStats[0]?.value || '0'}</p>
                          <p className="text-blue-600 text-xs">{memoizedStats[0]?.change || '+0%'} completion rate</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Completed Projects Card */}
                  <Card className="bg-emerald-50 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-700 text-sm font-medium mb-1">Completed</p>
                          <p className="text-3xl font-bold mb-1 text-emerald-900">{memoizedStats[1]?.value || '0'}</p>
                          <p className="text-emerald-600 text-xs">{memoizedStats[1]?.change || '0%'} of total</p>
                        </div>
                        <div className="bg-emerald-100 p-3 rounded-lg">
                          <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* In Progress Card */}
                  <Card className="bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-700 text-sm font-medium mb-1">In Progress</p>
                          <p className="text-3xl font-bold text-slate-900 mb-1">{memoizedStats[2]?.value || '0'}</p>
                          <p className="text-slate-600 text-xs">{memoizedStats[2]?.change || '0%'} of total</p>
                        </div>
                        <div className="bg-slate-100 p-3 rounded-lg">
                          <ShoppingCart className="w-6 h-6 text-slate-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              {/* Projects Section */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
                    <p className="text-gray-600 mt-1">Manage and track your startup projects</p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => router.push('/projects/create')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                </div>

                {/* Projects Grid */}
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onEdit={handleProjectEdit}
                        onDelete={handleProjectDelete}
                        onDuplicate={handleProjectDuplicate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Card className="max-w-md mx-auto">
                      <CardContent className="p-8">
                        <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No projects yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Start your entrepreneurial journey by creating your first project.
                        </p>
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                          onClick={() => router.push('/projects/create')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Project
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
              </Container>
        </PageLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}