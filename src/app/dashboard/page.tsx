'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectService, ProjectData } from '@/lib/firebase-service';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import { MainLayout, Container, Section } from '@/components/layout/main-layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingFallback from '@/components/LoadingFallback';
import ProjectCard from '@/components/ProjectCard';
import { formatRelativeTime } from '@/lib/utils';
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



const quickActions = [
  {
    title: 'New Business Plan',
    description: 'Create a comprehensive business plan',
    icon: DocumentTextIcon,
    color: 'blue' as const,
    href: '/create/business-plan'
  },
  {
    title: 'Pitch Deck',
    description: 'Build an investor-ready presentation',
    icon: RocketLaunchIcon,
    color: 'emerald' as const,
    href: '/create/pitch-deck'
  },
  {
    title: 'Market Analysis',
    description: 'Analyze your target market',
    icon: ChartBarIcon,
    color: 'blue' as const,
    href: '/create/market-analysis'
  },
  {
    title: 'Idea Validator',
    description: 'Validate your startup concept',
    icon: LightBulbIcon,
    color: 'emerald' as const,
    href: '/create/idea-validator'
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
  const [searchQuery, setSearchQuery] = useState('');
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



  // Memoized filtered projects for performance
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    
    const query = searchQuery.toLowerCase();
    return projects.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      (project.tags && project.tags.some((tag: string) => tag.toLowerCase().includes(query)))
    );
  }, [projects, searchQuery]);

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
          <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              <Container className="relative py-12">
                <LoadingFallback type="dashboard" />
              </Container>
            </div>
          </MainLayout>
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
        <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Container className="relative">
          {/* Welcome Section */}
          <Section className="pt-12 pb-8">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Entrepreneur</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Transform your ideas into successful startups with AI-powered insights and professional tools
              </p>
            </div>
          </Section>

          {/* Stats Section */}
          <Section className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {memoizedStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="text-center space-y-4">
                      <div className={`inline-flex p-3 rounded-xl ${
                        index % 2 === 0 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{stat.change}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Quick Actions */}
          <Section className="py-8">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Quick Actions</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-300">Start building your next big idea</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  const colorClasses = action.color === 'blue' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50';
                  
                  return (
                    <div key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                      <div className="text-center space-y-4">
                        <div className={`inline-flex p-4 rounded-xl transition-colors duration-300 ${colorClasses}`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-100">{action.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{action.description}</p>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                          size="sm"
                          onClick={() => setIsLoading(true)}
                        >
                          Get Started
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>

          {/* Projects Section */}
          <Section className="py-8">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                    <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Your Projects</span>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300">Manage and track your startup projects</p>
                </div>
                <div className="flex gap-3">
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300" size="lg">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleProjectEdit}
                    onDelete={handleProjectDelete}
                    onDuplicate={handleProjectDuplicate}
                  />
                ))}
              </div>
              
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <GlowIcon color="blue">
                    <DocumentTextIcon className="h-16 w-16 mx-auto mb-4" />
                  </GlowIcon>
                  <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                  <p className="text-muted-foreground mb-6">Create your first project to get started</p>
                  <Button variant="gradient" size="lg">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </div>
          </Section>
        </Container>
        
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <GlassCard className="p-8">
              <div className="flex flex-col items-center space-y-4">
                <LoadingSpinner variant="gradient" size="xl" />
                <p className="text-white font-medium">Creating your project...</p>
              </div>
            </GlassCard>
          </div>
        )}
        </div>
        </MainLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}