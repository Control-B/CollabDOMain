'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AnimatedChat from './animated/AnimatedChat';
import AnimatedMapTracking from './animated/AnimatedMapTracking';
import AnimatedGeofencing from './animated/AnimatedGeofencing';
import AnimatedDigitalSigning from './animated/AnimatedDigitalSigning';
import AnimatedDocumentManagement from './animated/AnimatedDocumentManagement';
import AnimatedCollaboration from './animated/AnimatedCollaboration';
import AnimatedSharing from './animated/AnimatedSharing';
import FeatureIcon, { FeatureKey } from './icons/FeatureIcon';
import FeatureThumb from './animated/FeatureThumb';

type ShowcaseMedia =
  | { type: 'image'; src: string }
  | { type: 'video'; mp4: string; webm?: string; poster?: string }
  | { type: 'component'; component: React.ComponentType };

type ShowcaseItem = {
  key: FeatureKey;
  title: string;
  caption: string;
  media: ShowcaseMedia;
  gradient: string; // tailwind from-... to-...
};

const ITEMS: ShowcaseItem[] = [
  {
    key: 'messaging',
    title: 'Real-time Messaging',
    caption:
      'Chat instantly with drivers and teams. Delivery updates, broadcasts, and read receipts keep everyone aligned.',
    media: { type: 'component', component: AnimatedChat },
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    key: 'collaboration',
    title: 'Team Collaboration',
    caption:
      'Share tasks, assign owners, and collaborate across terminals and dispatch in one place.',
    media: { type: 'component', component: AnimatedCollaboration },
    gradient: 'from-purple-500 to-fuchsia-500',
  },
  {
    key: 'tracking',
    title: 'Live Tracking',
    caption:
      'Track vehicles and shipments in real-time with smart ETAs and status updates.',
    media: { type: 'component', component: AnimatedMapTracking },
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    key: 'geofencing',
    title: 'Geofencing',
    caption:
      'Automate check-ins/outs, trigger workflows, and reduce dwell time with precise zones.',
    media: { type: 'component', component: AnimatedGeofencing },
    gradient: 'from-sky-500 to-cyan-500',
  },
  {
    key: 'documents',
    title: 'Document Management',
    caption:
      'Scan, tag, and retrieve documents instantly. No more lost PODs or gate passes.',
    media: { type: 'component', component: AnimatedDocumentManagement },
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    key: 'signing',
    title: 'Digital Signing',
    caption:
      'Collect compliant e‑signatures on bills, acknowledgements, and receipts from any device.',
    media: { type: 'component', component: AnimatedDigitalSigning },
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    key: 'sharing',
    title: 'Secure Sharing',
    caption:
      'Share links with expiring access to loads, invoices, and documents—securely.',
    media: { type: 'component', component: AnimatedSharing },
    gradient: 'from-lime-500 to-green-500',
  },
];

export default function ShowcaseSection() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const paused = useRef(false);

  const current = useMemo(() => ITEMS[index % ITEMS.length], [index]);

  useEffect(() => {
    if (paused.current) return;
    const t = setInterval(
      () =>
        setIndex((i) => {
          setPrevIndex(i);
          return (i + 1) % ITEMS.length;
        }),
      5000, // Slightly longer for better viewing
    );
    return () => clearInterval(t);
  }, [index]);

  return (
    <section className="py-20" id="showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            See It In Action
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Real time messaging, collaboration, tracking, geofencing, document
            management, signing, and more—powered by Dispatch.
          </p>
        </div>

        <div
          className="relative surface-card rounded-2xl p-4 md:p-6 overflow-hidden group"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          {/* Enhanced animated background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-30 animate-shimmer" />
            <div
              className={`absolute inset-0 opacity-5 bg-gradient-to-br ${current.gradient} animate-gradient-wave`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image area with enhanced animations */}
            <div
              className="relative rounded-xl bg-gray-900/40 border border-gray-800 overflow-hidden group cursor-zoom-in transform transition-all duration-700 hover:scale-[1.02] hover:border-gray-700 hover:shadow-2xl"
              onClick={() => setLightbox(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setLightbox(true);
              }}
              aria-label="Open media in lightbox"
              title="Click to enlarge"
            >
              {/* Enhanced gradient orbs with animation */}
              <div
                className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${current.gradient} animate-float`}
              />
              <div
                className={`absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-15 bg-gradient-to-tr ${current.gradient} animate-float-delayed`}
              />
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-3 bg-gradient-to-r ${current.gradient} animate-gradient-wave`}
              />

              {/* Enhanced crossfade with better animations */}
              {prevIndex !== null &&
                (ITEMS[prevIndex].media.type === 'image' ? (
                  <Image
                    key={`prev-${prevIndex}`}
                    src={ITEMS[prevIndex].media.src}
                    alt="previous slide"
                    width={1200}
                    height={800}
                    className="absolute inset-0 w-full h-auto opacity-0 animate-slide-out-left"
                  />
                ) : ITEMS[prevIndex].media.type === 'component' ? (
                  <div
                    key={`prev-${prevIndex}`}
                    className="absolute inset-0 w-full h-full opacity-0 animate-slide-out-left"
                  >
                    {(() => {
                      const Component = ITEMS[prevIndex].media.component;
                      return <Component />;
                    })()}
                  </div>
                ) : (
                  <video
                    key={`prev-${prevIndex}`}
                    className="absolute inset-0 w-full h-auto opacity-0 animate-slide-out-left"
                    muted
                    playsInline
                    autoPlay
                    loop
                    poster={ITEMS[prevIndex].media.poster}
                  >
                    {ITEMS[prevIndex].media.webm && (
                      <source
                        src={ITEMS[prevIndex].media.webm}
                        type="video/webm"
                      />
                    )}
                    <source src={ITEMS[prevIndex].media.mp4} type="video/mp4" />
                  </video>
                ))}

              {current.media.type === 'image' ? (
                <Image
                  key={`curr-${current.key}-${index}`}
                  src={current.media.src}
                  alt={current.title}
                  width={1200}
                  height={800}
                  className="relative w-full h-auto animate-slide-in-right group-hover:scale-105 transition-all duration-1000 ease-out"
                  priority
                />
              ) : current.media.type === 'component' ? (
                <div
                  key={`curr-${current.key}-${index}`}
                  className="relative w-full h-full animate-slide-in-right"
                >
                  {(() => {
                    const Component = current.media.component;
                    return <Component />;
                  })()}
                </div>
              ) : (
                <video
                  key={`curr-${current.key}-${index}`}
                  className="relative w-full h-auto animate-slide-in-right rounded-md group-hover:scale-105 transition-all duration-1000"
                  muted
                  playsInline
                  autoPlay
                  loop
                  poster={current.media.poster}
                >
                  {current.media.webm && (
                    <source src={current.media.webm} type="video/webm" />
                  )}
                  <source src={current.media.mp4} type="video/mp4" />
                </video>
              )}
            </div>

            {/* Text & controls with enhanced animations */}
            <div className="space-y-6">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${current.gradient} animate-pulse-subtle shadow-lg`}
              >
                <FeatureIcon
                  feature={current.key}
                  active
                  className="w-4 h-4 mr-2"
                />
                Live Feature
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3 animate-slide-up">
                {current.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed text-lg animate-slide-up-delayed">
                {current.caption}
              </p>

              <div className="flex items-center gap-4 animate-slide-up-more-delayed">
                <button
                  aria-label="Previous"
                  onClick={() =>
                    setIndex((i) => {
                      setPrevIndex(i);
                      return (i - 1 + ITEMS.length) % ITEMS.length;
                    })
                  }
                  className="group p-3 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800/70 hover:border-gray-600 hover:scale-110 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <button
                  aria-label="Next"
                  onClick={() =>
                    setIndex((i) => {
                      setPrevIndex(i);
                      return (i + 1) % ITEMS.length;
                    })
                  }
                  className="group p-3 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800/70 hover:border-gray-600 hover:scale-110 transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <div className="ml-2 hidden md:flex gap-2">
                  {ITEMS.map((it, i) => (
                    <button
                      key={it.key}
                      aria-label={`Go to ${it.title}`}
                      onClick={() =>
                        setIndex((curr) => {
                          setPrevIndex(curr);
                          return i;
                        })
                      }
                      className={`h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                        i === index
                          ? `bg-gradient-to-r ${current.gradient} w-8 shadow-lg opacity-90`
                          : 'bg-gray-600 hover:bg-gray-500 w-3'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lightbox */}
          {lightbox && (
            <div
              role="dialog"
              aria-label="Showcase lightbox"
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setLightbox(false)}
            >
              <div
                className="relative max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {current.media.type === 'image' ? (
                  <Image
                    src={current.media.src}
                    alt={current.title}
                    width={1600}
                    height={1000}
                    className="w-full h-auto animate-fade-in"
                  />
                ) : current.media.type === 'component' ? (
                  <div className="w-full h-96 bg-white rounded-lg animate-fade-in">
                    {(() => {
                      const Component = current.media.component;
                      return <Component />;
                    })()}
                  </div>
                ) : (
                  <video
                    className="w-full h-auto animate-fade-in"
                    muted
                    playsInline
                    autoPlay
                    loop
                    controls
                    poster={current.media.poster}
                  >
                    {current.media.webm && (
                      <source src={current.media.webm} type="video/webm" />
                    )}
                    <source src={current.media.mp4} type="video/mp4" />
                  </video>
                )}

                <div
                  className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md cursor-pointer"
                  onClick={() => setLightbox(false)}
                >
                  Close
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced thumbnail selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mt-12">
          {ITEMS.map((it, i) => (
            <button
              key={it.key}
              onClick={() =>
                setIndex((curr) => {
                  setPrevIndex(curr);
                  return i;
                })
              }
              className={`group relative rounded-xl overflow-hidden border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                i === index
                  ? `border-2 ${current.gradient
                      .replace('from-', 'border-')
                      .replace(
                        ' to-',
                        ' border-opacity-70',
                      )} shadow-2xl scale-105 -translate-y-1`
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="aspect-[16/10] bg-gray-900/40 relative overflow-hidden">
                {/* Gradient overlay for active state */}
                {i === index && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-5 animate-gradient-wave`}
                  />
                )}

                {it.media.type === 'image' ? (
                  <Image
                    src={it.media.src}
                    alt={it.title}
                    width={480}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : it.media.type === 'component' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <FeatureThumb
                      feature={it.key}
                      active={i === index}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <Image
                    src={it.media.poster ?? '/images/messaging.svg'}
                    alt={`${it.title} poster`}
                    width={480}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center text-xs font-medium text-gray-200 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm">
                {it.title}
              </div>

              {/* Active indicator */}
              {i === index && (
                <div
                  className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-r ${current.gradient} opacity-90 animate-pulse-subtle`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
