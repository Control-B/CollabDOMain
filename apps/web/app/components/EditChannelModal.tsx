'use client';

import { useState, useEffect, useRef } from 'react';
import { Channel, editChannel } from '../lib/channelsStore';
import {
  type DocumentItem,
  loadDocuments,
  addDocumentFromFile,
  replaceDocument,
  deleteDocument,
} from '../lib/documentsStore';
import DocumentEditorModal from './DocumentEditorModal';

interface EditChannelModalProps {
  channel: Channel | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditChannelModal({
  channel,
  isOpen,
  onClose,
  onSaved,
}: EditChannelModalProps) {
  const [name, setName] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [doorNumber, setDoorNumber] = useState('');
  const [docsOk, setDocsOk] = useState(false);
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [editorDoc, setEditorDoc] = useState<DocumentItem | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (channel) {
      setName(channel.name || '');
      setPoNumber(channel.poNumber || '');
      setVehicleNumber(channel.vehicleNumber || '');
      setDoorNumber(channel.doorNumber || '');
      setDocsOk(!!channel.docsOk);
      // Load documents linked to this channel (by channel name or PO)
      const all = loadDocuments();
      const filtered = all.filter(
        (d) =>
          d.channelName === channel.name ||
          (!!channel.poNumber && d.poNumber === channel.poNumber),
      );
      setDocs(filtered);
    }
  }, [channel]);

  if (!isOpen || !channel) return null;

  const isCore = ['general', 'inbound', 'outbound'].includes(
    channel.name.toLowerCase(),
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      editChannel(channel.name, {
        name: name.trim(),
        poNumber: poNumber.trim() || undefined,
        vehicleNumber: vehicleNumber.trim() || undefined,
        doorNumber: doorNumber.trim() || undefined,
        docsOk,
      });
      onSaved();
      onClose();
    } catch (err) {
      alert((err as Error).message || 'Failed to edit channel');
    }
  };

  // Documents helpers scoped to channel
  const refreshDocs = () => {
    if (!channel) return;
    const all = loadDocuments();
    const filtered = all.filter(
      (d) =>
        d.channelName === channel.name ||
        (!!channel.poNumber && d.poNumber === channel.poNumber),
    );
    setDocs(filtered);
  };

  const onBrowse = () => fileInputRef.current?.click();

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !channel) return;
    const list = Array.from(files);
    if (replaceTarget) {
      replaceDocument(replaceTarget, list[0]);
      setReplaceTarget(null);
    } else {
      list.forEach((f) =>
        addDocumentFromFile(f, {
          channelName: channel.name,
          poNumber: poNumber || channel.poNumber,
        }),
      );
    }
    refreshDocs();
  };

  const handleReplace = (id: string) => {
    setReplaceTarget(id);
    fileInputRef.current?.click();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this document?')) return;
    deleteDocument(id);
    refreshDocs();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-100">
        <div className="mb-3 text-lg font-semibold">
          Edit{' '}
          {isCore ? 'Channel' : channel.isDM ? 'Direct Message' : 'Channel'}
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Channel name"
              disabled={isCore}
            />
          </div>

          {!channel.isDM && (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Trip/PO Number
                </label>
                <input
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="PO-12345"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Vehicle ID
                  </label>
                  <input
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="TRK-001"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Door Number
                  </label>
                  <input
                    value={doorNumber}
                    onChange={(e) => setDoorNumber(e.target.value)}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="D-15"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={docsOk}
                  onChange={(e) => setDocsOk(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-600"
                />
                Documents OK
              </label>
            </>
          )}

          {/* Documents section for non-DM channels */}
          {!channel.isDM && (
            <div className="mt-2 rounded-lg border border-gray-800 bg-gray-900/60">
              <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
                <div className="text-sm font-medium text-gray-100">
                  Channel Documents
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={onFileSelect}
                    className="hidden"
                    aria-label="Upload documents"
                    title="Upload documents"
                  />
                  <button
                    type="button"
                    onClick={onBrowse}
                    className="rounded bg-indigo-600 px-2 py-1 text-sm hover:bg-indigo-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="max-h-56 overflow-auto px-3 py-2">
                {docs.length === 0 ? (
                  <div className="text-sm text-gray-400">
                    No documents linked to this channel yet.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {docs.map((d) => (
                      <li
                        key={d.id}
                        className="flex items-center justify-between rounded border border-gray-800 bg-gray-900 px-3 py-2"
                      >
                        <div>
                          <div className="text-sm text-gray-100">{d.name}</div>
                          <div className="text-xs text-gray-400">
                            {d.size} • {d.modified} • {d.status}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setEditorDoc(d)}
                            className="text-indigo-400 hover:text-indigo-300 text-sm"
                          >
                            Edit Fields
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReplace(d.id)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(d.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={isCore || !name.trim()}
            >
              Save
            </button>
          </div>
        </form>
        <DocumentEditorModal
          document={editorDoc}
          isOpen={!!editorDoc}
          onClose={() => setEditorDoc(null)}
          onSaved={() => refreshDocs()}
        />
      </div>
    </div>
  );
}
