'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ArrowLeft,
  CheckCircle,
  Clock,
  Truck,
  Zap,
  Shield,
  Users,
  ArrowRight,
  AlertTriangle,
  BarChart3,
  Globe,
  Target,
  Layers,
  PlayCircle,
  DollarSign,
  TrendingUp,
  Wifi,
  Lock,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function GeofenceCheckInsPage() {
  const [activeDemo, setActiveDemo] = useState(0);

  const demoSteps = [
    {
      title: 'Driver Approaches Zone',
      description: 'Vehicle enters predefined geofence area',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Automatic Detection',
      description: 'System automatically detects location',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Instant Check-in',
      description: 'Check-in recorded without driver action',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Real-time Updates',
      description: 'Dispatch and office receive immediate notification',
      icon: Clock,
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Save 2+ Hours Daily',
      description:
        'Eliminate manual check-in processes and reduce wait times at terminals',
      stat: '120 min',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: '100% Compliance',
      description:
        'Automated logging ensures all check-ins are recorded accurately',
      stat: '99.9%',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Truck,
      title: 'Reduced Fuel Costs',
      description: 'Less idling time and optimized routing saves fuel expenses',
      stat: '15%',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      title: 'Better Experience',
      description: 'Drivers and dispatchers love the seamless automation',
      stat: '95%',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const features = [
    'GPS-based automatic detection',
    'Custom geofence zone setup',
    'Real-time notifications',
    'Compliance tracking',
    'Integration with dispatch systems',
    'Historical data analytics',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/30 text-emerald-300 border border-emerald-800/50 text-sm font-medium mb-6">
                <MapPin className="w-4 h-4 mr-2" />
                Advanced Location Technology
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Geofence Check-ins
                </span>
                <br />
                Made Simple
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Eliminate manual check-ins with automated geofence technology.
                Save time, reduce costs, and ensure 100% compliance with zero
                driver effort.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className="relative animate-fade-in-up animate-delay-200">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  How It Works
                </h3>
                <div className="space-y-4">
                  {demoSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        activeDemo === index
                          ? 'bg-gray-700/50 border border-gray-600'
                          : 'hover:bg-gray-700/30'
                      }`}
                      onClick={() => setActiveDemo(index)}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${step.color} shadow-lg`}
                      >
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {step.description}
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          activeDemo === index
                            ? 'bg-emerald-400'
                            : 'bg-gray-600'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Measurable Results
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real companies see immediate improvements when they switch to
              automated geofence check-ins
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${benefit.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`text-3xl font-bold mb-2 bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}
                >
                  {benefit.stat}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Advanced Features
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our geofencing technology includes everything you need for
                seamless automation
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 animate-fade-in-up animate-delay-200">
              <div className="aspect-video bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Interactive geofence visualization
                  </p>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  See It In Action
                </h3>
                <p className="text-gray-400 text-sm">
                  Watch how geofences automatically detect and log check-ins
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-900/30 to-teal-900/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Automate Your Check-ins?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of companies already saving time and money with
            geofence automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg"
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

      {/* Problems We Solve Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Problems{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                We Solve
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Traditional check-in processes create bottlenecks, compliance
              issues, and operational inefficiencies. Dispatchar's geofencing
              eliminates these problems entirely.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Before: Problems */}
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Without Geofencing
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Clock,
                    title: 'Manual Check-ins',
                    description:
                      'Drivers waste 15-30 minutes per location on paperwork and manual processes',
                    impact: '2+ hours daily per driver',
                  },
                  {
                    icon: AlertTriangle,
                    title: 'Missed Check-ins',
                    description:
                      'Human error leads to incomplete documentation and compliance gaps',
                    impact: '15-20% missed records',
                  },
                  {
                    icon: Shield,
                    title: 'Compliance Risk',
                    description:
                      'Inconsistent documentation creates audit risks and potential penalties',
                    impact: '$5,000+ potential fines',
                  },
                  {
                    icon: BarChart3,
                    title: 'No Visibility',
                    description:
                      'Dispatchers have limited real-time insight into fleet location and status',
                    impact: '30% productivity loss',
                  },
                ].map((problem, index) => (
                  <div
                    key={index}
                    className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <problem.icon className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {problem.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          {problem.description}
                        </p>
                        <span className="text-red-400 text-xs font-medium">
                          {problem.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* After: Solutions */}
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  With Dispatchar Geofencing
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Zap,
                    title: 'Automatic Check-ins',
                    description:
                      'Zero driver action required - system handles everything automatically',
                    impact: '100% accuracy guaranteed',
                  },
                  {
                    icon: Shield,
                    title: 'Perfect Compliance',
                    description:
                      'Every arrival and departure is logged with precise timestamps',
                    impact: 'Zero missed records',
                  },
                  {
                    icon: BarChart3,
                    title: 'Real-time Visibility',
                    description:
                      'Instant notifications and live tracking for complete fleet oversight',
                    impact: '40% efficiency increase',
                  },
                  {
                    icon: DollarSign,
                    title: 'Cost Savings',
                    description:
                      'Eliminate administrative overhead and reduce fuel costs from waiting',
                    impact: '$15,000+ annual savings',
                  },
                ].map((solution, index) => (
                  <div
                    key={index}
                    className="bg-emerald-900/20 border border-emerald-800/50 rounded-lg p-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <solution.icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {solution.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          {solution.description}
                        </p>
                        <span className="text-emerald-400 text-xs font-medium">
                          {solution.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Advanced{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Geofencing
              </span>{' '}
              Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our geofencing technology goes beyond basic location tracking with
              intelligent features designed for the complexities of modern
              logistics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Layers,
                title: 'Multi-Zone Geofences',
                description:
                  'Create complex, layered geofences with different actions for entry, exit, and dwell time zones.',
                features: [
                  'Nested zone detection',
                  'Zone priority management',
                  'Custom zone shapes',
                  'Radius adjustment',
                ],
              },
              {
                icon: Target,
                title: 'Smart Accuracy Control',
                description:
                  'AI-powered precision adjustment based on location type, weather conditions, and signal strength.',
                features: [
                  'Weather compensation',
                  'Signal strength analysis',
                  'Location type optimization',
                  'False positive prevention',
                ],
              },
              {
                icon: Clock,
                title: 'Intelligent Dwell Time',
                description:
                  'Configurable dwell time requirements prevent false triggers from brief zone entries.',
                features: [
                  'Customizable dwell periods',
                  'Activity-based triggers',
                  'Load-specific timing',
                  'Exception handling',
                ],
              },
              {
                icon: Globe,
                title: 'Global Coverage',
                description:
                  'Worldwide geofencing capability with support for international operations and time zones.',
                features: [
                  'Multi-country support',
                  'Timezone handling',
                  'Currency conversion',
                  'Local compliance',
                ],
              },
              {
                icon: Wifi,
                title: 'Offline Capability',
                description:
                  'Continue tracking and logging even when cellular or GPS signal is temporarily unavailable.',
                features: [
                  'Offline data storage',
                  'Signal recovery sync',
                  'Backup positioning',
                  'Network failover',
                ],
              },
              {
                icon: Lock,
                title: 'Security & Privacy',
                description:
                  'Enterprise-grade security with encrypted location data and privacy controls.',
                features: [
                  'End-to-end encryption',
                  'Privacy controls',
                  'Audit trails',
                  'GDPR compliance',
                ],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
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
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-400 text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-900/20 to-teal-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Calculate Your{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ROI
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how much time and money you'll save with automated geofence
              check-ins. Most companies see ROI within the first month.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  Average Customer Savings
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      metric: '2.5 hours',
                      label: 'Daily time saved per driver',
                      icon: Clock,
                      color: 'from-blue-500 to-cyan-500',
                    },
                    {
                      metric: '$18,500',
                      label: 'Annual cost savings per vehicle',
                      icon: DollarSign,
                      color: 'from-green-500 to-emerald-500',
                    },
                    {
                      metric: '95%',
                      label: 'Reduction in compliance issues',
                      icon: Shield,
                      color: 'from-purple-500 to-indigo-500',
                    },
                    {
                      metric: '40%',
                      label: 'Improvement in dispatch efficiency',
                      icon: TrendingUp,
                      color: 'from-orange-500 to-red-500',
                    },
                  ].map((saving, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${saving.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <saving.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-2xl font-bold bg-gradient-to-r ${saving.color} bg-clip-text text-transparent`}
                        >
                          {saving.metric}
                        </div>
                        <p className="text-gray-300 text-sm">{saving.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">
                  Ready to Calculate Your Savings?
                </h4>
                <p className="text-emerald-100 mb-4 text-sm">
                  Get a personalized ROI analysis for your fleet
                </p>
                <Link
                  href="/auth/signup"
                  className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center text-sm"
                >
                  Get Free ROI Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  Implementation Timeline
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      day: 'Day 1',
                      title: 'Setup & Configuration',
                      description: 'Zone creation and system configuration',
                      status: 'complete',
                    },
                    {
                      day: 'Day 2-3',
                      title: 'Driver Training',
                      description: 'Brief orientation on new automated system',
                      status: 'complete',
                    },
                    {
                      day: 'Day 4-7',
                      title: 'Testing & Optimization',
                      description: 'Fine-tune geofence accuracy and settings',
                      status: 'complete',
                    },
                    {
                      day: 'Week 2+',
                      title: 'Full Operation',
                      description: 'Complete automation with ongoing support',
                      status: 'active',
                    },
                  ].map((phase, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          phase.status === 'complete'
                            ? 'bg-emerald-500'
                            : 'bg-blue-500'
                        }`}
                      >
                        {phase.status === 'complete' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-400">
                            {phase.day}
                          </span>
                          <span className="font-semibold text-white">
                            {phase.title}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
