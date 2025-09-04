'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Focus management
    cancelBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter')
        onConfirm();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        ref={dialogRef}
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-gray-800 bg-gray-900/95 backdrop-blur p-4 sm:p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              tone === 'danger'
                ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                : 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
            }`}
            aria-hidden
          >
            {tone === 'danger' ? (
              // Trash icon
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1zm1 4h4v12a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V7z" />
              </svg>
            ) : (
              // Info icon
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h2
              id="confirm-title"
              className="text-base sm:text-lg font-semibold text-gray-100"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 ${
              tone === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500/50'
                : 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500/50'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
