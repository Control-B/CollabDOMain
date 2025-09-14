'use client';

import {
  MapPin,
  FileText,
  Users,
  Clock,
  Shield,
  Smartphone,
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: 'Geofence Check-ins',
      description:
        'Automated check-ins when drivers enter designated zones. No more manual paperwork or long queues at terminals.',
      benefits: [
        'Instant location tracking',
        'Automated compliance',
        'Reduced wait times',
      ],
    },
    {
      icon: FileText,
      title: 'Paperless Documents',
      description:
        'Digitize all your paperwork. Upload, sign, and share documents instantly with your team and clients.',
      benefits: ['Digital signatures', 'Cloud storage', 'Version control'],
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description:
        'Connect drivers, dispatchers, and office staff in real-time. Share updates, photos, and important information instantly.',
      benefits: ['Real-time messaging', 'Group channels', 'File sharing'],
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description:
        "Monitor your fleet's progress with live GPS tracking. Get instant updates on delivery status and ETAs.",
      benefits: ['Live GPS tracking', 'ETA predictions', 'Route optimization'],
    },
    {
      icon: Shield,
      title: 'Compliance Management',
      description:
        'Stay compliant with automated logging, driver hour tracking, and regulatory reporting.',
      benefits: ['ELD compliance', 'Hours of service', 'Audit trails'],
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description:
        'Access everything from your smartphone or tablet. Works offline and syncs when connected.',
      benefits: ['Offline capability', 'Cross-platform', 'Push notifications'],
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Everything You Need to Streamline Operations
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Dispatch brings together all the tools your trucking business needs
            in one powerful platform. From automated check-ins to paperless
            document management, we&#39;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl surface-card hover:border-blue-400/60 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-gray-100 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400 mb-4 leading-relaxed">
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li
                    key={benefitIndex}
                    className="flex items-center text-sm text-gray-400"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
