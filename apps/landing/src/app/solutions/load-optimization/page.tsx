'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  ArrowRight,
  Package,
  Route,
  BarChart3,
  Zap,
  TrendingUp,
  Target,
  Clock,
  DollarSign,
  Truck,
  AlertTriangle,
  CheckCircle,
  Globe,
  Shield,
  Users,
  Calculator,
  PlayCircle,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function LoadOptimizationPage() {
  const [activeDemo, setActiveDemo] = useState(0);

  const loadFeatures = [
    {
      icon: Package,
      title: 'Smart Load Planning',
      description: 'AI-powered load planning for maximum efficiency',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Route,
      title: 'Route Optimization',
      description: 'Find the most efficient routes for multiple stops',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Capacity Analytics',
      description: 'Analyze and optimize cargo capacity utilization',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Zap,
      title: 'Real-time Adjustments',
      description: 'Dynamic load adjustments based on conditions',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const optimizationSteps = [
    {
      title: 'Load Assessment',
      description:
        'AI analyzes cargo dimensions, weight, and destination requirements',
      icon: Package,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Route Calculation',
      description:
        'Calculate optimal routes considering traffic, weather, and delivery windows',
      icon: Route,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Space Optimization',
      description:
        'Maximize vehicle capacity utilization with intelligent load arrangement',
      icon: Target,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Real-time Adjustments',
      description: 'Dynamic reoptimization based on changing conditions',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
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
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/30 text-emerald-300 border border-emerald-800/50 text-sm font-medium mb-6">
                <Package className="w-4 h-4 mr-2" />
                AI-Powered Optimization
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Load Optimization
                </span>
                <br />
                Intelligence
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-xl lg:max-w-none mx-auto leading-relaxed">
                Transform your logistics operations with AI-powered load
                planning that maximizes capacity, reduces costs, and optimizes
                routes for maximum efficiency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold text-base shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center"
                >
                  Start Optimizing
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/#contact"
                  className="group flex items-center px-8 py-4 rounded-xl border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300 font-semibold text-base text-gray-200 hover:text-emerald-400"
                >
                  View Demo
                  <PlayCircle className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

            <div className="relative w-full max-w-lg mx-auto lg:max-w-none animate-fade-in-up animate-delay-200">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-950 aspect-video">
                {/* Animated Load Optimization Visualization */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 300"
                  fill="none"
                >
                  <defs>
                    <linearGradient
                      id="truck-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient
                      id="cargo-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>

                  {/* Background Grid */}
                  <pattern
                    id="grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.1)"
                      strokeWidth="1"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Truck Container */}
                  <rect
                    x="50"
                    y="150"
                    width="120"
                    height="60"
                    rx="8"
                    fill="url(#truck-gradient)"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.8;1;0.8"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </rect>

                  {/* Cargo Boxes - Optimized Layout */}
                  <rect
                    x="60"
                    y="160"
                    width="25"
                    height="15"
                    rx="2"
                    fill="url(#cargo-gradient)"
                    opacity="0.9"
                  >
                    <animate
                      attributeName="y"
                      values="160;158;160"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <rect
                    x="90"
                    y="160"
                    width="20"
                    height="20"
                    rx="2"
                    fill="url(#cargo-gradient)"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="y"
                      values="160;158;160"
                      dur="2.2s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <rect
                    x="115"
                    y="160"
                    width="30"
                    height="18"
                    rx="2"
                    fill="url(#cargo-gradient)"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="y"
                      values="160;158;160"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <rect
                    x="60"
                    y="180"
                    width="35"
                    height="25"
                    rx="2"
                    fill="url(#cargo-gradient)"
                    opacity="0.9"
                  >
                    <animate
                      attributeName="y"
                      values="180;178;180"
                      dur="2.1s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <rect
                    x="100"
                    y="185"
                    width="45"
                    height="20"
                    rx="2"
                    fill="url(#cargo-gradient)"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="y"
                      values="185;183;185"
                      dur="1.9s"
                      repeatCount="indefinite"
                    />
                  </rect>

                  {/* Route Optimization Path */}
                  <path
                    d="M 200 180 Q 250 160 300 180 Q 320 190 340 170"
                    stroke="url(#truck-gradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-15;0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Destination Points */}
                  <circle cx="300" cy="180" r="6" fill="#10b981">
                    <animate
                      attributeName="r"
                      values="6;8;6"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="340" cy="170" r="6" fill="#06b6d4">
                    <animate
                      attributeName="r"
                      values="6;8;6"
                      dur="1.7s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Efficiency Metrics */}
                  <text
                    x="220"
                    y="50"
                    fill="#10b981"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    95% Capacity
                  </text>
                  <text x="220" y="70" fill="#06b6d4" fontSize="12">
                    Optimal Route
                  </text>
                  <text x="220" y="90" fill="#8b5cf6" fontSize="12">
                    Real-time Updates
                  </text>

                  {/* Progress Bars */}
                  <rect
                    x="220"
                    y="100"
                    width="100"
                    height="8"
                    rx="4"
                    fill="rgba(59, 130, 246, 0.2)"
                  />
                  <rect
                    x="220"
                    y="100"
                    width="85"
                    height="8"
                    rx="4"
                    fill="url(#truck-gradient)"
                  >
                    <animate
                      attributeName="width"
                      values="0;85;85;0"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </rect>

                  <rect
                    x="220"
                    y="115"
                    width="100"
                    height="8"
                    rx="4"
                    fill="rgba(139, 92, 246, 0.2)"
                  />
                  <rect
                    x="220"
                    y="115"
                    width="92"
                    height="8"
                    rx="4"
                    fill="url(#cargo-gradient)"
                  >
                    <animate
                      attributeName="width"
                      values="0;92;92;0"
                      dur="4.5s"
                      repeatCount="indefinite"
                    />
                  </rect>
                </svg>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-2">
                      Interactive Load Planning
                    </h3>
                    <p className="text-gray-300 text-sm">
                      See optimization in action
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {loadFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
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

      {/* Load Optimization Problems Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Traditional Load Planning{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Wastes Money
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Manual load planning leads to inefficiencies that cost trucking
              companies millions in lost revenue and unnecessary expenses.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              {[
                {
                  problem: 'Wasted Cargo Space',
                  impact: '30% capacity unused',
                  description:
                    'Poor load planning leaves valuable cargo space empty, reducing revenue per trip.',
                  icon: '📦',
                  cost: '$15,000 lost revenue/month',
                },
                {
                  problem: 'Inefficient Routes',
                  impact: '25% longer trips',
                  description:
                    'Sub-optimal routing increases fuel costs and delivery times.',
                  icon: '🛣️',
                  cost: '$8,500 extra fuel/month',
                },
                {
                  problem: 'Manual Planning Time',
                  impact: '4 hours daily',
                  description:
                    'Dispatchers spend hours manually planning loads instead of focusing on strategy.',
                  icon: '⏰',
                  cost: '$12,000 labor costs/month',
                },
                {
                  problem: 'Customer Delays',
                  impact: '40% late deliveries',
                  description:
                    'Poor planning leads to delays, damaging customer relationships.',
                  icon: '🚚',
                  cost: '$25,000 lost contracts/year',
                },
              ].map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl flex-shrink-0">{issue.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {issue.problem}
                      </h3>
                      <span className="text-red-400 text-sm font-medium">
                        {issue.impact}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                      {issue.description}
                    </p>
                    <div className="bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
                      <span className="text-red-400 text-xs font-semibold">
                        {issue.cost}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Annual Cost of Inefficiency
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-gray-300">Lost Revenue</span>
                    <span className="text-red-400 font-bold">$180,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-gray-300">Extra Fuel Costs</span>
                    <span className="text-red-400 font-bold">$102,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-gray-300">Labor Inefficiency</span>
                    <span className="text-red-400 font-bold">$144,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-gray-300">Lost Contracts</span>
                    <span className="text-red-400 font-bold">$25,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 pt-4 border-t-2 border-red-500">
                    <span className="text-lg font-bold text-white">
                      Total Annual Loss
                    </span>
                    <span className="text-2xl font-bold text-red-400">
                      $451,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            How Dispatchar{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Optimizes Everything
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Our AI-powered optimization engine analyzes thousands of variables
            to create the perfect load plan.
          </p>

          <div className="space-y-8">
            {optimizationSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 p-6 rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-gray-600 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${step.color} shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Advanced{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Optimization Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful algorithms and machine learning capabilities that set
              Dispatchar apart from traditional load planning tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '3D Load Visualization',
                description:
                  'Interactive 3D modeling shows exactly how cargo fits in your vehicles, preventing loading errors.',
                features: [
                  'Real-time 3D rendering',
                  'Weight distribution analysis',
                  'Load stability checks',
                  'Visual loading instructions',
                ],
                icon: Package,
                color: 'from-emerald-500 to-teal-500',
              },
              {
                title: 'Multi-Stop Optimization',
                description:
                  'Optimize complex routes with multiple pickup and delivery points for maximum efficiency.',
                features: [
                  'Dynamic route recalculation',
                  'Time window constraints',
                  'Multi-vehicle coordination',
                  'Priority delivery handling',
                ],
                icon: Route,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Predictive Analytics',
                description:
                  'Machine learning predicts optimal load configurations based on historical performance.',
                features: [
                  'Performance pattern analysis',
                  'Seasonal optimization',
                  'Driver preference learning',
                  'Cost prediction modeling',
                ],
                icon: BarChart3,
                color: 'from-purple-500 to-indigo-500',
              },
              {
                title: 'Real-time Adaptation',
                description:
                  'Automatically adjust plans when conditions change during transit.',
                features: [
                  'Traffic condition updates',
                  'Weather impact analysis',
                  'Emergency rerouting',
                  'Capacity reallocation',
                ],
                icon: Zap,
                color: 'from-orange-500 to-red-500',
              },
              {
                title: 'Compliance Integration',
                description:
                  'Ensure all loads meet safety regulations and weight restrictions automatically.',
                features: [
                  'DOT compliance checking',
                  'Weight limit validation',
                  'Hazmat handling rules',
                  'International regulations',
                ],
                icon: Shield,
                color: 'from-green-500 to-emerald-500',
              },
              {
                title: 'Customer Integration',
                description:
                  'Connect directly with customer systems for seamless load planning and updates.',
                features: [
                  'EDI integration',
                  'API connectivity',
                  'Real-time notifications',
                  'Proof of delivery sync',
                ],
                icon: Globe,
                color: 'from-indigo-500 to-purple-500',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
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

      {/* ROI Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-900/20 to-teal-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Proven{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Cost Savings
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Companies using Dispatchar's load optimization see immediate
              improvements in efficiency and profitability.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  Average Customer Results
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      metric: '35%',
                      label: 'Capacity utilization increase',
                      icon: '📦',
                      color: 'from-emerald-500 to-teal-500',
                    },
                    {
                      metric: '25%',
                      label: 'Fuel cost reduction',
                      icon: '⛽',
                      color: 'from-blue-500 to-cyan-500',
                    },
                    {
                      metric: '90%',
                      label: 'Planning time saved',
                      icon: '⚡',
                      color: 'from-purple-500 to-indigo-500',
                    },
                    {
                      metric: '50%',
                      label: 'Customer satisfaction improvement',
                      icon: '🎯',
                      color: 'from-orange-500 to-red-500',
                    },
                  ].map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-3xl">{result.icon}</div>
                      <div className="flex-1">
                        <div
                          className={`text-2xl font-bold bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}
                        >
                          {result.metric}
                        </div>
                        <p className="text-gray-300 text-sm">{result.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">
                  Calculate Your Savings
                </h4>
                <p className="text-emerald-100 mb-4 text-sm">
                  Get a personalized ROI analysis for your fleet
                </p>
                <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm flex items-center justify-center mx-auto">
                  <Calculator className="w-4 h-4 mr-2" />
                  ROI Calculator
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  Implementation Success
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      phase: 'Week 1',
                      title: 'Quick Setup',
                      description:
                        'Connect your existing systems and import load data',
                      progress: 100,
                    },
                    {
                      phase: 'Week 2',
                      title: 'Team Training',
                      description:
                        'Comprehensive training on optimization features',
                      progress: 100,
                    },
                    {
                      phase: 'Week 3-4',
                      title: 'Optimization Tuning',
                      description:
                        'Fine-tune algorithms for your specific operations',
                      progress: 100,
                    },
                    {
                      phase: 'Ongoing',
                      title: 'Continuous Improvement',
                      description:
                        'AI learns and improves optimization over time',
                      progress: 85,
                    },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-medium text-emerald-400">
                            {step.phase}
                          </span>
                          <span className="font-semibold text-white text-sm">
                            {step.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {step.progress}%
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs mb-2">
                        {step.description}
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${step.progress}%` }}
                        ></div>
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
