'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = {
  key: string;
  label: string;
  color: string; // hex or tailwind color value
  note?: string | null; // e.g., "1 hour", "Today", etc.
  emoji?: string;
};

const allStatuses: Status[] = [
  { key: 'active', label: 'Active', color: '#22c55e', emoji: '🟢' },
  { key: 'away', label: 'Away', color: '#fbbf24', emoji: '🟡' },
  { key: 'lunch', label: 'Lunch Break', color: '#f59e0b', emoji: '🍽️' },
  { key: 'meeting', label: 'In a meeting', color: '#60a5fa', emoji: '🗓️' },
  { key: 'commuting', label: 'Commuting', color: '#a78bfa', emoji: '🚌' },
  { key: 'outsick', label: 'Out sick', color: '#f97316', emoji: '🤒' },
  { key: 'vacation', label: 'Vacationing', color: '#10b981', emoji: '🏝️' },
  { key: 'remote', label: 'Working remotely', color: '#34d399', emoji: '🏡' },
];

function StatusIcon({ k, color }: { k: string; color: string }) {
  const base =
    'w-7 h-7 shrink-0 grid place-items-center rounded-md bg-gray-800 border border-gray-700';
  switch (k) {
    case 'active':
      return (
        <div className={base}>
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <circle cx="12" cy="12" r="9" fill="#22c55e" />
          </svg>
        </div>
      );
    case 'away':
      return (
        <div className={base}>
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <circle cx="12" cy="12" r="9" fill="#fbbf24" />
          </svg>
        </div>
      );
    case 'lunch':
      return (
        <div className={base}>
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" fill="#60a5fa" />
            <circle cx="12" cy="12" r="6.2" fill="#f8fafc" />
            <path d="M7 6.5v7" stroke="#e5e7eb" strokeWidth="1.6" />
            <path d="M17 6v12" stroke="#e5e7eb" strokeWidth="1.6" />
          </svg>
        </div>
      );
    case 'meeting':
      return (
        <div className={base}>
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="3.5"
              y="6.5"
              width="17"
              height="12"
              rx="2"
              fill="#f8fafc"
              stroke="#9ca3af"
              strokeWidth="1.2"
            />
            <rect x="3.5" y="6.5" width="17" height="3" rx="2" fill="#ef4444" />
            <path d="M8 4v3M16 4v3" stroke="#ef4444" strokeWidth="1.6" />
            <circle cx="17.5" cy="13" r="2.2" fill="#60a5fa" />
            <path d="M17.5 12v1.2l.9.6" stroke="#0c4a6e" strokeWidth="1.2" />
          </svg>
        </div>
      );
    case 'commuting':
      return (
        <div className={base}>
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="4.5"
              y="7.5"
              width="15"
              height="7.5"
              rx="2"
              fill="#fbbf24"
              stroke="#92400e"
              strokeWidth="1.2"
            />
            <rect
              x="6"
              y="9"
              width="4.2"
              height="2.5"
              rx="0.6"
              fill="#93c5fd"
            />
            <rect
              x="11.8"
              y="9"
              width="4.2"
              height="2.5"
              rx="0.6"
              fill="#93c5fd"
            />
            <circle cx="9" cy="17.2" r="1.1" fill="#111827" />
            <circle cx="15.8" cy="17.2" r="1.1" fill="#111827" />
          </svg>
        </div>
      );
    case 'outsick':
      return (
        <div className={base}>
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="#fde68a"
              stroke="#f59e0b"
              strokeWidth="1.2"
            />
            <circle cx="9" cy="10" r="1" fill="#111827" />
            <circle cx="15" cy="10" r="1" fill="#111827" />
            <path d="M9 15c2-1 4-1 6 0" stroke="#b45309" strokeWidth="1.2" />
            <rect
              x="12.2"
              y="13.5"
              width="5"
              height="1.2"
              rx="0.6"
              fill="#ef4444"
            />
          </svg>
        </div>
      );
    case 'vacation':
      return (
        <div className={base}>
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="6" r="3" fill="#fb923c" />
            <path d="M7 18c3-2 5-6 7-8" stroke="#10b981" strokeWidth="1.6" />
            <path d="M12 10c1 2 3 4 5 5" stroke="#065f46" strokeWidth="1.2" />
            <rect x="3" y="18" width="18" height="2" fill="#60a5fa" />
          </svg>
        </div>
      );
    case 'remote':
      return (
        <div className={base}>
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 11l8-6 8 6" stroke="#ef4444" strokeWidth="1.6" />
            <rect
              x="6.5"
              y="11"
              width="11"
              height="7"
              rx="1.2"
              fill="#f8fafc"
              stroke="#9ca3af"
              strokeWidth="1.2"
            />
            <rect
              x="11"
              y="14"
              width="2.5"
              height="4"
              rx="0.6"
              fill="#a78bfa"
            />
          </svg>
        </div>
      );
    default:
      return <div className={base}>🙂</div>;
  }
}

export default function StatusPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<Status | null>(null);

  // Load previously selected status
  useEffect(() => {
    try {
      const raw = localStorage.getItem('userStatus');
      if (raw) {
        const parsed = JSON.parse(raw) as Status;
        const match = allStatuses.find((s) => s.key === parsed.key);
        setSelected(match ?? allStatuses[0]);
      } else {
        setSelected(allStatuses[0]);
      }
    } catch {
      setSelected(allStatuses[0]);
    }
  }, []);

  const canSave = useMemo(() => !!selected, [selected]);

  const onSave = () => {
    if (!selected) return;
    localStorage.setItem('userStatus', JSON.stringify(selected));
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold tracking-wide">
            Set your status
          </h1>
          <button
            className="px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750"
            onClick={() => router.back()}
          >
            Close
          </button>
        </div>

        {/* Status input placeholder (non-functional for now) */}
        <div className="mb-4">
          <input
            readOnly
            placeholder="What's your status?"
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 placeholder:text-gray-500 cursor-text"
          />
        </div>

        <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
          Suggestions
        </div>
        <div className="rounded-xl border border-gray-800 divide-y divide-gray-800 overflow-hidden bg-gray-900">
          {allStatuses.map((s) => {
            const active = selected?.key === s.key;
            return (
              <button
                key={s.key}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-800 ${active ? 'bg-gray-800' : ''}`}
                onClick={() => setSelected(s)}
              >
                <StatusIcon k={s.key} color={s.color} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.label}</span>
                  </div>
                </div>
                {active && (
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-750"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
