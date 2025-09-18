'use client';

import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
} from 'lucide-react';
import CollabLogo from './CollabLogo';

// Custom X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Solutions', href: '#solutions' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'API Documentation', href: '/api-documentation' },
        { name: 'Integrations', href: '/integrations' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/company/about-us' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Partners', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', href: '/resources/help-center' },
        { name: 'Documentation', href: '/resources/documentation' },
        { name: 'Case Studies', href: '/resources/case-studies' },
        { name: 'Community', href: '/resources/community' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/company/contact-us' },
        { name: 'Status Page', href: '#' },
        { name: 'Security', href: '#' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: '#',
      label: 'Facebook',
      bgColor: 'hover:bg-blue-600',
      iconColor: 'text-blue-600 hover:text-white',
    },
    {
      icon: XIcon,
      href: '#',
      label: 'X (Twitter)',
      bgColor: 'hover:bg-black',
      iconColor: 'text-gray-200 hover:text-white',
    },
    {
      icon: Linkedin,
      href: '#',
      label: 'LinkedIn',
      bgColor: 'hover:bg-blue-700',
      iconColor: 'text-blue-700 hover:text-white',
    },
    {
      icon: Instagram,
      href: '#',
      label: 'Instagram',
      bgColor:
        'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500',
      iconColor: 'text-pink-500 hover:text-white',
    },
    {
      icon: Youtube,
      href: '#',
      label: 'YouTube',
      bgColor: 'hover:bg-red-600',
      iconColor: 'text-red-600 hover:text-white',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <CollabLogo className="w-8 h-8" />
              <span className="text-xl font-bold" style={{ color: 'white' }}>
                Dispatchar
              </span>
            </Link>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Revolutionizing trucking and logistics operations with innovative
              technology. Streamline your fleet management, eliminate paperwork,
              and connect your team like never before.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">support@dispatchar.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Tampa, FL</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: 'white' }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-2xl">
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: 'white' }}
            >
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-6">
              Get the latest updates on new features, industry insights, and
              best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm mb-4 md:mb-0" style={{ color: 'white' }}>
              © {currentYear} Dispatchar. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${social.bgColor}`}
                  aria-label={social.label}
                >
                  <social.icon
                    className={`w-5 h-5 transition-colors duration-300 ${social.iconColor}`}
                  />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy-policy"
                className="transition-colors duration-200"
                style={{ color: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="transition-colors duration-200"
                style={{ color: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="transition-colors duration-200"
                style={{ color: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
