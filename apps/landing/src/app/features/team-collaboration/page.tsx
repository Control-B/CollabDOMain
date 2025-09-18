'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ArrowLeft,
  MessageSquare,
  Share2,
  Bell,
  Clock,
  Camera,
  FileText,
  ArrowRight,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Globe,
  Layers,
  DollarSign,
  Smartphone,
  Video,
  Headphones,
  Settings,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function TeamCollaborationPage() {
  const [activeTab, setActiveTab] = useState(0);

  const collaborationFeatures = [
    {
      title: 'Real-time Messaging',
      description:
        'Instant communication between drivers, dispatchers, and office staff',
      icon: MessageSquare,
      color: 'from-orange-500 to-pink-500',
      details: [
        'Group channels by route or team',
        'Direct messaging capabilities',
        'Read receipts and delivery status',
        'Offline message synchronization',
      ],
    },
    {
      title: 'File Sharing',
      description: 'Share documents, photos, and important files instantly',
      icon: Share2,
      color: 'from-blue-500 to-cyan-500',
      details: [
        'Drag-and-drop file uploads',
        'Photo sharing from mobile',
        'Document version control',
        'Cloud storage integration',
      ],
    },
    {
      title: 'Smart Notifications',
      description:
        'Intelligent alerts that keep everyone informed without overwhelming',
      icon: Bell,
      color: 'from-purple-500 to-indigo-500',
      details: [
        'Priority-based notifications',
        'Custom alert preferences',
        'Location-based updates',
        'Emergency broadcast system',
      ],
    },
  ];

  const stats = [
    {
      number: '87%',
      label: 'Faster Response Times',
      description:
        'Teams respond to issues 87% faster with real-time communication',
      icon: Clock,
      color: 'from-green-500 to-emerald-500',
    },
    {
      number: '65%',
      label: 'Reduced Phone Calls',
      description:
        'Significant reduction in disruptive phone calls during driving',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '92%',
      label: 'Driver Satisfaction',
      description: 'Drivers love staying connected without safety concerns',
      icon: Users,
      color: 'from-orange-500 to-red-500',
    },
    {
      number: '99.8%',
      label: 'Message Delivery',
      description: 'Reliable message delivery even in poor network conditions',
      icon: Share2,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-900/30 text-orange-300 border border-orange-800/50 text-sm font-medium mb-6">
                <Users className="w-4 h-4 mr-2" />
                Connected Teams Work Better
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Team Collaboration
                </span>
                <br />
                That Actually Works
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Keep your entire team connected with real-time messaging, file
                sharing, and smart notifications designed specifically for
                trucking operations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-orange-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  Start Collaborating
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Collaboration Preview */}
            <div className="relative animate-fade-in-up animate-delay-200">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Team Chat
                  </h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      M
                    </div>
                    <div className="flex-1 bg-gray-700/50 rounded-lg p-3">
                      <p className="text-sm text-white">
                        Route 95 clear, ETA 2:30 PM
                      </p>
                      <span className="text-xs text-gray-400">
                        Mike • Driver • 2m ago
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      S
                    </div>
                    <div className="flex-1 bg-gray-700/50 rounded-lg p-3">
                      <p className="text-sm text-white">
                        Great! Customer notified ✓
                      </p>
                      <span className="text-xs text-gray-400">
                        Sarah • Dispatch • 1m ago
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      T
                    </div>
                    <div className="flex-1 bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Camera className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-white">
                          Delivery confirmation
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        Tom • Driver • 30s ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Communication Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything your team needs to stay connected and productive
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {collaborationFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveTab(index)}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="flex items-start space-x-2"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color} mt-2 flex-shrink-0`}
                      />
                      <span className="text-sm text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Proven Results
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how team collaboration improves operations across the board
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-r ${stat.color} shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div
                  className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-900/30 to-pink-900/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Connect Your Team?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of trucking companies using our collaboration tools
            to improve efficiency
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-orange-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/#contact"
              className="bg-gray-800 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold border border-gray-600"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Communication Challenges Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Breaking Down{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Communication
              </span>{' '}
              Barriers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Traditional trucking communication relies on phone calls, text
              messages, and paperwork, creating inefficiencies and missed
              opportunities. Our platform eliminates these barriers.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Current Challenges */}
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Traditional Communication Problems
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: MessageSquare,
                    title: 'Fragmented Communication',
                    description:
                      'Information scattered across phone calls, texts, emails, and paper documents',
                    impact: '40% information loss',
                    severity: 'high',
                  },
                  {
                    icon: Clock,
                    title: 'Delayed Updates',
                    description:
                      'Critical information delayed by hours due to manual communication processes',
                    impact: '2-4 hour delays',
                    severity: 'high',
                  },
                  {
                    icon: FileText,
                    title: 'Documentation Gaps',
                    description:
                      'Important details lost in verbal communication without proper documentation',
                    impact: '25% missing records',
                    severity: 'medium',
                  },
                  {
                    icon: Users,
                    title: 'Limited Collaboration',
                    description:
                      'Difficulty coordinating between drivers, dispatch, and office teams',
                    impact: '30% efficiency loss',
                    severity: 'high',
                  },
                ].map((challenge, index) => (
                  <div
                    key={index}
                    className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <challenge.icon className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {challenge.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          {challenge.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-red-400 text-xs font-medium">
                            {challenge.impact}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              challenge.severity === 'high'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-orange-500/20 text-orange-400'
                            }`}
                          >
                            {challenge.severity} impact
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Solutions */}
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Dispatchar's Collaboration Solutions
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: MessageSquare,
                    title: 'Unified Communication Hub',
                    description:
                      'All team communication in one platform with organized channels and threads',
                    impact: '100% information retention',
                    improvement: 'unified',
                  },
                  {
                    icon: Zap,
                    title: 'Instant Real-time Updates',
                    description:
                      'Immediate notifications and status updates across all team members',
                    impact: 'Real-time sync',
                    improvement: 'instant',
                  },
                  {
                    icon: FileText,
                    title: 'Automatic Documentation',
                    description:
                      'All communications automatically logged with searchable history',
                    impact: 'Zero missing records',
                    improvement: 'automated',
                  },
                  {
                    icon: Users,
                    title: 'Enhanced Team Coordination',
                    description:
                      'Seamless collaboration tools designed specifically for logistics teams',
                    impact: '50% efficiency gain',
                    improvement: 'optimized',
                  },
                ].map((solution, index) => (
                  <div
                    key={index}
                    className="bg-orange-900/20 border border-orange-800/50 rounded-lg p-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <solution.icon className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {solution.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          {solution.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-400 text-xs font-medium">
                            {solution.impact}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
                            {solution.improvement}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Collaboration Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Advanced{' '}
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Collaboration
              </span>{' '}
              Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Go beyond basic messaging with intelligent collaboration tools
              designed for the complexities of modern logistics operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Video,
                title: 'Video Communication',
                description:
                  'HD video calls and screen sharing for complex issue resolution and remote assistance.',
                features: [
                  'HD video quality',
                  'Screen sharing',
                  'Group video calls',
                  'Recording capability',
                ],
              },
              {
                icon: Layers,
                title: 'Smart Channel Organization',
                description:
                  'AI-powered channel suggestions and automatic message routing based on content and urgency.',
                features: [
                  'Auto-categorization',
                  'Priority routing',
                  'Smart notifications',
                  'Channel templates',
                ],
              },
              {
                icon: Target,
                title: 'Task Management Integration',
                description:
                  'Convert conversations into actionable tasks with deadlines, assignments, and progress tracking.',
                features: [
                  'Task creation',
                  'Deadline tracking',
                  'Progress updates',
                  'Completion analytics',
                ],
              },
              {
                icon: Globe,
                title: 'Multi-Language Support',
                description:
                  'Real-time translation and language support for diverse, international logistics teams.',
                features: [
                  '50+ languages',
                  'Real-time translation',
                  'Voice translation',
                  'Cultural adaptation',
                ],
              },
              {
                icon: BarChart3,
                title: 'Communication Analytics',
                description:
                  'Detailed insights into team communication patterns, response times, and collaboration effectiveness.',
                features: [
                  'Response time tracking',
                  'Engagement metrics',
                  'Team performance',
                  'Trend analysis',
                ],
              },
              {
                icon: Settings,
                title: 'Custom Workflows',
                description:
                  'Create automated communication workflows for common scenarios and processes.',
                features: [
                  'Workflow automation',
                  'Custom triggers',
                  'Escalation rules',
                  'Template library',
                ],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      <span className="text-gray-400 text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Performance & ROI Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Measurable{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Team Performance
              </span>{' '}
              Improvements
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Track the impact of improved collaboration on your team's
              performance with detailed analytics and ROI metrics.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  Performance Metrics
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      metric: '67%',
                      label: 'Faster issue resolution',
                      icon: Zap,
                      color: 'from-yellow-500 to-orange-500',
                    },
                    {
                      metric: '45%',
                      label: 'Reduction in miscommunication',
                      icon: MessageSquare,
                      color: 'from-blue-500 to-cyan-500',
                    },
                    {
                      metric: '89%',
                      label: 'Improvement in team satisfaction',
                      icon: Users,
                      color: 'from-green-500 to-emerald-500',
                    },
                    {
                      metric: '52%',
                      label: 'Increase in operational efficiency',
                      icon: TrendingUp,
                      color: 'from-purple-500 to-indigo-500',
                    },
                  ].map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}
                        >
                          {metric.metric}
                        </div>
                        <p className="text-gray-300 text-sm">{metric.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  Cost Savings Breakdown
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      category: 'Reduced Phone Calls',
                      savings: '$2,400/year',
                      description: '75% reduction in billable phone time',
                    },
                    {
                      category: 'Faster Problem Resolution',
                      savings: '$8,200/year',
                      description: 'Average 2.5 hours saved per incident',
                    },
                    {
                      category: 'Improved Coordination',
                      savings: '$12,500/year',
                      description: 'Eliminated duplicate efforts and delays',
                    },
                    {
                      category: 'Enhanced Productivity',
                      savings: '$15,800/year',
                      description: 'Better team efficiency and workflow',
                    },
                  ].map((saving, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">
                          {saving.category}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          {saving.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          {saving.savings}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      Total Annual Savings
                    </span>
                    <span className="text-2xl font-bold text-green-400">
                      $38,900
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  Implementation Success Timeline
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      week: 'Week 1',
                      milestone: 'Team Onboarding',
                      description: 'User training and initial setup',
                      completion: 100,
                    },
                    {
                      week: 'Week 2',
                      milestone: 'Channel Organization',
                      description: 'Create team channels and workflows',
                      completion: 100,
                    },
                    {
                      week: 'Week 3-4',
                      milestone: 'Process Integration',
                      description:
                        'Integrate with existing tools and processes',
                      completion: 100,
                    },
                    {
                      week: 'Week 5+',
                      milestone: 'Optimization',
                      description:
                        'Continuous improvement and feature adoption',
                      completion: 85,
                    },
                  ].map((phase, index) => (
                    <div
                      key={index}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-medium text-orange-400">
                            {phase.week}
                          </span>
                          <span className="font-semibold text-white text-sm">
                            {phase.milestone}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {phase.completion}%
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs mb-2">
                        {phase.description}
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${phase.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">
                  Ready to Transform Your Team?
                </h4>
                <p className="text-orange-100 mb-4 text-sm">
                  See how better collaboration impacts your bottom line
                </p>
                <Link
                  href="/auth/signup"
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center text-sm"
                >
                  Start Collaborating Better
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
