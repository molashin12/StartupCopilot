'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLayout, Container, Section, Navigation } from '@/components/layout/main-layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ProjectService } from '@/lib/firebase-service';
import { ProjectData } from '@/lib/firebase-service';
import Link from 'next/link';
import {
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  PresentationChartLineIcon,
  FolderIcon,
  CalendarIcon,
  TagIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const aiServices = [
  {
    id: 'business-plan',
    title: 'Business Plan Generator',
    description: 'Create a comprehensive AI-powered business plan with market analysis and financial projections for this project.',
    icon: DocumentTextIcon,
    color: 'blue',
    href: '#business-plan',
    features: ['Executive Summary', 'Market Analysis', 'Financial Projections', 'Risk Assessment'],
    estimatedTime: '15-20 minutes',
    difficulty: 'Beginner'
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    description: 'Get detailed market insights, competitor analysis, and industry trends for this project.',
    icon: ChartBarIcon,
    color: 'emerald',
    href: '#market-analysis',
    features: ['Market Size', 'Competitor Research', 'Industry Trends', 'Target Audience'],
    estimatedTime: '10-15 minutes',
    difficulty: 'Beginner'
  },
  {
    id: 'idea-validator',
    title: 'Idea Validator',
    description: 'Validate your startup concept with AI-powered analysis and feedback for this project.',
    icon: LightBulbIcon,
    color: 'purple',
    href: '#idea-validator',
    features: ['Viability Score', 'Market Potential', 'Risk Analysis', 'Recommendations'],
    estimatedTime: '5-10 minutes',
    difficulty: 'Beginner'
  },
  {
    id: 'financial-projections',
    title: 'Financial Projections',
    description: 'Generate detailed financial models with revenue forecasts and scenario analysis for this project.',
    icon: CurrencyDollarIcon,
    color: 'green',
    href: '#financial-projections',
    features: ['Revenue Forecasts', 'Expense Planning', 'Cash Flow', 'Break-even Analysis'],
    estimatedTime: '20-25 minutes',
    difficulty: 'Intermediate'
  },
  {
    id: 'swot-analysis',
    title: 'SWOT Analysis',
    description: 'Comprehensive strengths, weaknesses, opportunities, and threats analysis for this project.',
    icon: ShieldCheckIcon,
    color: 'orange',
    href: '#swot-analysis',
    features: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
    estimatedTime: '10-15 minutes',
    difficulty: 'Beginner'
  },
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Generator',
    description: 'Create investor-ready presentations with compelling storytelling for this project.',
    icon: PresentationChartLineIcon,
    color: 'indigo',
    href: '#pitch-deck',
    features: ['Problem & Solution', 'Market Opportunity', 'Business Model', 'Financial Ask'],
    estimatedTime: '25-30 minutes',
    difficulty: 'Advanced'
  }
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-100',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    badge: 'bg-blue-100 text-blue-800'
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    iconBg: 'bg-purple-100',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
    badge: 'bg-purple-100 text-purple-800'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    iconBg: 'bg-green-100',
    button: 'bg-green-600 hover:bg-green-700 text-white',
    badge: 'bg-green-100 text-green-800'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    iconBg: 'bg-orange-100',
    button: 'bg-orange-600 hover:bg-orange-700 text-white',
    badge: 'bg-orange-100 text-orange-800'
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    badge: 'bg-indigo-100 text-indigo-800'
  }
};

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800'
};

const stageColors = {
  'idea': 'bg-purple-100 text-purple-800',
  'validation': 'bg-blue-100 text-blue-800',
  'development': 'bg-orange-100 text-orange-800',
  'launch': 'bg-green-100 text-green-800',
  'growth': 'bg-emerald-100 text-emerald-800'
};

const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800'
};

export default function ProjectPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.id as string;

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', active: false },
    { label: 'Projects', href: '/projects', active: false },
    { label: 'Report and Analytics', href: '/reports', active: false }
  ];

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !user) return;

      try {
        setLoading(true);
        const projectData = await ProjectService.getProject(projectId);
        
        if (!projectData) {
          setError('Project not found');
          return;
        }

        // Check if user owns this project
        if (projectData.userId !== user.uid) {
          setError('You do not have access to this project');
          return;
        }

        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <PageLayout title="Loading...">
          <Container>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </Container>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  if (error || !project) {
    return (
      <ProtectedRoute>
        <PageLayout title="Error">
          <Container>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Project not found'}</h2>
              <Button onClick={() => router.push('/projects')} className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </div>
          </Container>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <PageLayout 
          title={project.name}
          headerActions={
            <div className="flex items-center space-x-4">
              <Navigation items={navigationItems} />
            </div>
          }
        >
          <Container className="relative">
            {/* Back Button */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => router.push('/projects')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </div>

            {/* Project Header */}
            <Section className="pb-6">
              <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <FolderIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                          <Badge className={cn('text-xs', statusColors[project.status])}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4 max-w-2xl">{project.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                            {project.content?.data?.industry || 'Not specified'}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Created {project.createdAt ? formatDistanceToNow(project.createdAt.toDate(), { addSuffix: true }) : 'recently'}
                          </div>
                          {project.lastModified && (
                            <div className="flex items-center">
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Updated {formatDistanceToNow(project.lastModified.toDate(), { addSuffix: true })}
                            </div>
                          )}
                        </div>

                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {project.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <TagIcon className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">Progress</div>
                      <div className="text-2xl font-bold text-blue-600">{project.progress}%</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Section>

            {/* AI Services Section */}
            <Section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  AI-Powered <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Services</span>
                </h2>
                <p className="text-gray-600">
                  Use these AI tools to develop and enhance your project
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiServices.map((service) => {
                  const Icon = service.icon;
                  const colors = colorClasses[service.color as keyof typeof colorClasses];
                  
                  return (
                    <Card 
                      key={service.id} 
                      className={cn(
                        'group hover:shadow-xl transition-all duration-300 border-2 hover:scale-105',
                        colors.bg,
                        colors.border
                      )}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className={cn('p-3 rounded-xl', colors.iconBg)}>
                            <Icon className={cn('h-8 w-8', colors.icon)} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className={cn(
                              'text-xs',
                              difficultyColors[service.difficulty as keyof typeof difficultyColors]
                            )}>
                              {service.difficulty}
                            </Badge>
                            <Badge className={cn('text-xs', colors.badge)}>
                              {service.estimatedTime}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                          {service.title}
                        </CardTitle>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">Key Features:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {service.features.map((item, index) => (
                              <div key={index} className="flex items-center text-xs text-slate-600">
                                <div className={cn('w-1.5 h-1.5 rounded-full mr-2', colors.icon.replace('text-', 'bg-'))} />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button 
                          className={cn(
                            'w-full font-semibold transition-all duration-300 group-hover:shadow-lg',
                            colors.button
                          )}
                          onClick={() => {
                            // TODO: Implement project-based AI service workflows
                            console.log(`Starting ${service.title} for project ${projectId}`);
                          }}
                        >
                          Start Service
                          <RocketLaunchIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </Section>

            {/* Quick Actions */}
            <Section className="mt-12">
              <Card className="bg-gradient-to-r from-blue-600 to-emerald-600 border-0 text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Accelerate Your Project?
                  </h3>
                  <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Start with our most popular service - the Business Plan Generator, or explore market analysis to validate your ideas.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3"
                      onClick={() => {
                        // TODO: Implement business plan generation for this project
                        console.log(`Generating business plan for project ${projectId}`);
                      }}
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Generate Business Plan
                    </Button>
                    <Button 
                      className="bg-white/10 text-white hover:bg-white/20 font-semibold px-6 py-3 border border-white/20"
                      onClick={() => {
                        // TODO: Implement market analysis for this project
                        console.log(`Analyzing market for project ${projectId}`);
                      }}
                    >
                      <ChartBarIcon className="h-5 w-5 mr-2" />
                      Analyze Market
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Section>
          </Container>
        </PageLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}