'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Truck,
  Calendar,
  Target,
  Zap,
  Shield,
  Building,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      title: 'LogiTech Express: From Paper to Digital Excellence',
      company: 'LogiTech Express',
      industry: 'Regional Freight',
      fleetSize: '250 trucks',
      timeframe: '6 months',
      image: '/images/case-study-logitech.jpg',
      challenge:
        'Managing paperwork for 250 trucks was becoming overwhelming with manual processes.',
      solution:
        'Implemented comprehensive digital transformation with Dispatchar platform.',
      results: [
        { metric: 'Paperwork Reduction', value: '95%', icon: FileText },
        { metric: 'Processing Time', value: '-80%', icon: Clock },
        { metric: 'Cost Savings', value: '$120K/year', icon: DollarSign },
        { metric: 'Driver Satisfaction', value: '+65%', icon: Users },
      ],
      quote:
        'Switching from paper-based operations to Dispatchar was the best decision we made. Our drivers can now focus on driving instead of paperwork.',
      quoteName: 'Sarah Johnson',
      quoteTitle: 'Operations Manager, LogiTech Express',
    },
    {
      title: 'MegaHaul Solutions: Scaling Without the Paper Trail',
      company: 'MegaHaul Solutions',
      industry: 'Long-haul Transportation',
      fleetSize: '500 trucks',
      timeframe: '8 months',
      image: '/images/case-study-megahaul.jpg',
      challenge:
        'Rapid growth was hindered by outdated paper-based tracking and compliance systems.',
      solution:
        'Full digital overhaul with real-time tracking, automated compliance, and digital documentation.',
      results: [
        { metric: 'Compliance Score', value: '99.8%', icon: Shield },
        { metric: 'Route Efficiency', value: '+35%', icon: Target },
        { metric: 'Document Processing', value: '-90%', icon: FileText },
        { metric: 'Revenue Growth', value: '+45%', icon: TrendingUp },
      ],
      quote:
        'The digital transformation eliminated our paper bottleneck and allowed us to scale our operations efficiently.',
      quoteName: 'Michael Chen',
      quoteTitle: 'CEO, MegaHaul Solutions',
    },
    {
      title: 'Swift Logistics: Modernizing a 50-Year Legacy',
      company: 'Swift Logistics',
      industry: 'Mixed Fleet Operations',
      fleetSize: '150 trucks',
      timeframe: '4 months',
      image: '/images/case-study-swift.jpg',
      challenge:
        'A family business stuck in traditional methods needed to modernize to compete.',
      solution:
        'Gradual transition from paper logs to digital fleet management with comprehensive training.',
      results: [
        { metric: 'Operational Efficiency', value: '+55%', icon: Zap },
        { metric: 'Error Reduction', value: '-85%', icon: CheckCircle },
        { metric: 'Fuel Savings', value: '22%', icon: DollarSign },
        { metric: 'Customer Satisfaction', value: '+40%', icon: Users },
      ],
      quote:
        'We thought digital meant losing our personal touch. Instead, it freed us to focus more on what matters - our customers.',
      quoteName: 'Robert Swift Jr.',
      quoteTitle: 'Third Generation Owner, Swift Logistics',
    },
  ];

  const digitalVsPaperComparison = [
    {
      category: 'Document Processing',
      paper: { time: '45 minutes', accuracy: '75%', cost: '$25/shipment' },
      digital: { time: '2 minutes', accuracy: '99.9%', cost: '$1/shipment' },
      improvement: '95% faster, 24% more accurate, 96% cheaper',
    },
    {
      category: 'Compliance Tracking',
      paper: { time: '4 hours/week', accuracy: '80%', cost: '$200/violation' },
      digital: { time: 'Automated', accuracy: '99.5%', cost: '$0/violation' },
      improvement: 'Fully automated, 19% more accurate, 100% cost reduction',
    },
    {
      category: 'Route Planning',
      paper: { time: '2 hours', accuracy: '70%', cost: '15% fuel waste' },
      digital: { time: '5 minutes', accuracy: '95%', cost: '5% fuel waste' },
      improvement: '96% faster, 25% more accurate, 67% fuel savings',
    },
    {
      category: 'Driver Communication',
      paper: {
        time: '30 min/call',
        accuracy: '60%',
        cost: '$50/miscommunication',
      },
      digital: { time: 'Instant', accuracy: '99%', cost: '$0/message' },
      improvement: 'Instant delivery, 39% more accurate, 100% cost reduction',
    },
  ];

  const transformationTimeline = [
    {
      phase: 'Assessment',
      duration: 'Week 1-2',
      description:
        'Analyze current paper-based processes and identify digital opportunities',
      tasks: [
        'Process mapping',
        'Pain point identification',
        'ROI calculation',
        'Team readiness assessment',
      ],
    },
    {
      phase: 'Planning',
      duration: 'Week 3-4',
      description:
        'Design digital transformation strategy and implementation roadmap',
      tasks: [
        'Solution design',
        'Integration planning',
        'Training schedule',
        'Change management plan',
      ],
    },
    {
      phase: 'Implementation',
      duration: 'Week 5-12',
      description:
        'Gradual rollout of digital systems with parallel paper backup',
      tasks: [
        'System deployment',
        'Data migration',
        'User training',
        'Process optimization',
      ],
    },
    {
      phase: 'Optimization',
      duration: 'Week 13-16',
      description:
        'Fine-tune processes and eliminate remaining paper dependencies',
      tasks: [
        'Performance monitoring',
        'Process refinement',
        'Advanced training',
        'Full digital adoption',
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
              <FileText className="w-4 h-4 mr-2" />
              Case Studies
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              From Paper to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}
                Digital Success
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover how forward-thinking logistics companies transformed
              their operations by leaving paper behind and embracing digital
              innovation. Real stories, measurable results, transformative
              outcomes.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-gray-400">Average Paperwork Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  $120K
                </div>
                <div className="text-gray-400">Average Annual Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  4 Months
                </div>
                <div className="text-gray-400">Average ROI Timeline</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Success Stories: Digital Transformation in Action
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how companies just like yours revolutionized their operations
              by replacing outdated paper processes with modern digital
              solutions.
            </p>
          </div>

          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden"
              >
                <div className="grid lg:grid-cols-2 gap-8 p-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <Building className="w-6 h-6 text-blue-400" />
                        <span className="text-blue-400 font-medium">
                          {study.industry}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{study.fleetSize}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {study.title}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Transformation completed in {study.timeframe}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          The Challenge
                        </h4>
                        <p className="text-gray-400">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          The Solution
                        </h4>
                        <p className="text-gray-400">{study.solution}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {study.results.map((result, resultIndex) => (
                        <div
                          key={resultIndex}
                          className="bg-gray-700/30 rounded-lg p-4"
                        >
                          <div className="flex items-center mb-2">
                            <result.icon className="w-5 h-5 text-blue-400 mr-2" />
                            <span className="text-gray-300 text-sm">
                              {result.metric}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {result.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/20 p-6 mb-6">
                      <div className="text-4xl text-blue-400 mb-4">"</div>
                      <blockquote className="text-lg text-gray-300 mb-4 italic">
                        {study.quote}
                      </blockquote>
                      <div className="border-t border-gray-700 pt-4">
                        <div className="font-semibold text-white">
                          {study.quoteName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {study.quoteTitle}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/company/contact-us"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                    >
                      Start Your Transformation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital vs Paper Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              The Numbers Don't Lie: Digital vs Paper
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See the stark difference between traditional paper-based
              operations and modern digital solutions across key operational
              metrics.
            </p>
          </div>

          <div className="space-y-8">
            {digitalVsPaperComparison.map((comparison, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8"
              >
                <h3 className="text-xl font-bold text-white mb-6">
                  {comparison.category}
                </h3>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-red-400 mb-4">
                      📄 Paper-Based
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-white">
                          {comparison.paper.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Accuracy:</span>
                        <span className="text-white">
                          {comparison.paper.accuracy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cost:</span>
                        <span className="text-white">
                          {comparison.paper.cost}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-600/10 border border-green-600/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-green-400 mb-4">
                      💻 Digital Solution
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-white">
                          {comparison.digital.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Accuracy:</span>
                        <span className="text-white">
                          {comparison.digital.accuracy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cost:</span>
                        <span className="text-white">
                          {comparison.digital.cost}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-6 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">
                        Improvement
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {comparison.improvement}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Transformation Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Your Digital Transformation Journey
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We guide you through a proven 4-phase approach to transform your
              paper-based operations into a fully digital, efficient system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {transformationTimeline.map((phase, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-white">
                        {phase.phase}
                      </h3>
                      <p className="text-sm text-blue-400">{phase.duration}</p>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-4">{phase.description}</p>

                  <ul className="space-y-2">
                    {phase.tasks.map((task, taskIndex) => (
                      <li
                        key={taskIndex}
                        className="flex items-center text-gray-300 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {index < transformationTimeline.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/company/contact-us"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg"
            >
              Start Your Digital Journey Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
