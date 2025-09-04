'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadChannels, type Channel } from '../lib/channelsStore';
import { loadDocuments, type DocumentItem } from '../lib/documentsStore';
import {
  listPinnedMessages,
  type PinnedMessage,
} from '../lib/pinnedMessagesStore';

export default function ShortcutsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [msgs, setMsgs] = useState<PinnedMessage[]>([]);

  useEffect(() => {
    setChannels(loadChannels().filter((c) => !!c.pinned));
    setDocs(loadDocuments().filter((d: any) => !!(d as any).pinned));
    setMsgs(listPinnedMessages());
  }, []);

  const empty = channels.length === 0 && docs.length === 0 && msgs.length === 0;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Shortcuts</h1>
          <Link href="/chat" className="text-indigo-400 hover:text-indigo-300">
            ← Back to Chat
          </Link>
        </div>

        {empty && (
          <div className="text-sm text-gray-400">
            Nothing pinned yet. Pin a channel, document, or message to see it
            here.
          </div>
        )}

        {channels.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-2">
              Pinned Channels
            </h2>
            <div className="grid gap-2">
              {channels.map((c) => (
                <Link
                  key={c.name}
                  href={`/chat?channel=${encodeURIComponent(c.name)}`}
                  className="flex items-center justify-between rounded-md border border-indigo-600/30 bg-indigo-900/10 px-3 py-2 hover:bg-indigo-900/20"
                >
                  <div className="truncate">
                    <div className="font-medium"># {c.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {[
                        c.vehicleNumber && `Vehicle: ${c.vehicleNumber}`,
                        c.doorNumber && `Door: ${c.doorNumber}`,
                        c.description,
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-600/20 text-yellow-300 border border-yellow-600/40">
                    Pinned
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {docs.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-2">
              Pinned Documents
            </h2>
            <div className="grid gap-2">
              {docs.map((d) => (
                <Link
                  key={d.id}
                  href="/dms"
                  className="flex items-center justify-between rounded-md border border-purple-600/30 bg-purple-900/10 px-3 py-2 hover:bg-purple-900/20"
                >
                  <div className="truncate">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {d.description}
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-600/20 text-yellow-300 border border-yellow-600/40">
                    Pinned
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {msgs.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-300 mb-2">
              Pinned Messages
            </h2>
            <div className="grid gap-2">
              {msgs.map((m) => (
                <Link
                  key={m.id}
                  href={`/chat?channel=${encodeURIComponent(m.channelName)}`}
                  className="flex items-center justify-between rounded-md border border-amber-600/30 bg-amber-900/10 px-3 py-2 hover:bg-amber-900/20"
                >
                  <div className="truncate">
                    <div className="text-xs text-gray-400">
                      # {m.channelName} • {new Date(m.dateMs).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-200 truncate">
                      {m.body}
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-600/20 text-yellow-300 border border-yellow-600/40">
                    Pinned
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
