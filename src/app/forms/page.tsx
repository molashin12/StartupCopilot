'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout, Container, Section, PageHeader } from '@/components/layout/main-layout';
import {
  GradientBackground,
  FloatingElements,
  GlassCard,
  GradientText,
  AnimatedBorder,
  GlowIcon
} from '@/components/design-system';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Globe,
  DollarSign,
  Calendar,
  FileText,
  Send,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';

export default function FormsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    website: '',
    budget: '',
    launchDate: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    
    // Reset form or show success message
    console.log('Form submitted:', formData);
  };

  const formSections = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: User,
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          placeholder: 'Enter your first name',
          icon: User,
          required: true
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          placeholder: 'Enter your last name',
          icon: User,
          required: true
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'Enter your email',
          icon: Mail,
          required: true
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Create a secure password',
          icon: Lock,
          required: true
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'tel',
          placeholder: '+1 (555) 123-4567',
          icon: Phone,
          required: false
        }
      ]
    },
    {
      title: 'Business Details',
      description: 'Information about your startup',
      icon: Building,
      fields: [
        {
          name: 'company',
          label: 'Company Name',
          type: 'text',
          placeholder: 'Your startup name',
          icon: Building,
          required: false
        },
        {
          name: 'website',
          label: 'Website',
          type: 'url',
          placeholder: 'https://yourwebsite.com',
          icon: Globe,
          required: false
        },
        {
          name: 'budget',
          label: 'Initial Budget',
          type: 'text',
          placeholder: '$10,000 - $50,000',
          icon: DollarSign,
          required: false
        },
        {
          name: 'launchDate',
          label: 'Target Launch Date',
          type: 'date',
          placeholder: '',
          icon: Calendar,
          required: false
        }
      ]
    }
  ];

  return (
    <MainLayout withGradient gradientVariant="primary">
      <GradientBackground variant="primary" className="min-h-screen">
        <FloatingElements />
        
        <Container>
          <PageHeader
            title="Startup Registration"
            description="Join thousands of entrepreneurs building the future"
            gradient
            className="text-center mb-12"
          />
          
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {formSections.map((section, sectionIndex) => {
                const SectionIcon = section.icon;
                return (
                  <GlassCard key={sectionIndex} className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <GlowIcon color={sectionIndex % 2 === 0 ? 'blue' : 'emerald'}>
                        <SectionIcon className="w-6 h-6" />
                      </GlowIcon>
                      <div>
                        <GradientText variant="primary" className="text-2xl font-bold">
                          {section.title}
                        </GradientText>
                        <p className="text-white/80 mt-1">{section.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {section.fields.map((field, fieldIndex) => {
                        const FieldIcon = field.icon;
                        const hasError = errors[field.name];
                        const isValid = formData[field.name as keyof typeof formData] && !hasError;
                        
                        return (
                          <div key={fieldIndex} className="space-y-2">
                            <Label 
                              htmlFor={field.name} 
                              className="text-white font-medium flex items-center gap-2"
                            >
                              <FieldIcon className="w-4 h-4" />
                              {field.label}
                              {field.required && <span className="text-emerald-400">*</span>}
                            </Label>
                            
                            <div className="relative">
                              {field.name === 'password' ? (
                                <div className="relative">
                                  <Input
                                    id={field.name}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={field.placeholder}
                                    value={formData[field.name as keyof typeof formData]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.name, e.target.value)}
                                    className={`
                                      bg-white/10 border-white/20 text-white placeholder:text-white/50
                                      focus:border-blue-400 focus:ring-blue-400/20
                                      ${hasError ? 'border-red-400 focus:border-red-400' : ''}
                                      ${isValid ? 'border-emerald-400' : ''}
                                      pr-20
                                    `}
                                    required={field.required}
                                  />
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {isValid && (
                                      <Check className="w-4 h-4 text-green-400" />
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="text-white/60 hover:text-white transition-colors"
                                    >
                                      {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ) : field.name === 'description' ? (
                                <Textarea
                                  id={field.name}
                                  placeholder={field.placeholder}
                                  value={formData[field.name as keyof typeof formData]}
                                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                                  className={`
                                    bg-white/10 border-white/20 text-white placeholder:text-white/50
                                    focus:border-blue-400 focus:ring-blue-400/20 min-h-[120px]
                                    ${hasError ? 'border-red-400 focus:border-red-400' : ''}
                                    ${isValid ? 'border-emerald-400' : ''}
                                  `}
                                  required={field.required}
                                />
                              ) : (
                                <Input
                                  id={field.name}
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  value={formData[field.name as keyof typeof formData]}
                                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                                  className={`
                                    bg-white/10 border-white/20 text-white placeholder:text-white/50
                                    focus:border-blue-400 focus:ring-blue-400/20
                                    ${hasError ? 'border-red-400 focus:border-red-400' : ''}
                                    ${isValid ? 'border-emerald-400 pr-10' : ''}
                                  `}
                                  required={field.required}
                                />
                              )}
                              
                              {isValid && field.name !== 'password' && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                              )}
                            </div>
                            
                            {hasError && (
                              <div className="flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {errors[field.name]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                );
              })}
              
              {/* Project Description */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <GlowIcon color="blue">
                    <FileText className="w-6 h-6" />
                  </GlowIcon>
                  <div>
                    <GradientText variant="primary" className="text-2xl font-bold">
                      Project Description
                    </GradientText>
                    <p className="text-white/80 mt-1">Tell us about your startup idea</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Describe Your Startup Idea
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Share your vision, target market, unique value proposition, and what problem you're solving..."
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 min-h-[150px]"
                  />
                </div>
              </GlassCard>
              
              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  type="button"
                  variant="glass"
                  size="lg"
                  className="px-8 py-3"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Draft
                </Button>
                
                <AnimatedBorder className="inline-block">
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="px-8 py-3 w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Create Account & Start Building
                      </>
                    )}
                  </Button>
                </AnimatedBorder>
              </div>
              
              {/* Terms and Privacy */}
              <div className="text-center text-sm text-white/60">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </a>
              </div>
            </form>
          </div>
        </Container>
      </GradientBackground>
    </MainLayout>
  );
}