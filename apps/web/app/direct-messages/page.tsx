'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadChannels, type Channel } from '../lib/channelsStore';
import ChannelContextMenu from '../components/ChannelContextMenu';
import EditChannelModal from '../components/EditChannelModal';

export default function DirectMessagesPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [query, setQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    channel: Channel | null;
  }>({ isOpen: false, channel: null });
  const [editState, setEditState] = useState<{
    open: boolean;
    channel: Channel | null;
  }>({ open: false, channel: null });

  useEffect(() => {
    setChannels(loadChannels());
  }, []);

  const refreshChannels = () => setChannels(loadChannels());
  const handleEdit = () => {
    if (!contextMenu.channel) return;
    setEditState({ open: true, channel: contextMenu.channel });
  };

  const filtered = useMemo(() => {
    return channels
      .filter((c) => c.isDM)
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  }, [channels, query]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Direct Messages</h1>
          <Link
            href="/chat"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Chat
          </Link>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex w-full max-w-md items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-300">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm8.707 13.293l-3.387-3.387a8 8 0 10-1.414 1.414l3.387 3.387a1 1 0 001.414-1.414z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search direct messages"
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((c) => (
            <div
              key={c.name}
              className="group relative rounded-lg border border-gray-700 bg-gray-800 p-4 hover:bg-gray-800/80"
            >
              <Link
                href={`/chat?channel=${encodeURIComponent(c.name)}`}
                className="block"
              >
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400">@</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate font-semibold">{c.name}</div>
                    </div>
                    <div className="truncate text-sm text-gray-400">
                      Direct message
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>{c.members ?? 2} members</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setContextMenu({ isOpen: true, channel: c });
                      }}
                      className="ml-1 rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-700/60 hover:text-gray-200 group-hover:opacity-100"
                      title="More actions"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 15a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
              {contextMenu.isOpen && contextMenu.channel?.name === c.name && (
                <ChannelContextMenu
                  channel={contextMenu.channel}
                  isOpen={contextMenu.isOpen}
                  onClose={() =>
                    setContextMenu({ isOpen: false, channel: null })
                  }
                  onEdit={handleEdit}
                  onRefresh={refreshChannels}
                  currentUser="current-user"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <EditChannelModal
        channel={editState.channel}
        isOpen={editState.open}
        onClose={() => setEditState({ open: false, channel: null })}
        onSaved={refreshChannels}
      />
    </div>
  );
}
