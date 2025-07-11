'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import { MainLayout, Container, Section } from '@/components/layout/main-layout';
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
    color: 'purple' as const,
    href: '/create/business-plan'
  },
  {
    title: 'Pitch Deck',
    description: 'Build an investor-ready presentation',
    icon: RocketLaunchIcon,
    color: 'pink' as const,
    href: '/create/pitch-deck'
  },
  {
    title: 'Market Analysis',
    description: 'Analyze your target market',
    icon: ChartBarIcon,
    color: 'purple' as const,
    href: '/create/market-analysis'
  },
  {
    title: 'Idea Validator',
    description: 'Validate your startup concept',
    icon: LightBulbIcon,
    color: 'pink' as const,
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
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'in-progress':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'draft':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
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
    <MainLayout>
      <GradientBackground variant="primary" className="min-h-screen">
        <FloatingElements />
        
        <Container className="relative z-10">
          {/* Welcome Section */}
          <Section className="pt-8 pb-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Welcome back, <GradientText variant="primary">Entrepreneur</GradientText>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your ideas into successful startups with AI-powered insights
              </p>
            </div>
          </Section>

          {/* Stats Section */}
          <Section className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <AnimatedBorder key={index} className="group">
                    <div className="text-center space-y-3">
                      <GlowIcon color={index % 2 === 0 ? 'purple' : 'pink'}>
                        <Icon className="h-8 w-8 mx-auto" />
                      </GlowIcon>
                      <div>
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                        <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                      </div>
                    </div>
                  </AnimatedBorder>
                );
              })}
            </div>
          </Section>

          {/* Quick Actions */}
          <Section className="py-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">
                  <GradientText>Quick Actions</GradientText>
                </h2>
                <p className="text-muted-foreground">Start building your next big idea</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <GlassCard key={index} className="group cursor-pointer">
                      <div className="text-center space-y-4">
                        <GlowIcon color={action.color}>
                          <Icon className="h-12 w-12 mx-auto" />
                        </GlowIcon>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <Button 
                          variant="gradient" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setIsLoading(true)}
                        >
                          Get Started
                        </Button>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          </Section>

          {/* Projects Section */}
          <Section className="py-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    <GradientText>Your Projects</GradientText>
                  </h2>
                  <p className="text-muted-foreground">Manage and track your startup projects</p>
                </div>
                <div className="flex gap-3">
                  <Input
                    variant="gradient"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="gradient" size="lg">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const TypeIcon = getTypeIcon(project.type);
                  return (
                    <Card key={project.id} variant="gradient" className="group">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <GlowIcon color="purple">
                              <TypeIcon className="h-6 w-6" />
                            </GlowIcon>
                            <div>
                              <h3 className="font-semibold text-lg">{project.name}</h3>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {project.status.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            Modified {project.lastModified}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <GlowIcon color="purple">
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
      </GradientBackground>
    </MainLayout>
  );
}