'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  ListChecks,
  Info,
} from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  type DemoStep = {
    title: string;
    description: string;
    duration: number; // ms
    content: ReactNode;
    keyTakeaways?: string[];
    media?: { type: 'video' | 'gif'; src: string; poster?: string };
  };

  const demoSteps: DemoStep[] = useMemo(
    () => [
      {
        title: 'Real-time Fleet Tracking',
        description:
          'Watch as vehicles move across the map with live GPS updates, ETAs, and status notifications.',
        duration: 8000,
        keyTakeaways: [
          'Live map with vehicle positions and ETAs',
          'Status panel shows key events at a glance',
          'Animated routes simulate movement and progress',
        ],
        media: { type: 'gif', src: '/media/fleet-tracking.svg' },
        content: (
          <div className="bg-gray-900 rounded-lg p-6 h-80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-emerald-900/20"></div>

            {/* Mock map interface */}
            <div className="relative h-full bg-gray-800 rounded-lg border border-gray-600">
              {/* Map header */}
              <div className="p-4 border-b border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold">Fleet Overview</h3>
                  <div className="flex items-center space-x-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>12 vehicles active</span>
                  </div>
                </div>
              </div>

              {/* Map content */}
              <div className="p-4 h-full relative">
                {/* Moving vehicle indicators */}
                <div className="absolute top-8 left-12 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                <div className="absolute top-16 right-20 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 left-1/3 w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>

                {/* Route lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  <path
                    d="M50 40 Q100 60 150 80"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                  <path
                    d="M200 50 Q150 100 100 150"
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                </svg>

                {/* Status panel */}
                <div className="absolute bottom-4 right-4 bg-gray-700/90 backdrop-blur rounded-lg p-3 text-xs text-white">
                  <div className="space-y-1">
                    <div>TRK-001: En route (ETA 2:30 PM)</div>
                    <div>TRK-002: Loading (5 min delay)</div>
                    <div>TRK-003: Delivered ✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Smart Geofencing Alerts',
        description:
          'Automatic notifications when vehicles enter or exit designated zones, reducing manual check-ins.',
        duration: 6000,
        keyTakeaways: [
          'Configurable zones to track arrivals and departures',
          'Instant alerts reduce manual check-ins',
          'Simple status list of active geofences',
        ],
        media: { type: 'gif', src: '/media/geofence-alerts.svg' },
        content: (
          <div className="bg-gray-900 rounded-lg p-6 h-80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 to-cyan-900/20"></div>

            {/* Geofencing interface */}
            <div className="relative h-full bg-gray-800 rounded-lg border border-gray-600">
              <div className="p-4 border-b border-gray-600">
                <h3 className="text-white font-semibold">
                  Geofence Monitoring
                </h3>
              </div>

              <div className="p-4 h-full relative">
                {/* Zone indicators */}
                <div className="absolute top-12 left-16 w-16 h-16 border-2 border-dashed border-blue-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <div className="absolute top-20 right-24 w-20 h-20 border-2 border-dashed border-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>

                {/* Alert notifications */}
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="bg-green-600 text-white text-xs px-3 py-2 rounded-lg animate-slide-in-right">
                    🚛 TRK-001 entered Warehouse A
                  </div>
                  <div className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg animate-slide-in-right [animation-delay:2s]">
                    📍 Auto check-in completed
                  </div>
                </div>

                {/* Zone list */}
                <div className="absolute bottom-4 left-4 bg-gray-700/90 backdrop-blur rounded-lg p-3 text-xs text-white">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Warehouse A (Active)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Customer Site B</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <span>Fuel Station C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Digital Document Management',
        description:
          'Scan, store, and instantly retrieve PODs, invoices, and receipts with smart tagging and search.',
        duration: 7000,
        keyTakeaways: [
          'Centralized hub for BOLs, PODs, and invoices',
          'Visual upload progress for transparency',
          'Fast search (mocked here) and smart tagging',
        ],
        media: { type: 'gif', src: '/media/documents.svg' },
        content: (
          <div className="bg-gray-900 rounded-lg p-6 h-80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-orange-900/20"></div>

            {/* Document interface */}
            <div className="relative h-full bg-gray-800 rounded-lg border border-gray-600">
              <div className="p-4 border-b border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold">Document Hub</h3>
                  <div className="flex items-center space-x-2 text-sm text-amber-400">
                    <span>147 documents</span>
                  </div>
                </div>
              </div>

              <div className="p-4 h-full">
                {/* Document grid */}
                <div className="grid grid-cols-3 gap-3 h-32">
                  <div className="bg-gray-700 rounded-lg p-3 text-xs text-white hover:bg-gray-600 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-amber-500 rounded mb-2 flex items-center justify-center">
                      📄
                    </div>
                    <div className="font-medium">BOL_12345.pdf</div>
                    <div className="text-gray-400">Bill of Lading</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-xs text-white hover:bg-gray-600 transition-colors cursor-pointer animate-slide-in-up">
                    <div className="w-8 h-8 bg-green-500 rounded mb-2 flex items-center justify-center">
                      ✓
                    </div>
                    <div className="font-medium">POD_TRK001.pdf</div>
                    <div className="text-gray-400">Proof of Delivery</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-xs text-white hover:bg-gray-600 transition-colors cursor-pointer animate-slide-in-up [animation-delay:1s]">
                    <div className="w-8 h-8 bg-blue-500 rounded mb-2 flex items-center justify-center">
                      💰
                    </div>
                    <div className="font-medium">Invoice_ABC.pdf</div>
                    <div className="text-gray-400">Invoice</div>
                  </div>
                </div>

                {/* Upload progress */}
                <div className="mt-4 bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs text-white mb-2">
                    <span>Uploading: scan_receipt.pdf</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full transition-all duration-300 w-[85%]"></div>
                  </div>
                </div>

                {/* Search bar */}
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Team Communication Hub',
        description:
          'Real-time messaging between drivers, dispatch, and management with delivery updates and notifications.',
        duration: 6000,
        keyTakeaways: [
          'Real-time chat connects drivers and dispatch',
          'Delivery updates are shared in-thread',
          'Presence indicator shows who is online',
        ],
        media: { type: 'gif', src: '/media/chat-demo.svg' },
        content: (
          <div className="bg-gray-900 rounded-lg p-6 h-80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>

            {/* Chat interface */}
            <div className="relative h-full bg-gray-800 rounded-lg border border-gray-600">
              <div className="p-4 border-b border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold">Team Chat</h3>
                  <div className="flex items-center space-x-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>8 online</span>
                  </div>
                </div>
              </div>

              <div className="p-4 h-48 overflow-y-auto space-y-3">
                {/* Messages */}
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white text-sm px-3 py-2 rounded-lg max-w-xs">
                    <div className="font-medium text-blue-400 text-xs mb-1">
                      Driver Mike
                    </div>
                    Arrived at pickup location, loading now
                    <div className="text-xs text-gray-400 mt-1">2:30 PM</div>
                  </div>
                </div>

                <div className="flex justify-end animate-slide-in-left [animation-delay:2s]">
                  <div className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg max-w-xs">
                    <div className="font-medium text-blue-200 text-xs mb-1">
                      Dispatch
                    </div>
                    Great! Customer has been notified. ETA?
                    <div className="text-xs text-blue-200 mt-1">2:31 PM</div>
                  </div>
                </div>

                <div className="flex justify-start animate-slide-in-left [animation-delay:4s]">
                  <div className="bg-gray-700 text-white text-sm px-3 py-2 rounded-lg max-w-xs">
                    <div className="font-medium text-blue-400 text-xs mb-1">
                      Driver Mike
                    </div>
                    ETA 5:45 PM - traffic clear on I-95
                    <div className="text-xs text-gray-400 mt-1">2:35 PM</div>
                  </div>
                </div>
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-gray-600">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    disabled
                  />
                  <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  // Autoplay to next step after the current duration when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }, demoSteps[currentStep].duration);
    return () => clearTimeout(timer);
  }, [isOpen, isPlaying, currentStep, demoSteps]);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Reset media error when step changes
  useEffect(() => {
    setMediaError(false);
  }, [currentStep]);

  // Keyboard shortcuts: Space (play/pause), ArrowLeft (back), ArrowRight (next), Esc (close)
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentStep(
          (prev) => (prev - 1 + demoSteps.length) % demoSteps.length,
        );
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, demoSteps.length, onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const handleBack = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };
  // Compute step info early (not hooks, safe before returns)
  const totalSteps = demoSteps.length;
  const current = useMemo(
    () => demoSteps[currentStep],
    [demoSteps, currentStep],
  );
  const formatMs = useCallback(
    (ms: number) =>
      `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(
        Math.floor((ms % 60000) / 1000),
      ).padStart(2, '0')}`,
    [],
  );

  // Deep-linking via query params (hooks must run unconditionally)
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // On open, read ?chapter and move to it (1-indexed)
  useEffect(() => {
    if (!isOpen) return;
    const chap = searchParams.get('chapter');
    const idx = chap
      ? Math.max(1, Math.min(totalSteps, parseInt(chap, 10))) - 1
      : 0;
    if (!Number.isNaN(idx)) setCurrentStep(idx);
  }, [isOpen, searchParams, totalSteps]);

  // Update ?chapter when step changes
  useEffect(() => {
    if (!isOpen) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('chapter', String(currentStep + 1));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [currentStep, isOpen, pathname, router, searchParams]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-6 md:pt-10 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden grid grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Header */}
        <div className="md:col-span-2 flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 id="demo-modal-title" className="text-2xl font-bold text-white">
              CollabAzure Demo
            </h2>
            <p className="text-gray-400 mt-1">
              See how our platform transforms logistics operations
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            title="Close demo (Esc)"
            aria-label="Close demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar (Chapters) */}
        <aside className="hidden md:block border-r border-gray-800 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 text-gray-300 mb-3">
            <ListChecks className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold">Chapters</span>
          </div>
          <ul className="space-y-2" aria-label="Demo chapters">
            {demoSteps.map((step, index) => (
              <li key={step.title}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between ${
                    index === currentStep
                      ? 'bg-blue-900/30 text-blue-200 border border-blue-800/50'
                      : index < currentStep
                      ? 'bg-gray-800/70 text-gray-200 hover:bg-gray-800'
                      : 'bg-gray-800/30 text-gray-300 hover:bg-gray-800/50'
                  }`}
                  onClick={() => {
                    setCurrentStep(index);
                  }}
                  aria-current={index === currentStep ? 'step' : undefined}
                  aria-label={`Go to chapter ${index + 1}: ${step.title}`}
                >
                  <div className="pr-2">
                    <div className="font-medium truncate">
                      {index + 1}. {step.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatMs(step.duration)}
                    </div>
                  </div>
                  {index < currentStep ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : index === currentStep ? (
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>

          {/* Tips */}
          <div className="mt-6 text-xs text-gray-400 bg-gray-800/40 border border-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <Info className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold">Shortcuts</span>
            </div>
            <ul className="space-y-1 list-disc pl-5">
              <li>Space: Play/Pause</li>
              <li>←: Previous chapter</li>
              <li>→: Next chapter</li>
              <li>Esc: Close</li>
            </ul>
          </div>
        </aside>

        {/* Main content area */}
        <div className="overflow-y-auto">
          {/* Progress indicator */}
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-blue-500'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-400">
                Step {currentStep + 1} of {totalSteps} •{' '}
                {formatMs(current.duration)}
              </div>
            </div>

            {/* Indeterminate progress (avoids inline style) */}
            <div className="w-full h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 animate-[progress-move_1.2s_linear_infinite] ${
                  isPlaying ? '' : 'opacity-40'
                }`}
              ></div>
            </div>
          </div>

          {/* Step info */}
          <div className="px-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-900/40 text-blue-200 border border-blue-800/50">
                Chapter {currentStep + 1}/{totalSteps}
              </span>
              <h3 className="text-lg md:text-xl font-semibold text-white">
                {current.title}
              </h3>
            </div>
            <p className="text-gray-400 mb-4">{current.description}</p>
          </div>

          {/* Optional media per chapter */}
          {current.media && !mediaError && (
            <div className="px-6 mb-4">
              <div className="rounded-xl overflow-hidden border border-gray-800 bg-black">
                {current.media.type === 'video' ? (
                  <video
                    className="w-full h-56 md:h-72 object-cover"
                    src={current.media.src}
                    poster={current.media.poster}
                    controls
                    preload="none"
                    onError={() => setMediaError(true)}
                    playsInline
                    muted
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="w-full h-56 md:h-72 object-cover"
                    src={current.media.src}
                    alt="Demo clip"
                    loading="lazy"
                    onError={() => setMediaError(true)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Media fallback placeholder */}
          {current.media && mediaError && (
            <div className="px-6 mb-4">
              <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-950">
                <div className="h-48 md:h-56 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm px-4 text-center">
                    Preview unavailable — showing interactive demo below
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo content */}
          <div className="px-6 mb-4">{current.content}</div>

          {/* Key takeaways */}
          {Array.isArray(current.keyTakeaways) &&
            current.keyTakeaways.length > 0 && (
              <div className="px-6 pb-4">
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-200 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold">
                      What you&apos;ll learn
                    </span>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-300 list-disc pl-5">
                    {current.keyTakeaways?.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          {/* Sticky Controls */}
          <div className="sticky bottom-0 z-10">
            <div className="px-6 pb-4 pt-3 bg-gray-900/95 backdrop-blur border-t border-gray-800">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  title="Previous step (←)"
                  aria-label="Previous step"
                >
                  <SkipBack className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handlePlayPause}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  title={isPlaying ? 'Pause demo (Space)' : 'Play demo (Space)'}
                  aria-label={isPlaying ? 'Pause demo' : 'Play demo'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  title="Next step (→)"
                  aria-label="Next step"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Next</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  title="Restart demo"
                  aria-label="Restart demo"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
