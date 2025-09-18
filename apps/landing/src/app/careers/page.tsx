'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Zap,
  Heart,
  TrendingUp,
  Coffee,
  ExternalLink,
} from 'lucide-react';

export default function CareersPage() {
  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description:
        'Comprehensive health insurance, dental, and wellness programs',
    },
    {
      icon: TrendingUp,
      title: 'Growth Opportunities',
      description:
        'Professional development, training, and career advancement paths',
    },
    {
      icon: Clock,
      title: 'Work-Life Balance',
      description: 'Flexible hours, remote work options, and generous PTO',
    },
    {
      icon: Coffee,
      title: 'Great Culture',
      description:
        'Collaborative environment, team events, and modern workspace',
    },
  ];

  const departments = [
    {
      name: 'Engineering',
      openings: 3,
      description: 'Build the future of fleet management technology',
    },
    {
      name: 'Product',
      openings: 2,
      description: 'Shape user experiences and define product roadmaps',
    },
    {
      name: 'Sales',
      openings: 4,
      description: 'Help businesses transform their logistics operations',
    },
    {
      name: 'Customer Success',
      openings: 2,
      description: 'Ensure our customers achieve success with our platform',
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-6">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're building the future of logistics and fleet management. Join
            our passionate team of innovators who are transforming how
            businesses move goods and manage their operations.
          </p>
        </div>

        {/* Company Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
            <div className="text-gray-400">Team Members</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">15+</div>
            <div className="text-gray-400">Countries</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
            <div className="text-gray-400">Support Coverage</div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We believe in taking care of our team so they can do their best
              work
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mb-4">
                  <benefit.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're rapidly growing and looking for talented individuals to join
              our team
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-gray-800/30 rounded-xl border border-gray-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{dept.name}</h3>
                    <p className="text-gray-400">{dept.description}</p>
                  </div>
                  <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                    {dept.openings} open
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 p-8 mb-16">
          <div className="text-center">
            <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">We're Growing Fast!</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We're currently setting up our hiring process and will be posting
              detailed job descriptions soon. In the meantime, we'd love to hear
              from passionate individuals who want to join our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/company/contact-us"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
              >
                Get in Touch
                <ExternalLink className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Remote Work */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Remote-First Company</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            We believe the best talent can be found anywhere. Our team works
            remotely from around the world, collaborating to build amazing
            products for our customers.
          </p>
          <div className="flex items-center justify-center text-gray-400">
            <MapPin className="w-5 h-5 mr-2" />
            <span>Tampa, FL (HQ) • Remote Worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
}
