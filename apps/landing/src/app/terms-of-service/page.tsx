'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Scale,
  Shield,
  AlertTriangle,
} from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = 'September 18, 2025';

  const keyPoints = [
    {
      icon: FileText,
      title: 'Service Agreement',
      description: 'Terms governing your use of our fleet management platform',
    },
    {
      icon: Scale,
      title: 'Fair Usage',
      description: 'Guidelines for appropriate use of our services',
    },
    {
      icon: Shield,
      title: 'Data Protection',
      description: 'How we protect your business and fleet data',
    },
    {
      icon: AlertTriangle,
      title: 'Responsibilities',
      description: 'Your responsibilities as a Dispatchar user',
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-6">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-400">Last updated: {lastUpdated}</p>
        </div>

        {/* Key Points */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {keyPoints.map((point, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mb-4 mx-auto">
                <point.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
              <p className="text-gray-400 text-sm">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Terms Content */}
        <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                By accessing and using Dispatchar's services, you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to these terms, you should not use our
                services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              2. Description of Service
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Dispatchar provides a comprehensive fleet management platform
                that includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Real-time vehicle tracking and monitoring</li>
                <li>Digital document management and e-signatures</li>
                <li>Team collaboration and communication tools</li>
                <li>Geofencing and location-based services</li>
                <li>Analytics and reporting capabilities</li>
                <li>Mobile applications for drivers and managers</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              3. User Accounts and Registration
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                To use our services, you must create an account and provide
                accurate, complete information. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>
                  Ensuring your account information remains current and accurate
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              4. Acceptable Use Policy
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>You agree not to use our services to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>
                  Use our services for any illegal or unauthorized purpose
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              5. Subscription and Billing
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>Our services are provided on a subscription basis:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Subscriptions are billed in advance on a monthly or annual
                  basis
                </li>
                <li>All fees are non-refundable unless otherwise stated</li>
                <li>
                  We reserve the right to change our pricing with 30 days notice
                </li>
                <li>
                  Failure to pay may result in suspension or termination of
                  services
                </li>
                <li>You may cancel your subscription at any time</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              6. Data and Privacy
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>Your data and privacy are important to us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You retain ownership of all data you input into our system
                </li>
                <li>
                  We use your data only as described in our Privacy Policy
                </li>
                <li>
                  We implement security measures to protect your information
                </li>
                <li>You can export your data at any time</li>
                <li>
                  We will delete your data upon account termination as requested
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              7. Service Availability
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                While we strive for maximum uptime, we cannot guarantee
                uninterrupted service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We target 99.9% uptime but do not guarantee it</li>
                <li>
                  Planned maintenance will be announced in advance when possible
                </li>
                <li>
                  We are not liable for downtime beyond our reasonable control
                </li>
                <li>
                  Service credits may be available for significant outages
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              8. Intellectual Property
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                The Dispatchar platform and all related intellectual property
                are owned by us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our software, algorithms, and designs are proprietary</li>
                <li>You receive a limited license to use our services</li>
                <li>You may not copy, modify, or distribute our software</li>
                <li>All feedback and suggestions become our property</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              9. Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Our liability is limited to the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We provide our services "as is" without warranties</li>
                <li>
                  We are not liable for indirect, incidental, or consequential
                  damages
                </li>
                <li>
                  Our total liability is limited to the amount you paid in the
                  last 12 months
                </li>
                <li>
                  You agree to indemnify us against claims related to your use
                  of our services
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              10. Termination
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>Either party may terminate this agreement:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may terminate by canceling your subscription</li>
                <li>We may terminate for breach of these terms</li>
                <li>We may suspend services for non-payment</li>
                <li>Upon termination, you lose access to our services</li>
                <li>Certain provisions survive termination</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              11. Changes to Terms
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We reserve the right to modify these terms at any time. We will
                notify you of significant changes via email or through our
                service. Your continued use of our services after changes
                constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              12. Governing Law
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                These terms are governed by the laws of the State of Florida,
                United States. Any disputes will be resolved in the courts of
                Tampa, Florida.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              13. Contact Information
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                If you have questions about these Terms of Service, please
                contact us:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p>
                  <strong>Email:</strong> legal@dispatchar.com
                </p>
                <p>
                  <strong>Address:</strong> 123 Logistics Ave, Tampa, FL
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-gray-400 mb-6">
            Our legal team is available to clarify any questions you may have
            about these terms.
          </p>
          <Link
            href="/company/contact-us"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
          >
            Contact Legal Team
          </Link>
        </div>
      </div>
    </div>
  );
}
