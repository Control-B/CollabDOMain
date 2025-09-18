'use client';

import {
  MapPin,
  FileText,
  Users,
  Clock,
  Shield,
  Smartphone,
  CheckCircle,
} from 'lucide-react';

// Helper function to create hover gradient classes (brighter on hover)
function getHoverGradient(gradient: string): string {
  const hoverMap: { [key: string]: string } = {
    'from-emerald-700 via-teal-700 to-cyan-700':
      'group-hover:from-emerald-800 group-hover:via-teal-800 group-hover:to-cyan-800',
    'from-blue-700 via-indigo-700 to-purple-700':
      'group-hover:from-blue-800 group-hover:via-indigo-800 group-hover:to-purple-800',
    'from-orange-700 via-pink-700 to-red-700':
      'group-hover:from-orange-800 group-hover:via-pink-800 group-hover:to-red-800',
    'from-violet-700 via-purple-700 to-indigo-700':
      'group-hover:from-violet-800 group-hover:via-purple-800 group-hover:to-indigo-800',
    'from-green-700 via-emerald-700 to-teal-700':
      'group-hover:from-green-800 group-hover:via-emerald-800 group-hover:to-teal-800',
    'from-cyan-700 via-sky-700 to-blue-700':
      'group-hover:from-cyan-800 group-hover:via-sky-800 group-hover:to-blue-800',
  };
  return hoverMap[gradient] || '';
}

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
      gradient: 'from-emerald-700 via-teal-700 to-cyan-700',
      bgPattern: 'bg-emerald-500/10',
      iconBg: 'from-emerald-400 to-teal-500',
      animatedIcon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient
              id="geofence-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Pulsing geofence circles */}
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="url(#geofence-gradient)"
            strokeWidth="2"
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values="25;35;25"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="none"
            stroke="url(#geofence-gradient)"
            strokeWidth="2"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="15;25;15"
              dur="2s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.2;0.5"
              dur="2s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>
          {/* Central pin */}
          <circle cx="40" cy="35" r="8" fill="url(#geofence-gradient)">
            <animate
              attributeName="cy"
              values="35;32;35"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <path
            d="M40 27 L40 35"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="40" cy="30" r="2" fill="white" />
        </svg>
      ),
    },
    {
      icon: FileText,
      title: 'Paperless Documents',
      description:
        'Digitize all your paperwork. Upload, sign, and share documents instantly with your team and clients.',
      benefits: ['Digital signatures', 'Cloud storage', 'Version control'],
      gradient: 'from-blue-700 via-indigo-700 to-purple-700',
      bgPattern: 'bg-blue-500/10',
      iconBg: 'from-blue-400 to-indigo-500',
      animatedIcon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient
              id="doc-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {/* Document stack */}
          <rect
            x="25"
            y="20"
            width="30"
            height="40"
            rx="3"
            fill="url(#doc-gradient)"
            opacity="0.8"
          >
            <animate
              attributeName="y"
              values="20;18;20"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="20"
            y="25"
            width="30"
            height="40"
            rx="3"
            fill="url(#doc-gradient)"
            opacity="0.6"
          >
            <animate
              attributeName="y"
              values="25;23;25"
              dur="2s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </rect>
          <rect
            x="15"
            y="30"
            width="30"
            height="40"
            rx="3"
            fill="url(#doc-gradient)"
            opacity="0.4"
          >
            <animate
              attributeName="y"
              values="30;28;30"
              dur="2s"
              repeatCount="indefinite"
              begin="0.6s"
            />
          </rect>
          {/* Floating particles */}
          <circle cx="60" cy="25" r="2" fill="url(#doc-gradient)">
            <animate
              attributeName="cy"
              values="25;15;25"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="65" cy="35" r="1.5" fill="url(#doc-gradient)">
            <animate
              attributeName="cy"
              values="35;25;35"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
        </svg>
      ),
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description:
        'Connect drivers, dispatchers, and office staff in real-time. Share updates, photos, and important information instantly.',
      benefits: ['Real-time messaging', 'Group channels', 'File sharing'],
      gradient: 'from-orange-700 via-pink-700 to-red-700',
      bgPattern: 'bg-orange-500/10',
      iconBg: 'from-orange-400 to-pink-500',
      animatedIcon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient
              id="collab-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {/* Connected users */}
          <circle cx="25" cy="30" r="8" fill="url(#collab-gradient)">
            <animate
              attributeName="r"
              values="8;10;8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="55" cy="30" r="8" fill="url(#collab-gradient)">
            <animate
              attributeName="r"
              values="8;10;8"
              dur="2s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>
          <circle cx="40" cy="55" r="8" fill="url(#collab-gradient)">
            <animate
              attributeName="r"
              values="8;10;8"
              dur="2s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
          {/* Connection lines */}
          <line
            x1="25"
            y1="30"
            x2="55"
            y2="30"
            stroke="url(#collab-gradient)"
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="25"
            y1="30"
            x2="40"
            y2="55"
            stroke="url(#collab-gradient)"
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </line>
          <line
            x1="55"
            y1="30"
            x2="40"
            y2="55"
            stroke="url(#collab-gradient)"
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="1.5s"
              repeatCount="indefinite"
              begin="1s"
            />
          </line>
        </svg>
      ),
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description:
        "Monitor your fleet's progress with live GPS tracking. Get instant updates on delivery status and ETAs.",
      benefits: ['Live GPS tracking', 'ETA predictions', 'Route optimization'],
      gradient: 'from-violet-700 via-purple-700 to-indigo-700',
      bgPattern: 'bg-violet-500/10',
      iconBg: 'from-violet-400 to-purple-500',
      animatedIcon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient
              id="tracking-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Moving truck */}
          <rect
            x="30"
            y="35"
            width="20"
            height="10"
            rx="2"
            fill="url(#tracking-gradient)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0;20 0;0 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </rect>
          {/* Route path */}
          <path
            d="M15 40 Q25 25 40 40 Q55 55 65 40"
            stroke="url(#tracking-gradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4,2"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-12;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          {/* GPS satellites */}
          <circle cx="20" cy="20" r="3" fill="url(#tracking-gradient)">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="60" cy="20" r="3" fill="url(#tracking-gradient)">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="1s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </circle>
          <circle cx="65" cy="60" r="3" fill="url(#tracking-gradient)">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="1s"
              repeatCount="indefinite"
              begin="0.6s"
            />
          </circle>
        </svg>
      ),
    },
    {
      icon: Shield,
      title: 'Compliance Management',
      description:
        'Stay compliant with automated logging, driver hour tracking, and regulatory reporting.',
      benefits: ['ELD compliance', 'Hours of service', 'Audit trails'],
      gradient: 'from-green-700 via-emerald-700 to-teal-700',
      bgPattern: 'bg-green-500/10',
      iconBg: 'from-green-400 to-emerald-500',
      animatedIcon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient
              id="compliance-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          {/* Shield */}
          <path
            d="M40 15 L25 25 L25 45 Q25 55 40 65 Q55 55 55 45 L55 25 Z"
            fill="url(#compliance-gradient)"
          >
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          {/* Checkmark */}
          <path
            d="M32 40 L38 46 L48 32"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,20;20,0;20,0"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              values="20;0;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          {/* Protective aura */}
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="url(#compliance-gradient)"
            strokeWidth="1"
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values="30;40;30"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.1;0.3"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      ),
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description:
        'Access everything from your smartphone or tablet. Works offline and syncs when connected.',
      benefits: ['Offline capability', 'Cross-platform', 'Push notifications'],
      gradient: 'from-cyan-700 via-sky-700 to-blue-700',
      bgPattern: 'bg-cyan-500/10',
      iconBg: 'from-cyan-400 to-sky-500',
      animatedIcon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient
              id="mobile-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          {/* Phone device */}
          <rect
            x="28"
            y="20"
            width="24"
            height="40"
            rx="4"
            fill="url(#mobile-gradient)"
          >
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          {/* Screen content */}
          <rect
            x="31"
            y="25"
            width="18"
            height="12"
            rx="1"
            fill="white"
            opacity="0.9"
          >
            <animate
              attributeName="opacity"
              values="0.9;0.6;0.9"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="31"
            y="40"
            width="18"
            height="8"
            rx="1"
            fill="white"
            opacity="0.7"
          >
            <animate
              attributeName="opacity"
              values="0.7;0.4;0.7"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </rect>
          {/* Notification dots */}
          <circle cx="60" cy="25" r="2" fill="url(#mobile-gradient)">
            <animate
              attributeName="cy"
              values="25;20;25"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="20" cy="35" r="2" fill="url(#mobile-gradient)">
            <animate
              attributeName="cy"
              values="35;30;35"
              dur="2s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
        </svg>
      ),
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
            Dispatchar brings together all the tools your trucking business
            needs in one powerful platform. From automated check-ins to
            paperless document management, we&#39;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Vibrant Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
              ></div>

              {/* High Contrast Card Background */}
              <div
                className="relative backdrop-blur-sm bg-gray-800/80 border-2 border-gray-600/60 group-hover:border-gray-500/80 rounded-3xl p-8 h-full transition-all duration-500 group-hover:shadow-2xl"
                style={{
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.05)`,
                }}
              >
                {/* Vibrant Floating Pattern Background */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-25 group-hover:opacity-35 transition-opacity duration-500 -translate-y-16 translate-x-16`}
                ></div>

                {/* Vibrant Additional Color Accents */}
                <div
                  className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${feature.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 translate-y-12 -translate-x-12`}
                ></div>

                {/* Animated Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                    {feature.animatedIcon}
                  </div>

                  {/* Icon with Gradient Background */}
                  <div
                    className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br ${feature.iconBg} rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 shadow-lg`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3
                    className={`text-xl font-bold mb-4 transition-all duration-300 bg-gradient-to-r ${
                      feature.gradient
                    } bg-clip-text text-transparent ${getHoverGradient(
                      feature.gradient,
                    )}`}
                  >
                    {feature.title}
                  </h3>

                  <p className="text-gray-200 mb-6 leading-relaxed text-sm group-hover:text-gray-100 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Enhanced Benefits List */}
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-all duration-300"
                        style={{ transitionDelay: `${benefitIndex * 50}ms` }}
                      >
                        <div className="relative mr-3">
                          <CheckCircle
                            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 text-green-400"
                            style={{
                              transitionDelay: `${benefitIndex * 100}ms`,
                            }}
                          />
                          <div className="absolute inset-0 w-2 h-2 bg-blue-400 rounded-full group-hover:opacity-0 transition-opacity duration-300 mt-1 ml-1 shadow-lg"></div>
                        </div>
                        <span
                          className="group-hover:translate-x-1 transition-transform duration-300"
                          style={{ transitionDelay: `${benefitIndex * 50}ms` }}
                        >
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subtle Hover Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                ></div>

                {/* Subtle Border Accent */}
                <div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{ padding: '1px', margin: '-1px' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
