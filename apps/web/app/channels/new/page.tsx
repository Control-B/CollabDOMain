'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { addChannel } from '../../lib/channelsStore';

function NewChannelPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Primary identifier is Trip/PO Number (mandatory)
  const initialCategory = (() => {
    const c = (searchParams.get('category') || '').toLowerCase();
    return c === 'inbound' || c === 'outbound'
      ? (c as 'inbound' | 'outbound')
      : 'general';
  })();
  const [poNumber, setPoNumber] = useState(searchParams.get('po') || '');
  const [category, setCategory] = useState<'general' | 'inbound' | 'outbound'>(
    initialCategory,
  );
  const [description, setDescription] = useState('');
  const [doorNumber, setDoorNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState(
    searchParams.get('vehicleId') || '',
  );
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = poNumber.trim().length > 0 && !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    // Fake create delay
    await new Promise((r) => setTimeout(r, 400));
    // Persist channel locally
    const primary = poNumber.trim();
    addChannel({
      name: primary,
      description: description.trim() || undefined,
      poNumber: primary,
      doorNumber: doorNumber.trim() || undefined,
      vehicleNumber:
        category === 'inbound' || category === 'outbound'
          ? vehicleNumber.trim() || undefined
          : undefined,
      members: 1,
      category,
      createdBy: 'demo@chatdo.com',
    });
    // Redirect to chat and "open" the channel by primary Trip/PO
    router.push(`/chat?channel=${encodeURIComponent(primary)}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create new channel</h1>
          <Link
            href="/channels"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Back to Channels
          </Link>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Category
            </label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              <label
                className="flex items-center gap-2 rounded-md bg-gray-900 border border-gray-700 px-3 py-2 cursor-pointer"
                onClick={() => {
                  setCategory('general');
                  setVehicleNumber('');
                }}
              >
                <input
                  type="radio"
                  name="category"
                  value="general"
                  checked={category === 'general'}
                  onChange={() => {
                    setCategory('general');
                    setVehicleNumber('');
                  }}
                />
                <span className="text-sm">General</span>
              </label>
              <label
                className="flex items-center gap-2 rounded-md bg-gray-900 border border-gray-700 px-3 py-2 cursor-pointer"
                onClick={() => setCategory('inbound')}
              >
                <input
                  type="radio"
                  name="category"
                  value="inbound"
                  checked={category === 'inbound'}
                  onChange={() => setCategory('inbound')}
                />
                <span className="text-sm">Inbound</span>
              </label>
              <label
                className="flex items-center gap-2 rounded-md bg-gray-900 border border-gray-700 px-3 py-2 cursor-pointer"
                onClick={() => setCategory('outbound')}
              >
                <input
                  type="radio"
                  name="category"
                  value="outbound"
                  checked={category === 'outbound'}
                  onChange={() => setCategory('outbound')}
                />
                <span className="text-sm">Outbound</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Trip/PO Number <span className="text-rose-400">*</span>
            </label>
            <input
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="e.g., TRIP-10482 or PO-10482"
              className="mt-1 w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              This becomes the channel’s primary name.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this channel about?"
              rows={3}
              className="mt-1 w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-y"
            />
            <p className="mt-1 text-xs text-gray-400">
              Used as a friendly label if needed. Primary name is Trip/PO.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Door number (optional)
            </label>
            <input
              value={doorNumber}
              onChange={(e) => setDoorNumber(e.target.value)}
              placeholder="e.g., Door 12"
              className="mt-1 w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>

          {(category === 'inbound' || category === 'outbound') && (
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Vehicle ID (optional)
              </label>
              <input
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g., TRK-8472 or VIN"
                className="mt-1 w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/channels"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:bg-indigo-600/40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating…' : 'Create channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewChannelPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gray-900 text-gray-100" />}
    >
      <NewChannelPageInner />
    </Suspense>
  );
}
