'use client';

import { useEffect, useState } from 'react';
import { Truck, Users, Clock, TrendingUp } from 'lucide-react';

// Helper function to create hover gradient classes (brighter on hover)
function getHoverGradient(gradient: string): string {
  const hoverMap: { [key: string]: string } = {
    'from-blue-700 via-cyan-700 to-sky-700':
      'group-hover:from-blue-800 group-hover:via-cyan-800 group-hover:to-sky-800',
    'from-emerald-700 via-teal-700 to-green-700':
      'group-hover:from-emerald-800 group-hover:via-teal-800 group-hover:to-green-800',
    'from-indigo-700 via-purple-700 to-violet-700':
      'group-hover:from-indigo-800 group-hover:via-purple-800 group-hover:to-violet-800',
    'from-yellow-700 via-orange-700 to-amber-700':
      'group-hover:from-yellow-800 group-hover:via-orange-800 group-hover:to-amber-800',
  };
  return hoverMap[gradient] || '';
}

interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  description: string;
  color: string;
  gradient: string;
  iconBg: string;
}

const stats: Stat[] = [
  {
    icon: Truck,
    value: '50,000+',
    label: 'Active Vehicles',
    description: 'Fleet vehicles managed daily',
    color: 'text-blue-400',
    gradient: 'from-blue-700 via-cyan-700 to-sky-700',
    iconBg: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    value: '75,000+',
    label: 'Active Users',
    description: 'Drivers and dispatchers',
    color: 'text-emerald-400',
    gradient: 'from-emerald-700 via-teal-700 to-green-700',
    iconBg: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Clock,
    value: '99.9%',
    label: 'Uptime',
    description: 'System reliability',
    color: 'text-indigo-400',
    gradient: 'from-indigo-700 via-purple-700 to-violet-700',
    iconBg: 'from-indigo-500 to-purple-500',
  },
  {
    icon: TrendingUp,
    value: '75%',
    label: 'Time Saved',
    description: 'Average efficiency gain',
    color: 'text-yellow-400',
    gradient: 'from-yellow-700 via-orange-700 to-amber-700',
    iconBg: 'from-yellow-500 to-orange-500',
  },
];

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section
      id="stats-section"
      className="py-20 bg-gradient-to-r from-gray-900 to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of trucking companies that have transformed their
            operations with Dispatchar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Vibrant Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  stat.gradient
                } ${getHoverGradient(
                  stat.gradient,
                )} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
              ></div>

              {/* High Contrast Card Background */}
              <div
                className="relative backdrop-blur-sm bg-gray-800/80 border-2 border-gray-600/60 group-hover:border-gray-500/80 rounded-3xl p-8 h-full transition-all duration-500 group-hover:shadow-2xl text-center"
                style={{
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.05)`,
                }}
              >
                {/* Vibrant Floating Pattern Background */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-25 group-hover:opacity-35 transition-opacity duration-500 -translate-y-16 translate-x-16`}
                ></div>

                {/* Vibrant Additional Color Accents */}
                <div
                  className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${stat.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 translate-y-12 -translate-x-12`}
                ></div>

                {/* Animated Icon */}
                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-r ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg`}
                  >
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Stats Content */}
                <div className="relative">
                  <div
                    className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
                      stat.gradient
                    } ${getHoverGradient(
                      stat.gradient,
                    )} bg-clip-text text-transparent mb-3`}
                  >
                    {stat.value}
                  </div>

                  <div
                    className="text-xl font-bold mb-2"
                    style={{ color: 'white' }}
                  >
                    {stat.label}
                  </div>

                  <div className="text-gray-300 leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-8">
            Trusted by companies across North America
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold text-gray-500">
              Distribution Centers
            </div>
            <div className="text-lg font-semibold text-gray-500">
              Fulfilment Centers
            </div>
            <div className="text-lg font-semibold text-gray-500">
              Trucking Companies
            </div>
            <div className="text-lg font-semibold text-gray-500">
              Independent Contractors
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
