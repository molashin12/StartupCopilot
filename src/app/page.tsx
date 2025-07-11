'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout, Container, Section } from '@/components/layout/main-layout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  GradientBackground,
  FloatingElements,
  GlassCard,
  GradientText,
  AnimatedBorder,
  GlowIcon
} from '@/components/design-system';
import { 
  Lightbulb, 
  TrendingUp, 
  FileText, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight, 
  Star, 
  CheckCircle,
  Sparkles,
  Rocket,
  Target,
  BarChart3,
  Brain,
  Globe
} from 'lucide-react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your business idea and provide instant viability scores with market insights.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Market Intelligence",
      description: "Deep competitor analysis and market sizing with actionable recommendations for success.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "Smart Documents",
      description: "Generate professional business plans, financial projections, and investor-ready pitch decks.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Identify potential risks early and get strategic mitigation plans to protect your venture.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Rocket,
      title: "Growth Strategy",
      description: "Personalized roadmaps and growth strategies tailored to your industry and market.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: BarChart3,
      title: "Performance Tracking",
      description: "Monitor your startup's progress with real-time analytics and performance metrics.",
      gradient: "from-teal-500 to-blue-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Startups Launched" },
    { number: "$2.5B+", label: "Funding Raised" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <MainLayout>
      <GradientBackground variant="primary" className="min-h-screen">
        <FloatingElements />

        {/* Navigation */}
        <nav className="relative z-50 border-b border-white/20 bg-white/10 backdrop-blur-xl">
          <Container>
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center">
                  <GlowIcon color="purple">
                    <Sparkles className="w-5 h-5" />
                  </GlowIcon>
                </div>
                <GradientText variant="primary" className="text-xl font-bold">
                  StartupCopilot
                </GradientText>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
                <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
                {!loading && (
                  user ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-white/90 text-sm">
                        Welcome, {user.displayName || user.email}
                      </span>
                      <Button 
                        variant="glass" 
                        size="sm" 
                        onClick={() => logout()}
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Link href="/auth">
                        <Button variant="glass" size="sm">Sign In</Button>
                      </Link>
                      <Link href="/auth">
                        <Button variant="gradient" size="sm">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </Container>
        </nav>

        {/* Hero Section */}
        <Section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <Container>
            <div className={`text-center space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Floating Badge */}
              <AnimatedBorder className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-center mr-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-white drop-shadow-sm">Trusted by 10,000+ entrepreneurs worldwide</span>
              </AnimatedBorder>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <span className="block text-white animate-fade-in">
                    Transform Ideas
                  </span>
                  <GradientText variant="primary" className="block animate-slide-up">
                    Into Startups
                  </GradientText>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed animate-fade-in drop-shadow-sm">
                  The most advanced AI-powered platform for entrepreneurs. Generate comprehensive business plans, 
                  analyze markets, and get expert guidance to turn your vision into a thriving business.
                </p>
              </div>
            
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
                {user ? (
                  <>
                    <Button 
                      variant="gradient"
                      size="lg" 
                      className="text-lg px-10 py-6 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      Go to Dashboard
                      <Rocket className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      variant="glass" 
                      size="lg" 
                      className="text-lg px-10 py-6 transform hover:scale-105 transition-all duration-300"
                    >
                      Watch Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth">
                      <Button 
                        variant="gradient"
                        size="lg" 
                        className="text-lg px-10 py-6 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                      >
                        Start Building Free
                        <Rocket className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Button 
                      variant="glass" 
                      size="lg" 
                      className="text-lg px-10 py-6 transform hover:scale-105 transition-all duration-300"
                    >
                      Watch Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/90 animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 drop-shadow-sm" />
                  <span className="drop-shadow-sm">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 drop-shadow-sm" />
                  <span className="drop-shadow-sm">Free Forever Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 drop-shadow-sm" />
                  <span className="drop-shadow-sm">Setup in 2 Minutes</span>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Stats Section */}
        <Section className="relative">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <AnimatedBorder 
                  key={index} 
                  className="text-center group p-6"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {stat.number}
                  </div>
                  <div className="text-white/90 mt-2 drop-shadow-sm font-medium">{stat.label}</div>
                </AnimatedBorder>
              ))}
            </div>
          </Container>
        </Section>

        {/* Features Section */}
        <Section id="features" className="relative">
          <Container>
            <div className="text-center mb-20">
              <AnimatedBorder className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <div className="flex items-center justify-center mr-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm font-medium text-white drop-shadow-sm">Powerful Features</span>
              </AnimatedBorder>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-sm">
                Everything You Need to
                <GradientText variant="primary" className="block drop-shadow-lg">
                  Launch Successfully
                </GradientText>
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-sm">
                Comprehensive AI-powered tools designed to transform your startup idea into a thriving business
              </p>
            </div>
          
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <GlassCard 
                    key={index}
                    className="group relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2"
                  >
                    <CardHeader className="relative text-center">
                      <div className="flex justify-center mb-6">
                        <GlowIcon color={index % 2 === 0 ? 'purple' : 'pink'} className="p-4">
                          <Icon className="h-12 w-12" />
                        </GlowIcon>
                      </div>
                      <CardTitle className="text-xl mb-3 text-white group-hover:text-purple-200 transition-colors duration-300 drop-shadow-sm">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-white/90 drop-shadow-sm">
                    {feature.description}
                  </CardDescription>
                    </CardHeader>
                  </GlassCard>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* CTA Section */}
        <Section className="relative overflow-hidden">
          <Container>
            <div className="relative text-center space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-sm">
                  Ready to Build Your
                  <GradientText variant="primary" className="block drop-shadow-lg">
                    Dream Startup?
                  </GradientText>
                </h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                  Join thousands of successful entrepreneurs who transformed their ideas into thriving businesses with StartupCopilot. 
                  Start your journey today with our free plan.
                </p>
              </div>
            
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {user ? (
                  <>
                    <Button 
                      variant="gradient"
                      size="lg" 
                      className="text-lg px-12 py-6 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      Go to Dashboard
                      <Rocket className="ml-2 h-6 w-6" />
                    </Button>
                    <Button 
                      variant="glass" 
                      size="lg" 
                      className="text-lg px-12 py-6"
                    >
                      Schedule Demo
                      <Globe className="ml-2 h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth">
                      <Button 
                        variant="gradient"
                        size="lg" 
                        className="text-lg px-12 py-6 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                      >
                        Start Building Now
                        <Rocket className="ml-2 h-6 w-6" />
                      </Button>
                    </Link>
                    <Button 
                      variant="glass" 
                      size="lg" 
                      className="text-lg px-12 py-6"
                    >
                      Schedule Demo
                      <Globe className="ml-2 h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
                <span className="drop-shadow-sm">✨ Start with our free plan</span>
                <span className="drop-shadow-sm">🚀 No setup required</span>
                <span className="drop-shadow-sm">💳 No credit card needed</span>
                <span className="drop-shadow-sm">⚡ Launch in minutes</span>
              </div>
            </div>
          </Container>
        </Section>

        {/* Footer */}
        <footer className="relative border-t border-white/20 bg-white/10 backdrop-blur-xl">
          <Container>
            <div className="py-12">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <div className="flex items-center justify-center">
                    <GlowIcon color="purple">
                      <Sparkles className="w-5 h-5" />
                    </GlowIcon>
                  </div>
                  <GradientText variant="primary" className="text-xl font-bold">
                    StartupCopilot
                  </GradientText>
                </div>
                <div className="text-sm text-white/90 drop-shadow-sm">
                  © 2024 StartupCopilot. All rights reserved.
                </div>
              </div>
            </div>
          </Container>
        </footer>
      </GradientBackground>
    </MainLayout>
  );
}
