'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Truck, MapPin, FileText, Users } from 'lucide-react';
import DemoModal from './DemoModal';

export default function HeroSection() {
  const [currentText, setCurrentText] = useState(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const heroTexts = useMemo(
    () => [
      'Streamline Operations',
      'Eliminate Paperwork',
      'Connect Your Team',
      'Track Everything',
    ],
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full mix-blend-screen blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full mix-blend-screen blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-screen blur-3xl opacity-60 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50 text-sm font-medium mb-8">
            <Truck className="w-4 h-4 mr-2" />
            Trusted by 10,000+ trucking companies
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-100 mb-6 leading-tight">
            The Future of
            <br />
            <span className="gradient-text">{heroTexts[currentText]}</span>
            <br />
            is Here
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionize your trucking and logistics operations with Dispatch.
            Say goodbye to endless paperwork, long check-in queues, and
            communication gaps. Welcome to seamless collaboration, instant
            document sharing, and real-time tracking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/auth/signup"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="group flex items-center px-8 py-4 rounded-xl border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 font-semibold text-lg text-gray-200 hover:text-blue-400"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Interactive Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100">50K+</div>
              <div className="text-gray-400">Active Vehicles</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100">1M+</div>
              <div className="text-gray-400">Documents</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100">25K+</div>
              <div className="text-gray-400">Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Demo Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </section>
  );
}
