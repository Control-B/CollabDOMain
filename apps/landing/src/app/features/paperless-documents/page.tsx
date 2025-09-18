'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  Upload,
  Signature,
  Cloud,
  Search,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PaperlessDocumentsPage() {
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  const documentWorkflow = [
    {
      title: 'Upload & Capture',
      description: 'Scan or photograph documents instantly',
      icon: Upload,
      color: 'from-blue-500 to-indigo-500',
      features: [
        'Mobile camera scanning',
        'Bulk document upload',
        'OCR text recognition',
        'Auto-categorization',
      ],
    },
    {
      title: 'Digital Signatures',
      description: 'Sign documents electronically with legal validity',
      icon: Signature,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Legally binding e-signatures',
        'Multi-party signing',
        'Signature audit trail',
        'Template creation',
      ],
    },
    {
      title: 'Secure Storage',
      description: 'Store documents safely in the cloud',
      icon: Cloud,
      color: 'from-green-500 to-teal-500',
      features: [
        'Encrypted cloud storage',
        'Version control',
        'Backup & recovery',
        'Compliance ready',
      ],
    },
    {
      title: 'Smart Search',
      description: 'Find any document instantly',
      icon: Search,
      color: 'from-orange-500 to-red-500',
      features: [
        'Full-text search',
        'Tag-based filtering',
        'Date range searches',
        'Advanced filters',
      ],
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: '75% Time Savings',
      description: 'Eliminate paper filing and manual document handling',
      metric: '2.5 hrs/day',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: '100% Secure',
      description: 'Bank-level encryption keeps documents safe',
      metric: 'Zero breaches',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: FileText,
      title: 'Unlimited Storage',
      description: 'Never run out of space for your documents',
      metric: '∞ documents',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: CheckCircle,
      title: 'DOT Compliant',
      description: 'Meet all regulatory requirements digitally',
      metric: '100% compliance',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const documentTypes = [
    'Bills of Lading',
    'Delivery Receipts',
    'Inspection Reports',
    'Driver Logs',
    'Fuel Receipts',
    'Maintenance Records',
    'Insurance Documents',
    'Permits & Licenses',
    'Customer Contracts',
    'Rate Confirmations',
    'Load Confirmations',
    'POD Forms',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50 text-sm font-medium mb-6">
                <FileText className="w-4 h-4 mr-2" />
                Digital Document Management
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Go Completely
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Paperless
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Digitize, sign, and manage all your trucking documents in one
                secure platform. Eliminate filing cabinets and never lose
                another document.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  Go Digital Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Document Preview */}
            <div className="relative animate-fade-in-up animate-delay-200">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Recent Documents
                  </h3>
                  <Upload className="w-5 h-5 text-blue-400" />
                </div>

                <div className="space-y-3">
                  {[
                    {
                      name: 'Bill of Lading #BL-2024-001',
                      status: 'Signed',
                      color: 'green',
                    },
                    {
                      name: 'Delivery Receipt - Walmart DC',
                      status: 'Pending',
                      color: 'orange',
                    },
                    {
                      name: 'Fuel Receipt - Pilot #4455',
                      status: 'Uploaded',
                      color: 'blue',
                    },
                    {
                      name: 'DOT Inspection Report',
                      status: 'Signed',
                      color: 'green',
                    },
                  ].map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-white">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.color === 'green'
                            ? 'bg-green-900/30 text-green-300'
                            : doc.color === 'orange'
                            ? 'bg-orange-900/30 text-orange-300'
                            : 'bg-blue-900/30 text-blue-300'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300">
                  Upload New Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Complete Document Workflow
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From capture to storage, handle every aspect of document
              management digitally
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {documentWorkflow.map((step, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveWorkflow(index)}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${step.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-1">
                  {step.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`w-1 h-1 rounded-full bg-gradient-to-r ${step.color}`}
                      />
                      <span className="text-xs text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Immediate Benefits
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                See why companies switch to digital document management
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${benefit.color} shadow-lg flex-shrink-0`}
                    >
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div
                        className={`text-2xl font-bold mb-1 bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}
                      >
                        {benefit.metric}
                      </div>
                      <h3 className="font-semibold text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 animate-fade-in-up animate-delay-200">
              <h3 className="text-xl font-bold text-white mb-6">
                Supported Document Types
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {documentTypes.map((type, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">{type}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/50">
                <p className="text-sm text-blue-300">
                  <strong>Plus many more!</strong> Our system can handle any
                  document type your trucking business uses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Go Paperless?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of trucking companies saving time and money with
            digital documents
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg"
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

      <Footer />
    </div>
  );
}
