'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Building,
  Globe,
  Shield,
  Zap,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  Server,
  Database,
  Lock,
  Headphones,
  TrendingUp,
  Settings,
  FileText,
  Truck,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function EnterpriseSolutionsPage() {
  const enterpriseFeatures = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description:
        'Bank-grade security with SSO, advanced encryption, and compliance certifications',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Database,
      title: 'Scalable Infrastructure',
      description:
        'Handle thousands of vehicles and unlimited users with our enterprise-grade platform',
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: Settings,
      title: 'Custom Integrations',
      description:
        'Seamlessly integrate with your existing ERP, CRM, and logistics systems',
      color: 'from-purple-600 to-indigo-600',
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description:
        '24/7 priority support with dedicated account managers and technical specialists',
      color: 'from-orange-600 to-red-600',
    },
  ];

  const scalabilityMetrics = [
    { label: 'Vehicles Supported', value: '10,000+', icon: Truck },
    { label: 'Concurrent Users', value: 'Unlimited', icon: Users },
    { label: 'Data Retention', value: '10+ Years', icon: Database },
    { label: 'API Calls/Hour', value: '1M+', icon: Zap },
  ];

  const customizationOptions = [
    {
      title: 'White-Label Solutions',
      description:
        'Brand the platform with your company logo, colors, and custom domain',
      features: [
        'Custom branding',
        'Domain mapping',
        'Logo integration',
        'Color schemes',
      ],
    },
    {
      title: 'Custom Workflows',
      description:
        'Design workflows that match your specific business processes and requirements',
      features: [
        'Process automation',
        'Custom approvals',
        'Rule configuration',
        'Notification settings',
      ],
    },
    {
      title: 'Advanced Analytics',
      description:
        'Build custom dashboards and reports tailored to your enterprise metrics',
      features: [
        'Custom KPIs',
        'Executive dashboards',
        'Automated reporting',
        'Data visualization',
      ],
    },
    {
      title: 'API & Integrations',
      description:
        'Connect with your existing enterprise systems through robust APIs',
      features: [
        'REST APIs',
        'Webhook support',
        'ERP integration',
        'Third-party connectors',
      ],
    },
  ];

  const supportTiers = [
    {
      title: 'Standard Enterprise',
      description: 'Perfect for growing enterprises',
      features: [
        'Up to 500 vehicles',
        'Standard integrations',
        'Email & phone support',
        'Monthly training sessions',
        'Basic customization',
      ],
      price: 'Custom Pricing',
    },
    {
      title: 'Premium Enterprise',
      description: 'For large-scale operations',
      features: [
        'Up to 2,000 vehicles',
        'Advanced integrations',
        'Priority 24/7 support',
        'Weekly training sessions',
        'Advanced customization',
        'Dedicated success manager',
      ],
      price: 'Custom Pricing',
      popular: true,
    },
    {
      title: 'Global Enterprise',
      description: 'Ultimate enterprise solution',
      features: [
        'Unlimited vehicles',
        'Custom integrations',
        'White-glove support',
        'On-demand training',
        'Full customization',
        'Technical account manager',
        'SLA guarantees',
      ],
      price: 'Custom Pricing',
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
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-sm font-medium mb-6">
                <Building className="w-4 h-4 mr-2" />
                Enterprise Solutions
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Scale Your
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {' '}
                  Fleet Operations
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Empower your enterprise with a comprehensive fleet management
                platform designed for large-scale operations. Get the security,
                scalability, and customization your organization demands.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/company/contact-us"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
                >
                  Schedule Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-200 font-semibold border border-gray-700"
                >
                  Learn More
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    99.9%
                  </div>
                  <div className="text-sm text-gray-400">Uptime SLA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    10K+
                  </div>
                  <div className="text-sm text-gray-400">
                    Vehicles Supported
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-gray-400">
                    Enterprise Support
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up animate-delay-200">
              <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
                <div className="grid grid-cols-2 gap-6">
                  {enterpriseFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} shadow-lg mb-4 mx-auto`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Scale & Security Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built for Enterprise Scale
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform is designed to handle the most demanding enterprise
              requirements with military-grade security and infinite
              scalability.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Unmatched Scalability
              </h3>
              <p className="text-gray-400 mb-8">
                Whether you're managing 100 or 10,000+ vehicles, our
                infrastructure scales seamlessly with your business. Built on
                enterprise-grade cloud architecture with global redundancy and
                99.9% uptime SLA.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {scalabilityMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/30 rounded-xl border border-gray-700 p-6"
                  >
                    <div className="flex items-center mb-3">
                      <metric.icon className="w-6 h-6 text-blue-400 mr-3" />
                      <span className="text-gray-300 text-sm">
                        {metric.label}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Security & Compliance
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">
                      SOC 2 Type II Certified
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Independently audited security controls and procedures
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">
                      GDPR & CCPA Compliant
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Full compliance with global data protection regulations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">
                      End-to-End Encryption
                    </h4>
                    <p className="text-gray-400 text-sm">
                      256-bit AES encryption for data at rest and in transit
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">
                      SSO Integration
                    </h4>
                    <p className="text-gray-400 text-sm">
                      SAML, OAuth, and LDAP integration with your identity
                      provider
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Customization Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tailored to Your Enterprise
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every enterprise is unique. Our platform offers extensive
              customization options to match your specific workflows, branding,
              and integration requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {customizationOptions.map((option, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {option.title}
                </h3>
                <p className="text-gray-400 mb-6">{option.description}</p>
                <ul className="space-y-3">
                  {option.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Integration Showcase */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Seamless Enterprise Integrations
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Connect with your existing enterprise systems through our robust
                API and pre-built integrations with leading business platforms.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">ERP Systems</h4>
                <p className="text-gray-400 text-sm">
                  SAP, Oracle, Microsoft Dynamics
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">HR Systems</h4>
                <p className="text-gray-400 text-sm">Workday, BambooHR, ADP</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Analytics</h4>
                <p className="text-gray-400 text-sm">
                  Tableau, Power BI, Looker
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-orange-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Accounting</h4>
                <p className="text-gray-400 text-sm">
                  QuickBooks, Sage, NetSuite
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Support & Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Enterprise Support & Solutions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the enterprise plan that fits your organization's size and
              requirements. All plans include dedicated support and
              customization options.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {supportTiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-gray-800/30 backdrop-blur-sm rounded-2xl border p-8 relative ${
                  tier.popular
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{tier.description}</p>
                  <div className="text-3xl font-bold text-blue-400">
                    {tier.price}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/company/contact-us"
                  className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  Contact Sales
                </Link>
              </div>
            ))}
          </div>

          {/* Success Stories Preview */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Trusted by Leading Enterprises
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join Fortune 500 companies who trust Dispatchar to manage their
              global fleet operations with efficiency, security, and scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/company/contact-us"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
              >
                Schedule Enterprise Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/resources/case-studies"
                className="inline-flex items-center px-8 py-4 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-200 font-semibold border border-gray-700"
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
