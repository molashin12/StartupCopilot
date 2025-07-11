import { Timestamp } from 'firebase/firestore';

// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  subscription: {
    status: 'active' | 'inactive' | 'cancelled' | 'past_due';
    currentPeriodEnd: Timestamp;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  usage: {
    projectsCreated: number;
    reportsGenerated: number;
    aiQueriesUsed: number;
    lastResetDate: Timestamp;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}

// Project Types
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  industry: string;
  stage: 'idea' | 'validation' | 'development' | 'launch' | 'growth';
  businessModel: string;
  targetMarket: string;
  status: 'active' | 'completed' | 'archived';
  metadata: {
    tags: string[];
    category: string;
    priority: 'low' | 'medium' | 'high';
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Report Types
export interface Report {
  id: string;
  projectId: string;
  type: 'business_plan' | 'market_analysis' | 'financial_projection' | 'swot_analysis' | 'risk_assessment';
  title: string;
  content: {
    sections: ReportSection[];
    summary: string;
    recommendations: string[];
  };
  status: 'generating' | 'completed' | 'failed';
  generatedAt: Timestamp;
  version: number;
  aiModel: string;
  processingTime: number;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'chart' | 'table' | 'list';
  data?: any;
}

// Analysis Types
export interface Analysis {
  id: string;
  projectId: string;
  type: 'idea_validation' | 'competitor_research' | 'market_sizing' | 'swot' | 'risk_assessment';
  input: {
    businessIdea: string;
    targetMarket?: string;
    competitors?: string[];
    additionalContext?: string;
  };
  output: {
    score: number;
    insights: string[];
    recommendations: string[];
    data: any;
  };
  status: 'processing' | 'completed' | 'failed';
  createdAt: Timestamp;
  completedAt?: Timestamp;
  aiModel: string;
}

// AI Types
export interface AIRequest {
  type: 'idea_analysis' | 'competitor_research' | 'financial_projection' | 'swot_analysis' | 'risk_assessment' | 'chat';
  input: any;
  context?: {
    projectId?: string;
    previousAnalyses?: string[];
    userPreferences?: any;
  };
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage: {
    tokensUsed: number;
    processingTime: number;
    model: string;
  };
}

// UI Types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

// Form Types
export interface ProjectFormData {
  name: string;
  description: string;
  industry: string;
  stage: Project['stage'];
  businessModel: string;
  targetMarket: string;
  tags: string[];
}

export interface BusinessIdeaFormData {
  idea: string;
  targetMarket: string;
  problemSolving: string;
  uniqueValue: string;
  businessModel: string;
  competitors: string[];
}

// Export Types
export interface ExportRequest {
  projectId: string;
  reportIds: string[];
  format: 'pdf' | 'docx' | 'pptx';
  template: string;
  customization: {
    includeCover: boolean;
    includeCharts: boolean;
    includeRecommendations: boolean;
    branding?: {
      logo?: string;
      colors?: string[];
      companyName?: string;
    };
  };
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    projects: number;
    reports: number;
    aiQueries: number;
    exports: number;
  };
}

// Analytics Types
export interface AnalyticsEvent {
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Timestamp;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}