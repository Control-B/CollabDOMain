import React from 'react';

export type FeatureKey =
  | 'messaging'
  | 'collaboration'
  | 'tracking'
  | 'geofencing'
  | 'documents'
  | 'signing'
  | 'sharing';

type Props = {
  feature: FeatureKey;
  active?: boolean;
  className?: string;
};

const Dot = ({
  cx,
  cy,
  r = 2,
  className = '',
}: {
  cx: number;
  cy: number;
  r?: number;
  className?: string;
}) => <circle cx={cx} cy={cy} r={r} className={className} />;

export default function FeatureIcon({
  feature,
  active = false,
  className = '',
}: Props) {
  switch (feature) {
    case 'messaging':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <defs>
            <linearGradient id="msgGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <g
            fill="none"
            stroke="url(#msgGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="6" y="8" width="36" height="24" rx="6" opacity="0.95" />
            <path d="M16 36l6-6h20" opacity="0.9" />
          </g>
          {/* typing dots */}
          <Dot cx={18} cy={20} className="fill-white/90 animate-typing1" />
          <Dot cx={24} cy={20} className="fill-white/90 animate-typing2" />
          <Dot cx={30} cy={20} className="fill-white/90 animate-typing3" />
        </svg>
      );

    case 'collaboration':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <defs>
            <linearGradient id="colGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {/* Board */}
          <rect
            x="6"
            y="8"
            width="36"
            height="24"
            rx="6"
            fill="none"
            stroke="url(#colGrad)"
            strokeWidth="2.2"
          />
          {/* Cards */}
          <rect
            x="10"
            y="12"
            width="14"
            height="8"
            rx="2"
            fill="#8b5cf6"
            className="animate-fade-in"
          />
          <rect
            x="26"
            y="20"
            width="12"
            height="6"
            rx="2"
            fill="#22d3ee"
            className="animate-fade-in-up"
          />
          {/* Connector */}
          <path
            d="M24 16C26 18 28 18 30 20"
            fill="none"
            stroke="url(#colGrad)"
            strokeWidth="2"
          />
        </svg>
      );

    case 'tracking':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <defs>
            <radialGradient id="trkGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </radialGradient>
          </defs>
          <g fill="none" stroke="url(#trkGrad)" strokeWidth="2.2">
            <circle cx="24" cy="24" r="10" className="opacity-90" />
            <circle cx="24" cy="24" r="16" className="opacity-40" />
          </g>
          {/* pin */}
          <path
            d="M24 12c-4 0-7 3.1-7 7 0 5.6 7 13 7 13s7-7.4 7-13c0-3.9-3-7-7-7zm0 10a3 3 0 110-6 3 3 0 010 6z"
            fill="url(#trkGrad)"
            className="drop-shadow"
          />
          {/* orbiting dot */}
          <circle
            cx="24"
            cy="8"
            r="2"
            fill="#a7f3d0"
            className="animate-orbit"
          />
        </svg>
      );

    case 'geofencing':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <defs>
            <linearGradient id="geoGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* zone */}
          <circle cx="24" cy="26" r="10" fill="url(#geoGrad)" opacity="0.15" />
          <circle
            cx="24"
            cy="26"
            r="10"
            fill="none"
            stroke="url(#geoGrad)"
            strokeWidth="2"
            strokeDasharray="2 3"
            className="animate-dash"
          />
          {/* pin */}
          <path
            d="M24 10c-4 0-7 3.1-7 7 0 5.6 7 13 7 13s7-7.4 7-13c0-3.9-3-7-7-7zm0 10a3 3 0 110-6 3 3 0 010 6z"
            fill="url(#geoGrad)"
          />
          {/* soft ping when active */}
          {active && (
            <circle
              cx="24"
              cy="26"
              r="14"
              className="fill-cyan-300/10 animate-soft-ping"
            />
          )}
        </svg>
      );

    case 'documents':
    case 'sharing':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <defs>
            <linearGradient id="docGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
          <g
            fill="none"
            stroke="url(#docGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <rect x="12" y="8" width="20" height="28" rx="3" />
            <path d="M32 16h-8V8" />
          </g>
          {/* lines */}
          <rect
            x="16"
            y="20"
            width="12"
            height="2"
            rx="1"
            fill="url(#docGrad)"
            className="animate-draw"
          />
          <rect
            x="16"
            y="25"
            width="8"
            height="2"
            rx="1"
            fill="url(#docGrad)"
            className="animate-draw delay-100"
          />
          {/* link badge for sharing */}
          {feature === 'sharing' && (
            <g transform="translate(30,28)">
              <circle r="6" fill="url(#docGrad)" opacity="0.2" />
              <path
                d="M-2 0a3 3 0 014.2-2.7l2-2a3 3 0 114.2 4.2l-2 2A3 3 0 010 2.8"
                fill="none"
                stroke="url(#docGrad)"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      );

    case 'signing':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <defs>
            <linearGradient id="sigGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <rect
            x="8"
            y="10"
            width="28"
            height="22"
            rx="3"
            fill="none"
            stroke="url(#sigGrad)"
            strokeWidth="2.2"
          />
          {/* signature squiggle */}
          <path
            d="M12 24c3 0 3-4 6-4s3 6 6 6 3-4 6-4"
            fill="none"
            stroke="url(#sigGrad)"
            strokeWidth="2.2"
            className="animate-draw"
          />
          {/* pen nib */}
          <g transform="translate(30,18)" className="animate-pen">
            <path d="M0 0l6 6-3 1-3-3z" fill="url(#sigGrad)" />
          </g>
        </svg>
      );
  }
}
