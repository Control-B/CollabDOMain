'use client';

import React, { useEffect, useState } from 'react';

export default function AnimatedSharing() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProgress((p) => (p + 10) % 100), 500);
    return () => clearInterval(t);
  }, []);

  const circumference = 2 * Math.PI * 14; // r=14
  const dash = (progress / 100) * circumference;

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg h-96 relative">
        <div className="bg-gradient-to-r from-lime-500 to-green-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Secure Sharing</h3>
              <p className="text-sm opacity-90">Expiring links</p>
            </div>
            <div className="text-right text-xs opacity-95">Expires soon</div>
          </div>
        </div>

        <div className="relative h-full bg-gradient-to-br from-slate-50 to-green-50 overflow-hidden flex items-center justify-center">
          {/* Document */}
          <svg viewBox="0 0 120 120" className="w-2/3 h-2/3">
            <defs>
              <linearGradient id="shr-doc" x1="0" x2="1">
                <stop offset="0%" stopColor="#a3e635" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <g
              fill="none"
              stroke="url(#shr-doc)"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <rect x="30" y="20" width="44" height="64" rx="6" />
              <path d="M74 36H54V20" />
            </g>
            {/* lines */}
            <rect
              x="36"
              y="48"
              width="32"
              height="4"
              rx="2"
              fill="url(#shr-doc)"
              className="animate-draw"
            />
            <rect
              x="36"
              y="58"
              width="24"
              height="4"
              rx="2"
              fill="url(#shr-doc)"
              className="animate-draw delay-05"
            />
          </svg>

          {/* Share waves */}
          <svg viewBox="0 0 120 120" className="absolute w-2/3 h-2/3">
            <g
              stroke="#22c55e"
              strokeWidth="2"
              fill="none"
              className="opacity-40"
            >
              <circle cx="88" cy="72" r="8" className="animate-soft-ping" />
              <circle cx="88" cy="72" r="16" className="animate-soft-ping" />
            </g>
            {/* link badge */}
            <g transform="translate(88,72)">
              <circle r="6" fill="#22c55e" opacity="0.15" />
              <path
                d="M-3 0a4 4 0 015.6-3.6l2.4-2.4a4 4 0 115.6 5.6l-2.4 2.4A4 4 0 010 3.6"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
              />
            </g>
          </svg>

          {/* Expiry ring */}
          <svg viewBox="0 0 40 40" className="absolute right-6 top-6">
            <circle
              cx="20"
              cy="20"
              r="14"
              stroke="#d1fae5"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="20"
              cy="20"
              r="14"
              stroke="#10b981"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${dash} ${circumference}`}
              transform="rotate(-90 20 20)"
              className="transition-all duration-300"
            />
          </svg>

          {/* Attention text panel (with glow + staggered bullets) */}
          <div className="absolute left-6 bottom-24 md:bottom-20 w-[80%] md:w-[70%] max-w-lg">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-lime-400/60 to-emerald-500/60 blur-lg opacity-80 animate-pulse-subtle" />
            <div className="relative bg-gradient-to-r from-lime-500 to-emerald-600/90 text-white rounded-xl p-4 md:p-5 shadow-2xl ring-1 ring-white/10">
              <div className="text-sm md:text-base font-semibold tracking-wide animate-slide-up">
                Share safely, anywhere
              </div>
              <ul className="mt-2 text-xs md:text-sm text-white/90 list-disc list-inside space-y-1">
                <li className="animate-slide-up">Expiring, revocable links</li>
                <li className="animate-slide-up-delayed">
                  Track views and downloads
                </li>
                <li className="animate-slide-up-more-delayed">
                  Granular access control
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
