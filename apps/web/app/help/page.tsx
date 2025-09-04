'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function HelpPage() {
  // Search index and UI state
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<
    Array<{ id: string; title: string; text: string }>
  >([]);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Build a simple index from section headings and text content
  useEffect(() => {
    try {
      const nodes = Array.from(
        document.querySelectorAll('section[id]') as NodeListOf<HTMLElement>,
      );
      const idx = nodes.map((sec) => {
        const id = sec.id;
        const h2 = sec.querySelector('h2');
        const title = (h2?.textContent || id || '').trim();
        // Use only within-section text to keep matches relevant
        const text = Array.from(sec.querySelectorAll('p, li'))
          .map((n) => (n.textContent || '').trim())
          .filter(Boolean)
          .join(' \n ')
          .slice(0, 4000); // cap to avoid excess
        return { id, title, text };
      });
      setSections(idx);
    } catch {}
  }, []);

  // Filter matches with basic scoring: title match > text match
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q)
      return [] as Array<{
        id: string;
        title: string;
        snippet: string;
        score: number;
      }>;
    const matched = sections
      .map((s) => {
        const inTitle = s.title.toLowerCase().includes(q);
        const pos = s.text.toLowerCase().indexOf(q);
        const inText = pos >= 0;
        if (!inTitle && !inText) return null;
        let snippet = '';
        if (inTitle) {
          snippet = s.title;
        } else if (inText) {
          const start = Math.max(0, pos - 40);
          const end = Math.min(s.text.length, pos + q.length + 60);
          snippet =
            (start > 0 ? '…' : '') +
            s.text.slice(start, end) +
            (end < s.text.length ? '…' : '');
        }
        const score = (inTitle ? 2 : 0) + (inText ? 1 : 0);
        return { id: s.id, title: s.title, snippet, score };
      })
      .filter(Boolean) as Array<{
      id: string;
      title: string;
      snippet: string;
      score: number;
    }>;
    matched.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    return matched.slice(0, 10);
  }, [query, sections]);

  // Close results when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (searchRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const jumpTo = (id: string) => {
    try {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
      }
    } catch {}
    setOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Help & Guide — Dispatchar
          </h1>
          <p className="text-gray-400 mt-1">
            A detailed guide to every feature in Dispatchar: what it is, when to
            use it, and exactly how to use it in your day-to-day trucking and
            logistics operations.
          </p>
          {/* Search menu */}
          <div ref={searchRef} className="relative mt-4">
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 focus-within:border-gray-700">
              <svg
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search this help page…"
                className="w-full bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-500"
                aria-label="Search help"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="text-gray-400 hover:text-gray-300"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            {open && query && results.length > 0 && (
              <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-800 bg-gray-950 shadow-xl">
                <ul className="max-h-80 overflow-auto py-1">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button
                        onClick={() => jumpTo(r.id)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-900"
                      >
                        <div className="text-sm font-medium text-gray-100 truncate">
                          {r.title}
                        </div>
                        {r.snippet && (
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                            {r.snippet}
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {open && query && results.length === 0 && (
              <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-800 bg-gray-950 shadow-xl">
                <div className="px-3 py-2 text-sm text-gray-400">
                  No matches
                </div>
              </div>
            )}
          </div>
        </header>

        <nav className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'start', t: 'Getting Started' },
            { id: 'nav', t: 'Navigation & Drawer' },
            { id: 'search', t: 'Search (Channels & DMs)' },
            { id: 'chat', t: 'Chat Basics' },
            { id: 'channels', t: 'Channels (PO/Trips)' },
            { id: 'channel-actions', t: 'Pin · Edit · Delete' },
            { id: 'members', t: 'Members & Roles' },
            { id: 'checkins', t: 'Driver Check‑ins & Alerts' },
            { id: 'dms-page', t: 'Direct Messages' },
            { id: 'quick', t: 'Quick Actions' },
            { id: 'docs', t: 'Documents & E‑Sign' },
            { id: 'controls', t: 'Door · Docs OK · Alarm' },
            { id: 'message-actions', t: 'Message Menus & Actions' },
            { id: 'media', t: 'Media, Photos & Video' },
            { id: 'shortcuts', t: 'Shortcuts (Pinned)' },
            { id: 'activity', t: 'Activity' },
            { id: 'language', t: 'Language & Translation' },
            { id: 'location', t: 'Location & Geofencing' },
            { id: 'tips', t: 'Troubleshooting & Tips' },
          ].map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 hover:border-gray-700"
            >
              {s.t}
            </a>
          ))}
        </nav>

        <section id="start" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Getting Started</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Home opens to Chat. Activity and Help are available from the left
              panel.
            </li>
            <li>
              General, Inbound, and Outbound are the primary spaces for your
              yard and lanes.
            </li>
            <li>
              Use channels for each PO/Trip to keep messages, docs, and
              signatures in one place.
            </li>
          </ul>
        </section>

        <section id="nav" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Navigation & Drawer</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Click the truck icon to toggle the left drawer. It faces right
              when closed, left when open.
            </li>
            <li>
              A large, colorful channel type badge shows your current context
              (General, Inbound, Outbound).
            </li>
            <li>
              Left panel icons are color‑coded. Activity uses a clock icon
              across the app.
            </li>
            <li>
              Links: Activity (
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/activity"
              >
                /activity
              </Link>
              ), Documents (
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/dms"
              >
                /dms
              </Link>
              ), Direct Messages (
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/direct-messages"
              >
                /direct-messages
              </Link>
              ), Help (
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/help"
              >
                /help
              </Link>
              ).
            </li>
          </ul>
        </section>

        <section id="chat" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Chat Basics</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Familiar, driver‑friendly layout with avatar‑first messages.
            </li>
            <li>Use Shift+Enter for a new line; Enter to send.</li>
            <li>
              Each message has a 3‑dot menu for actions like Reply, Forward,
              Mark Read, Edit, Delete.
            </li>
            <li>
              The members icon opens a popover showing online users and counts
              for the current channel.
            </li>
          </ul>
        </section>

        <section id="channels" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Channels (PO/Trips)</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Primary spaces: General, Inbound, Outbound. Use{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/channels"
              >
                All Channels
              </Link>{' '}
              to browse.
            </li>
            <li>
              Create a new channel via{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/channels/new"
              >
                /channels/new
              </Link>
              :
            </li>
            <li className="ml-6">
              Trip/PO Number = channel name (required); Description/label
              (optional); Vehicle Number (optional).
            </li>
            <li>
              Inbound/Outbound channels show a Vehicle ID chip. Click it to open
              the driver page.
            </li>
            <li>
              Dedicated views exist for{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/channels/general"
              >
                General
              </Link>
              ,{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/channels/inbound"
              >
                Inbound
              </Link>
              , and{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/channels/outbound"
              >
                Outbound
              </Link>
              .
            </li>
          </ul>
        </section>

        <section id="channel-actions" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Pin · Edit · Delete</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Hover a channel/DM row; the member count shows a 3‑dot menu on the
              far right.
            </li>
            <li>
              Menu options: Pin (toggles), Edit (update metadata, manage docs),
              Delete (with modern confirm dialog).
            </li>
            <li>
              Pinned channels and items appear in{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/shortcuts"
              >
                Shortcuts
              </Link>
              .
            </li>
          </ul>
        </section>

        <section id="members" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Members & Roles</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Top‑right users icon shows current members, with dynamic counts.
            </li>
            <li>
              Channel creators can authorize who may toggle dock door status
              (safety control).
            </li>
            <li>
              Use the channel edit screen to add/remove authorized door
              changers.
            </li>
          </ul>
        </section>

        <section id="checkins" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Driver Check‑ins & Alerts</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Inbound/Outbound check‑ins appear as modern, color‑coded
              notifications.
            </li>
            <li>
              Clerks can create a channel from a check‑in card, then track the
              load in that channel.
            </li>
            <li>
              Vehicle ID links to the driver detail page:{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/driver/TRK-001"
              >
                /driver/[vehicleId]
              </Link>
              .
            </li>
          </ul>
        </section>

        <section id="search" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Search (Channels & DMs)</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Type to filter in real‑time across channels and DMs by name,
              vehicle ID, door number, PO, or description.
            </li>
            <li>
              Search results show matching metadata inline (role, vehicle,
              department, etc.).
            </li>
            <li>
              Click a search result to switch the chat to that channel/DM
              without navigating away.
            </li>
            <li>
              Regular sidebar items still navigate using links to the dedicated
              pages.
            </li>
          </ul>
        </section>

        <section id="quick" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Attach Doc: opens a file picker to upload to the current channel.
            </li>
            <li>
              Docs button: jumps to Documents for the channel (
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/dms"
              >
                /dms
              </Link>
              ).
            </li>
            <li>
              E‑Sign: opens the signature panel (
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/esign/sign"
              >
                /esign/sign
              </Link>
              ) for the current channel.
            </li>
            <li>
              Start Call: initiates a call to the channel/DM creator
              (placeholder flow).
            </li>
            <li>
              Share Location: requests permission and shows your location via
              OpenStreetMap.
            </li>
            <li>
              Image/Video: choose Camera or Library in a modal; asks for camera
              permission when needed.
            </li>
          </ul>
        </section>

        <section id="docs" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Documents & E‑Sign</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Upload bills, PODs, photos, and other files; they stay with the
              load’s channel.
            </li>
            <li>
              Edit document fields with a drag‑and‑drop field editor; reposition
              fields as needed.
            </li>
            <li>
              Replace a document (e.g., updated POD) while retaining field
              placements.
            </li>
            <li>
              Create and send for e‑signature; the signature pad uses a white
              canvas and dark ink for clarity.
            </li>
            <li>
              Cancel Signature returns to Chat; Delete Signature clears the
              current signature.
            </li>
            <li>
              Channel Edit includes a documents section to upload, replace, edit
              fields, or delete files.
            </li>
          </ul>
        </section>

        <section id="controls" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Door · Docs OK · Alarm</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Door: green = OK to move; red = hold. Only authorized users or the
              creator can toggle.
            </li>
            <li>
              Docs OK: toggle paperwork readiness for the current load (pending
              vs OK).
            </li>
            <li>
              Alarm: creator can start/stop an audible alert; turns orange while
              active.
            </li>
          </ul>
        </section>

        <section id="message-actions" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Message Menus & Actions</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Open the 3‑dot menu on any message for: Reply, Forward, Mark
              Read/Unread, Edit, Delete.
            </li>
            <li>
              Actions are color‑coded; Delete appears in red and requires
              confirmation.
            </li>
            <li>
              Each action opens a dedicated page under{' '}
              <code>/messages/[id]/...</code> to complete the flow.
            </li>
          </ul>
        </section>

        <section id="media" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Media, Photos & Video</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Shared media in chat is clickable to enlarge in a preview modal.
            </li>
            <li>
              Documents open in the editor where you can add e‑sign fields by
              dragging to position.
            </li>
            <li>
              Camera uploads request permission first; library uploads use your
              device’s file picker.
            </li>
          </ul>
        </section>

        <section id="shortcuts" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Shortcuts (Pinned)</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Aggregates pinned channels, pinned documents, and pinned messages
              in one place.
            </li>
            <li>
              Find it at{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/shortcuts"
              >
                /shortcuts
              </Link>
              . Unpin from here or jump to the original item.
            </li>
          </ul>
        </section>

        <section id="activity" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Activity</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              The hub for recent actions across channels: created/edited, pins,
              document events, and more.
            </li>
            <li>
              Open from the left panel or go to{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/activity"
              >
                /activity
              </Link>
              .
            </li>
          </ul>
        </section>

        <section id="language" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Language & Translation</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Choose your language at{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/language"
              >
                /language
              </Link>{' '}
              (English, Spanish, French, Arabic, Hindi, Chinese).
            </li>
            <li>
              Messages are auto‑translated per viewer so dispatch and drivers
              each see their own language.
            </li>
          </ul>
        </section>

        <section id="location" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Location & Geofencing</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Share your live location from Quick Actions; coordinates open in
              OpenStreetMap.
            </li>
            <li>
              Geofencing logic can note when a driver enters/leaves a zone; use
              with Inbound/Outbound workflows.
            </li>
          </ul>
        </section>

        <section id="dms-page" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Direct Messages</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              DMs list shows presence, unread counts, and search matches
              (role/vehicle/department).
            </li>
            <li>
              Click a DM in search to switch the chat view instantly; use{' '}
              <Link
                className="text-indigo-300 hover:text-indigo-200"
                href="/direct-messages"
              >
                /direct-messages
              </Link>{' '}
              for the full list.
            </li>
          </ul>
        </section>

        <section id="tips" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Troubleshooting & Tips</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              If camera or location doesn’t work, check browser permissions and
              try again.
            </li>
            <li>
              If a channel action seems stuck, refresh the page; changes persist
              via local storage.
            </li>
            <li>
              Need more channels or DMs in the sidebar? Click “View all…” links
              to open the full pages.
            </li>
            <li>
              Use Search for quick hops between PO/Trips by vehicle, door
              number, or PO.
            </li>
          </ul>
        </section>

        <section id="prefs" className="mb-10">
          <h2 className="text-xl font-bold mb-2">Profile & Notifications</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>
              Open your menu from the avatar. Set status (Active, Away, Lunch
              Break, etc.).
            </li>
            <li>
              Toggle “Pause notifications” with color feedback; persisted in
              localStorage.
            </li>
            <li>
              Language selection persists in localStorage and affects message
              translation.
            </li>
          </ul>
        </section>

        <footer className="mt-12 text-sm text-gray-500">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </footer>
      </div>
    </div>
  );
}
