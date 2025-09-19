'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Truck,
  ArrowRight,
  CheckCircle,
  Users,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

interface VideoDemo {
  id: string;
  title: string;
  description: string;
  videoPath?: string;
  component?: React.ComponentType<any>;
  icon: React.ComponentType<any>;
  features: string[];
  duration: string;
}

const videoDemos: VideoDemo[] = [
  {
    id: 'efficient-trucking',
    title: 'Efficient Digital Trucking',
    description:
      'Digital-first solutions that eliminate paperwork and streamline workflows.',
    videoPath: '/videos/efficient-digital-trucking.mp4',
    icon: MapPin,
    features: [
      'Automated Check-ins',
      'Paperless Operations',
      'Real-time Tracking',
    ],
    duration: '2:30',
  },
  {
    id: 'efficient-trucking-1',
    title: 'Advanced Fleet Management',
    description: 'Optimize routes, reduce costs, and improve delivery times.',
    videoPath: '/videos/efficient-digital-trucking-1.mp4',
    icon: MapPin,
    features: ['Route Optimization', 'Cost Reduction', 'Performance Analytics'],
    duration: '2:45',
  },
  {
    id: 'geofencing',
    title: 'Geofencing Entry Success',
    description:
      'Automatic geofencing eliminates manual check-ins and provides instant notifications.',
    videoPath: '/videos/geofencing-entry-success.mp4',
    icon: CheckCircle,
    features: [
      'Automatic Check-ins',
      'Location Alerts',
      'Instant Notifications',
    ],
    duration: '3:15',
  },
  {
    id: 'truckers-realtime-chat',
    title: "Truckers' Realtime Chat",
    description:
      'Real-time messaging between drivers, dispatchers, and fleet managers with instant updates.',
    videoPath: '/videos/truckers-realtime-chat.mp4',
    icon: MessageSquare,
    features: ['Driver Communication', 'Instant Updates', 'Group Messaging'],
    duration: '2:15',
  },
  {
    id: 'live-tracking-not-map',
    title: 'Going Digital',
    description:
      'Monitor fleet status, delivery progress, and driver locations in real-time.',
    videoPath: '/videos/live-tracking-not-map.mp4',
    icon: MapPin,
    features: ['Real-time Status', 'Fleet Monitoring', 'Delivery Tracking'],
    duration: '2:30',
  },
  {
    id: 'truckers-chat-group',
    title: "Truckers' Chat Group",
    description:
      'Group communication channels for coordinating loads, routes, and logistics.',
    videoPath: '/videos/truckers-chat-group.mp4',
    icon: Users,
    features: ['Group Coordination', 'Load Management', 'Route Planning'],
    duration: '2:10',
  },
  {
    id: 'paperwork-overload',
    title: 'Paperwork Overload Solution',
    description:
      'Eliminate paperwork bottlenecks with digital document management and e-signatures.',
    videoPath: '/videos/paperwork-overload.mp4',
    icon: CheckCircle,
    features: ['Digital Documents', 'E-Signatures', 'Workflow Automation'],
    duration: '2:40',
  },
  {
    id: 'busy-shipping-office',
    title: 'Busy Shipping Office',
    description:
      'Streamline busy shipping operations with coordinated workflows and real-time visibility.',
    videoPath: '/videos/busy-shipping-office.mp4',
    icon: Users,
    features: [
      'Office Coordination',
      'Workflow Management',
      'Real-time Updates',
    ],
    duration: '2:25',
  },
];

export default function HeroSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentTrustIndex, setCurrentTrustIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videoDemos[currentVideoIndex];

  // More intuitive and compelling rotating text
  const heroTexts = [
    'Trucking Operations',
    'Fleet Management',
    'Dispatch Operations',
    'Logistics Coordination',
    'Paperless Workflows',
    'Real-time Tracking',
  ];

  const trustTexts = [
    'Trusted by 10,000+ trucking companies',
    'Managing 50,000+ active vehicles',
    'Serving 75,000+ active users',
    'Maintaining 99.9% system uptime',
    'Delivering 75% time savings',
  ];

  // Text rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  // Trust text rotation effect (slightly different timing)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrustIndex((prev) => (prev + 1) % trustTexts.length);
    }, 4000); // 4 seconds for trust text
    return () => clearInterval(interval);
  }, [trustTexts.length]);

  useEffect(() => {
    const video = videoRef.current;

    // Only set up video event listeners if we have a video (not an animated component)
    if (!video || currentVideo.component) {
      // For animated components, use a timer to cycle through demos
      const timer = setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videoDemos.length);
      }, 8000); // 8 seconds for animated components

      return () => clearTimeout(timer);
    }

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoDemos.length);
    };

    // Add a fallback timer in case the video doesn't trigger 'ended' event
    const fallbackTimer = setTimeout(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoDemos.length);
    }, 10000); // 10 second fallback

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      clearTimeout(fallbackTimer);
    };
  }, [currentVideoIndex, videoDemos.length, currentVideo.component]);

  useEffect(() => {
    const video = videoRef.current;

    // Only handle video play/pause if we have a video (not an animated component)
    if (!video || currentVideo.component) return;

    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying, currentVideoIndex, currentVideo.component]);

  return (
    <section className="relative min-h-screen flex items-start pt-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-screen blur-3xl opacity-60 animate-pulse"></div>

        {/* Additional floating elements for depth */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl animate-float-delayed"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-sm font-medium mb-8"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <Truck className="w-4 h-4 mr-2" style={{ color: '#3b82f6' }} />
              {trustTexts[currentTrustIndex]}
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span style={{ color: 'white' }}>The Future of</span>
              <br />
              <span
                className="bg-clip-text text-transparent transition-all duration-500"
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {heroTexts[currentTextIndex]}
              </span>
              <br />
              <span style={{ color: 'white' }}>is Here</span>
            </h1>

            {/* Subheading */}
            <p className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed">
              Revolutionize your trucking and logistics operations with
              Dispatchar. Eliminate paperwork, streamline workflows, and connect
              your team with cutting-edge technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/auth/signup"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-base shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                style={{ color: 'white' }}
              >
                Start Free Trial
                <ArrowRight
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  style={{ color: 'white' }}
                />
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Active Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">25K+</div>
                <div className="text-sm text-gray-400">Users</div>
              </div>
            </div>
          </div>

          {/* Right Side - Video Player */}
          <div className="animate-fade-in-up animate-delay-200">
            <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
              {/* Video Player or Animated Component */}
              <div className="relative aspect-video bg-black">
                {currentVideo.component ? (
                  <div className="w-full h-full">
                    <currentVideo.component />
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={currentVideo.videoPath}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition:
                          currentVideo.id === 'truckers-chat-group'
                            ? 'center 80%'
                            : 'center center',
                      }}
                      muted={true}
                      loop={false}
                      playsInline
                      autoPlay
                      onError={(e) => {
                        console.error('Video error:', e);
                        console.error('Video src:', currentVideo.videoPath);
                      }}
                      onLoadStart={() => {
                        console.log(
                          'Video loading started:',
                          currentVideo.videoPath,
                        );
                      }}
                      onCanPlay={() => {
                        console.log('Video can play:', currentVideo.videoPath);
                      }}
                    />

                    {/* Video Overlay Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      {/* Bottom Left - Video Title */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/50 rounded-lg px-3 py-2">
                          <h3
                            className="font-semibold text-sm"
                            style={{ color: 'white' }}
                          >
                            {currentVideo.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: 'white' }}
                >
                  {currentVideo.title}
                </h2>
                <p className="text-gray-400 mb-4 text-sm">
                  {currentVideo.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 gap-2">
                  {currentVideo.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
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
    </section>
  );
}
