'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Code,
  FileText,
  Video,
  Users,
  Search,
  Download,
  Clock,
  Star,
  ExternalLink,
  CheckCircle,
  Play,
  Book,
  Terminal,
  Smartphone,
  Settings,
  HelpCircle,
  Zap,
  Shield,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const docSections = [
    {
      icon: Code,
      title: 'API Reference',
      description: 'Complete API documentation and code examples',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileText,
      title: 'User Guides',
      description: 'Step-by-step guides for all features',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Visual learning with comprehensive video guides',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Users,
      title: 'Best Practices',
      description: 'Industry recommendations and optimization tips',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const quickLinks = [
    {
      title: 'Quick Start Guide',
      description: 'Get up and running in 5 minutes',
      time: '5 min read',
      icon: Zap,
      popular: true,
    },
    {
      title: 'API Authentication',
      description: 'Learn how to authenticate with our API',
      time: '8 min read',
      icon: Shield,
      popular: true,
    },
    {
      title: 'Mobile App Setup',
      description: 'Configure the mobile app for drivers',
      time: '12 min read',
      icon: Smartphone,
      popular: false,
    },
    {
      title: 'Dashboard Configuration',
      description: 'Customize your dashboard for maximum efficiency',
      time: '15 min read',
      icon: Settings,
      popular: true,
    },
  ];

  const documentationCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      articles: [
        'Quick Start Guide',
        'Account Setup',
        'Initial Configuration',
        'First Load Planning',
        'Team Onboarding',
      ],
    },
    {
      id: 'features',
      title: 'Core Features',
      icon: Zap,
      articles: [
        'Load Optimization',
        'Route Planning',
        'Real-time Tracking',
        'Document Management',
        'Team Collaboration',
      ],
    },
    {
      id: 'api',
      title: 'API Documentation',
      icon: Code,
      articles: [
        'Authentication',
        'REST API Reference',
        'Webhooks',
        'SDKs & Libraries',
        'Rate Limiting',
      ],
    },
    {
      id: 'mobile',
      title: 'Mobile Apps',
      icon: Smartphone,
      articles: [
        'Driver App Setup',
        'Dispatcher Mobile',
        'Offline Functionality',
        'Push Notifications',
        'GPS Configuration',
      ],
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Settings,
      articles: [
        'TMS Integration',
        'ERP Connectivity',
        'EDI Setup',
        'Third-party APIs',
        'Custom Webhooks',
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: HelpCircle,
      articles: [
        'Common Issues',
        'Error Codes',
        'Performance Optimization',
        'Data Recovery',
        'Contact Support',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-800/50 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              Complete Documentation
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Developer
              </span>
              <br />
              Documentation
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Everything you need to get started, integrate APIs, and master all
              features of Dispatchar. From quick setup guides to advanced
              integrations.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-700 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
              >
                Start Building
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#api-reference"
                className="group flex items-center px-8 py-4 rounded-xl border-2 border-gray-700 hover:border-indigo-500 transition-all duration-300 font-semibold text-gray-200 hover:text-indigo-400"
              >
                API Reference
                <ExternalLink className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {quickLinks.map((link, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                    <link.icon className="w-6 h-6 text-white" />
                  </div>
                  {link.popular && (
                    <div className="flex items-center px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                      <Star className="w-3 h-3 mr-1" />
                      <span className="text-xs font-medium">Popular</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                  {link.description}
                </p>
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {link.time}
                </div>
              </div>
            ))}
          </div>

          {/* Main Documentation Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {docSections.map((section, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${section.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-400 text-sm">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Documentation Browser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Browse{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Documentation
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our comprehensive documentation organized by category.
              Find exactly what you need quickly.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Category Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 sticky top-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Categories
                </h3>
                <nav className="space-y-2">
                  {documentationCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === category.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <category.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{category.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                {documentationCategories
                  .filter((category) => category.id === activeTab)
                  .map((category) => (
                    <div key={category.id} className="animate-fade-in-up">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {category.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {category.articles.length} articles available
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {category.articles.map((article, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer group"
                          >
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                              <span className="text-white font-medium group-hover:text-indigo-400 transition-colors">
                                {article}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-800/50">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600">
                            <Video className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white">
                            Video Tutorial Available
                          </h4>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                          Watch our comprehensive video guide for{' '}
                          {category.title.toLowerCase()}.
                        </p>
                        <button className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors">
                          <Play className="w-4 h-4 mr-2" />
                          Watch Tutorial
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Resources Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Developer{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Resources
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Additional tools and resources to help you build amazing
              integrations with Dispatchar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'SDK Downloads',
                description:
                  'Official SDKs for popular programming languages including Node.js, Python, PHP, and more.',
                icon: Download,
                color: 'from-blue-500 to-cyan-500',
                features: [
                  'Node.js SDK',
                  'Python Library',
                  'PHP Package',
                  'REST API Client',
                ],
              },
              {
                title: 'Code Examples',
                description:
                  'Ready-to-use code examples and sample implementations for common use cases.',
                icon: Code,
                color: 'from-green-500 to-emerald-500',
                features: [
                  'Authentication Examples',
                  'API Integration',
                  'Webhook Handlers',
                  'Error Handling',
                ],
              },
              {
                title: 'Testing Tools',
                description:
                  'Comprehensive testing tools including sandbox environment and API testing suite.',
                icon: Terminal,
                color: 'from-purple-500 to-indigo-500',
                features: [
                  'Sandbox API',
                  'Test Data Generator',
                  'API Explorer',
                  'Mock Responses',
                ],
              },
              {
                title: 'Community Forum',
                description:
                  'Connect with other developers, share solutions, and get help from our community.',
                icon: Users,
                color: 'from-orange-500 to-red-500',
                features: [
                  'Q&A Forums',
                  'Code Sharing',
                  'Best Practices',
                  'Community Examples',
                ],
              },
              {
                title: 'API Status & Updates',
                description:
                  'Real-time API status monitoring and notifications about updates and maintenance.',
                icon: Shield,
                color: 'from-indigo-500 to-purple-500',
                features: [
                  'Status Dashboard',
                  'Incident Reports',
                  'Maintenance Alerts',
                  'Performance Metrics',
                ],
              },
              {
                title: 'Migration Guides',
                description:
                  'Step-by-step guides for migrating from other platforms or upgrading API versions.',
                icon: Book,
                color: 'from-teal-500 to-cyan-500',
                features: [
                  'Platform Migration',
                  'Version Upgrades',
                  'Data Import Tools',
                  'Compatibility Guides',
                ],
              },
            ].map((resource, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${resource.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <resource.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {resource.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {resource.description}
                </p>
                <ul className="space-y-2 mb-4">
                  {resource.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="text-gray-400 text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors group">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need More{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Help?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Our support team is here to help you succeed. Get personalized
            assistance with implementation, troubleshooting, and optimization.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg mx-auto mb-4">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Live Chat Support
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get instant help from our technical support team
              </p>
              <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
                Start Chat
              </button>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Community Forum
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Connect with other developers and share knowledge
              </p>
              <button className="text-green-400 hover:text-green-300 font-medium text-sm">
                Join Community
              </button>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Training Sessions
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Schedule personalized training with our experts
              </p>
              <button className="text-purple-400 hover:text-purple-300 font-medium text-sm">
                Book Session
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
