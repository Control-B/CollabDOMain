'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Server } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 18, 2025';

  const principles = [
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We clearly explain what data we collect and how we use it',
    },
    {
      icon: Lock,
      title: 'Security',
      description:
        'Your data is protected with industry-leading security measures',
    },
    {
      icon: Shield,
      title: 'Control',
      description: 'You have full control over your personal information',
    },
    {
      icon: Server,
      title: 'Minimal Collection',
      description: 'We only collect data necessary to provide our services',
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
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-400">Last updated: {lastUpdated}</p>
        </div>

        {/* Privacy Principles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mb-4 mx-auto">
                <principle.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{principle.title}</h3>
              <p className="text-gray-400 text-sm">{principle.description}</p>
            </div>
          ))}
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We collect information you provide directly to us, such as when
                you create an account, use our services, or contact us for
                support.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email, company details)</li>
                <li>Fleet and vehicle data you choose to input</li>
                <li>Usage data and analytics to improve our services</li>
                <li>Communication preferences and support interactions</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We use the information we collect to provide, maintain, and
                improve our services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our fleet management platform</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>
                  Respond to your comments, questions, and customer service
                  requests
                </li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              3. Information Sharing
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  With service providers who assist us in operating our platform
                </li>
                <li>To comply with legal obligations or protect our rights</li>
                <li>
                  In connection with a merger, acquisition, or sale of assets
                </li>
                <li>With your explicit consent for specific purposes</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              4. Data Security
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We implement industry-standard security measures to protect your
                information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>End-to-end encryption for data transmission</li>
                <li>
                  Secure data centers with physical and digital protections
                </li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data protection best practices</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              5. Your Rights and Choices
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                You have several rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              6. Cookies and Tracking
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We use cookies and similar technologies to improve your
                experience:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Essential cookies for platform functionality</li>
                <li>Analytics cookies to understand usage patterns</li>
                <li>Preference cookies to remember your settings</li>
                <li>You can control cookie settings in your browser</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              7. Data Retention
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We retain your information only as long as necessary to provide
                our services and comply with legal obligations. When you delete
                your account, we will delete your personal information within 30
                days, except for data we are required to retain for legal or
                regulatory purposes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              8. International Data Transfers
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your data in accordance with this
                privacy policy and applicable data protection laws.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              9. Children's Privacy
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Our services are not directed to children under 13, and we do
                not knowingly collect personal information from children under
                13. If we learn that we have collected such information, we will
                delete it promptly.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              10. Changes to This Policy
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the "Last updated" date. We encourage you
                to review this policy periodically.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              11. Contact Us
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                If you have any questions about this privacy policy or our data
                practices, please contact us:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p>
                  <strong>Email:</strong> privacy@dispatchar.com
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
          <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-gray-400 mb-6">
            We're committed to protecting your privacy and are happy to address
            any concerns you may have.
          </p>
          <Link
            href="/company/contact-us"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
          >
            Contact Our Privacy Team
          </Link>
        </div>
      </div>
    </div>
  );
}
