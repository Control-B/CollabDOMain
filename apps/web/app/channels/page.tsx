'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadChannels, type Channel } from '../lib/channelsStore';

export default function ChannelsPage() {
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setAllChannels(loadChannels());
  }, []);

  const { general, inbound, outbound, others } = useMemo(() => {
    const list = allChannels.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );
    const isCore = (n: string) =>
      ['general', 'inbound', 'outbound'].includes(n);
    const byName = (n: string) =>
      list.find((c) => c.name.toLowerCase() === n) || null;
    const coreNames = new Set(['general', 'inbound', 'outbound']);
    const others = list
      .filter((c) => !coreNames.has(c.name.toLowerCase()))
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    return {
      general: byName('general'),
      inbound: byName('inbound'),
      outbound: byName('outbound'),
      others,
    };
  }, [allChannels, query]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">All Channels</h1>
          <Link
            href="/chat"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Back to Chat
          </Link>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 text-sm text-gray-300 w-full max-w-md">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm8.707 13.293l-3.387-3.387a8 8 0 10-1.414 1.414l3.387 3.387a1 1 0 001.414-1.414z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search channels"
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <Link
            href="/channels/new"
            className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Create channel
          </Link>
        </div>

        {/* Jump-to nav */}
        <div className="mb-6 text-xs text-gray-400 space-x-3">
          <a href="#general" className="hover:text-gray-200">
            General
          </a>
          <span>•</span>
          <a href="#inbound" className="hover:text-gray-200">
            Inbound
          </a>
          <span>•</span>
          <a href="#outbound" className="hover:text-gray-200">
            Outbound
          </a>
        </div>

        {/* General section */}
        <section id="general" className="mb-10">
          <h2 className="text-xl font-semibold mb-3">General</h2>
          {general ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                key={general.name}
                href={`/chat?channel=${encodeURIComponent(general.name)}`}
                className="block bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/80"
              >
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400">#</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold truncate">
                        {general.name}
                      </div>
                      {general.mentions ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-700/30">
                          {general.mentions}
                        </span>
                      ) : null}
                      {general.unread ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-900/50 text-indigo-200">
                          {general.unread}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {general.description || 'No description provided'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {general.members ?? 1} members
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              No General channel found.
            </div>
          )}
        </section>

        {/* Inbound section */}
        <section id="inbound" className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Inbound</h2>
          {inbound ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                key={inbound.name}
                href={`/chat?channel=${encodeURIComponent(inbound.name)}`}
                className="block bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/80"
              >
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400">#</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold truncate">
                        {inbound.name}
                      </div>
                      {inbound.mentions ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-700/30">
                          {inbound.mentions}
                        </span>
                      ) : null}
                      {inbound.unread ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-900/50 text-indigo-200">
                          {inbound.unread}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {inbound.description || 'No description provided'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {inbound.members ?? 1} members
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              No Inbound channel found.
            </div>
          )}
        </section>

        {/* Outbound section */}
        <section id="outbound" className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Outbound</h2>
          {outbound ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                key={outbound.name}
                href={`/chat?channel=${encodeURIComponent(outbound.name)}`}
                className="block bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/80"
              >
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400">#</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold truncate">
                        {outbound.name}
                      </div>
                      {outbound.mentions ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-700/30">
                          {outbound.mentions}
                        </span>
                      ) : null}
                      {outbound.unread ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-900/50 text-indigo-200">
                          {outbound.unread}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {outbound.description || 'No description provided'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {outbound.members ?? 1} members
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              No Outbound channel found.
            </div>
          )}
        </section>

        {/* Other channels (exclude the three core ones to avoid duplicates) */}
        {others.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Other channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {others.map((c) => (
                <Link
                  key={c.name}
                  href={`/chat?channel=${encodeURIComponent(c.name)}`}
                  className="block bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">#</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold truncate">{c.name}</div>
                        {c.mentions ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-700/30">
                            {c.mentions}
                          </span>
                        ) : null}
                        {c.unread ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-900/50 text-indigo-200">
                            {c.unread}
                          </span>
                        ) : null}
                      </div>
                      <div className="text-sm text-gray-400 truncate">
                        {c.description || 'No description provided'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {c.members ?? 1} members
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
