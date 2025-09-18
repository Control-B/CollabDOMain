'use client';

import Link from 'next/link';
import {
  Truck,
  ArrowRight,
  BarChart3,
  Fuel,
  Wrench,
  Shield,
  Users,
  Clock,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function FleetManagementPage() {
  const fleetFeatures = [
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Real-time insights into vehicle performance and efficiency',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Fuel,
      title: 'Fuel Management',
      description: 'Track fuel consumption and optimize costs',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Wrench,
      title: 'Maintenance Tracking',
      description: 'Automated maintenance schedules and alerts',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Safety Compliance',
      description: 'Ensure all vehicles meet safety standards',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const benefits = [
    {
      metric: '25%',
      label: 'Fuel Savings',
      description: 'Optimize routes and reduce fuel costs',
    },
    {
      metric: '40%',
      label: 'Maintenance Reduction',
      description: 'Prevent breakdowns with predictive maintenance',
    },
    {
      metric: '30%',
      label: 'Efficiency Increase',
      description: 'Streamline operations and reduce downtime',
    },
    {
      metric: '99.9%',
      label: 'Uptime',
      description: 'Keep your fleet running smoothly',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50 text-sm font-medium mb-6">
              <Truck className="w-4 h-4 mr-2" />
              Fleet Optimization
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Fleet Management
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Optimize vehicle performance, reduce costs, and ensure compliance
              with comprehensive fleet management solutions.
            </p>

            <Link
              href="/auth/signup"
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
            >
              Optimize Fleet
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {fleetFeatures.map((feature, index) => (
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {benefit.metric}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {benefit.label}
                </h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Management Challenges Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Modern Fleet{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Challenges
              </span>{' '}
              Require Smart Solutions
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Today's fleet managers face unprecedented challenges with rising
              costs, driver shortages, and increasing regulatory requirements.
              Traditional approaches are no longer sufficient.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Rising Operational Costs',
                description:
                  'Fuel costs, maintenance expenses, and insurance premiums continue to rise while profit margins shrink.',
                impact: '15-20% annual cost increase',
                icon: '💸',
                severity: 'critical',
              },
              {
                title: 'Driver Shortage Crisis',
                description:
                  'Difficulty recruiting and retaining qualified drivers leads to reduced capacity and increased overtime costs.',
                impact: '80,000 driver shortage',
                icon: '👥',
                severity: 'high',
              },
              {
                title: 'Regulatory Compliance',
                description:
                  'Complex and ever-changing regulations require constant monitoring and documentation.',
                impact: '$50,000+ potential fines',
                icon: '📋',
                severity: 'high',
              },
              {
                title: 'Vehicle Downtime',
                description:
                  'Unexpected breakdowns and unplanned maintenance disrupt schedules and increase costs.',
                impact: '25% productivity loss',
                icon: '🔧',
                severity: 'medium',
              },
              {
                title: 'Poor Visibility',
                description:
                  'Limited real-time insight into fleet performance makes optimization difficult.',
                impact: '30% inefficiency',
                icon: '👁️',
                severity: 'medium',
              },
              {
                title: 'Customer Demands',
                description:
                  'Increasing expectations for faster delivery and real-time tracking capabilities.',
                impact: '40% service complaints',
                icon: '📱',
                severity: 'medium',
              },
            ].map((challenge, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {challenge.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {challenge.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-red-400 text-xs font-medium">
                    {challenge.impact}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      challenge.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : challenge.severity === 'high'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {challenge.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Fleet Solutions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              AI-Powered{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Fleet Intelligence
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dispatchar's fleet management platform uses advanced AI and
              machine learning to optimize every aspect of your fleet
              operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Predictive Maintenance',
                description:
                  'AI algorithms analyze vehicle data to predict maintenance needs before breakdowns occur, reducing downtime by up to 70%.',
                features: [
                  'Engine diagnostics',
                  'Tire pressure monitoring',
                  'Brake wear analysis',
                  'Oil life tracking',
                ],
                savings: '$8,500/vehicle/year',
              },
              {
                title: 'Route Optimization',
                description:
                  'Dynamic routing algorithms consider traffic, weather, and delivery windows to create the most efficient routes.',
                features: [
                  'Real-time traffic data',
                  'Weather integration',
                  'Delivery window optimization',
                  'Multi-stop planning',
                ],
                savings: '25% fuel reduction',
              },
              {
                title: 'Driver Performance Analytics',
                description:
                  'Comprehensive driver scoring system that identifies coaching opportunities and rewards safe driving behaviors.',
                features: [
                  'Safety scoring',
                  'Fuel efficiency tracking',
                  'Hours of service monitoring',
                  'Performance coaching',
                ],
                savings: '30% accident reduction',
              },
              {
                title: 'Fuel Management',
                description:
                  'Advanced fuel tracking and optimization that identifies savings opportunities and prevents fuel theft.',
                features: [
                  'Consumption monitoring',
                  'Theft detection',
                  'Efficiency recommendations',
                  'Cost analytics',
                ],
                savings: '$12,000/vehicle/year',
              },
              {
                title: 'Compliance Automation',
                description:
                  'Automated compliance tracking ensures your fleet meets all regulatory requirements without manual effort.',
                features: [
                  'DOT compliance',
                  'IFTA reporting',
                  'Vehicle inspections',
                  'Driver qualifications',
                ],
                savings: '100% compliance rate',
              },
              {
                title: 'Asset Utilization',
                description:
                  'Optimize vehicle and trailer utilization with real-time tracking and intelligent assignment algorithms.',
                features: [
                  'Asset tracking',
                  'Utilization analytics',
                  'Assignment optimization',
                  'Capacity planning',
                ],
                savings: '40% asset efficiency',
              },
            ].map((solution, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg font-bold text-white mb-3">
                  {solution.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {solution.description}
                </p>
                <ul className="space-y-2 mb-4">
                  {solution.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-400 text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
                  <span className="text-blue-400 font-semibold text-sm">
                    Potential Savings: {solution.savings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI and Implementation Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Proven{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ROI Results
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our customers typically see a complete return on investment within
              6 months, with continued savings year over year.
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
                      metric: '25%',
                      label: 'Fuel cost reduction',
                      icon: '⛽',
                      color: 'from-green-500 to-emerald-500',
                    },
                    {
                      metric: '40%',
                      label: 'Maintenance cost savings',
                      icon: '🔧',
                      color: 'from-blue-500 to-cyan-500',
                    },
                    {
                      metric: '30%',
                      label: 'Increase in fleet efficiency',
                      icon: '📊',
                      color: 'from-purple-500 to-indigo-500',
                    },
                    {
                      metric: '99.9%',
                      label: 'Fleet uptime achieved',
                      icon: '⚡',
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

              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">
                  Calculate Your Fleet ROI
                </h4>
                <p className="text-blue-100 mb-4 text-sm">
                  Get a personalized analysis of potential savings for your
                  fleet
                </p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm">
                  Get ROI Calculator
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  Implementation Timeline
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      phase: 'Week 1-2',
                      title: 'System Setup',
                      description: 'Install devices and configure platform',
                      progress: 100,
                    },
                    {
                      phase: 'Week 3-4',
                      title: 'Team Training',
                      description: 'Comprehensive training for all users',
                      progress: 100,
                    },
                    {
                      phase: 'Week 5-8',
                      title: 'Data Integration',
                      description: 'Integrate existing systems and data',
                      progress: 100,
                    },
                    {
                      phase: 'Week 9+',
                      title: 'Optimization',
                      description:
                        'Continuous improvement and feature adoption',
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
                          <span className="text-xs font-medium text-blue-400">
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
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
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
