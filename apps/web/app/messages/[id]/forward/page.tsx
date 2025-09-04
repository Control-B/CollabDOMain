'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForwardMessagePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [destination, setDestination] = useState('General');
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-violet-300">
            Forward Message
          </h1>
          <Link href="/chat" className="text-indigo-300 hover:text-indigo-200">
            Back to Chat
          </Link>
        </div>
        <div className="text-sm text-gray-400 mb-2">Message ID: {id}</div>
        <label className="text-sm text-gray-300">Destination channel</label>
        <input
          className="w-full mt-1 rounded-md bg-gray-800 border border-gray-700 p-2 outline-none focus:border-indigo-500"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Inbound, Outbound, DM: Alice"
        />
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => router.push('/chat')}
            className="px-3 py-2 rounded-md bg-violet-600/30 text-violet-200 border border-violet-500/30 hover:bg-violet-600/40"
          >
            Forward
          </button>
          <button
            onClick={() => router.back()}
            className="px-3 py-2 rounded-md bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
