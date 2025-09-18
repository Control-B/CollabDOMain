'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  ArrowLeft,
  CheckCircle,
  Clock,
  ExternalLink,
  Smartphone,
  Database,
  BarChart3,
  Truck,
  MessageSquare,
  MapPin,
  FileText,
  DollarSign,
} from 'lucide-react';

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const integrationCategories = [
    { id: 'all', name: 'All Integrations', count: 12 },
    { id: 'accounting', name: 'Accounting', count: 3 },
    { id: 'communication', name: 'Communication', count: 4 },
    { id: 'tracking', name: 'Tracking', count: 2 },
    { id: 'analytics', name: 'Analytics', count: 3 },
  ];

  const integrations = [
    {
      name: 'QuickBooks Online',
      category: 'accounting',
      description:
        'Seamlessly sync your fleet expenses and invoicing with QuickBooks Online',
      icon: DollarSign,
      status: 'available',
      features: [
        'Automatic expense tracking',
        'Invoice generation',
        'Financial reporting',
      ],
      comingSoon: false,
    },
    {
      name: 'Slack',
      category: 'communication',
      description:
        'Get real-time fleet notifications and updates directly in your Slack channels',
      icon: MessageSquare,
      status: 'available',
      features: [
        'Instant alerts',
        'Driver communication',
        'Team notifications',
      ],
      comingSoon: false,
    },
    {
      name: 'Microsoft Teams',
      category: 'communication',
      description:
        'Collaborate with your team and receive fleet updates in Microsoft Teams',
      icon: MessageSquare,
      status: 'coming-soon',
      features: ['Team collaboration', 'Voice integration', 'File sharing'],
      comingSoon: true,
    },
    {
      name: 'Google Analytics',
      category: 'analytics',
      description:
        'Track fleet performance metrics and analyze operational data',
      icon: BarChart3,
      status: 'available',
      features: ['Performance tracking', 'Custom dashboards', 'Data insights'],
      comingSoon: false,
    },
    {
      name: 'Salesforce',
      category: 'communication',
      description:
        'Connect your customer data with delivery and logistics operations',
      icon: Database,
      status: 'coming-soon',
      features: ['Customer sync', 'Order tracking', 'Lead management'],
      comingSoon: true,
    },
    {
      name: 'Garmin Fleet',
      category: 'tracking',
      description:
        'Enhanced GPS tracking and vehicle diagnostics through Garmin devices',
      icon: MapPin,
      status: 'coming-soon',
      features: ['Enhanced GPS', 'Vehicle diagnostics', 'Driver behavior'],
      comingSoon: true,
    },
    {
      name: 'Zapier',
      category: 'automation',
      description:
        'Connect Dispatchar with 5000+ apps through automated workflows',
      icon: Zap,
      status: 'coming-soon',
      features: [
        'Workflow automation',
        '5000+ app connections',
        'Custom triggers',
      ],
      comingSoon: true,
    },
    {
      name: 'DocuSign',
      category: 'documentation',
      description:
        'Digital signature integration for delivery confirmations and contracts',
      icon: FileText,
      status: 'coming-soon',
      features: [
        'Digital signatures',
        'Document workflows',
        'Legal compliance',
      ],
      comingSoon: true,
    },
    {
      name: 'WhatsApp Business',
      category: 'communication',
      description:
        'Send delivery updates and communicate with customers via WhatsApp',
      icon: Smartphone,
      status: 'coming-soon',
      features: ['Customer messaging', 'Delivery updates', 'Support chat'],
      comingSoon: true,
    },
    {
      name: 'Power BI',
      category: 'analytics',
      description:
        'Create advanced fleet analytics and business intelligence reports',
      icon: BarChart3,
      status: 'coming-soon',
      features: ['Advanced analytics', 'Custom reports', 'Data visualization'],
      comingSoon: true,
    },
    {
      name: 'SAP',
      category: 'accounting',
      description:
        'Enterprise resource planning integration for large fleet operations',
      icon: Database,
      status: 'coming-soon',
      features: ['ERP integration', 'Resource planning', 'Enterprise scale'],
      comingSoon: true,
    },
    {
      name: 'Tableau',
      category: 'analytics',
      description:
        'Advanced data visualization and fleet performance analytics',
      icon: BarChart3,
      status: 'coming-soon',
      features: [
        'Data visualization',
        'Performance analytics',
        'Interactive dashboards',
      ],
      comingSoon: true,
    },
  ];

  const filteredIntegrations =
    selectedCategory === 'all'
      ? integrations
      : integrations.filter(
          (integration) => integration.category === selectedCategory,
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-6">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Integrations</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect Dispatchar with your favorite tools and services. Streamline
            your workflow by integrating with the platforms you already use to
            manage your business.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">12+</div>
            <div className="text-gray-400">Available Integrations</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">3</div>
            <div className="text-gray-400">Currently Available</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">9</div>
            <div className="text-gray-400">Coming Soon</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-12">
          {integrationCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredIntegrations.map((integration, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mr-4">
                    <integration.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {integration.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        integration.status === 'available'
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-yellow-600/20 text-yellow-400'
                      }`}
                    >
                      {integration.status === 'available' && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {integration.status === 'coming-soon' && (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {integration.status === 'available'
                        ? 'Available'
                        : 'Coming Soon'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 mb-4">{integration.description}</p>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-300">
                  Key Features:
                </div>
                <ul className="space-y-1">
                  {integration.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="text-sm text-gray-400 flex items-center"
                    >
                      <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {integration.comingSoon && (
                <div className="mt-4 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    This integration is currently in development. Join our early
                    access program to be notified when it's ready.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Request Integration */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 p-8 mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Don't See Your Tool?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We're constantly adding new integrations based on customer
              feedback. Let us know which tools you'd like to see integrated
              with Dispatchar.
            </p>
            <Link
              href="/company/contact-us"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
            >
              Request Integration
              <ExternalLink className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* API Information */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Build Custom Integrations</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Need a custom integration? Use our API to build your own connections
            with any system or service.
          </p>
          <Link
            href="/api-documentation"
            className="inline-flex items-center px-8 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold border border-gray-600"
          >
            Explore API Documentation
            <ExternalLink className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
