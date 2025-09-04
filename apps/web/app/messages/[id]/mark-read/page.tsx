'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function MarkReadMessagePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-green-300">
            Marked as Read
          </h1>
          <Link href="/chat" className="text-indigo-300 hover:text-indigo-200">
            Back to Chat
          </Link>
        </div>
        <div className="text-sm text-gray-400">Message ID: {id}</div>
        <div className="mt-3 text-sm text-gray-300">
          This message is now marked as read.
        </div>
      </div>
    </div>
  );
}
