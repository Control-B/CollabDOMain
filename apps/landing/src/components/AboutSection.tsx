'use client';

import { Users, Target, Award, Heart } from 'lucide-react';

export default function AboutSection() {
  const stats = [
    { number: '10,000+', label: 'Companies Trust Us', icon: Users },
    { number: '50,000+', label: 'Active Vehicles', icon: Target },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Award },
    { number: '24/7', label: 'Support Available', icon: Heart },
  ];

  const values = [
    {
      title: 'Innovation',
      description:
        "We're constantly pushing the boundaries of what's possible in trucking technology, bringing you the latest innovations to stay ahead of the competition.",
    },
    {
      title: 'Reliability',
      description:
        "Your operations depend on us. That's why we've built Dispatch with enterprise-grade reliability and 99.9% uptime guarantee.",
    },
    {
      title: 'Simplicity',
      description:
        "Complex problems deserve simple solutions. We've designed Dispatch to be intuitive and easy to use, so your team can focus on what matters most.",
    },
    {
      title: 'Partnership',
      description:
        "We're not just a software vendor - we're your technology partner, committed to your success and growth in the trucking industry.",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Story: Born from
            <span className="gradient-text"> Real Experience</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Dispatch was founded by trucking industry veterans who experienced
            firsthand the pain points of traditional fleet management. After
            years of dealing with paperwork, communication gaps, and inefficient
            processes, we set out to build a solution that would revolutionize
            the industry.
          </p>
        </div>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              The Problem
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Traditional trucking operations are bogged down by:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  Endless paperwork and manual processes
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  Long check-in queues at terminals
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  Communication gaps between drivers and dispatch
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  Lost documents and compliance issues
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  Lack of real-time visibility into operations
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-green-600 mb-4">
              Our Solution
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Dispatch transforms your operations with:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  Automated geofence check-ins
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  Paperless document management
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  Real-time team communication
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  Digital signatures and compliance
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  Complete operational visibility
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            These principles guide everything we do and every decision we make.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {value.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-xl leading-relaxed">
              To revolutionize the trucking and logistics industry by providing
              innovative, reliable, and easy-to-use technology that empowers
              companies to operate more efficiently, reduce costs, and deliver
              exceptional service to their customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
