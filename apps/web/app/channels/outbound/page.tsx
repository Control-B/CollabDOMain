'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadChannels, type Channel } from '../../lib/channelsStore';
import ChannelContextMenu from '../../components/ChannelContextMenu';
import EditChannelModal from '../../components/EditChannelModal';

export default function OutboundChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [query, setQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    channel: Channel | null;
  }>({
    isOpen: false,
    channel: null,
  });

  useEffect(() => {
    setChannels(loadChannels());
  }, []);

  const refreshChannels = () => {
    setChannels(loadChannels());
  };

  const handleEdit = () => {
    if (!contextMenu.channel) return;
    setEditState({ open: true, channel: contextMenu.channel });
  };

  const [editState, setEditState] = useState<{
    open: boolean;
    channel: Channel | null;
  }>({ open: false, channel: null });

  const filtered = useMemo(() => {
    return channels
      .filter((c) => (c.category ?? 'general') === 'outbound')
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }, [channels, query]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Outbound Channels</h1>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/chat" className="text-blue-400 hover:text-blue-300">
              ← Back to Chat
            </Link>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 text-sm text-gray-300 w-full max-w-md">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm8.707 13.293l-3.387-3.387a8 8 0 10-1.414 1.414l3.387 3.387a1 1 0 001.414-1.414z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search outbound channels"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div
              key={c.name}
              className="relative group bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/80"
            >
              <Link
                href={`/chat?channel=${encodeURIComponent(c.name)}`}
                className="block"
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
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>{c.members ?? 1} members</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setContextMenu({ isOpen: true, channel: c });
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-1 p-1 rounded hover:bg-gray-700/60 text-gray-400 hover:text-gray-200 transition-opacity"
                      title="More actions"
                    >
                      <svg
                        className="w-4 h-4"
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
