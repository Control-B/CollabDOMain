'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  MapPin,
  FileText,
  Users,
  Clock,
  Shield,
  Smartphone,
  MessageSquare,
  Truck,
  DollarSign,
  ChevronRight,
  Building,
  Phone,
  Mail,
  BookOpen,
  HelpCircle,
  FileBarChart,
  Zap,
  Globe,
  Play,
} from 'lucide-react';
import CollabLogo from './CollabLogo';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (itemName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 100);
  };

  // Helper functions for colorful gradients
  const getItemGradient = (itemName: string) => {
    switch (itemName) {
      case 'Features':
        return 'from-purple-500 via-pink-500 to-red-500';
      case 'Solutions':
        return 'from-blue-500 via-cyan-500 to-teal-500';
      case 'Pricing':
        return 'from-green-500 via-emerald-500 to-teal-500';
      case 'Resources':
        return 'from-indigo-500 via-purple-500 to-pink-500';
      case 'Company':
        return 'from-orange-500 via-amber-500 to-yellow-500';
      default:
        return 'from-blue-500 to-indigo-500';
    }
  };

  const getSubItemGradient = (index: number) => {
    const gradients = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-cyan-500 to-teal-500',
      'from-teal-500 to-green-500',
      'from-green-500 to-emerald-500',
      'from-emerald-500 to-lime-500',
      'from-yellow-500 to-orange-500',
      'from-orange-500 to-red-500',
    ];
    return gradients[index % gradients.length];
  };

  const navItems = [
    {
      name: 'Features',
      href: '#features',
      description: 'Powerful tools to streamline operations',
      items: [
        {
          name: 'Geofence Check-ins',
          description: 'Automated check-ins when drivers enter zones',
          icon: MapPin,
          href: '/features/geofence-check-ins',
        },
        {
          name: 'Paperless Documents',
          description: 'Digital document management and signatures',
          icon: FileText,
          href: '/features/paperless-documents',
        },
        {
          name: 'Team Collaboration',
          description: 'Real-time messaging and communication',
          icon: Users,
          href: '/features/team-collaboration',
        },
        {
          name: 'Real-time Tracking',
          description: 'Live GPS tracking and delivery updates',
          icon: Clock,
          href: '/features/real-time-tracking',
        },
        {
          name: 'Compliance Management',
          description: 'Automated logging and regulatory reporting',
          icon: Shield,
          href: '/features/compliance-management',
        },
        {
          name: 'Mobile First',
          description: 'Works offline and syncs when connected',
          icon: Smartphone,
          href: '/features/mobile-first',
        },
      ],
    },
    {
      name: 'Solutions',
      href: '/#solutions',
      description: 'Industry-specific solutions',
      items: [
        {
          name: 'Fleet Management',
          description: 'Complete fleet oversight and optimization',
          icon: Truck,
          href: '/solutions/fleet-management',
        },
        {
          name: 'Load Optimization',
          description: 'Maximize cargo efficiency and routing',
          icon: MessageSquare,
          href: '/solutions/load-optimization',
        },
        {
          name: 'Enterprise Solutions',
          description: 'Scalable solutions for large operations',
          icon: Building,
          href: '/solutions/enterprise-solutions',
        },
      ],
    },
    {
      name: 'Pricing',
      href: '#pricing',
      description: 'Simple, transparent pricing',
      items: [
        {
          name: 'Starter Plan',
          description: 'Perfect for small fleets getting started',
          icon: DollarSign,
          href: '#pricing',
        },
        {
          name: 'Professional Plan',
          description: 'Advanced features for growing businesses',
          icon: DollarSign,
          href: '#pricing',
        },
        {
          name: 'Enterprise Plan',
          description: 'Custom solutions for large operations',
          icon: DollarSign,
          href: '#pricing',
        },
      ],
    },
    {
      name: 'Resources',
      href: '#resources',
      description: 'Helpful guides and documentation',
      items: [
        {
          name: 'Documentation',
          description: 'Complete guides and API reference',
          icon: BookOpen,
          href: '/resources/documentation',
        },
        {
          name: 'Help Center',
          description: 'FAQs and troubleshooting guides',
          icon: HelpCircle,
          href: '/resources/help-center',
        },
        {
          name: 'Case Studies',
          description: 'Real-world success stories',
          icon: FileBarChart,
          href: '/resources/case-studies',
        },
        {
          name: 'Best Practices',
          description: 'Industry tips and optimization guides',
          icon: Zap,
          href: '/resources/best-practices',
        },
        {
          name: 'Community',
          description: 'Connect with other users and experts',
          icon: Globe,
          href: '/resources/community',
        },
      ],
    },
    {
      name: 'Company',
      href: '#about',
      description: 'Learn about our mission and team',
      items: [
        {
          name: 'About Us',
          description: 'Our story and mission in trucking',
          icon: Building,
          href: '/company/about-us',
        },
        {
          name: 'Contact Us',
          description: 'Get in touch with our team',
          icon: Phone,
          href: '/company/contact-us',
        },
        {
          name: 'Support',
          description: '24/7 customer support and resources',
          icon: Mail,
          href: '#contact',
        },
      ],
    },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/80 backdrop-blur-md border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <CollabLogo className="w-10 h-10" title="Dispatchar" />
            <span className="text-xl font-bold" style={{ color: 'white' }}>
              Dispatchar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className="transition-colors duration-200 font-medium py-2 px-1 flex items-center"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  {item.name}
                </Link>

                {/* Colorful Hover Dropdown */}
                {hoveredItem === item.name && (
                  <div
                    className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 ${
                      item.name === 'Features' ? 'w-[600px]' : 'w-96'
                    } bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-gray-700/50`}
                  >
                    {/* Colorful Header */}
                    <div
                      className={`px-6 py-4 bg-gradient-to-r ${getItemGradient(
                        item.name,
                      )} text-white`}
                    >
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-white/90 text-sm">
                        {item.description}
                      </p>
                    </div>

                    {/* Content */}
                    <div
                      className={`p-4 ${
                        item.name === 'Features'
                          ? 'grid grid-cols-2 gap-2'
                          : 'space-y-2'
                      }`}
                    >
                      {item.items.map((subItem, index) => (
                        <Link
                          key={index}
                          href={subItem.href}
                          className={`flex items-start ${
                            item.name === 'Features'
                              ? 'space-x-2 p-2'
                              : 'space-x-2.5 p-2.5'
                          } rounded-xl hover:bg-gray-800/50 transition-all duration-200 group`}
                        >
                          <div
                            className={`flex-shrink-0 ${
                              item.name === 'Features'
                                ? 'w-10 h-10'
                                : 'w-11 h-11'
                            } rounded-lg flex items-center justify-center bg-gradient-to-br ${getSubItemGradient(
                              index,
                            )} shadow-lg group-hover:scale-110 transition-transform duration-200`}
                          >
                            <subItem.icon
                              className={`${
                                item.name === 'Features' ? 'w-5 h-5' : 'w-5 h-5'
                              } text-white`}
                            />
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`font-semibold transition-colors ${
                                item.name === 'Features'
                                  ? 'text-sm'
                                  : 'text-base'
                              }`}
                              style={{ color: 'white' }}
                            >
                              {subItem.name}
                            </h4>
                            <p
                              className={`text-gray-300 mt-1 leading-relaxed ${
                                item.name === 'Features' ? 'text-xs' : 'text-sm'
                              }`}
                            >
                              {subItem.description}
                            </p>
                          </div>
                          <ChevronRight
                            className={`${
                              item.name === 'Features'
                                ? 'w-4 h-4 mt-0.5'
                                : 'w-4 h-4 mt-1'
                            } text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 opacity-50 group-hover:opacity-100`}
                          />
                        </Link>
                      ))}
                    </div>

                    {/* Colorful Footer CTA */}
                    <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700/50">
                      <Link
                        href={item.href}
                        className={`inline-flex items-center text-sm font-semibold transition-opacity hover:opacity-80`}
                      >
                        <span
                          className={`bg-gradient-to-r ${getItemGradient(
                            item.name,
                          )} bg-clip-text text-transparent`}
                        >
                          View all {item.name.toLowerCase()}
                        </span>
                        <ChevronRight className="w-4 h-4 ml-1 text-gray-500" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/signin"
              className="transition-colors duration-200 font-medium"
              style={{ color: 'white' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white';
              }}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              style={{ color: 'white' }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/90 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-800">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 hover:bg-gray-800 rounded-md transition-colors duration-200 font-medium"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 hover:bg-gray-800 rounded-md transition-colors duration-200 font-medium"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium mx-3 mt-2"
                  style={{ color: 'white' }}
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
