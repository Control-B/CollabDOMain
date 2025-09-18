'use client';

import Link from 'next/link';
import {
  Smartphone,
  ArrowRight,
  Wifi,
  Download,
  RefreshCw,
  Bell,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function MobileFirstPage() {
  const mobileFeatures = [
    {
      icon: Wifi,
      title: 'Offline Capability',
      description: 'Works without internet connection',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Download,
      title: 'Native Apps',
      description: 'iOS and Android optimized apps',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: RefreshCw,
      title: 'Auto Sync',
      description: 'Automatic data synchronization',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Instant alerts and updates',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-800/50 text-sm font-medium mb-6">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Optimized
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Mobile First
                </span>
                <br />
                Design
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Access everything from your smartphone or tablet. Works offline
                and syncs automatically when connected. Built for drivers and
                dispatchers on the go.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  Download App
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Mobile App Interface Visualization */}
            <div className="relative animate-fade-in-up animate-delay-200">
              <div
                className="relative mx-auto"
                style={{ width: '280px', height: '580px' }}
              >
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gray-800 rounded-[3rem] p-2 shadow-2xl border-2 border-gray-700">
                  <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="h-8 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-between px-6 text-xs text-white">
                      <span>9:41 AM</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        <div className="w-4 h-2 border border-white rounded-sm">
                          <div className="w-3 h-1 bg-green-400 rounded-sm animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Interface */}
                    <div className="p-4 h-full bg-gradient-to-br from-gray-900 to-gray-950">
                      {/* Animated Mobile Interface */}
                      {/* Simple Mobile Interface */}
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-3">
                          <h3 className="text-white font-bold text-sm">
                            Dispatchar Driver
                          </h3>
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-blue-500/20 border border-blue-500/30 rounded p-2">
                            <p className="text-cyan-400 text-xs font-semibold">
                              Current Load
                            </p>
                            <p className="text-gray-300 text-xs">
                              Route 95 North
                            </p>
                            <p className="text-gray-400 text-xs">
                              ETA: 2:30 PM
                            </p>
                          </div>
                          <div className="bg-green-500/20 border border-green-500/30 rounded p-2">
                            <p className="text-green-400 text-xs font-semibold">
                              Messages
                            </p>
                            <p className="text-gray-300 text-xs">3 new</p>
                          </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-300 text-xs">
                              Online
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-300 text-xs">
                              GPS Active
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-300 text-xs">
                              Sync Complete
                            </span>
                          </div>
                        </div>

                        {/* Map Area */}
                        <div className="bg-gray-700/50 rounded p-4 h-20 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            Interactive Map
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button className="bg-cyan-600 text-white rounded py-2 text-xs font-medium">
                            Check In
                          </button>
                          <button className="bg-green-600 text-white rounded py-2 text-xs font-medium">
                            Message
                          </button>
                          <button className="bg-purple-600 text-white rounded py-2 text-xs font-medium">
                            Sync
                          </button>
                        </div>

                        {/* Offline Indicator */}
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-2">
                          <span className="text-yellow-400 text-xs">
                            Offline Ready
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center animate-bounce">
                  <Wifi className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                  <Download className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mobileFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile vs Desktop Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Mobile-First{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Changes Everything
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Traditional logistics software was built for desktops. We built
              for mobile from day one.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Traditional Approach */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-800/30">
                <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-red-400 text-lg">✗</span>
                  </div>
                  Traditional Approach
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Desktop-Only Software',
                      description:
                        'Requires drivers to return to office for updates',
                      impact: 'Lost productivity',
                    },
                    {
                      title: 'Paper-Based Processes',
                      description:
                        'Physical documents that can be lost or damaged',
                      impact: 'Compliance risks',
                    },
                    {
                      title: 'Delayed Communication',
                      description:
                        'Updates only when drivers check in manually',
                      impact: 'Poor visibility',
                    },
                    {
                      title: 'Limited Accessibility',
                      description: 'Can only access from specific locations',
                      impact: 'Operational delays',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-red-900/10 rounded-lg p-4 border-l-4 border-red-500"
                    >
                      <h4 className="font-semibold text-red-300 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-300 text-sm mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center">
                        <span className="text-red-400 text-xs font-medium bg-red-900/30 px-2 py-1 rounded">
                          Impact: {item.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile-First Approach */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-2xl p-8 border border-green-800/30">
                <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-400 text-lg">✓</span>
                  </div>
                  Dispatchar Mobile-First
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Native Mobile Apps',
                      description:
                        'iOS and Android apps built for drivers on the road',
                      impact: '24/7 productivity',
                    },
                    {
                      title: 'Digital-First Workflow',
                      description:
                        'All documents and processes digitized and accessible',
                      impact: '100% compliance',
                    },
                    {
                      title: 'Real-Time Updates',
                      description: 'Instant communication and status updates',
                      impact: 'Complete visibility',
                    },
                    {
                      title: 'Anywhere Access',
                      description:
                        'Full functionality from any device, anywhere',
                      impact: 'Zero delays',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-green-900/10 rounded-lg p-4 border-l-4 border-green-500"
                    >
                      <h4 className="font-semibold text-green-300 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-300 text-sm mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center">
                        <span className="text-green-400 text-xs font-medium bg-green-900/30 px-2 py-1 rounded">
                          Result: {item.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Metrics */}
          <div className="mt-16 grid md:grid-cols-4 gap-8">
            {[
              {
                metric: '85%',
                label: 'Faster Check-ins',
                color: 'from-cyan-500 to-blue-500',
              },
              {
                metric: '100%',
                label: 'Digital Compliance',
                color: 'from-green-500 to-emerald-500',
              },
              {
                metric: '60%',
                label: 'Less Paperwork',
                color: 'from-purple-500 to-indigo-500',
              },
              {
                metric: '24/7',
                label: 'Accessibility',
                color: 'from-orange-500 to-red-500',
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${stat.color} shadow-lg mx-auto mb-4`}
                >
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                >
                  {stat.metric}
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Built for{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Performance & Reliability
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Enterprise-grade mobile technology designed for the demanding
              logistics environment.
            </p>
          </div>

          {/* Technical Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Wifi,
                title: 'Offline-First Architecture',
                description:
                  'Continue working even without internet connection',
                features: [
                  'Local data storage',
                  'Queue sync when online',
                  'Zero downtime',
                ],
                color: 'from-cyan-500 to-blue-500',
              },
              {
                icon: RefreshCw,
                title: 'Real-Time Synchronization',
                description:
                  'Instant data sync across all devices and platforms',
                features: [
                  'Sub-second updates',
                  'Conflict resolution',
                  'Multi-device sync',
                ],
                color: 'from-purple-500 to-indigo-500',
              },
              {
                icon: Download,
                title: 'Progressive Web App',
                description: 'Web app that works like a native mobile app',
                features: [
                  'App-like experience',
                  'Install from browser',
                  'Automatic updates',
                ],
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Bell,
                title: 'Smart Notifications',
                description: 'Intelligent alerts that adapt to your workflow',
                features: [
                  'Priority-based alerts',
                  'Custom notification rules',
                  'Quiet hours',
                ],
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: Smartphone,
                title: 'Cross-Platform Support',
                description: 'Works seamlessly on iOS, Android, and web',
                features: [
                  'Native iOS app',
                  'Native Android app',
                  'Responsive web app',
                ],
                color: 'from-indigo-500 to-purple-500',
              },
              {
                icon: ArrowRight,
                title: 'Enterprise Security',
                description: 'Bank-level security for your sensitive data',
                features: [
                  'End-to-end encryption',
                  'Biometric authentication',
                  'GDPR compliant',
                ],
                color: 'from-red-500 to-pink-500',
              },
            ].map((tech, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${tech.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {tech.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{tech.description}</p>
                <ul className="space-y-2">
                  {tech.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* App Download Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Download Our Mobile Apps
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the full Dispatchar experience on your mobile device.
              Available for iOS and Android with all the features you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-4 bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📱</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Download for iOS</p>
                  <p className="text-gray-400 text-sm">
                    Available on App Store
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🤖</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">
                    Download for Android
                  </p>
                  <p className="text-gray-400 text-sm">
                    Available on Google Play
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              Or access the web app directly from your mobile browser - no
              download required!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
