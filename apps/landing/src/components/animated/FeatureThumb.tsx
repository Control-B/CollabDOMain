'use client';

import React from 'react';
import { FeatureKey } from '../icons/FeatureIcon';

type Props = {
  feature: FeatureKey;
  active?: boolean;
  className?: string;
};

// Minimal, low-motion thumbnail animations that hint each function.
export default function FeatureThumb({
  feature,
  active = false,
  className = '',
}: Props) {
  switch (feature) {
    case 'messaging':
      // Chat bubble with typing dots and a subtle shimmer line
      return (
        <svg viewBox="0 0 160 100" className={className} aria-hidden>
          <defs>
            <linearGradient id="ft-msg" x1="0" x2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="160"
            height="100"
            rx="12"
            fill="#0b1220"
            opacity="0.85"
          />
          <g
            fill="none"
            stroke="url(#ft-msg)"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <rect x="24" y="24" width="88" height="44" rx="12" opacity="0.9" />
            <path d="M48 76l10-10h54" opacity="0.8" />
          </g>
          {/* Typing dots */}
          <g fill="#fff">
            <circle cx="48" cy="46" r="4" className="animate-typing1" />
            <circle cx="64" cy="46" r="4" className="animate-typing2" />
            <circle cx="80" cy="46" r="4" className="animate-typing3" />
          </g>
          {/* Subtle shimmer line to indicate activity */}
          <rect
            x="26"
            y="28"
            width="84"
            height="4"
            rx="2"
            fill="#93c5fd"
            className="animate-fade-in-up"
            opacity="0.25"
          />
        </svg>
      );

    case 'collaboration':
      // Mini board with two cards and connecting line to represent teamwork
      return (
        <svg viewBox="0 0 160 100" className={className} aria-hidden>
          <defs>
            <linearGradient id="ft-col" x1="0" x2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="160"
            height="100"
            rx="12"
            fill="#0b1220"
            opacity="0.85"
          />
          <rect
            x="30"
            y="22"
            width="44"
            height="28"
            rx="6"
            fill="#8b5cf6"
            opacity="0.9"
            className="animate-fade-in"
          />
          <rect
            x="86"
            y="50"
            width="44"
            height="24"
            rx="6"
            fill="#22d3ee"
            opacity="0.9"
            className="animate-fade-in-up"
          />
          <svg viewBox="0 0 160 100" className="absolute inset-0">
            <path
              d="M74 36C92 44 98 52 108 62"
              fill="none"
              stroke="url(#ft-col)"
              strokeWidth="3"
              className="animate-fade-in"
            />
          </svg>
        </svg>
      );

    case 'tracking':
      // Concentric rings with a map pin and orbiting beacon
      return (
        <svg viewBox="0 0 160 100" className={className} aria-hidden>
          <defs>
            <radialGradient id="ft-trk" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </radialGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="160"
            height="100"
            rx="12"
            fill="#0b1220"
            opacity="0.85"
          />
          <g fill="none" stroke="url(#ft-trk)" strokeWidth="3">
            <circle cx="80" cy="50" r="18" className="opacity-90" />
            <circle cx="80" cy="50" r="28" className="opacity-40" />
          </g>
          {/* Pin */}
          <path
            d="M80 30c-7 0-12 5.4-12 12 0 9.6 12 22 12 22s12-12.4 12-22c0-6.6-5-12-12-12zm0 17a5 5 0 110-10 5 5 0 010 10z"
            fill="url(#ft-trk)"
          />
          {/* Orbiting dot */}
          <circle
            cx="80"
            cy="20"
            r="4"
            fill="#a7f3d0"
            className="animate-orbit"
          />
        </svg>
      );

    case 'geofencing':
      // Geofence ring with dashed stroke and soft ping when active, plus a pin
      return (
        <svg viewBox="0 0 160 100" className={className} aria-hidden>
          <defs>
            <linearGradient id="ft-geo" x1="0" x2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="160"
            height="100"
            rx="12"
            fill="#0b1220"
            opacity="0.85"
          />
          <circle cx="80" cy="60" r="22" fill="url(#ft-geo)" opacity="0.12" />
          <circle
            cx="80"
            cy="60"
            r="22"
            fill="none"
            stroke="url(#ft-geo)"
            strokeWidth="3"
            strokeDasharray="4 5"
            className="animate-dash"
          />
          {active && (
            <circle
              cx="80"
              cy="60"
              r="30"
              className="fill-cyan-300/10 animate-soft-ping"
            />
          )}
          {/* Pin */}
          <path
            d="M80 30c-7 0-12 5.4-12 12 0 9.6 12 22 12 22s12-12.4 12-22c0-6.6-5-12-12-12zm0 17a5 5 0 110-10 5 5 0 010 10z"
            fill="url(#ft-geo)"
          />
        </svg>
      );

    case 'documents':
      // Document sheet with drawing lines animating in
      return (
        <svg viewBox="0 0 160 100" className={className} aria-hidden>
          <defs>
            <linearGradient id="ft-doc" x1="0" x2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="160"
            height="100"
            rx="12"
            fill="#0b1220"
            opacity="0.85"
          />
          <g
            fill="none"
            stroke="url(#ft-doc)"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <rect x="44" y="18" width="56" height="64" rx="6" />
            <path d="M100 34H76V18" />
          </g>
          <rect
            x="52"
            y="44"
            width="40"
            height="4"
            rx="2"
            fill="url(#ft-doc)"
            className="animate-draw"
          />
          <rect
            x="52"
            y="54"
            width="28"
            height="4"
            rx="2"
            fill="url(#ft-doc)"
            className="animate-draw delay-05"
          />
        </svg>
      );

    case 'sharing':
      // Document with link badge hint
      return (
        <svg viewBox="0 0 160 100" className={className} aria-hidden>
          <defs>
            <linearGradient id="ft-shr" x1="0" x2="1">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="160"
            height="100"
            rx="12"
            fill="#0b1220"
            opacity="0.85"
          />
          <g
            fill="none"
            stroke="url(#ft-shr)"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <rect x="44" y="18" width="56" height="64" rx="6" />
            <path d="M100 34H76V18" />
          </g>
          <g
            transform="translate(104,64)"
            fill="none"
            stroke="url(#ft-shr)"
            strokeWidth="3"
          >
            <circle r="10" opacity="0.25" />
            <path d="M-4 0a5 5 0 017-4.5l3-3a5 5 0 117 7l-3 3A5 5 0 010 4.5" />
          </g>
        </svg>
      );

    case 'signing':
      // Signature squiggle drawing with a pen nib movement
      return (
        <svg viewBox="0 0 160 100" className={className} aria-hidden>
          <defs>
            <linearGradient id="ft-sig" x1="0" x2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="160"
            height="100"
            rx="12"
            fill="#0b1220"
            opacity="0.85"
          />
          <rect
            x="28"
            y="20"
            width="88"
            height="52"
            rx="6"
            fill="none"
            stroke="url(#ft-sig)"
            strokeWidth="3"
          />
          <path
            d="M36 58c9 0 9-12 18-12s9 18 18 18 9-12 18-12"
            fill="none"
            stroke="url(#ft-sig)"
            strokeWidth="3"
            className="animate-draw"
          />
          <g transform="translate(94,40)" className="animate-pen">
            <path d="M0 0l10 10-5 2-5-5z" fill="url(#ft-sig)" />
          </g>
        </svg>
      );
  }
}
