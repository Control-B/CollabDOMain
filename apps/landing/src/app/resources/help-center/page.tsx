'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ArrowRight,
  MapPin,
  FileText,
  Users,
  Clock,
  Shield,
  Smartphone,
  Truck,
  MessageSquare,
  CheckCircle,
  Zap,
  BarChart3,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  BookOpen,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HelpCenterPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'overview',
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const tableOfContents = [
    { id: 'overview', title: 'Platform Overview', icon: BookOpen },
    { id: 'geofence', title: 'Geofence Check-ins', icon: MapPin },
    { id: 'documents', title: 'Paperless Documents', icon: FileText },
    { id: 'collaboration', title: 'Team Collaboration', icon: Users },
    { id: 'tracking', title: 'Real-time Tracking', icon: Clock },
    { id: 'fleet', title: 'Fleet Management', icon: Truck },
    { id: 'support', title: 'Getting Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4 mr-2" />
            Complete Documentation
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Dispatchar Guide
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Your comprehensive guide to mastering Dispatchar's powerful
            features. Learn how to streamline your logistics operations,
            eliminate paperwork, and boost efficiency with our cutting-edge
            platform.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleSection(item.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        expandedSection === item.id
                          ? 'bg-blue-900/50 text-blue-300 border border-blue-800/50'
                          : 'hover:bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.title}</span>
                      <ChevronRight
                        className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                          expandedSection === item.id ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {/* Platform Overview */}
                {expandedSection === 'overview' && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 animate-fade-in-up">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        Platform Overview
                      </h2>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Dispatchar is a comprehensive trucking and logistics
                        collaboration platform designed to eliminate paperwork,
                        streamline workflows, and connect your entire team. Our
                        platform serves drivers, dispatchers, fleet managers,
                        and back-office staff with powerful tools that work
                        seamlessly together.
                      </p>

                      <h3 className="text-xl font-semibold text-white mb-4">
                        Core Capabilities
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-400 mb-2">
                            Automation
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Automate check-ins, document sharing, and compliance
                            tracking to save hours of manual work daily.
                          </p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h4 className="font-semibold text-green-400 mb-2">
                            Collaboration
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Real-time communication between drivers,
                            dispatchers, and office staff with instant messaging
                            and document sharing.
                          </p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h4 className="font-semibold text-purple-400 mb-2">
                            Visibility
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Complete visibility into fleet operations with
                            real-time tracking, analytics, and reporting.
                          </p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h4 className="font-semibold text-orange-400 mb-2">
                            Compliance
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Automated compliance management ensuring all
                            regulations are met without additional
                            administrative burden.
                          </p>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-4">
                        Who Uses Dispatchar?
                      </h3>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>
                            <strong>Fleet Managers:</strong> Optimize
                            operations, track performance, and manage compliance
                            across entire fleets.
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>
                            <strong>Dispatchers:</strong> Coordinate loads,
                            communicate with drivers, and track deliveries in
                            real-time.
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>
                            <strong>Drivers:</strong> Access load information,
                            check in automatically, and communicate seamlessly
                            with dispatch.
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>
                            <strong>Back-office Staff:</strong> Handle
                            documentation, billing, and compliance with
                            streamlined digital processes.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Geofence Check-ins */}
                {expandedSection === 'geofence' && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 animate-fade-in-up">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-4">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        Geofence Check-ins
                      </h2>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Eliminate manual check-ins with GPS-powered geofencing
                        technology. Drivers are automatically checked in when
                        they enter predefined zones, saving time and ensuring
                        100% compliance.
                      </p>

                      <h3 className="text-xl font-semibold text-white mb-4">
                        How It Works
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                1
                              </span>
                              <h4 className="font-semibold text-white">
                                Zone Setup
                              </h4>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Create custom geofence zones around facilities,
                              customers, or pickup/delivery locations.
                            </p>
                          </div>
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                2
                              </span>
                              <h4 className="font-semibold text-white">
                                Automatic Detection
                              </h4>
                            </div>
                            <p className="text-gray-300 text-sm">
                              GPS automatically detects when vehicles enter or
                              exit designated zones.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                3
                              </span>
                              <h4 className="font-semibold text-white">
                                Instant Check-in
                              </h4>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Check-ins are recorded instantly without any
                              driver action required.
                            </p>
                          </div>
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                4
                              </span>
                              <h4 className="font-semibold text-white">
                                Real-time Updates
                              </h4>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Dispatch and office receive immediate
                              notifications of all check-ins and status changes.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-emerald-400 mb-2">
                          💡 Pro Tip
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Set up different geofence sizes for different location
                          types - larger zones for truck stops and smaller,
                          precise zones for customer facilities.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Start CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Transform your logistics operations today. Join thousands of
                    companies already using Dispatchar to streamline their
                    workflows.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/auth/signup"
                      className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                    >
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                    <Link
                      href="#"
                      className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                    >
                      Schedule Demo
                      <PlayCircle className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
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
