'use client';

import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  CheckCircle,
  FileText,
  Clock,
  AlertTriangle,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ComplianceManagementPage() {
  const complianceFeatures = [
    {
      icon: FileText,
      title: 'ELD Compliance',
      description: 'Automated hours of service tracking and reporting',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      title: 'Driver Hours Monitoring',
      description: 'Real-time tracking of driving and duty hours',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: AlertTriangle,
      title: 'Violation Alerts',
      description: 'Proactive warnings before violations occur',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: BarChart3,
      title: 'Audit Reports',
      description: 'Complete audit trails and compliance reports',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-900/30 text-green-300 border border-green-800/50 text-sm font-medium mb-6">
                <Shield className="w-4 h-4 mr-2" />
                100% DOT Compliant
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Compliance Management
                </span>
                <br />
                Made Simple
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Stay compliant with automated logging, real-time monitoring, and
                comprehensive reporting. Never worry about DOT audits again.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  Ensure Compliance
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Compliance Dashboard Visualization */}
            <div className="relative animate-fade-in-up animate-delay-200">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Compliance Dashboard
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">
                      All Clear
                    </span>
                  </div>
                </div>

                {/* Animated Compliance Visualization */}
                <div className="h-64 relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 400 250"
                    fill="none"
                  >
                    <defs>
                      <linearGradient
                        id="compliance-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient
                        id="status-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>

                    {/* Compliance Status Circles */}
                    <circle
                      cx="100"
                      cy="80"
                      r="35"
                      fill="none"
                      stroke="url(#status-gradient)"
                      strokeWidth="3"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        values="0 220;110 110;220 0"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text
                      x="100"
                      y="85"
                      textAnchor="middle"
                      fill="#22c55e"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      98%
                    </text>
                    <text
                      x="100"
                      y="110"
                      textAnchor="middle"
                      fill="#d1d5db"
                      fontSize="10"
                    >
                      ELD Compliance
                    </text>

                    <circle
                      cx="300"
                      cy="80"
                      r="35"
                      fill="none"
                      stroke="url(#status-gradient)"
                      strokeWidth="3"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        values="0 220;195 25;220 0"
                        dur="4.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text
                      x="300"
                      y="85"
                      textAnchor="middle"
                      fill="#22c55e"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      95%
                    </text>
                    <text
                      x="300"
                      y="110"
                      textAnchor="middle"
                      fill="#d1d5db"
                      fontSize="10"
                    >
                      HOS Compliance
                    </text>

                    {/* Status Indicators */}
                    <rect
                      x="50"
                      y="150"
                      width="120"
                      height="20"
                      rx="10"
                      fill="rgba(34, 197, 94, 0.2)"
                    />
                    <rect
                      x="50"
                      y="150"
                      width="105"
                      height="20"
                      rx="10"
                      fill="url(#compliance-gradient)"
                    >
                      <animate
                        attributeName="width"
                        values="0;105;105;0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <text
                      x="60"
                      y="164"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      Driver Hours
                    </text>

                    <rect
                      x="230"
                      y="150"
                      width="120"
                      height="20"
                      rx="10"
                      fill="rgba(34, 197, 94, 0.2)"
                    />
                    <rect
                      x="230"
                      y="150"
                      width="115"
                      height="20"
                      rx="10"
                      fill="url(#compliance-gradient)"
                    >
                      <animate
                        attributeName="width"
                        values="0;115;115;0"
                        dur="3.5s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <text
                      x="240"
                      y="164"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      Vehicle Inspections
                    </text>

                    {/* Alert Indicators */}
                    <circle cx="50" cy="200" r="6" fill="#22c55e">
                      <animate
                        attributeName="opacity"
                        values="1;0.5;1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text x="65" y="205" fill="#d1d5db" fontSize="11">
                      No Violations Today
                    </text>

                    <circle cx="250" cy="200" r="6" fill="#22c55e">
                      <animate
                        attributeName="opacity"
                        values="1;0.5;1"
                        dur="2.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text x="265" y="205" fill="#d1d5db" fontSize="11">
                      All Drivers Compliant
                    </text>

                    {/* Data Flow Lines */}
                    <path
                      d="M 50 30 Q 100 20 150 30 Q 200 40 250 30 Q 300 20 350 30"
                      stroke="url(#compliance-gradient)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-10;0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Audit Ready</span>
                  </div>
                  <span className="text-green-400 font-medium">
                    Last Updated: Just Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {complianceFeatures.map((feature, index) => (
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

      {/* Regulatory Standards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Regulatory Standards & Certifications
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stay compliant with industry regulations and maintain
              certifications effortlessly. Our platform automatically tracks
              compliance requirements and generates necessary documentation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Industry Standards Covered
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      DOT Compliance
                    </h4>
                    <p className="text-gray-400">
                      Department of Transportation regulations including driver
                      hours, vehicle inspections, and safety requirements.
                      Automated reporting and violation prevention.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      FMCSA Regulations
                    </h4>
                    <p className="text-gray-400">
                      Federal Motor Carrier Safety Administration compliance
                      including HOS rules, drug testing requirements, and safety
                      management systems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Environmental Standards
                    </h4>
                    <p className="text-gray-400">
                      EPA emissions standards, fuel efficiency reporting, and
                      environmental impact documentation for sustainable fleet
                      operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Compliance Dashboard
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">
                      DOT Inspection
                    </span>
                  </div>
                  <span className="text-green-400 text-sm">Current</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">
                      Driver Certifications
                    </span>
                  </div>
                  <span className="text-green-400 text-sm">Valid</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">
                      Insurance Renewal
                    </span>
                  </div>
                  <span className="text-yellow-400 text-sm">
                    Due in 15 days
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Safety Score</span>
                  </div>
                  <span className="text-blue-400 text-sm">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit & Reporting Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Automated Audit Trails & Reporting
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Generate comprehensive audit reports and maintain detailed records
              automatically. Be ready for inspections with complete
              documentation at your fingertips.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Automated Documentation
              </h3>
              <p className="text-gray-400 mb-6">
                Automatically generate and maintain all required compliance
                documentation, from driver logs to vehicle inspection reports.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Driver time logs
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Vehicle inspections
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Maintenance records
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Incident reports
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Real-time Monitoring
              </h3>
              <p className="text-gray-400 mb-6">
                Monitor compliance status in real-time with instant alerts for
                potential violations and proactive risk management.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  HOS violations
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Speed monitoring
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Route compliance
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Safety events
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Audit Preparation
              </h3>
              <p className="text-gray-400 mb-6">
                Stay audit-ready with organized documentation, instant report
                generation, and comprehensive compliance scoring systems.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  One-click reports
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Document archiving
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Compliance scoring
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Risk assessment
                </li>
              </ul>
            </div>
          </div>

          {/* Report Examples */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Comprehensive Reporting Suite
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">
                  Monthly Safety Reports
                </h4>
                <p className="text-gray-400 text-sm">
                  Comprehensive safety performance and incident analysis
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">
                  Compliance Trends
                </h4>
                <p className="text-gray-400 text-sm">
                  Historical compliance data and improvement tracking
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">
                  Driver Performance
                </h4>
                <p className="text-gray-400 text-sm">
                  Individual driver compliance scores and training needs
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">
                  Risk Assessments
                </h4>
                <p className="text-gray-400 text-sm">
                  Proactive risk identification and mitigation strategies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
