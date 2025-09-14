'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  iconClass?: string;
  iconActiveClass?: string;
};

const iconClasses = 'h-6 w-6';

function HomeIcon() {
  return (
    <svg
      className={iconClasses}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-10.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12h.01M12 12h.01M16 12h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v5l4 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilesIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShortcutsIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7h18M3 12h12M3 17h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M15 12l6-5v10l-6-5z" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3a9 9 0 100 18 9 9 0 000-18zm.01 12.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a3.5 3.5 0 00-3.5 3.5h2A1.5 1.5 0 1112 12a1 1 0 00-1 1v1h2v-.382A2.618 2.618 0 0015 11.618C15 9.625 13.433 8 12 8z"
        fill="currentColor"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2a10 10 0 100 20 10 10 0 000-20z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.5 9a2.5 2.5 0 115 0c0 1.5-1.25 2-2 2.5-.75.5-1 1-1 1.5V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function NavItem({
  href,
  label,
  icon,
  exact = false,
  iconClass,
  iconActiveClass,
}: Item) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname?.startsWith(href);
  return (
    <Link
      href={href}
      className={classNames(
        'group w-16 h-16 rounded-xl flex flex-col items-center justify-center text-gray-300 border transition-colors',
        active
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-gray-900 border-gray-800 hover:bg-gray-800 hover:text-white',
      )}
      title={label}
    >
      <span className={active ? iconActiveClass ?? iconClass : iconClass}>
        {icon}
      </span>
      <span className="mt-1 text-[10px] leading-none">{label}</span>
    </Link>
  );
}

export default function LeftRail() {
  const USER_EMAIL = 'demo@chatdo.com';
  const USER_NAME = 'Demo User';
  const AVATAR_URL = `https://i.pravatar.cc/64?u=${encodeURIComponent(
    USER_EMAIL,
  )}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  type Status = { key: string; label: string; color?: string; emoji?: string };
  const [status, setStatus] = useState<Status | null>(null);
  const [notificationsPaused, setNotificationsPaused] = useState(false);
  const statusDotClass = (k?: string) =>
    k === 'lunch'
      ? 'bg-amber-500'
      : k === 'away'
      ? 'bg-yellow-400'
      : k === 'meeting'
      ? 'bg-sky-500'
      : k === 'commuting'
      ? 'bg-violet-400'
      : k === 'outsick'
      ? 'bg-orange-500'
      : k === 'vacation'
      ? 'bg-emerald-500'
      : k === 'remote'
      ? 'bg-green-400'
      : 'bg-emerald-500';
  // Load and watch status and notification settings in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('userStatus');
      if (raw) setStatus(JSON.parse(raw));
      const np = localStorage.getItem('notificationsPaused');
      setNotificationsPaused(np === 'true');
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'userStatus') {
        try {
          setStatus(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
      if (e.key === 'notificationsPaused') {
        setNotificationsPaused(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleNotifications = () => {
    setNotificationsPaused((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('notificationsPaused', String(next));
      } catch {}
      return next;
    });
  };

  // Close menu on outside click / Esc
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (menuBtnRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);
  return (
    <aside
      className="fixed left-0 top-0 z-40 h-svh w-20 bg-gray-900 border-r border-gray-800 flex flex-col items-center justify-between py-3"
      aria-label="Primary navigation"
    >
      {/* Top workspace badge */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-gray-800 text-white grid place-items-center border border-gray-700 select-none overflow-hidden">
          <Image
            src="/dispatchar-logo.svg"
            alt="Dispatchar logo"
            width={56}
            height={56}
            unoptimized
            className="w-14 h-14 object-cover"
          />
        </div>

        <nav className="mt-2 flex flex-col items-center gap-3">
          <NavItem
            href="/"
            label="Home"
            icon={<HomeIcon />}
            exact
            iconClass="text-slate-300 group-hover:text-slate-100"
            iconActiveClass="text-white"
          />
          <NavItem
            href="/direct-messages"
            label="DMs"
            icon={<ChatIcon />}
            iconClass="text-indigo-400 group-hover:text-indigo-300"
            iconActiveClass="text-indigo-300"
          />
          <NavItem
            href="/activity"
            label="Activity"
            icon={<ClockIcon />}
            iconClass="text-amber-400 group-hover:text-amber-300"
            iconActiveClass="text-amber-300"
          />
          <NavItem
            href="/dms"
            label="Files"
            icon={<FilesIcon />}
            iconClass="text-purple-400 group-hover:text-purple-300"
            iconActiveClass="text-purple-300"
          />
          <NavItem
            href="/calls"
            label="Calls"
            icon={<PhoneIcon />}
            iconClass="text-green-400 group-hover:text-green-300"
            iconActiveClass="text-green-300"
          />
          <NavItem
            href="/shortcuts"
            label="Shortcuts"
            icon={<ShortcutsIcon />}
            iconClass="text-emerald-400 group-hover:text-emerald-300"
            iconActiveClass="text-emerald-300"
          />
          <NavItem
            href="/help"
            label="Help"
            icon={<HelpIcon />}
            iconClass="text-sky-400 group-hover:text-sky-300"
            iconActiveClass="text-sky-300"
          />
        </nav>
      </div>

      {/* Bottom user avatar with hover username and click menu */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="relative" aria-label="Current user">
          <button
            ref={menuBtnRef}
            onClick={() => setMenuOpen((v) => !v)}
            className="group"
            title={USER_NAME}
            aria-haspopup
          >
            <Image
              src={AVATAR_URL}
              alt={USER_NAME}
              width={56}
              height={56}
              unoptimized
              className="w-14 h-14 rounded-xl object-cover border border-gray-700"
            />
            {/* Online status dot */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-900 ${statusDotClass(
                status?.key,
              )}`}
            />
            {/* Hover label */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1 rounded-2xl bg-gray-800 border border-gray-700 text-white shadow-lg">
              <span className="text-xs font-bold tracking-wide uppercase whitespace-nowrap">
                {USER_NAME}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute left-16 bottom-0 mb-2 w-80 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl p-3 z-50"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={AVATAR_URL}
                  alt={USER_NAME}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-lg object-cover border border-gray-700"
                />
                <div>
                  <div className="text-sm font-extrabold tracking-wide text-white uppercase">
                    {USER_NAME}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${statusDotClass(
                        status?.key,
                      )}`}
                    />
                    {status?.label ?? 'Active'}
                  </div>
                </div>
              </div>

              {/* Set Your Status */}
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm text-gray-200 hover:bg-gray-800"
                onClick={() => {
                  setMenuOpen(false);
                  router.push('/status');
                }}
              >
                <span className="grid place-items-center w-5 h-5 rounded-full bg-gray-700">
                  🙂
                </span>
                Set Your Status
              </button>

              <div className="my-3 space-y-1">
                <button
                  className={`w-full px-1.5 py-2 rounded-md text-sm flex items-center gap-2 border ${
                    notificationsPaused
                      ? 'text-emerald-300 border-emerald-800/40 bg-emerald-900/10 hover:bg-emerald-700/10'
                      : 'text-amber-300 border-amber-800/40 bg-amber-900/10 hover:bg-amber-700/10'
                  }`}
                  onClick={toggleNotifications}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      notificationsPaused ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {notificationsPaused
                      ? 'Allow notifications'
                      : 'Pause notifications'}
                  </span>
                </button>
              </div>

              <div className="border-t border-gray-800 my-2" />
              <div className="space-y-1">
                <button className="w-full text-left px-1.5 py-2 rounded-md text-sm text-gray-200 hover:bg-gray-800">
                  Profile
                </button>
                <button
                  className="w-full text-left px-1.5 py-2 rounded-md text-sm text-gray-200 hover:bg-gray-800"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/language');
                  }}
                >
                  Language
                </button>
                <button
                  className="w-full text-left px-1.5 py-2 rounded-md text-sm text-gray-200 hover:bg-gray-800"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/help');
                  }}
                >
                  Help
                </button>
              </div>

              <div className="border-top border-gray-800 my-2" />
              <div className="space-y-1">
                <button className="w-full flex items-center gap-2 px-1.5 py-2 rounded-md text-sm text-gray-200 hover:bg-gray-800">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  Upgrade workspace
                </button>
                <button
                  className="w-full text-left px-1.5 py-2 rounded-md text-sm text-rose-300 hover:bg-rose-600/10"
                  onClick={() => {
                    console.log('Sign out of Dispatchar');
                    setMenuOpen(false);
                  }}
                >
                  Sign out of Dispatchar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
