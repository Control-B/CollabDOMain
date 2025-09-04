'use client';

import { useEffect } from 'react';

export default function ForceDark() {
  useEffect(() => {
    try {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.removeAttribute('data-theme');
    } catch {}

    (async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
        if (typeof window !== 'undefined' && 'caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {
        // ignore
      }
    })();

    // Remove any UI toggle that renders a “Light”/“Dark” button/badge
    const killToggle = () => {
      try {
        const candidates = Array.from(
          document.querySelectorAll('button,[role="button"],a,div,span'),
        ) as HTMLElement[];
        for (const el of candidates) {
          const txt = (el.textContent || '').trim();
          if (!txt) continue;
          if (txt === 'Light' || txt === 'Dark') {
            el.style.display = 'none';
          }
        }
      } catch {}
    };
    killToggle();
    const mo = new MutationObserver(() => killToggle());
    try {
      mo.observe(document.body, { childList: true, subtree: true });
    } catch {}
    return () => {
      try {
        mo.disconnect();
      } catch {}
    };
  }, []);

  return null;
}
