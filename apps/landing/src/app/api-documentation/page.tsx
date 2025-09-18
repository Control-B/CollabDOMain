'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Code,
  FileText,
  Key,
  Globe,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Zap,
  Shield,
} from 'lucide-react';

export default function APIDocumentationPage() {
  const [activeTab, setActiveTab] = useState('getting-started');

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/vehicles',
      description: 'Retrieve all vehicles in your fleet',
      status: 'Available',
    },
    {
      method: 'POST',
      endpoint: '/api/v1/vehicles',
      description: 'Add a new vehicle to your fleet',
      status: 'Available',
    },
    {
      method: 'GET',
      endpoint: '/api/v1/tracking/{vehicle_id}',
      description: 'Get real-time location data for a specific vehicle',
      status: 'Available',
    },
    {
      method: 'POST',
      endpoint: '/api/v1/geofences',
      description: 'Create custom geofence boundaries',
      status: 'Coming Soon',
    },
    {
      method: 'GET',
      endpoint: '/api/v1/documents',
      description: 'Access digital documents and signatures',
      status: 'Coming Soon',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'RESTful API',
      description: 'Modern REST API with predictable, resource-oriented URLs',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'API key and OAuth 2.0 authentication methods',
    },
    {
      icon: FileText,
      title: 'Comprehensive Docs',
      description: 'Detailed documentation with code examples',
    },
    {
      icon: Globe,
      title: 'Webhooks Support',
      description: 'Real-time notifications for important events',
    },
  ];

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
            <Code className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Integrate Dispatchar's powerful fleet management capabilities into
            your existing systems with our comprehensive API. Build custom
            solutions and automate your logistics operations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* API Status */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 p-8 mb-16">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                API Development Status
              </h2>
              <p className="text-gray-400">
                Our API is currently in active development. Core endpoints are
                available for early access partners.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-400 mb-1">Beta</div>
              <div className="text-sm text-gray-400">
                Current Version: v1.0-beta
              </div>
            </div>
          </div>
        </div>

        {/* Available Endpoints */}
        <div className="bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden mb-16">
          <div className="p-8 border-b border-gray-700">
            <h2 className="text-2xl font-bold mb-2">Available Endpoints</h2>
            <p className="text-gray-400">
              Explore our current and upcoming API endpoints for fleet
              management
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Method</th>
                  <th className="text-left p-4 font-semibold">Endpoint</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {apiEndpoints.map((endpoint, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          endpoint.method === 'GET'
                            ? 'bg-green-600/20 text-green-400'
                            : endpoint.method === 'POST'
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'bg-orange-600/20 text-orange-400'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-300">
                      {endpoint.endpoint}
                    </td>
                    <td className="p-4 text-gray-400">
                      {endpoint.description}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          endpoint.status === 'Available'
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-yellow-600/20 text-yellow-400'
                        }`}
                      >
                        {endpoint.status === 'Available' && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {endpoint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Getting Started */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <Key className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold">Authentication</h3>
            </div>
            <p className="text-gray-400 mb-4">
              All API requests require authentication using API keys. Contact
              our team to get your API credentials.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <div className="text-gray-500"># Example API call</div>
              <div className="text-green-400">
                curl -H "Authorization: Bearer YOUR_API_KEY"
              </div>
              <div className="text-blue-400">
                https://api.dispatchar.com/v1/vehicles
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold">Rate Limits</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Our API implements rate limiting to ensure fair usage and optimal
              performance for all users.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Standard Plan:</span>
                <span className="text-white">1,000 requests/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pro Plan:</span>
                <span className="text-white">5,000 requests/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Enterprise:</span>
                <span className="text-white">Custom limits</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our early access program to get API credentials and start
            integrating Dispatchar into your applications today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/company/contact-us"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
            >
              Request API Access
              <ExternalLink className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/resources/documentation"
              className="inline-flex items-center px-8 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold border border-gray-600"
            >
              View Documentation
              <FileText className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
