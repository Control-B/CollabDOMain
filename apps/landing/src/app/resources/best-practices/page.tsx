'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Smartphone,
  Globe,
  Users,
  Clock,
  DollarSign,
  Truck,
  Database,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function BestPracticesPage() {
  const bestPractices = [
    {
      category: 'Technology Adoption',
      icon: Zap,
      color: 'from-blue-600 to-cyan-600',
      practices: [
        {
          title: 'Start with Core Operations',
          description:
            'Begin digitization with your most critical processes like tracking and dispatch',
          impact: 'Immediate ROI and quick wins',
          difficulty: 'Easy',
        },
        {
          title: 'Invest in Mobile-First Solutions',
          description:
            'Ensure your technology works seamlessly on mobile devices for drivers',
          impact: 'Higher adoption rates',
          difficulty: 'Medium',
        },
        {
          title: 'Integrate with Existing Systems',
          description:
            'Choose platforms that connect with your current ERP and accounting software',
          impact: 'Streamlined operations',
          difficulty: 'Medium',
        },
        {
          title: 'Implement Real-Time Monitoring',
          description:
            'Use IoT and telematics for instant visibility into fleet performance',
          impact: 'Proactive management',
          difficulty: 'Advanced',
        },
      ],
    },
    {
      category: 'Digital Strategy',
      icon: Target,
      color: 'from-purple-600 to-indigo-600',
      practices: [
        {
          title: 'Define Clear Digital Goals',
          description:
            'Set specific, measurable objectives for your technology investments',
          impact: 'Focused implementation',
          difficulty: 'Easy',
        },
        {
          title: 'Create a Phased Rollout Plan',
          description:
            'Implement technology gradually to ensure smooth adoption',
          impact: 'Reduced resistance',
          difficulty: 'Medium',
        },
        {
          title: 'Establish KPIs and Metrics',
          description:
            'Track performance improvements and ROI from technology adoption',
          impact: 'Measurable success',
          difficulty: 'Medium',
        },
        {
          title: 'Build Change Management Process',
          description:
            'Prepare your team for digital transformation with proper change management',
          impact: 'Successful adoption',
          difficulty: 'Advanced',
        },
      ],
    },
    {
      category: 'Operational Excellence',
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-600',
      practices: [
        {
          title: 'Automate Repetitive Tasks',
          description:
            'Use technology to eliminate manual data entry and routine processes',
          impact: 'Efficiency gains',
          difficulty: 'Easy',
        },
        {
          title: 'Implement Predictive Analytics',
          description:
            'Use data to predict maintenance needs and optimize routes',
          impact: 'Cost reduction',
          difficulty: 'Advanced',
        },
        {
          title: 'Enable Self-Service Capabilities',
          description:
            'Give customers and drivers access to real-time information',
          impact: 'Improved satisfaction',
          difficulty: 'Medium',
        },
        {
          title: 'Create Digital Workflows',
          description:
            'Design paperless processes that guide users through tasks',
          impact: 'Error reduction',
          difficulty: 'Medium',
        },
      ],
    },
  ];

  const technologyTrends = [
    {
      trend: 'Artificial Intelligence & Machine Learning',
      description:
        'AI-powered route optimization, predictive maintenance, and demand forecasting',
      adoption: '85%',
      impact: 'High',
      timeframe: 'Now',
      benefits: [
        '30% route efficiency improvement',
        'Predictive maintenance savings',
        'Enhanced decision making',
      ],
    },
    {
      trend: 'Internet of Things (IoT)',
      description:
        'Connected sensors for cargo monitoring, vehicle diagnostics, and environmental tracking',
      adoption: '75%',
      impact: 'High',
      timeframe: 'Now',
      benefits: [
        'Real-time cargo visibility',
        'Proactive maintenance alerts',
        'Temperature monitoring',
      ],
    },
    {
      trend: 'Blockchain Technology',
      description:
        'Secure, transparent supply chain tracking and smart contracts',
      adoption: '25%',
      impact: 'Medium',
      timeframe: '2-3 years',
      benefits: [
        'Enhanced security',
        'Supply chain transparency',
        'Automated payments',
      ],
    },
    {
      trend: 'Autonomous Vehicles',
      description:
        'Self-driving trucks for long-haul routes and urban delivery',
      adoption: '5%',
      impact: 'Revolutionary',
      timeframe: '5-10 years',
      benefits: [
        '24/7 operations',
        'Driver shortage solution',
        'Safety improvements',
      ],
    },
    {
      trend: 'Electric Fleet Transition',
      description:
        'Electric and hybrid vehicles for sustainable logistics operations',
      adoption: '15%',
      impact: 'High',
      timeframe: '3-5 years',
      benefits: [
        'Reduced emissions',
        'Lower fuel costs',
        'Regulatory compliance',
      ],
    },
    {
      trend: 'Advanced Analytics & BI',
      description:
        'Real-time dashboards, predictive analytics, and performance optimization',
      adoption: '70%',
      impact: 'High',
      timeframe: 'Now',
      benefits: [
        'Data-driven decisions',
        'Performance insights',
        'Cost optimization',
      ],
    },
  ];

  const implementationSteps = [
    {
      step: 1,
      title: 'Assessment & Planning',
      duration: '2-4 weeks',
      description: 'Evaluate current operations and define technology strategy',
      tasks: [
        'Current state analysis',
        'Technology gap assessment',
        'ROI projections',
        'Implementation roadmap',
      ],
    },
    {
      step: 2,
      title: 'Foundation Building',
      duration: '4-8 weeks',
      description:
        'Establish core infrastructure and basic digital capabilities',
      tasks: [
        'Core platform deployment',
        'Basic integrations',
        'User account setup',
        'Initial training',
      ],
    },
    {
      step: 3,
      title: 'Advanced Features',
      duration: '8-12 weeks',
      description:
        'Implement advanced analytics, automation, and optimization features',
      tasks: [
        'Advanced analytics setup',
        'Automation workflows',
        'Performance monitoring',
        'Optimization algorithms',
      ],
    },
    {
      step: 4,
      title: 'Optimization & Scale',
      duration: 'Ongoing',
      description: 'Continuous improvement and scaling of digital capabilities',
      tasks: [
        'Performance tuning',
        'Feature expansion',
        'User feedback integration',
        'Strategic enhancements',
      ],
    },
  ];

  const riskMitigation = [
    {
      risk: 'Technology Adoption Resistance',
      impact: 'High',
      mitigation: 'Comprehensive training programs and change management',
      prevention: [
        'Early stakeholder engagement',
        'Clear communication',
        'Gradual rollout',
      ],
    },
    {
      risk: 'Data Security Breaches',
      impact: 'Critical',
      mitigation: 'Multi-layered security protocols and regular audits',
      prevention: [
        'End-to-end encryption',
        'Access controls',
        'Security training',
      ],
    },
    {
      risk: 'Integration Failures',
      impact: 'Medium',
      mitigation: 'Thorough testing and staged implementation',
      prevention: [
        'API compatibility checks',
        'Sandbox testing',
        'Rollback plans',
      ],
    },
    {
      risk: 'Budget Overruns',
      impact: 'Medium',
      mitigation: 'Phased implementation with clear milestones',
      prevention: [
        'Detailed cost planning',
        'Regular budget reviews',
        'Scope management',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

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

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4 mr-2" />
              Best Practices
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Technology Best Practices for
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}
                Modern Logistics
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover proven strategies, emerging technologies, and
              implementation best practices that leading logistics companies use
              to stay competitive in the digital age.
            </p>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">75%</div>
                <div className="text-gray-400">Efficiency Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  $2.5M
                </div>
                <div className="text-gray-400">Average Annual Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  6x
                </div>
                <div className="text-gray-400">ROI on Technology</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  99.9%
                </div>
                <div className="text-gray-400">Operational Reliability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Proven Best Practices for Success
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Learn from industry leaders who have successfully implemented
              technology solutions to transform their logistics operations.
            </p>
          </div>

          <div className="space-y-12">
            {bestPractices.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8"
              >
                <div className="flex items-center mb-8">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${category.color} shadow-lg mr-6`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {category.category}
                    </h3>
                    <p className="text-gray-400">
                      Essential practices for {category.category.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {category.practices.map((practice, practiceIndex) => (
                    <div
                      key={practiceIndex}
                      className="bg-gray-700/30 rounded-xl border border-gray-600 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">
                          {practice.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            practice.difficulty === 'Easy'
                              ? 'bg-green-600/20 text-green-400'
                              : practice.difficulty === 'Medium'
                              ? 'bg-yellow-600/20 text-yellow-400'
                              : 'bg-red-600/20 text-red-400'
                          }`}
                        >
                          {practice.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">
                        {practice.description}
                      </p>
                      <div className="flex items-center text-blue-400">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          {practice.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Trends Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Emerging Technology Trends
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stay ahead of the curve with insights into the technologies that
              will shape the future of logistics and supply chain management.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {technologyTrends.map((trend, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {trend.trend}
                    </h3>
                    <p className="text-gray-400 mb-4">{trend.description}</p>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {trend.adoption}
                    </div>
                    <div className="text-sm text-gray-400">Adoption</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Impact</div>
                    <div
                      className={`font-semibold ${
                        trend.impact === 'High'
                          ? 'text-green-400'
                          : trend.impact === 'Medium'
                          ? 'text-yellow-400'
                          : 'text-purple-400'
                      }`}
                    >
                      {trend.impact}
                    </div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Timeline</div>
                    <div className="font-semibold text-blue-400">
                      {trend.timeframe}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">
                    Key Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {trend.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center text-gray-400 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Technology Implementation Roadmap
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Follow this proven 4-step approach to successfully implement
              technology solutions in your logistics operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {implementationSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-blue-400">{step.duration}</p>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-6">{step.description}</p>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">
                      Key Tasks:
                    </h4>
                    <ul className="space-y-2">
                      {step.tasks.map((task, taskIndex) => (
                        <li
                          key={taskIndex}
                          className="flex items-center text-gray-400 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {index < implementationSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Mitigation Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Risk Mitigation & Success Factors
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Anticipate and mitigate common risks in technology implementation
              to ensure successful adoption and maximum ROI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {riskMitigation.map((risk, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8"
              >
                <div className="flex items-start mb-6">
                  <AlertTriangle className="w-6 h-6 text-orange-400 mr-4 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {risk.risk}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          risk.impact === 'Critical'
                            ? 'bg-red-600/20 text-red-400'
                            : risk.impact === 'High'
                            ? 'bg-orange-600/20 text-orange-400'
                            : 'bg-yellow-600/20 text-yellow-400'
                        }`}
                      >
                        {risk.impact} Impact
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">{risk.mitigation}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">
                    Prevention Strategies:
                  </h4>
                  <ul className="space-y-2">
                    {risk.prevention.map((strategy, strategyIndex) => (
                      <li
                        key={strategyIndex}
                        className="flex items-center text-gray-400 text-sm"
                      >
                        <Shield className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Implement These Best Practices?
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Our team of logistics technology experts can help you implement
                these proven best practices and guide you through a successful
                digital transformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/company/contact-us"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                >
                  Schedule Strategy Session
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/resources/case-studies"
                  className="inline-flex items-center px-8 py-4 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-200 font-semibold border border-gray-700"
                >
                  View Success Stories
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
