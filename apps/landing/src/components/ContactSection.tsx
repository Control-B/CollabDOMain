'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@dispatch.com',
      description: "We'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri 8AM-6PM EST',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Logistics Ave',
      description: 'Austin, TX 78701',
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: '24/7 Available',
      description: 'Emergency support always on',
    },
  ];

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions about Dispatch? Want to see how it can transform your
            operations? Get in touch with our team of trucking technology
            experts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="surface-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">
              Send us a Message
            </h3>

            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-100 mb-2">
                  Message Sent!
                </h4>
                <p className="text-gray-400">
                  We&#39;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900/60 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900/60 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900/60 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="ABC Trucking"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900/60 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
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
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/60 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us about your fleet size, current challenges, and how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-100 mb-6">
                Get in Touch
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Our team of trucking technology experts is here to help you
                transform your operations. Whether you have questions about
                features, need a custom demo, or want to discuss enterprise
                solutions, we&#39;re ready to assist.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100">
                      {info.title}
                    </h4>
                    <p className="text-gray-200 font-medium">{info.details}</p>
                    <p className="text-gray-400 text-sm">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="surface-card rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-100 mb-4">
                Quick Actions
              </h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-900/60 border border-gray-700 rounded-lg hover:bg-gray-900/80 transition-colors">
                  <div className="font-medium text-gray-100">
                    Schedule a Demo
                  </div>
                  <div className="text-sm text-gray-400">
                    See Dispatch in action
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-900/60 border border-gray-700 rounded-lg hover:bg-gray-900/80 transition-colors">
                  <div className="font-medium text-gray-100">
                    Download Brochure
                  </div>
                  <div className="text-sm text-gray-400">
                    Get detailed information
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-900/60 border border-gray-700 rounded-lg hover:bg-gray-900/80 transition-colors">
                  <div className="font-medium text-gray-100">
                    Start Free Trial
                  </div>
                  <div className="text-sm text-gray-400">
                    No credit card required
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
