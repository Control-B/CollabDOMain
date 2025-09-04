'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function DeleteMessagePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-rose-400">
            Delete Message
          </h1>
          <Link href="/chat" className="text-indigo-300 hover:text-indigo-200">
            Back to Chat
          </Link>
        </div>
        <div className="text-sm text-gray-400 mb-4">Message ID: {id}</div>
        <div className="rounded-lg border border-rose-700/40 bg-rose-900/10 p-4">
          <div className="text-sm text-rose-300 mb-3">
            Are you sure you want to delete this message? This action cannot be
            undone.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/chat')}
              className="px-3 py-2 rounded-md bg-rose-600/30 text-rose-300 border border-rose-500/40 hover:bg-rose-600/40"
            >
              Delete
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
    </div>
  );
}
