'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  ArrowRight,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  User,
  Building,
  Headphones,
  Calendar,
  CheckCircle,
  Globe,
  Zap,
  Heart,
  Award,
  Users,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general',
  });

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      contact: '+1 (555) 123-4567',
      color: 'from-blue-500 to-cyan-500',
      availability: 'Mon-Fri, 8 AM - 8 PM PST',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: "Send us a message and we'll respond quickly",
      contact: 'support@dispatchar.com',
      color: 'from-green-500 to-emerald-500',
      availability: 'Response within 4 hours',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant help through our chat system',
      contact: 'Available 24/7',
      color: 'from-purple-500 to-indigo-500',
      availability: 'Instant response',
    },
    {
      icon: MapPin,
      title: 'Office Location',
      description: 'Visit us at our headquarters',
      contact: '123 Tech Street, San Francisco, CA',
      color: 'from-orange-500 to-red-500',
      availability: 'By appointment only',
    },
  ];

  const departments = [
    {
      title: 'Sales & Partnerships',
      description: 'New business inquiries and partnership opportunities',
      email: 'sales@dispatchar.com',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Customer Success',
      description: 'Account management and success strategies',
      email: 'success@dispatchar.com',
      icon: Heart,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Technical Support',
      description: 'Platform issues and technical assistance',
      email: 'support@dispatchar.com',
      icon: Headphones,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Media & Press',
      description: 'Press inquiries and media relations',
      email: 'press@dispatchar.com',
      icon: Globe,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50 text-sm font-medium mb-6">
              <Phone className="w-4 h-4 mr-2" />
              24/7 Support Available
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get in{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Touch
              </span>
              <br />
              with Our Team
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Have questions? Need support? Want to learn more about how
              Dispatchar can transform your logistics operations? We're here to
              help and would love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#contact-form"
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center justify-center"
              >
                Send Message
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#live-chat"
                className="group flex items-center justify-center px-8 py-4 rounded-xl border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 font-semibold text-gray-200 hover:text-blue-400"
              >
                Start Live Chat
                <MessageSquare className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${method.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {method.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  {method.description}
                </p>
                <p className="text-white text-sm font-medium mb-2">
                  {method.contact}
                </p>
                <p className="text-gray-500 text-xs">{method.availability}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Connect with the{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Right Team
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Reach out to the specific department that can best assist you with
              your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${dept.color} shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <dept.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {dept.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                      {dept.description}
                    </p>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      {dept.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Send Us a{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Message
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inquiryType"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Inquiry Type
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales & Partnerships</option>
                    <option value="support">Technical Support</option>
                    <option value="demo">Request Demo</option>
                    <option value="press">Press & Media</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter the subject of your message"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
                >
                  Send Message
                  <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Support Hours & SLA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Commitment
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're committed to providing exceptional support and service to
              all our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">
                Response Time
              </h3>
              <p className="text-3xl font-bold text-blue-400 mb-2">
                &lt; 4 Hours
              </p>
              <p className="text-gray-400 text-sm">
                Average email response time during business hours
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">
                Resolution Rate
              </h3>
              <p className="text-3xl font-bold text-green-400 mb-2">98%</p>
              <p className="text-gray-400 text-sm">
                Issues resolved on first contact
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">
                Satisfaction
              </h3>
              <p className="text-3xl font-bold text-purple-400 mb-2">4.9/5</p>
              <p className="text-gray-400 text-sm">
                Customer satisfaction rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations & Meeting CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Visit Our{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Offices
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                We have offices around the globe. Schedule a visit or meet with
                our team to discuss your logistics needs in person.
              </p>

              <div className="space-y-6">
                {[
                  {
                    city: 'San Francisco, CA',
                    address: '123 Tech Street, Suite 100',
                    timezone: 'Pacific Time (PST)',
                    phone: '+1 (555) 123-4567',
                  },
                  {
                    city: 'Austin, TX',
                    address: '456 Innovation Blvd, Floor 5',
                    timezone: 'Central Time (CST)',
                    phone: '+1 (555) 234-5678',
                  },
                  {
                    city: 'New York, NY',
                    address: '789 Business Ave, 20th Floor',
                    timezone: 'Eastern Time (EST)',
                    phone: '+1 (555) 345-6789',
                  },
                ].map((office, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
                  >
                    <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {office.city}
                      </h4>
                      <p className="text-gray-400 text-sm mb-1">
                        {office.address}
                      </p>
                      <p className="text-gray-500 text-xs mb-1">
                        {office.timezone}
                      </p>
                      <p className="text-blue-400 text-sm">{office.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Schedule a Meeting
                </h3>
                <p className="text-gray-400">
                  Book a personalized demo or consultation with our team
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold">
                  Book Demo Call
                </button>
                <button className="w-full border-2 border-gray-600 text-gray-300 py-3 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-300 font-semibold">
                  Schedule Consultation
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Team Available</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>Online Now</span>
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
