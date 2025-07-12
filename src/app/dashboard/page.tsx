'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import { MainLayout, Container, Section } from '@/components/layout/main-layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  progress: number;
  status: 'draft' | 'in-progress' | 'completed';
  type: 'business-plan' | 'pitch-deck' | 'market-analysis';
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'EcoTech Solutions',
    description: 'Sustainable technology for smart cities',
    lastModified: '2 hours ago',
    progress: 85,
    status: 'in-progress',
    type: 'business-plan'
  },
  {
    id: '2',
    name: 'HealthAI Platform',
    description: 'AI-powered healthcare diagnostics',
    lastModified: '1 day ago',
    progress: 100,
    status: 'completed',
    type: 'pitch-deck'
  },
  {
    id: '3',
    name: 'FinanceFlow App',
    description: 'Personal finance management tool',
    lastModified: '3 days ago',
    progress: 45,
    status: 'draft',
    type: 'market-analysis'
  },
  {
    id: '4',
    name: 'EdTech Revolution',
    description: 'Interactive learning platform',
    lastModified: '1 week ago',
    progress: 70,
    status: 'in-progress',
    type: 'business-plan'
  }
];

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

const stats = [
  {
    label: 'Projects Created',
    value: '24',
    change: '+12%',
    icon: DocumentTextIcon
  },
  {
    label: 'Time Saved',
    value: '156h',
    change: '+23%',
    icon: ClockIcon
  },
  {
    label: 'Success Rate',
    value: '94%',
    change: '+5%',
    icon: ArrowTrendingUpIcon
  },
  {
    label: 'Team Members',
    value: '8',
    change: '+2',
    icon: UserGroupIcon
  }
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800';
      case 'in-progress':
        return 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800';
      case 'draft':
        return 'text-slate-700 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800';
      default:
        return 'text-slate-700 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800';
    }
  };

  const getTypeIcon = (type: Project['type']) => {
    switch (type) {
      case 'business-plan':
        return DocumentTextIcon;
      case 'pitch-deck':
        return RocketLaunchIcon;
      case 'market-analysis':
        return ChartBarIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
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
              {stats.map((stat, index) => {
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
                {filteredProjects.map((project) => {
                  const TypeIcon = getTypeIcon(project.type);
                  return (
                    <div key={project.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{project.name}</h3>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {project.status.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400">{project.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Progress</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Modified {project.lastModified}
                          </span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
    </ProtectedRoute>
  );
}