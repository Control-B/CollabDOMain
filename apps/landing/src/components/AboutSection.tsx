'use client';

import { Lightbulb, Shield, Zap, Handshake } from 'lucide-react';

export default function AboutSection() {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description:
        "We're constantly pushing the boundaries of what's possible in trucking technology, bringing you the latest innovations to stay ahead of the competition.",
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      iconBg: 'from-yellow-400 to-orange-500',
      animatedIcon: (
        <div className="relative">
          <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
            {/* Lightbulb base */}
            <circle
              cx="40"
              cy="45"
              r="18"
              fill="url(#lightbulb-gradient)"
              className="animate-pulse"
            />
            {/* Lightbulb filament */}
            <path
              d="M32 38 L48 38 M34 42 L46 42 M36 46 L44 46"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              className="animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
            {/* Lightbulb screw threads */}
            <rect
              x="36"
              y="60"
              width="8"
              height="3"
              fill="rgba(156,163,175,0.8)"
              rx="1"
            />
            <rect
              x="36"
              y="64"
              width="8"
              height="3"
              fill="rgba(156,163,175,0.8)"
              rx="1"
            />
            {/* Sparkling effects */}
            <circle
              cx="25"
              cy="30"
              r="2"
              fill="#fbbf24"
              className="animate-ping"
            />
            <circle
              cx="55"
              cy="35"
              r="1.5"
              fill="#f59e0b"
              className="animate-ping"
              style={{ animationDelay: '0.3s' }}
            />
            <circle
              cx="50"
              cy="25"
              r="1"
              fill="#eab308"
              className="animate-ping"
              style={{ animationDelay: '0.6s' }}
            />
            <defs>
              <linearGradient
                id="lightbulb-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ),
    },
    {
      icon: Shield,
      title: 'Reliability',
      description:
        "Your operations depend on us. That's why we've built Dispatchar with enterprise-grade reliability and 99.9% uptime guarantee.",
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      iconBg: 'from-green-400 to-emerald-500',
      animatedIcon: (
        <div className="relative">
          <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
            {/* Shield outline */}
            <path
              d="M40 8 L60 18 L60 40 C60 55 40 68 40 68 C40 68 20 55 20 40 L20 18 L40 8 Z"
              fill="url(#shield-gradient)"
              stroke="rgba(16,185,129,0.5)"
              strokeWidth="2"
              className="animate-pulse"
            />
            {/* Checkmark */}
            <path
              d="M30 38 L36 44 L50 30"
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
              style={{ animationDelay: '0.3s' }}
            />
            {/* Protective rings */}
            <circle
              cx="40"
              cy="38"
              r="25"
              fill="none"
              stroke="rgba(16,185,129,0.3)"
              strokeWidth="1"
              className="animate-ping"
            />
            <circle
              cx="40"
              cy="38"
              r="30"
              fill="none"
              stroke="rgba(16,185,129,0.2)"
              strokeWidth="1"
              className="animate-ping"
              style={{ animationDelay: '0.5s' }}
            />
            <defs>
              <linearGradient
                id="shield-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ),
    },
    {
      icon: Zap,
      title: 'Simplicity',
      description:
        "Complex problems deserve simple solutions. We've designed Dispatchar to be intuitive and easy to use, so your team can focus on what matters most.",
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      iconBg: 'from-purple-400 to-violet-500',
      animatedIcon: (
        <div className="relative">
          <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
            {/* Lightning bolt */}
            <path
              d="M45 10 L25 35 L35 35 L30 65 L50 40 L40 40 L45 10 Z"
              fill="url(#lightning-gradient)"
              className="animate-pulse"
            />
            {/* Energy waves */}
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="rgba(147,51,234,0.3)"
              strokeWidth="2"
              className="animate-ping"
            />
            <circle
              cx="40"
              cy="40"
              r="25"
              fill="none"
              stroke="rgba(147,51,234,0.4)"
              strokeWidth="1"
              className="animate-ping"
              style={{ animationDelay: '0.3s' }}
            />
            {/* Sparks */}
            <circle
              cx="20"
              cy="25"
              r="1.5"
              fill="#a855f7"
              className="animate-ping"
            />
            <circle
              cx="60"
              cy="55"
              r="1"
              fill="#8b5cf6"
              className="animate-ping"
              style={{ animationDelay: '0.4s' }}
            />
            <circle
              cx="15"
              cy="50"
              r="1"
              fill="#7c3aed"
              className="animate-ping"
              style={{ animationDelay: '0.7s' }}
            />
            <defs>
              <linearGradient
                id="lightning-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ),
    },
    {
      icon: Handshake,
      title: 'Partnership',
      description:
        "We're not just a software vendor - we're your technology partner, committed to your success and growth in the trucking industry.",
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      iconBg: 'from-blue-400 to-cyan-500',
      animatedIcon: (
        <div className="relative">
          <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
            {/* Left hand */}
            <path
              d="M15 45 C15 45 20 35 25 35 C30 35 35 40 35 45 L35 50"
              stroke="url(#handshake-gradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="animate-pulse"
            />
            {/* Right hand */}
            <path
              d="M65 45 C65 45 60 35 55 35 C50 35 45 40 45 45 L45 50"
              stroke="url(#handshake-gradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
            {/* Connection */}
            <circle
              cx="40"
              cy="47"
              r="8"
              fill="url(#handshake-gradient)"
              className="animate-pulse"
              style={{ animationDelay: '0.4s' }}
            />
            {/* Trust rings */}
            <circle
              cx="40"
              cy="47"
              r="15"
              fill="none"
              stroke="rgba(59,130,246,0.3)"
              strokeWidth="2"
              className="animate-ping"
            />
            <circle
              cx="40"
              cy="47"
              r="22"
              fill="none"
              stroke="rgba(59,130,246,0.2)"
              strokeWidth="1"
              className="animate-ping"
              style={{ animationDelay: '0.6s' }}
            />
            <defs>
              <linearGradient
                id="handshake-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Our Story: Born from Real Experience
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Dispatchar was founded by trucking industry veterans who experienced
            firsthand the pain points of traditional fleet management. After
            years of dealing with paperwork, communication gaps, and inefficient
            processes, we set out to build a solution that would revolutionize
            the industry.
          </p>
        </div>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="surface-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              The Problem
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                Traditional trucking operations are bogged down by:
              </p>
              <ul className="space-y-2 text-gray-400">
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

          <div className="surface-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>
              Our Solution
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                Dispatchar transforms your operations with:
              </p>
              <ul className="space-y-2 text-gray-400">
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

        {/* Values */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            These principles guide everything we do and every decision we make.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Subtle Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              {/* Glassmorphism Card */}
              <div className="relative bg-gray-900/95 border border-gray-700/50 group-hover:border-gray-600/50 rounded-3xl p-8 h-full transition-all duration-500 group-hover:shadow-2xl">
                {/* Subtle Floating Pattern Background */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 -translate-y-16 translate-x-16`}
                ></div>

                {/* Additional Color Accents */}
                <div
                  className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${value.gradient} rounded-full blur-2xl opacity-5 group-hover:opacity-15 transition-opacity duration-500 translate-y-12 -translate-x-12`}
                ></div>

                {/* Animated Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                    {value.animatedIcon}
                  </div>

                  {/* Icon with Gradient Background */}
                  <div
                    className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br ${value.iconBg} rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 shadow-lg`}
                  >
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3
                    className={`text-xl font-bold mb-4 transition-all duration-300 bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent`}
                  >
                    {value.title}
                  </h3>

                  <p className="text-gray-200 mb-6 leading-relaxed text-sm group-hover:text-gray-100 transition-colors duration-300">
                    {value.description}
                  </p>
                </div>

                {/* Subtle Hover Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                ></div>

                {/* Subtle Border Glow */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none blur-sm`}
                  style={{ padding: '2px', margin: '-2px' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>
              Our Mission
            </h3>
            <p className="text-xl leading-relaxed text-gray-300">
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
