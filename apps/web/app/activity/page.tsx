'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  listActivities,
  searchActivities,
  type ActivityItem,
} from '../lib/activityStore';

export default function ActivityPage() {
  // Searchable activity feed state
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    setItems(searchActivities(query));
  }, [query]);

  // Group by day, newest first
  const groups = useMemo(() => {
    const byDay: Record<string, ActivityItem[]> = {};
    const source = items.length ? items : listActivities();
    for (const a of source) {
      const d = a.timestampISO ? new Date(a.timestampISO) : new Date();
      const key = d.toLocaleDateString();
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(a);
    }
    Object.values(byDay).forEach((arr) =>
      arr.sort((a, b) =>
        (b.timestampISO || '').localeCompare(a.timestampISO || ''),
      ),
    );
    return Object.entries(byDay).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
    );
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Activity</h1>
            <p className="text-sm text-gray-300">
              Your main hub: metrics, exceptions, documents, and the full
              activity feed
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 border border-gray-700">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm8.707 13.293l-3.387-3.387a8 8 0 10-1.414 1.414l3.387 3.387a1 1 0 001.414-1.414z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activity, PO, truck, channel, etc."
              className="bg-transparent outline-none w-72"
            />
          </div>
        </div>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: System Metrics (from original dashboard) */}
          <section className="lg:col-span-4">
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-gray-100">
                  System Metrics
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg p-4 bg-blue-900/30 border border-blue-800/60">
                    <div className="text-2xl font-bold text-blue-400">24</div>
                    <div className="text-sm text-blue-300">
                      Active Documents
                    </div>
                  </div>
                  <div className="rounded-lg p-4 bg-green-900/30 border border-green-800/60">
                    <div className="text-2xl font-bold text-green-400">12</div>
                    <div className="text-sm text-green-300">
                      Pending Signatures
                    </div>
                  </div>
                  <div className="rounded-lg p-4 bg-purple-900/30 border border-purple-800/60">
                    <div className="text-2xl font-bold text-purple-400">
                      156
                    </div>
                    <div className="text-sm text-purple-300">
                      Messages Today
                    </div>
                  </div>
                  <div className="rounded-lg p-4 bg-red-900/30 border border-red-800/60">
                    <div className="text-2xl font-bold text-red-400">3</div>
                    <div className="text-sm text-red-300">Geofence Alerts</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Center: Activity Feed */}
          <section className="lg:col-span-5">
            <div className="space-y-4">
              {groups.length === 0 && (
                <div className="text-sm text-gray-400">No activity yet.</div>
              )}
              {groups.map(([dateKey, arr]) => (
                <div key={dateKey}>
                  <div className="text-sm text-gray-300 mb-2">{dateKey}</div>
                  <div className="space-y-2">
                    {arr.map((a) => (
                      <div
                        key={a.id}
                        className="rounded-lg border border-gray-700 bg-gray-800/60 p-3"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[10px] px-1.5 py-0.5 rounded border bg-indigo-600/15 text-indigo-300 border-indigo-500/30">
                            {a.kind}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(a.timestampISO).toLocaleTimeString()}
                          </span>
                          <div className="ml-auto text-xs text-gray-400">
                            {a.category} {a.direction ? `• ${a.direction}` : ''}
                          </div>
                        </div>
                        <div className="mt-1 text-sm">
                          {a.channelName ? (
                            <span className="text-gray-200">
                              Channel:{' '}
                              <span className="text-gray-100 font-medium">
                                {a.channelName}
                              </span>
                            </span>
                          ) : null}
                          {a.poNumber ? (
                            <span className="text-gray-400"> • PO:</span>
                          ) : null}{' '}
                          {a.poNumber || ''}
                          {a.vehicleId ? (
                            <span className="text-gray-400"> • Truck:</span>
                          ) : null}{' '}
                          {a.vehicleId || ''}
                          {a.pickupNumber ? (
                            <span className="text-gray-400"> • Pickup:</span>
                          ) : null}{' '}
                          {a.pickupNumber || ''}
                          {a.deliveryNumber ? (
                            <span className="text-gray-400"> • Delivery:</span>
                          ) : null}{' '}
                          {a.deliveryNumber || ''}
                        </div>
                        {a.description && (
                          <div className="text-xs text-gray-400">
                            {a.description}
                          </div>
                        )}
                        {a.channelName && (
                          <div className="mt-2">
                            <Link
                              href={`/chat?channel=${encodeURIComponent(a.channelName)}`}
                              className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                            >
                              View in Chat
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right: Exceptions + Recent Documents */}
          <aside className="lg:col-span-3">
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg shadow p-4 border border-gray-700">
                <h2 className="text-lg font-medium text-gray-100 mb-3">
                  Exceptions Queue
                </h2>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/50">
                    <div className="text-sm font-medium text-red-300">
                      PO Mismatch
                    </div>
                    <p className="text-xs text-red-300 mt-1">
                      Qty variance: +50 units
                    </p>
                    <div className="text-xs text-red-400 mt-1">
                      SKU: ABC-123
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-800/50">
                    <div className="text-sm font-medium text-yellow-300">
                      Signature Pending
                    </div>
                    <p className="text-xs text-yellow-300 mt-1">
                      Contract expires in 2 days
                    </p>
                    <div className="text-xs text-yellow-400 mt-1">
                      DOC-2024-067
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow p-4 border border-gray-700">
                <h2 className="text-lg font-medium text-gray-100 mb-3">
                  Recent Documents
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-700/60">
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        invoice-2024-05.pdf
                      </div>
                      <div className="text-xs text-gray-400">2.1 MB</div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-800/60">
                      Signed
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-700/60">
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        contract-001.docx
                      </div>
                      <div className="text-xs text-gray-400">1.8 MB</div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-800/60">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-700/60">
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        shipment-log.xlsx
                      </div>
                      <div className="text-xs text-gray-400">856 KB</div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/60">
                      Uploaded
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
