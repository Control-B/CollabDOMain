'use client';

import React from 'react';

export default function AnimatedCollaboration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg h-96 relative">
        <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Team Collaboration</h3>
              <p className="text-sm opacity-90">Boards & assignments</p>
            </div>
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur ring-2 ring-white/30" />
              <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur ring-2 ring-white/30" />
              <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur ring-2 ring-white/30" />
            </div>
          </div>
        </div>

        <div className="relative h-full bg-gradient-to-br from-slate-50 to-purple-50 overflow-hidden">
          {/* Board grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 100 100"
          >
            <defs>
              <pattern
                id="collab-grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#collab-grid)" />
          </svg>

          {/* Cards (fixed positions, subtle float) */}
          <div className="absolute left-[12%] top-[16%] w-[32%] h-[18%] rounded-lg shadow-md bg-indigo-500 animate-float">
            <div className="h-full w-full bg-white/20 rounded-lg p-2">
              <div className="h-2 w-2/3 bg-white/70 rounded mb-2" />
              <div className="h-2 w-1/2 bg-white/60 rounded mb-2" />
              <div className="h-2 w-1/3 bg-white/50 rounded" />
            </div>
          </div>
          <div className="absolute left-[52%] top-[18%] w-[28%] h-[14%] rounded-lg shadow-md bg-violet-400 animate-float-delayed">
            <div className="h-full w-full bg-white/20 rounded-lg p-2">
              <div className="h-2 w-1/2 bg-white/70 rounded mb-2" />
              <div className="h-2 w-1/3 bg-white/60 rounded" />
            </div>
          </div>
          <div className="absolute left-[12%] top-[40%] w-[24%] h-[14%] rounded-lg shadow-md bg-cyan-400 animate-float">
            <div className="h-full w-full bg-white/20 rounded-lg p-2">
              <div className="h-2 w-1/2 bg-white/70 rounded mb-2" />
              <div className="h-2 w-1/3 bg-white/60 rounded" />
            </div>
          </div>
          <div className="absolute left-[40%] top-[44%] w-[40%] h-[20%] rounded-lg shadow-md bg-emerald-400 animate-float-delayed">
            <div className="h-full w-full bg-white/20 rounded-lg p-2">
              <div className="h-2 w-2/3 bg-white/70 rounded mb-2" />
              <div className="h-2 w-1/2 bg-white/60 rounded mb-2" />
              <div className="h-2 w-1/3 bg-white/50 rounded" />
            </div>
          </div>

          {/* Connecting lines between cards */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="collab-line" x1="0" x2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <g
              stroke="url(#collab-line)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            >
              <path d="M28 25C40 28 48 30 60 25" className="animate-fade-in" />
              <path d="M24 47C34 44 44 52 64 54" className="animate-fade-in" />
              <path d="M40 28C44 38 46 40 60 45" className="animate-fade-in" />
            </g>
          </svg>

          {/* Attention text panel (with glow + staggered bullets) */}
          <div className="absolute left-6 bottom-24 md:bottom-20 w-[80%] md:w-[70%] max-w-lg">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-400/60 to-fuchsia-500/60 blur-lg opacity-80 animate-pulse-subtle" />
            <div className="relative bg-gradient-to-r from-purple-500 to-fuchsia-600/90 text-white rounded-xl p-4 md:p-5 shadow-2xl ring-1 ring-white/10">
              <div className="text-sm md:text-base font-semibold tracking-wide animate-slide-up">
                Get more done together
              </div>
              <ul className="mt-2 text-xs md:text-sm text-white/90 list-disc list-inside space-y-1">
                <li className="animate-slide-up">
                  Assign owners and due dates
                </li>
                <li className="animate-slide-up-delayed">
                  Move work with drag-and-drop
                </li>
                <li className="animate-slide-up-more-delayed">
                  See who’s on it in real time
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
