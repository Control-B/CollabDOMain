'use client';

import { useEffect, useRef, useState } from 'react';
import {
  type DocumentItem,
  type DocField,
  type DocFieldType,
  updateDocumentFields,
} from '../lib/documentsStore';

interface Props {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

type DragState =
  | { mode: 'none' }
  | {
      mode: 'move';
      id: string;
      startX: number;
      startY: number;
      origX: number;
      origY: number;
    }
  | {
      mode: 'resize';
      id: string;
      startX: number;
      startY: number;
      origW: number;
      origH: number;
    };

export default function DocumentEditorModal({
  document,
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [fields, setFields] = useState<DocField[]>([]);
  const [drag, setDrag] = useState<DragState>({ mode: 'none' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!document) return;
    setFields(
      document.fields ? JSON.parse(JSON.stringify(document.fields)) : [],
    );
  }, [document]);

  useEffect(() => {
    function recalc() {
      if (!containerRef.current || !document) return;
      const maxW = Math.min(window.innerWidth - 64, 900);
      const s = Math.min(maxW / document.pageWidth, 1);
      setScale(s);
    }
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [document]);

  const startMove = (e: React.MouseEvent, f: DocField) => {
    e.preventDefault();
    setSelectedId(f.id);
    setDrag({
      mode: 'move',
      id: f.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: f.x,
      origY: f.y,
    });
  };

  const startResize = (e: React.MouseEvent, f: DocField) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(f.id);
    setDrag({
      mode: 'resize',
      id: f.id,
      startX: e.clientX,
      startY: e.clientY,
      origW: f.w,
      origH: f.h,
    });
  };

  useEffect(() => {
    function onMove(ev: MouseEvent) {
      if (drag.mode === 'none' || !document) return;
      setFields((prev) => {
        const idx = prev.findIndex((p) => p.id === (drag as any).id);
        if (idx < 0) return prev;
        const next = prev.slice();
        const f = { ...next[idx] };
        const dx =
          (ev.clientX - (drag as any).startX) / (document.pageWidth * scale);
        const dy =
          (ev.clientY - (drag as any).startY) / (document.pageHeight * scale);
        if (drag.mode === 'move') {
          f.x = clamp((drag as any).origX + dx, 0, 1 - f.w);
          f.y = clamp((drag as any).origY + dy, 0, 1 - f.h);
        } else if (drag.mode === 'resize') {
          f.w = clamp((drag as any).origW + dx, 0.05, 1 - f.x);
          f.h = clamp((drag as any).origH + dy, 0.03, 1 - f.y);
        }
        next[idx] = f;
        return next;
      });
    }
    function onUp() {
      setDrag({ mode: 'none' });
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, document, scale]);

  const addField = (type: DocFieldType) => {
    const id = `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setFields((prev) => [
      ...prev,
      { id, type, x: 0.1, y: 0.1, w: 0.2, h: 0.05 },
    ]);
    setSelectedId(id);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setFields((prev) => prev.filter((f) => f.id !== selectedId));
    setSelectedId(null);
  };

  const save = () => {
    if (!document) return;
    updateDocumentFields(document.id, fields);
    onSaved();
    onClose();
  };

  useEffect(() => {
    if (!document || !containerRef.current) return;
    const w = Math.round(document.pageWidth * scale);
    const h = Math.round(document.pageHeight * scale);
    const el = containerRef.current;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
  }, [document, scale]);

  useEffect(() => {
    if (!document) return;
    for (const f of fields) {
      const el = fieldRefs.current[f.id];
      if (!el) continue;
      el.style.left = `${f.x * 100}%`;
      el.style.top = `${f.y * 100}%`;
      el.style.width = `${f.w * 100}%`;
      el.style.height = `${f.h * 100}%`;
      el.style.cursor = 'move';
    }
  }, [fields, document, scale]);

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-5xl rounded-lg border border-gray-700 bg-gray-900 text-gray-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 p-3">
          <div className="text-lg font-semibold">
            Edit Fields – {document.name}
          </div>
          <button
            onClick={onClose}
            className="rounded bg-gray-800 px-2 py-1 text-sm text-gray-300 hover:bg-gray-700"
          >
            Close
          </button>
        </div>
        <div className="flex gap-4 p-4">
          <div className="w-48 shrink-0 space-y-2">
            <div className="text-sm text-gray-300">Tools</div>
            <button
              onClick={() => addField('signature')}
              className="w-full rounded bg-indigo-600 px-3 py-2 text-sm hover:bg-indigo-700"
            >
              Add Signature
            </button>
            <button
              onClick={() => addField('name')}
              className="w-full rounded bg-blue-600 px-3 py-2 text-sm hover:bg-blue-700"
            >
              Add Name
            </button>
            <button
              onClick={() => addField('initial')}
              className="w-full rounded bg-teal-600 px-3 py-2 text-sm hover:bg-teal-700"
            >
              Add Initial
            </button>
            <button
              onClick={removeSelected}
              disabled={!selectedId}
              className={`w-full rounded px-3 py-2 text-sm ${selectedId ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 text-gray-400 cursor-not-allowed'}`}
            >
              Delete Selected
            </button>
            <div className="pt-2 text-xs text-gray-400">
              Hint: Drag to move. Grab the corner to resize.
            </div>
          </div>
          <div className="relative flex-1">
            <div
              ref={containerRef}
              className="relative mx-auto select-none rounded border border-gray-700 bg-white/5"
            >
              {fields.map((f) => (
                <div
                  key={f.id}
                  onMouseDown={(e) => startMove(e, f)}
                  className={`absolute rounded border ${selectedId === f.id ? 'border-yellow-400' : 'border-indigo-400'} bg-indigo-500/30`}
                  ref={(el) => {
                    fieldRefs.current[f.id] = el;
                  }}
                >
                  <div className="pointer-events-none px-1 text-[10px] font-semibold text-white/90">
                    {f.type.toUpperCase()}
                  </div>
                  <div
                    onMouseDown={(e) => startResize(e, f)}
                    className="absolute bottom-0 right-0 h-3 w-3 translate-x-1 translate-y-1 cursor-nwse-resize rounded bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-gray-800 p-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
