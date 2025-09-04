'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Lang = {
  key: string;
  label: string;
  native?: string;
  icon: React.ReactNode;
};

const langs: Lang[] = [
  {
    key: 'en',
    label: 'English',
    icon: (
      <span className="w-7 h-7 grid place-items-center rounded-md bg-blue-800 text-white text-xs font-bold border border-blue-700">
        EN
      </span>
    ),
  },
  {
    key: 'es',
    label: 'Spanish',
    native: 'Español',
    icon: (
      <span className="w-7 h-7 grid place-items-center rounded-md bg-red-700 text-white text-xs font-bold border border-red-600">
        ES
      </span>
    ),
  },
  {
    key: 'fr',
    label: 'French',
    native: 'Français',
    icon: (
      <span className="w-7 h-7 grid place-items-center rounded-md bg-indigo-700 text-white text-xs font-bold border border-indigo-600">
        FR
      </span>
    ),
  },
  {
    key: 'ar',
    label: 'Arabic',
    native: 'العربية',
    icon: (
      <span className="w-7 h-7 grid place-items-center rounded-md bg-emerald-700 text-white text-xs font-bold border border-emerald-600">
        AR
      </span>
    ),
  },
  {
    key: 'hi',
    label: 'Hindi (India)',
    native: 'हिन्दी',
    icon: (
      <span className="w-7 h-7 grid place-items-center rounded-md bg-orange-600 text-white text-xs font-bold border border-orange-500">
        HI
      </span>
    ),
  },
  {
    key: 'zh',
    label: 'Chinese',
    native: '中文',
    icon: (
      <span className="w-7 h-7 grid place-items-center rounded-md bg-yellow-600 text-white text-xs font-bold border border-yellow-500">
        ZH
      </span>
    ),
  },
];

export default function LanguagePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Lang | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('userLanguage');
      if (raw) {
        const found = langs.find((l) => l.key === raw);
        setSelected(found ?? langs[0]);
      } else {
        setSelected(langs[0]);
      }
    } catch {
      setSelected(langs[0]);
    }
  }, []);

  const canSave = useMemo(() => !!selected, [selected]);

  const onSave = () => {
    if (!selected) return;
    try {
      localStorage.setItem('userLanguage', selected.key);
      // simple RTL hint; not full i18n switch
      if (selected.key === 'ar')
        document.documentElement.setAttribute('dir', 'rtl');
      else document.documentElement.setAttribute('dir', 'ltr');
    } catch {}
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold tracking-wide">
            Choose language
          </h1>
          <button
            className="px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750"
            onClick={() => router.back()}
          >
            Close
          </button>
        </div>

        <div className="rounded-xl border border-gray-800 divide-y divide-gray-800 overflow-hidden bg-gray-900">
          {langs.map((l) => {
            const active = selected?.key === l.key;
            return (
              <button
                key={l.key}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-800 ${active ? 'bg-gray-800' : ''}`}
                onClick={() => setSelected(l)}
              >
                {l.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{l.label}</span>
                    {l.native && (
                      <span className="text-xs text-gray-400">{l.native}</span>
                    )}
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
