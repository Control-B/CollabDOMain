'use client';

import { useEffect, useState, useMemo } from 'react';

export default function AnimatedGeofencing() {
  const [activeZone, setActiveZone] = useState(0);
  const [vehiclePosition, setVehiclePosition] = useState({ x: 15, y: 70 });
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const zones = useMemo(
    () => [
      {
        id: 1,
        x: 25,
        y: 35,
        radius: 18,
        name: 'Warehouse A',
        type: 'pickup',
        color: 'blue',
      },
      {
        id: 2,
        x: 70,
        y: 55,
        radius: 15,
        name: 'Customer Site',
        type: 'delivery',
        color: 'green',
      },
      {
        id: 3,
        x: 45,
        y: 75,
        radius: 12,
        name: 'Fuel Station',
        type: 'service',
        color: 'amber',
      },
    ],
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setVehiclePosition((prev) => {
        const newX = (prev.x + 8) % 85;
        const newY = 50 + Math.sin(newX * 0.08) * 25;

        // Check if vehicle enters any zone
        zones.forEach((zone, idx) => {
          const distance = Math.sqrt(
            (newX - zone.x) ** 2 + (newY - zone.y) ** 2,
          );
          if (distance < zone.radius) {
            setActiveZone(idx);
            setAlertTriggered(true);
            setTimeout(() => setAlertTriggered(false), 2000);
          }
        });

        return { x: newX, y: newY };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [zones]);

  // Cycle the attention panel visibility
  useEffect(() => {
    const t1 = setTimeout(() => setShowPanel(true), 900);
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
        <div className="bg-gradient-to-r from-sky-500 to-cyan-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Geofencing</h3>
              <p className="text-sm opacity-90">Smart Zone Management</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-300 rounded-full opacity-80"></div>
                <span className="text-sm">3 Active Zones</span>
              </div>
              <p className="text-xs opacity-80">Auto-triggered</p>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="relative h-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
          {/* Grid lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 100 100"
          >
            <defs>
              <pattern
                id="geofence-grid"
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
            <rect width="100" height="100" fill="url(#geofence-grid)" />
          </svg>

          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <path
              d="M 10 70 Q 30 45 50 70 T 90 60"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              className="opacity-50"
            />
          </svg>

          {/* Geofence zones with pins and circles */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {zones.map((zone, idx) => (
              <g key={zone.id}>
                {/* Geofence circle */}
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={zone.radius}
                  fill={`rgba(${
                    zone.color === 'blue'
                      ? '59, 130, 246'
                      : zone.color === 'green'
                      ? '34, 197, 94'
                      : '245, 158, 11'
                  }, 0.08)`}
                  stroke={`${
                    zone.color === 'blue'
                      ? '#3b82f6'
                      : zone.color === 'green'
                      ? '#22c55e'
                      : '#f59e0b'
                  }`}
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                  className={`transition-all duration-500 ${
                    idx === activeZone ? 'opacity-100' : 'opacity-60'
                  }`}
                />

                {/* Location pin */}
                <g
                  transform={`translate(${zone.x}, ${
                    zone.y - zone.radius * 0.6
                  })`}
                >
                  <path
                    d="M0,-8 C-3,-8 -5,-6 -5,-3 C-5,0 0,8 0,8 C0,8 5,0 5,-3 C5,-6 3,-8 0,-8 Z"
                    fill={`${
                      zone.color === 'blue'
                        ? '#3b82f6'
                        : zone.color === 'green'
                        ? '#22c55e'
                        : '#f59e0b'
                    }`}
                    className={`transition-all duration-300 ${
                      idx === activeZone ? 'animate-float' : ''
                    }`}
                  />
                  <circle
                    cx="0"
                    cy="-5"
                    r="2"
                    fill="white"
                    className="opacity-90"
                  />
                </g>

                {/* Zone label */}
                <text
                  x={zone.x}
                  y={zone.y + zone.radius + 8}
                  textAnchor="middle"
                  className={`text-xs font-medium fill-${zone.color}-700`}
                >
                  {zone.name}
                </text>

                {/* Ripple effect when active */}
                {idx === activeZone && (
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={zone.radius}
                    fill="none"
                    stroke={`${
                      zone.color === 'blue'
                        ? '#3b82f6'
                        : zone.color === 'green'
                        ? '#22c55e'
                        : '#f59e0b'
                    }`}
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}
              </g>
            ))}
          </svg>

          {/* Moving vehicle (SVG overlay, avoids inline styles) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
          >
            <g
              transform={`translate(${vehiclePosition.x} ${vehiclePosition.y})`}
            >
              <circle r="3" className="fill-sky-600 shadow-lg" />
              <circle r="1.2" className="fill-white opacity-90" />
              <circle r="5" className="fill-sky-400 opacity-30 animate-ping" />
            </g>
          </svg>

          {/* Attention panel (Geofencing) */}
          <div
            aria-hidden="true"
            className={`absolute left-4 bottom-24 md:bottom-20 w-[80%] max-w-lg pointer-events-none transform transition-all duration-500 ${
              showPanel
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'
            }`}
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400/60 to-sky-500/60 blur-lg opacity-80 animate-pulse-subtle" />
            <div className="relative bg-gradient-to-r from-cyan-500 to-sky-600/90 text-white rounded-xl p-3 md:p-4 shadow-2xl ring-1 ring-white/10">
              <div className="text-sm md:text-base font-semibold tracking-wide animate-slide-up">
                Smart zone control
              </div>
              <ul className="mt-2 text-xs md:text-sm text-white/90 list-disc list-inside space-y-1">
                <li className="animate-slide-up">Auto check-in/out</li>
                <li className="animate-slide-up-delayed">
                  Real-time breach alerts
                </li>
                <li className="animate-slide-up-more-delayed">
                  Perimeter analytics
                </li>
              </ul>
            </div>
          </div>

          {/* Status panel */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full opacity-80"></div>
                <span className="text-gray-700">
                  Current Zone: {zones[activeZone]?.name || 'In Transit'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full opacity-80"></div>
                <span className="text-gray-700">Auto Check-in: On</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full opacity-80"></div>
                <span className="text-gray-700">
                  Alerts: {alertTriggered ? 'Active' : 'Idle'}
                </span>
              </div>
            </div>
          </div>

          {/* Alert notification */}
          {alertTriggered && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-slide-in-right">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Zone entered!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
