'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PageLayout, Container, Section, Navigation } from '@/components/layout/main-layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ProjectService } from '@/lib/firebase-service';
import { ProjectData } from '@/lib/firebase-service';
import Link from 'next/link';
import {
  PlusIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
  BuildingOfficeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800'
};

const stageColors = {
  'idea': 'bg-purple-100 text-purple-800',
  'validation': 'bg-blue-100 text-blue-800',
  'development': 'bg-orange-100 text-orange-800',
  'launch': 'bg-green-100 text-green-800',
  'growth': 'bg-emerald-100 text-emerald-800'
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', active: false },
    { label: 'Projects', href: '/projects', active: true },
    { label: 'Report and Analytics', href: '/reports', active: false }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userProjects = await ProjectService.getProjectsByUser(user.uid);
        setProjects(userProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await ProjectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  const getProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const inProgress = projects.filter(p => p.status === 'in-progress').length;
    const draft = projects.filter(p => p.status === 'draft').length;

    return { total, completed, inProgress, draft };
  };

  const stats = getProjectStats();

  if (loading) {
    return (
      <ProtectedRoute>
        <PageLayout title="Projects">
          <Container>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          title="Projects"
          headerActions={
            <div className="flex items-center space-x-4">
              <Navigation items={navigationItems} />
            </div>
          }
        >
          <Container className="relative">
            {/* Header Section */}
            <Section className="pt-6 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-black">
                    Your <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Projects</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage and track your startup projects
                  </p>
                </div>
                <Link href="/projects/create">
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    New Project
                  </Button>
                </Link>
              </div>
            </Section>

            {/* Stats Cards */}
            <Section className="pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-blue-700">Total Projects</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-sm text-green-700">Completed</div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
                    <div className="text-sm text-orange-700">In Progress</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
                    <div className="text-sm text-gray-700">Draft</div>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Search Bar */}
            <Section className="pb-6">
              <div className="relative max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500"
                />
              </div>
            </Section>

            {/* Projects Grid */}
            <Section>
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}

              {!error && filteredProjects.length === 0 && !loading && (
                <div className="text-center py-12">
                  {projects.length === 0 ? (
                    <div>
                      <FolderIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-600 mb-6">Create your first project to get started with AI-powered business tools</p>
                      <Link href="/projects/create">
                        <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white">
                          <PlusIcon className="h-5 w-5 mr-2" />
                          Create Your First Project
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                      <p className="text-gray-600">Try adjusting your search terms</p>
                    </div>
                  )}
                </div>
              )}

              {!error && filteredProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:scale-105">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FolderIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className={cn('text-xs', statusColors[project.status])}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {project.progress}% complete
                            </div>
                          </div>
                        </div>
                        
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {project.name}
                        </CardTitle>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.tags.length - 2} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {project.createdAt ? formatDistanceToNow(project.createdAt.toDate(), { addSuffix: true }) : 'Recently'}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex space-x-2">
                          <Link href={`/projects/${project.id || ''}`} className="flex-1">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => project.id && handleDeleteProject(project.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </Section>

            {/* Bottom CTA */}
            {projects.length > 0 && (
              <Section className="mt-12">
                <Card className="bg-gradient-to-r from-blue-600 to-emerald-600 border-0 text-white">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                      Ready to Start a New Project?
                    </h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                      Create another project and leverage our AI-powered tools to bring your ideas to life.
                    </p>
                    <Link href="/projects/create">
                      <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create New Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Section>
            )}
          </Container>
        </PageLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}