'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout, Container, Section, PageHeader, Navigation } from '@/components/layout/main-layout';
import {
  GradientBackground,
  FloatingElements,
  GlassCard,
  GradientText,
  AnimatedBorder,
  GlowIcon
} from '@/components/design-system';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  Share,
  Filter,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  LineChart,
  Zap,
  Star,
  Award,
  Briefcase
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', active: false },
    { label: 'Projects', href: '/projects', active: false },
    { label: 'Report and Analytics', href: '/reports', active: true }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$124,500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: '8,429',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'red'
    },
    {
      title: 'Growth Rate',
      value: '24.8%',
      change: '+5.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue'
    }
  ];

  const reports = [
    {
      title: 'Market Analysis Report',
      description: 'Comprehensive analysis of your target market and competitive landscape',
      status: 'completed',
      date: '2024-01-15',
      type: 'Market Research',
      icon: BarChart3,
      metrics: {
        marketSize: '$2.4B',
        competitors: 12,
        opportunities: 8
      }
    },
    {
      title: 'Financial Projections',
      description: 'Detailed financial forecasts and revenue projections for the next 3 years',
      status: 'completed',
      date: '2024-01-14',
      type: 'Financial',
      icon: DollarSign,
      metrics: {
        projectedRevenue: '$1.2M',
        breakEven: '18 months',
        roi: '340%'
      }
    },
    {
      title: 'User Acquisition Strategy',
      description: 'Strategic plan for customer acquisition and retention',
      status: 'in-progress',
      date: '2024-01-16',
      type: 'Marketing',
      icon: Users,
      metrics: {
        targetUsers: '10K',
        channels: 6,
        budget: '$50K'
      }
    },
    {
      title: 'Product Roadmap',
      description: 'Development timeline and feature prioritization',
      status: 'pending',
      date: '2024-01-18',
      type: 'Product',
      icon: Activity,
      metrics: {
        features: 24,
        sprints: 8,
        timeline: '6 months'
      }
    }
  ];

  const chartData = [
    { month: 'Jan', revenue: 45000, users: 1200, conversion: 2.8 },
    { month: 'Feb', revenue: 52000, users: 1450, conversion: 3.1 },
    { month: 'Mar', revenue: 48000, users: 1380, conversion: 2.9 },
    { month: 'Apr', revenue: 61000, users: 1650, conversion: 3.4 },
    { month: 'May', revenue: 55000, users: 1520, conversion: 3.0 },
    { month: 'Jun', revenue: 67000, users: 1820, conversion: 3.6 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'in-progress': return 'text-blue-400';
      case 'pending': return 'text-slate-400';
      default: return 'text-white';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${colors[status as keyof typeof colors]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <PageLayout 
      title="Analytics & Reports"
      headerActions={<Navigation items={navigationItems} />}
    >
      <Container>
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Analytics & <span className="text-blue-600">Reports</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive insights and data-driven reports for your startup
            </p>
          </div>
        </div>
          
          {/* Action Bar */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:ring-blue-400/20"
              >
                <option value="7d" className="bg-gray-800">Last 7 days</option>
                <option value="30d" className="bg-gray-800">Last 30 days</option>
                <option value="90d" className="bg-gray-800">Last 90 days</option>
                <option value="1y" className="bg-gray-800">Last year</option>
              </select>
              
              <Button
                variant="glass"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="glass" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="glass" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="gradient" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                const isPositive = metric.trend === 'up';
                
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-gray-600 text-sm font-medium">{metric.title}</span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-gray-900">
                              {metric.value}
                            </div>
                            
                            <div className={`flex items-center gap-1 text-sm ${
                              isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isPositive ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                              {metric.change}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="mt-12">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <Card>
                <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <LineChart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Revenue Trend
                        </h3>
                        <p className="text-gray-600 text-sm">Monthly revenue growth</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                
                {/* Simulated Chart */}
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                  {chartData.map((data, index) => {
                    const height = (data.revenue / 70000) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-1000 hover:from-blue-400 hover:to-blue-500"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-gray-600 text-xs">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
                </CardContent>
              </Card>
              
              {/* User Growth Chart */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <PieChart className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          User Acquisition
                        </h3>
                        <p className="text-gray-600 text-sm">Channel performance</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Simulated Pie Chart */}
                  <div className="flex items-center justify-center h-64">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-gray-500 opacity-80" />
                      <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            8,429
                          </div>
                          <p className="text-gray-600 text-sm">Total Users</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Reports List */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Generated Reports
              </h2>
            </div>
            
            <div className="grid gap-6">
              {reports.map((report, index) => {
                const Icon = report.icon;
                
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-lg ${
                            index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              index % 2 === 0 ? 'text-blue-600' : 'text-green-600'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {report.title}
                              </h3>
                              {getStatusBadge(report.status)}
                            </div>
                            
                            <p className="text-gray-600 mb-4">{report.description}</p>
                          
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(report.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                {report.type}
                              </div>
                            </div>
                            
                            {/* Report Metrics */}
                            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                              {Object.entries(report.metrics).map(([key, value], metricIndex) => (
                                <div key={metricIndex} className="text-center">
                                  <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </div>
                                  <div className="text-gray-900 font-semibold">{value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Generate New Report */}
            <div className="mt-8 text-center">
              <Button size="lg" className="px-8 py-3">
                <Zap className="w-5 h-5 mr-2" />
                Generate New Report
              </Button>
            </div>
          </div>
        </Container>
    </PageLayout>
  );
}