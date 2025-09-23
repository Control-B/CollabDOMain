'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Truck,
  ArrowRight,
  CheckCircle,
  Users,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
// Use existing animated components as rich, lightweight stand-ins for missing videos
import AnimatedChat from './animated/AnimatedChat';
import AnimatedMapTracking from './animated/AnimatedMapTracking';
import AnimatedGeofencing from './animated/AnimatedGeofencing';
import AnimatedDocumentManagement from './animated/AnimatedDocumentManagement';
import AnimatedCollaboration from './animated/AnimatedCollaboration';
import AnimatedSharing from './animated/AnimatedSharing';

interface VideoDemo {
  id: string;
  title: string;
  description: string;
  videoPath?: string;
  videoSources?: string[]; // optional multiple sources (first existing one will play)
  component?: React.ComponentType<Record<string, never>>;
  icon: React.ComponentType<{ className?: string }>; // lucide-react compatible
  features: string[];
  duration: string;
}

const videoDemos: VideoDemo[] = [
  {
    id: 'efficient-trucking',
    title: 'Efficient Digital Trucking',
    description:
      'Digital-first solutions that eliminate paperwork and streamline workflows.',
  // Prefer actual video when available; falls back to animation if missing
  videoPath: '/videos/efficient-digital-trucking.mp4',
  component: AnimatedMapTracking,
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
  // Prefer actual video when available; falls back to animation if missing
  // Switch to the requested "efficient digital trucking1" video with fallback
  videoSources: [
    '/videos/efficient-digital-trucking1.mp4',
    '/videos/efficient-digital-trucking.mp4',
  ],
  component: AnimatedCollaboration,
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
  component: AnimatedGeofencing,
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
  component: AnimatedChat,
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
  component: AnimatedMapTracking,
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
  component: AnimatedCollaboration,
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
  component: AnimatedDocumentManagement,
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
  component: AnimatedSharing,
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
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skippedVideosRef = useRef<Set<string>>(new Set());
  const debugMedia =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG_MEDIA === 'true';

  // Resolve asset URL with optional base path or asset prefix for DigitalOcean subpaths/CDNs
  const assetPrefix = useMemo(
    () =>
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_PATH) ||
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ASSET_PREFIX) ||
      '',
    []
  );
  // Heuristic: if the site is hosted under a subpath (e.g., /landing/*), detect it from the current URL
  const detectedBaseFromPath = useMemo(() => {
    if (typeof window === 'undefined') return '';
    try {
      const parts = window.location.pathname.split('/').filter(Boolean);
      // If the first segment appears across all routes (subpath host), using it as a prefix will succeed.
      // If hosted at root, trying this candidate is harmless (the <video> will skip to the next source).
      return parts.length > 0 ? `/${parts[0]}` : '';
    } catch {
      return '';
    }
  }, []);
  // When basePath-like prefixes are used (e.g., '/landing'), try both prefixed and unprefixed
  const resolveCandidates = useCallback(
    (p: string): string[] => {
      const candidates: string[] = [];
      const isAbsolute = p.startsWith('/');
      const relative = isAbsolute ? p.slice(1) : p;
      if (assetPrefix) {
        candidates.push(`${assetPrefix}${p}`);
        if (assetPrefix.startsWith('/')) {
          candidates.push(p); // unprefixed fallback
        }
      } else {
        candidates.push(p);
      }
      // Add heuristic candidate using detected base from current path (e.g., /landing)
      if (detectedBaseFromPath && detectedBaseFromPath !== '/' && !assetPrefix) {
        candidates.push(`${detectedBaseFromPath}${p}`);
      }
      // Add relative-path candidate so subpath hosting resolves automatically
      if (relative && relative !== p) {
        candidates.push(relative);
      }
      // de-duplicate in case of overlaps
      return Array.from(new Set(candidates));
    },
    [assetPrefix, detectedBaseFromPath]
  );

  const currentVideo = videoDemos[currentVideoIndex];
  const resolvedSources = useMemo(() => {
    if (currentVideo.videoSources && currentVideo.videoSources.length > 0) {
      return currentVideo.videoSources.flatMap((s) => resolveCandidates(s));
    }
    if (currentVideo.videoPath) {
      return resolveCandidates(currentVideo.videoPath);
    }
    return [];
  }, [currentVideo.videoPath, currentVideo.videoSources, resolveCandidates]);
  const currentVideoKey = resolvedSources.join(',') || currentVideo.id;

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

    // Animated component: rotate every 8s
    if (!video || resolvedSources.length === 0) {
      const t = setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videoDemos.length);
      }, 8000);
      return () => clearTimeout(t);
    }

    const handleEnded = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoDemos.length);
    };
    const handleLoaded = () => {
      const d = Number.isFinite(video.duration) ? video.duration : undefined;
      // Clear any previous timer
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      // Set a conservative fallback slightly longer than duration (cap at 180s)
      const ms = Math.min(Math.max((d || 60) + 2, 12) * 1000, 180000);
      fallbackTimerRef.current = setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videoDemos.length);
      }, ms);
    };
    const handleError = () => {
      // Skip to next on error after short delay
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      // Avoid retrying the same failing source repeatedly within this session
      skippedVideosRef.current.add(currentVideoKey);
      fallbackTimerRef.current = setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videoDemos.length);
      }, 800);
    };
    const handleCanPlay = () => {
      // Retry autoplay if the browser initially blocked it
      if (isPlaying) {
        video.play().catch(() => {
          // If still blocked, leave it paused silently
        });
      }
    };
    const handleStalled = () => {
      // Network hiccup: try a gentle resume; if not, move on
      video.play().catch(() => {
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = setTimeout(() => {
          setCurrentVideoIndex((prev) => (prev + 1) % videoDemos.length);
        }, 2000);
      });
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('stalled', handleStalled);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('stalled', handleStalled);
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [currentVideoIndex, currentVideoKey, resolvedSources.length, isPlaying]);

  useEffect(() => {
    const video = videoRef.current;

    // Only handle video play/pause if we have a video (not an animated component)
    if (!video || resolvedSources.length === 0) return;

    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying, currentVideoIndex, currentVideoKey, resolvedSources.length]);

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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-sm font-medium mb-8 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-500">
              <Truck className="w-4 h-4 mr-2 text-blue-500" />
              {trustTexts[currentTrustIndex]}
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="text-white">The Future of</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-500 transition-all duration-500">
                {heroTexts[currentTextIndex]}
              </span>
              <br />
              <span className="text-white">is Here</span>
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
                {resolvedSources.length > 0 ? (
                  <>
                    <video
                      key={currentVideoKey}
                      ref={videoRef}
                      className={`w-full h-full object-cover ${
                        currentVideo.id === 'truckers-chat-group'
                          ? 'object-[center_80%]'
                          : 'object-center'
                      }`}
                      muted={true}
                      loop={false}
                      playsInline
                      autoPlay
                      controls={false}
                      preload="auto"
                      onError={(e) => {
                        console.error('Video error event:', e);
                        console.error('Failed video sources:', resolvedSources);
                        console.error('Current video element src:', videoRef.current?.currentSrc);
                        console.error('Video element networkState:', videoRef.current?.networkState);
                        console.error('Video element readyState:', videoRef.current?.readyState);
                        console.error('Video element error code:', videoRef.current?.error?.code);
                        console.error('Video element error message:', videoRef.current?.error?.message);
                        // If video fails, advance to next demo as a graceful fallback
                        if (!skippedVideosRef.current.has(currentVideoKey)) {
                          skippedVideosRef.current.add(currentVideoKey);
                          setTimeout(() => {
                            setCurrentVideoIndex((prev) => (prev + 1) % videoDemos.length);
                          }, 800);
                        }
                      }}
                      onLoadStart={() => {
                        console.log('Video load started for sources:', resolvedSources);
                      }}
                      onCanPlay={() => {
                        console.log('Video can play:', videoRef.current?.currentSrc);
                      }}
                      onLoadedData={() => {
                        console.log('Video loaded data:', videoRef.current?.currentSrc);
                      }}
                    >
                      {resolvedSources.map((src) => (
                        <source key={src} src={src} type="video/mp4" />
                      ))}
                    </video>

                    {/* Video Overlay Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      {/* Bottom Left - Video Title */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/50 rounded-lg px-3 py-2">
                          <h3 className="font-semibold text-sm text-white">
                            {currentVideo.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full">
                    {currentVideo.component && <currentVideo.component />}
                  </div>
                )}
                {debugMedia && (
                  <div className="absolute top-2 right-2 z-20 text-xs bg-black/70 text-green-300 px-2 py-1 rounded border border-green-700 max-w-[75%] break-all">
                    <div className="font-semibold text-green-200">Debug media</div>
                    {resolvedSources.length > 0 ? (
                      <div>
                        <div>Sources: {resolvedSources.length}</div>
                        <div>Current: {resolvedSources[0]}</div>
                        <div>detectedBase: {detectedBaseFromPath || 'none'}</div>
                        <div>assetPrefix: {assetPrefix || 'none'}</div>
                      </div>
                    ) : (
                      <div>no video source (using animation)</div>
                    )}
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-white">
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
