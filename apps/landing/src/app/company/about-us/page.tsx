'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ArrowRight,
  Target,
  Heart,
  Zap,
  Shield,
  Award,
  Globe,
  Calendar,
  TrendingUp,
  CheckCircle,
  MapPin,
  Coffee,
  Lightbulb,
  Handshake,
  Star,
  Building,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AboutUsPage() {
  const [activeTimeline, setActiveTimeline] = useState(0);

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly pushing the boundaries of logistics technology',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: "Every decision is made with our customers' success in mind",
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'Streamlining operations to save time and reduce costs',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Building trust through consistent, dependable service',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    {
      number: '10,000+',
      label: 'Companies',
      description: 'Trusted by trucking companies worldwide',
    },
    {
      number: '500M+',
      label: 'Miles Tracked',
      description: 'Miles optimized through our platform',
    },
    {
      number: '99.9%',
      label: 'Uptime',
      description: 'Reliable service you can count on',
    },
    {
      number: '24/7',
      label: 'Support',
      description: 'Round-the-clock customer assistance',
    },
  ];

  const timeline = [
    {
      year: '2019',
      title: 'The Beginning',
      description:
        'Founded by logistics veterans who experienced firsthand the inefficiencies in traditional trucking operations.',
      milestone: 'Company Founded',
      icon: Lightbulb,
    },
    {
      year: '2020',
      title: 'First Platform Launch',
      description:
        'Launched our MVP with basic load optimization and tracking features for 50 pilot customers.',
      milestone: 'MVP Release',
      icon: Zap,
    },
    {
      year: '2021',
      title: 'Rapid Growth',
      description:
        'Expanded to serve 1,000+ companies and introduced mobile apps for drivers and dispatchers.',
      milestone: '1,000 Customers',
      icon: TrendingUp,
    },
    {
      year: '2022',
      title: 'AI Integration',
      description:
        'Launched AI-powered optimization engine, reducing customer fuel costs by an average of 25%.',
      milestone: 'AI Launch',
      icon: Target,
    },
    {
      year: '2023',
      title: 'Scale Achievement',
      description:
        'Reached 10,000+ companies and 500M+ miles tracked. Achieved 99.9% uptime reliability.',
      milestone: '10K Customers',
      icon: Award,
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description:
        'Expanded internationally and launched advanced compliance features for global markets.',
      milestone: 'Global Reach',
      icon: Globe,
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      background: '15 years in logistics, former VP at major trucking company',
      expertise: 'Strategic Leadership',
    },
    {
      name: 'Mike Chen',
      role: 'CTO & Co-Founder',
      background: 'Former senior engineer at Google, PhD in Computer Science',
      expertise: 'AI & Machine Learning',
    },
    {
      name: 'David Rodriguez',
      role: 'VP of Engineering',
      background: '12 years building scalable platforms at Amazon and Uber',
      expertise: 'Platform Architecture',
    },
    {
      name: 'Lisa Thompson',
      role: 'VP of Customer Success',
      background: '10 years in trucking operations, former dispatcher',
      expertise: 'Customer Experience',
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
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-900/30 text-orange-300 border border-orange-800/50 text-sm font-medium mb-6">
                <Building className="w-4 h-4 mr-2" />
                Founded in 2019
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transforming{' '}
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  Logistics
                </span>
                <br />
                Through Innovation
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-xl lg:max-w-none mx-auto leading-relaxed">
                We're revolutionizing the trucking industry with innovative
                technology that connects drivers, dispatchers, and fleet
                managers like never before. Our mission is to make logistics
                more efficient, profitable, and sustainable.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
                >
                  Join Our Mission
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/company/contact-us"
                  className="group flex items-center px-8 py-4 rounded-xl border-2 border-gray-700 hover:border-orange-500 transition-all duration-300 font-semibold text-gray-200 hover:text-orange-400"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative w-full max-w-lg mx-auto lg:max-w-none animate-fade-in-up animate-delay-200">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-950 aspect-video">
                {/* Animated Company Growth Visualization */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 300"
                  fill="none"
                >
                  <defs>
                    <linearGradient
                      id="growth-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                    <linearGradient
                      id="team-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>

                  {/* Background Network */}
                  <circle
                    cx="100"
                    cy="80"
                    r="25"
                    fill="none"
                    stroke="url(#growth-gradient)"
                    strokeWidth="2"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="25;35;25"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="300"
                    cy="80"
                    r="25"
                    fill="none"
                    stroke="url(#growth-gradient)"
                    strokeWidth="2"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="25;35;25"
                      dur="4.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="200"
                    cy="200"
                    r="30"
                    fill="none"
                    stroke="url(#growth-gradient)"
                    strokeWidth="2"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="30;40;30"
                      dur="3.5s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Connecting Lines */}
                  <line
                    x1="100"
                    y1="80"
                    x2="300"
                    y2="80"
                    stroke="url(#team-gradient)"
                    strokeWidth="2"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.4;0.8;0.4"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1="100"
                    y1="80"
                    x2="200"
                    y2="200"
                    stroke="url(#team-gradient)"
                    strokeWidth="2"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.4;0.8;0.4"
                      dur="2.2s"
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1="300"
                    y1="80"
                    x2="200"
                    y2="200"
                    stroke="url(#team-gradient)"
                    strokeWidth="2"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.4;0.8;0.4"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </line>

                  {/* Team Member Nodes */}
                  <circle cx="100" cy="80" r="12" fill="url(#team-gradient)">
                    <animate
                      attributeName="r"
                      values="12;15;12"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="300" cy="80" r="12" fill="url(#team-gradient)">
                    <animate
                      attributeName="r"
                      values="12;15;12"
                      dur="3.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="200" cy="200" r="12" fill="url(#team-gradient)">
                    <animate
                      attributeName="r"
                      values="12;15;12"
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Additional Team Members (Growing Network) */}
                  <circle
                    cx="50"
                    cy="150"
                    r="8"
                    fill="url(#growth-gradient)"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;0.7;0"
                      dur="4s"
                      repeatCount="indefinite"
                      begin="1s"
                    />
                  </circle>
                  <circle
                    cx="350"
                    cy="150"
                    r="8"
                    fill="url(#growth-gradient)"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;0.7;0"
                      dur="4s"
                      repeatCount="indefinite"
                      begin="1.5s"
                    />
                  </circle>
                  <circle
                    cx="200"
                    cy="120"
                    r="8"
                    fill="url(#growth-gradient)"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;0.7;0"
                      dur="4s"
                      repeatCount="indefinite"
                      begin="2s"
                    />
                  </circle>

                  {/* Growth Metrics */}
                  <text
                    x="50"
                    y="40"
                    fill="url(#growth-gradient)"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    2019 - Founded
                  </text>
                  <text
                    x="200"
                    y="40"
                    fill="url(#growth-gradient)"
                    fontSize="12"
                  >
                    10,000+ Companies
                  </text>
                  <text x="50" y="260" fill="url(#team-gradient)" fontSize="12">
                    Global Team
                  </text>
                  <text
                    x="250"
                    y="260"
                    fill="url(#team-gradient)"
                    fontSize="12"
                  >
                    Growing Network
                  </text>

                  {/* Progress Indicators */}
                  <rect
                    x="50"
                    y="270"
                    width="100"
                    height="6"
                    rx="3"
                    fill="rgba(249, 115, 22, 0.2)"
                  />
                  <rect
                    x="50"
                    y="270"
                    width="85"
                    height="6"
                    rx="3"
                    fill="url(#growth-gradient)"
                  >
                    <animate
                      attributeName="width"
                      values="0;85;85;0"
                      dur="5s"
                      repeatCount="indefinite"
                    />
                  </rect>

                  <rect
                    x="250"
                    y="270"
                    width="100"
                    height="6"
                    rx="3"
                    fill="rgba(139, 92, 246, 0.2)"
                  />
                  <rect
                    x="250"
                    y="270"
                    width="92"
                    height="6"
                    rx="3"
                    fill="url(#team-gradient)"
                  >
                    <animate
                      attributeName="width"
                      values="0;92;92;0"
                      dur="5.5s"
                      repeatCount="indefinite"
                    />
                  </rect>
                </svg>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-2">
                      Our Growing Team
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Passionate about transforming logistics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 mb-16">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${value.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
              >
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-400 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From a small startup to a leading logistics platform, see how
              we've grown and evolved to serve the trucking industry.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-700 h-full hidden md:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center md:justify-start">
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full hidden md:flex items-center justify-center shadow-lg z-10">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div
                      className={`w-full md:w-5/12 ${
                        index % 2 === 0
                          ? 'md:pr-8 md:text-right'
                          : 'md:pl-8 md:ml-auto'
                      }`}
                    >
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center md:hidden">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mr-3">
                              <item.icon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <span className="text-2xl font-bold text-orange-400">
                            {item.year}
                          </span>
                          <span className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-xs font-medium">
                            {item.milestone}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Meet Our{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Leadership Team
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our experienced leadership team combines deep industry knowledge
              with cutting-edge technology expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <h3 className="text-lg font-bold text-white mb-1 text-center">
                  {member.name}
                </h3>
                <p className="text-blue-400 text-sm mb-3 text-center font-medium">
                  {member.role}
                </p>
                <p className="text-gray-400 text-xs mb-3 text-center leading-relaxed">
                  {member.background}
                </p>
                <div className="flex items-center justify-center">
                  <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs font-medium">
                    {member.expertise}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Culture & Values
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We believe that great products come from great teams. Here's what
              makes Dispatchar a special place to work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Remote-First',
                description:
                  'Work from anywhere with flexible schedules and strong remote collaboration tools.',
                icon: Globe,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Continuous Learning',
                description:
                  'Annual learning budgets, conference attendance, and internal knowledge sharing.',
                icon: Lightbulb,
                color: 'from-purple-500 to-indigo-500',
              },
              {
                title: 'Customer-Centric',
                description:
                  'Every team member understands our customers and contributes to their success.',
                icon: Heart,
                color: 'from-red-500 to-pink-500',
              },
              {
                title: 'Innovation Focus',
                description:
                  '20% time for exploring new ideas and contributing to open source projects.',
                icon: Zap,
                color: 'from-yellow-500 to-orange-500',
              },
              {
                title: 'Work-Life Balance',
                description:
                  'Unlimited PTO, mental health support, and respect for personal time.',
                icon: Coffee,
                color: 'from-green-500 to-emerald-500',
              },
              {
                title: 'Diverse & Inclusive',
                description:
                  'Building a team that reflects the diversity of the customers we serve.',
                icon: Handshake,
                color: 'from-indigo-500 to-purple-500',
              },
            ].map((culture, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${culture.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <culture.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {culture.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {culture.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-900/20 to-amber-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Join Us?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            We're always looking for talented individuals who share our passion
            for transforming the logistics industry. Join our growing team and
            make an impact.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Engineering</h3>
              <p className="text-gray-400 text-sm mb-4">
                Build scalable platforms that move the industry forward
              </p>
              <span className="text-blue-400 text-xs font-medium">
                5 Open Positions
              </span>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Customer Success
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Help our customers achieve their logistics goals
              </p>
              <span className="text-green-400 text-xs font-medium">
                3 Open Positions
              </span>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Sales & Marketing
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Grow our market reach and build lasting relationships
              </p>
              <span className="text-purple-400 text-xs font-medium">
                4 Open Positions
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#careers"
              className="group bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              View All Careers
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/company/contact-us"
              className="group flex items-center justify-center px-8 py-4 rounded-xl border-2 border-gray-700 hover:border-orange-500 transition-all duration-300 font-semibold text-gray-200 hover:text-orange-400"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
