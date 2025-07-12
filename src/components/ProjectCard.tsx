'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  FileText, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectData } from '@/lib/firebase-service';
import { formatRelativeTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: ProjectData;
  onEdit?: (project: ProjectData) => void;
  onDelete?: (projectId: string) => void;
  onDuplicate?: (project: ProjectData) => void;
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'planning':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'on-hold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'completed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'business-plan':
      return <FileText className="h-4 w-4" />;
    case 'idea-validation':
      return <Lightbulb className="h-4 w-4" />;
    case 'market-research':
      return <TrendingUp className="h-4 w-4" />;
    case 'team-building':
      return <Users className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const ProjectCard = memo<ProjectCardProps>(({ 
  project, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  const router = useRouter();

  const handleViewProject = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleEdit = () => {
    if (project.id) {
      onEdit?.(project);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      if (project.id) {
        onDelete?.(project.id);
      }
    }
  };

  const handleDuplicate = () => {
    if (project.id) {
      onDuplicate?.(project);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {project.name}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className={getStatusColor(project.status)}
              >
                {project.status}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                {getTypeIcon(project.type)}
                <span className="ml-1 text-xs capitalize">
                  {project.type.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleViewProject}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Project
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={handleEdit}>
                  <FileText className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={handleDuplicate}>
                  <FileText className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-2 mb-4">
          {project.description || 'No description provided.'}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Updated {formatRelativeTime(project.lastModified)}</span>
          </div>
          <div className="flex items-center space-x-2">
            {project.tags && project.tags.length > 0 && (
              <div className="flex space-x-1">
                {project.tags.slice(0, 2).map((tag: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs px-1 py-0"
                  >
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 2 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-1 py-0"
                  >
                    +{project.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={handleViewProject}
            className="w-full"
            size="sm"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
export { ProjectCard };