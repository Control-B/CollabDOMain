'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  ArrowLeft,
  MapPin,
  Route,
  Bell,
  BarChart3,
  Navigation2,
  Truck,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function RealTimeTrackingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  const vehicles = [
    {
      id: 'TK-001',
      driver: 'Mike Johnson',
      location: 'I-95 S, Mile 45',
      status: 'On Route',
      eta: '2:30 PM',
      progress: 75,
    },
    {
      id: 'TK-002',
      driver: 'Sarah Wilson',
      location: 'Atlanta DC',
      status: 'Loading',
      eta: '4:15 PM',
      progress: 25,
    },
    {
      id: 'TK-003',
      driver: 'Tom Davis',
      location: 'Charlotte, NC',
      status: 'Delivered',
      eta: 'Completed',
      progress: 100,
    },
    {
      id: 'TK-004',
      driver: 'Lisa Chen',
      location: 'I-85 N, Mile 120',
      status: 'On Route',
      eta: '5:45 PM',
      progress: 60,
    },
  ];

  const trackingFeatures = [
    {
      icon: MapPin,
      title: 'Live GPS Tracking',
      description: 'Real-time location updates every 30 seconds',
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        'Precise location data',
        'Route optimization',
        'Geofence alerts',
        'Historical tracking',
      ],
    },
    {
      icon: Route,
      title: 'Route Optimization',
      description: 'AI-powered routing for efficiency and fuel savings',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        'Traffic-aware routing',
        'Fuel cost reduction',
        'Delivery time optimization',
        'Dynamic re-routing',
      ],
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Intelligent notifications for important events',
      color: 'from-orange-500 to-red-500',
      benefits: [
        'Delivery notifications',
        'Delay alerts',
        'Route deviations',
        'Emergency situations',
      ],
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive insights into fleet performance',
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Performance metrics',
        'Fuel efficiency reports',
        'Driver scorecards',
        'Custom dashboards',
      ],
    },
  ];

  const stats = [
    {
      number: '15%',
      label: 'Fuel Savings',
      description: 'Average fuel cost reduction through optimized routing',
    },
    {
      number: '25%',
      label: 'Faster Deliveries',
      description: 'Improved delivery times with real-time optimization',
    },
    {
      number: '90%',
      label: 'Customer Satisfaction',
      description: 'Customers love accurate ETAs and updates',
    },
    {
      number: '99.9%',
      label: 'Uptime',
      description: 'Reliable tracking data you can count on',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/50 text-sm font-medium mb-6">
                <Clock className="w-4 h-4 mr-2" />
                Live Fleet Visibility
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  Real-time Tracking
                </span>
                <br />
                That Actually Works
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Monitor your entire fleet with precision GPS tracking,
                intelligent routing, and predictive analytics. Know exactly
                where every vehicle is and when it will arrive.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  Start Tracking
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Live Tracking Dashboard */}
            <div className="relative animate-fade-in-up animate-delay-200">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Live Fleet Status
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {vehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedVehicle === index
                          ? 'bg-purple-900/30 border border-purple-700'
                          : 'bg-gray-700/50 hover:bg-gray-700/70'
                      }`}
                      onClick={() => setSelectedVehicle(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Truck className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="font-semibold text-white text-sm">
                              {vehicle.id}
                            </p>
                            <p className="text-xs text-gray-400">
                              {vehicle.driver}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            vehicle.status === 'On Route'
                              ? 'bg-blue-900/30 text-blue-300'
                              : vehicle.status === 'Loading'
                              ? 'bg-orange-900/30 text-orange-300'
                              : 'bg-green-900/30 text-green-300'
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {vehicle.location}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          ETA: {vehicle.eta}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-600 rounded-full h-1">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${vehicle.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {vehicle.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-400">4</div>
                    <div className="text-xs text-gray-400">Active</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-blue-400">847</div>
                    <div className="text-xs text-gray-400">Miles</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-purple-400">94%</div>
                    <div className="text-xs text-gray-400">On Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Complete Tracking Solution
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to monitor and optimize your fleet operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trackingFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-1">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="w-3 h-3 text-purple-400 flex-shrink-0" />
                      <span className="text-xs text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Proven Performance
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real results from companies using our tracking technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Track Your Fleet?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of fleet managers getting real-time visibility into
            their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg"
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
