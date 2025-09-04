'use client';

import { useRef, useEffect, useState } from 'react';
import { Channel, pinChannel, deleteChannel } from '../lib/channelsStore';
import ConfirmDialog from './ConfirmDialog';

interface ChannelContextMenuProps {
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
  currentUser: string;
}

export default function ChannelContextMenu({
  channel,
  isOpen,
  onClose,
  onEdit,
  onRefresh,
  currentUser,
}: ChannelContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePin = () => {
    pinChannel(channel.name, !channel.pinned);
    onRefresh();
    onClose();
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const isCore = ['general', 'inbound', 'outbound'].includes(
    channel?.name?.toLowerCase?.() ?? '',
  );
  const canEdit = true;
  const canDelete = true;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[180px]"
    >
      <button
        onClick={handlePin}
        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
      >
        Pin
      </button>

      {canEdit && (
        <button
          onClick={() => {
            if (isCore) return;
            onEdit();
            onClose();
          }}
          disabled={isCore}
          className={`w-full px-3 py-2 text-left text-sm ${isCore ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          Edit
        </button>
      )}

      {canDelete && (
        <button
          onClick={() => {
            if (isCore) return;
            handleDelete();
          }}
          disabled={isCore}
          className={`w-full px-3 py-2 text-left text-sm ${isCore ? 'text-gray-500 cursor-not-allowed' : 'text-red-400 hover:bg-red-900/20 hover:text-red-300'}`}
        >
          Delete
        </button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete channel?"
        description={`This will permanently remove "${channel.name}" and its local messages. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        tone="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          deleteChannel(channel.name);
          setConfirmOpen(false);
          onRefresh();
          onClose();
        }}
      />
    </div>
  );
}
