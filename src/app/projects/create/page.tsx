'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageLayout, Container, Section, Navigation } from '@/components/layout/main-layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ProjectService } from '@/lib/firebase-service';
import { ProjectFormData } from '@/types';
import {
  FolderPlusIcon,
  BuildingOfficeIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Food & Beverage',
  'Real Estate',
  'Manufacturing',
  'Entertainment',
  'Transportation',
  'Energy',
  'Agriculture',
  'Other'
];

const stages = [
  { value: 'idea', label: 'Idea Stage', description: 'Just starting with a concept' },
  { value: 'validation', label: 'Validation', description: 'Testing market fit' },
  { value: 'development', label: 'Development', description: 'Building the product' },
  { value: 'launch', label: 'Launch', description: 'Ready to go to market' },
  { value: 'growth', label: 'Growth', description: 'Scaling the business' }
];

const businessModels = [
  'B2B SaaS',
  'B2C Marketplace',
  'E-commerce',
  'Subscription',
  'Freemium',
  'Advertising',
  'Commission-based',
  'Licensing',
  'Consulting',
  'Other'
];

export default function CreateProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    industry: '',
    stage: 'idea',
    businessModel: '',
    targetMarket: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', active: false },
    { label: 'Projects', href: '/projects', active: false },
    { label: 'Report and Analytics', href: '/reports', active: false }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry selection is required';
    }

    if (!formData.businessModel) {
      newErrors.businessModel = 'Business model is required';
    }

    if (!formData.targetMarket.trim()) {
      newErrors.targetMarket = 'Target market description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setIsCreating(true);
    try {
      const projectData = {
        ...formData,
        userId: user.uid,
        progress: 0,
        status: 'draft' as const,
        type: 'business-plan' as const
      };

      const projectId = await ProjectService.createProject(projectData);
      
      // Redirect to the project dashboard
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ name: 'Failed to create project. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <PageLayout 
          title="Create New Project"
          headerActions={
            <div className="flex items-center space-x-4">
              <Navigation items={navigationItems} />
            </div>
          }
        >
          <Container className="relative max-w-4xl">
            <Section className="pt-6 pb-4">
              <div className="text-center space-y-3 mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <FolderPlusIcon className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-black">
                  Create New <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Project</span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Set up your startup project and access AI-powered tools to bring your ideas to life
                </p>
              </div>

              <Card className="bg-white border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Project Name *
                      </label>
                      <Input
                        placeholder="Enter your project name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={cn(
                          "border-gray-300 focus:border-blue-500",
                          errors.name && "border-red-500"
                        )}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Project Description */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Project Description *
                      </label>
                      <Textarea
                        placeholder="Describe your startup idea and what problem it solves"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className={cn(
                          "border-gray-300 focus:border-blue-500 min-h-[100px]",
                          errors.description && "border-red-500"
                        )}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>

                    {/* Industry and Stage Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Industry */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Industry *
                        </label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                        >
                          <SelectTrigger className={cn(
                            "border-gray-300 focus:border-blue-500",
                            errors.industry && "border-red-500"
                          )}>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.industry && (
                          <p className="text-sm text-red-600">{errors.industry}</p>
                        )}
                      </div>

                      {/* Stage */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Current Stage
                        </label>
                        <Select
                          value={formData.stage}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value as any }))}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stages.map((stage) => (
                              <SelectItem key={stage.value} value={stage.value}>
                                <div>
                                  <div className="font-medium">{stage.label}</div>
                                  <div className="text-sm text-gray-500">{stage.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Business Model */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Business Model *
                      </label>
                      <Select
                        value={formData.businessModel}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, businessModel: value }))}
                      >
                        <SelectTrigger className={cn(
                          "border-gray-300 focus:border-blue-500",
                          errors.businessModel && "border-red-500"
                        )}>
                          <SelectValue placeholder="Select business model" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessModels.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.businessModel && (
                        <p className="text-sm text-red-600">{errors.businessModel}</p>
                      )}
                    </div>

                    {/* Target Market */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Target Market *
                      </label>
                      <Textarea
                        placeholder="Describe your target audience and market"
                        value={formData.targetMarket}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                        className={cn(
                          "border-gray-300 focus:border-blue-500 min-h-[80px]",
                          errors.targetMarket && "border-red-500"
                        )}
                      />
                      {errors.targetMarket && (
                        <p className="text-sm text-red-600">{errors.targetMarket}</p>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tags (Optional)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tags (press Enter)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="border-gray-300 focus:border-blue-500"
                        />
                        <Button
                          type="button"
                          onClick={handleAddTag}
                          variant="outline"
                          className="border-gray-300"
                        >
                          <TagIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={isCreating}
                        className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-3"
                      >
                        {isCreating ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Project...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <RocketLaunchIcon className="h-5 w-5 mr-2" />
                            Create Project
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </Section>
          </Container>
        </PageLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}