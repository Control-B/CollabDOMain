'use client';

import { useEffect, useState } from 'react';

export default function AnimatedMapTracking() {
  const [vehiclePosition, setVehiclePosition] = useState({ x: 10, y: 60 });
  const [pulse, setPulse] = useState(false);
  const [showGeofence, setShowGeofence] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehiclePosition((prev) => ({
        x: (prev.x + 15) % 80,
        y: 50 + Math.sin((prev.x + 15) * 0.1) * 20,
      }));
    }, 2000);

    const pulseInterval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 3000);

    const geofenceInterval = setInterval(() => {
      setShowGeofence((prev) => !prev);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
      clearInterval(geofenceInterval);
    };
  }, []);

  // Cycle the attention panel to avoid covering main content
  useEffect(() => {
    // initial nudge
    const t1 = setTimeout(() => setShowPanel(true), 800);
    const t2 = setTimeout(() => setShowPanel(false), 4200);

    const cycle = setInterval(() => {
      setShowPanel(true);
      const hide = setTimeout(() => setShowPanel(false), 3500);
      return () => clearTimeout(hide);
    }, 10000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(cycle);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg h-96 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Live Tracking</h3>
              <p className="text-sm opacity-90">Vehicle: TRK-001</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full opacity-80"></div>
                <span className="text-sm">Live</span>
              </div>
              <p className="text-xs opacity-80">ETA: 5:45 PM</p>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="relative h-full bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
          {/* Grid lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 100 100"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>

          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <path
              d="M 5 60 Q 25 40 45 60 T 95 50"
              fill="none"
              stroke="#6b7280"
              strokeWidth="3"
              strokeDasharray="none"
              className="opacity-60"
            />
          </svg>

          {/* Geofence zones */}
          {showGeofence && (
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <circle
                cx="20"
                cy="60"
                r="12"
                fill="rgba(239, 68, 68, 0.1)"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="opacity-70"
              >
                <animate
                  attributeName="opacity"
                  values="0.5;0.9;0.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx="80"
                cy="50"
                r="15"
                fill="rgba(34, 197, 94, 0.1)"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="opacity-70"
              >
                <animate
                  attributeName="opacity"
                  values="0.5;0.9;0.5"
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          )}

          {/* Waypoints */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Start point */}
            <circle cx="10" cy="60" r="3" fill="#3b82f6" className="opacity-80">
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x="10"
              y="75"
              textAnchor="middle"
              className="text-xs fill-blue-600 font-medium"
            >
              Start
            </text>

            {/* End point */}
            <circle cx="85" cy="50" r="3" fill="#ef4444" className="opacity-80">
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x="85"
              y="42"
              textAnchor="middle"
              className="text-xs fill-red-600 font-medium"
            >
              Destination
            </text>
          </svg>

          {/* Moving vehicle (SVG overlay, avoids inline styles) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
          >
            <g
              transform={`translate(${vehiclePosition.x} ${vehiclePosition.y})`}
            >
              {/* Pulse rings */}
              {pulse && (
                <>
                  <circle
                    r="4"
                    className="fill-emerald-400 opacity-30 animate-ping"
                  />
                  <circle
                    r="6"
                    className="fill-emerald-400 opacity-20 animate-ping [animation-delay:200ms]"
                  />
                </>
              )}
              {/* Vehicle marker */}
              <circle r="3" className="fill-emerald-600 shadow-lg" />
              <circle r="1.2" className="fill-white" />
            </g>
          </svg>

          {/* Status indicators */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-700">Speed: 65 mph</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Distance: 142 mi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-gray-700">Fuel: 78%</span>
              </div>
            </div>
          </div>

          {/* Attention panel (Tracking) */}
          <div
            aria-hidden="true"
            className={`absolute left-4 bottom-24 md:bottom-20 w-[80%] max-w-lg pointer-events-none transform transition-all duration-500 ${
              showPanel
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4'
            }`}
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400/60 to-teal-500/60 blur-lg opacity-80 animate-pulse-subtle" />
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600/90 text-white rounded-xl p-3 md:p-4 shadow-2xl ring-1 ring-white/10">
              <div className="text-sm md:text-base font-semibold tracking-wide animate-slide-up">
                Track every mile
              </div>
              <ul className="mt-2 text-xs md:text-sm text-white/90 list-disc list-inside space-y-1">
                <li className="animate-slide-up">Live ETA and status</li>
                <li className="animate-slide-up-delayed">
                  Smart geofence alerts
                </li>
                <li className="animate-slide-up-more-delayed">
                  Exception notifications
                </li>
              </ul>
            </div>
          </div>

          {/* Geofence notification */}
          {showGeofence && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-slide-in-right">
              Entered delivery zone
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
