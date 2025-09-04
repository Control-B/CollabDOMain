export type DocFieldType = 'signature' | 'name' | 'initial';

export type DocField = {
  id: string;
  type: DocFieldType;
  // positions are stored as percentages (0..1) relative to page width/height
  x: number;
  y: number;
  w: number;
  h: number;
};

export type DocumentItem = {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  status: 'Uploaded' | 'Processing' | 'Failed';
  description: string;
  originator?: string;
  channelName?: string;
  poNumber?: string;
  pinned?: boolean;
  // single-page for now; extend to multi-page later
  pageWidth: number; // px reference for editor canvas
  pageHeight: number;
  fields: DocField[];
};

const STORAGE_KEY = 'collab_documents';

function isBrowser() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

const defaults: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'invoice-2024-05.pdf',
    type: 'pdf',
    size: '2.1 MB',
    modified: '2 hours ago',
    status: 'Uploaded',
    description: 'Invoice document',
    originator: 'demo@chatdo.com',
    pageWidth: 800,
    pageHeight: 1100,
    fields: [
      { id: 'f1', type: 'signature', x: 0.65, y: 0.86, w: 0.25, h: 0.05 },
      { id: 'f2', type: 'name', x: 0.1, y: 0.2, w: 0.35, h: 0.04 },
    ],
  },
  {
    id: 'doc-2',
    name: 'contract-001.docx',
    type: 'docx',
    size: '1.8 MB',
    modified: '1 day ago',
    status: 'Processing',
    description: 'Contract document',
    originator: 'demo@chatdo.com',
    pageWidth: 800,
    pageHeight: 1100,
    fields: [],
  },
  {
    id: 'doc-3',
    name: 'shipment-log.xlsx',
    type: 'xlsx',
    size: '856 KB',
    modified: '3 days ago',
    status: 'Uploaded',
    description: 'Logistics data',
    originator: 'demo@chatdo.com',
    pageWidth: 800,
    pageHeight: 1100,
    fields: [{ id: 'f3', type: 'initial', x: 0.12, y: 0.1, w: 0.12, h: 0.04 }],
  },
];

export function loadDocuments(): DocumentItem[] {
  try {
    if (!isBrowser()) return [...defaults];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return [...defaults];
    }
    const parsed = JSON.parse(raw) as DocumentItem[];
    if (!Array.isArray(parsed)) return [...defaults];
    // migrate missing pinned flag
    let changed = false;
    for (const d of parsed) {
      if (typeof d.pinned === 'undefined') {
        d.pinned = false;
        changed = true;
      }
    }
    if (changed) saveDocuments(parsed);
    return parsed;
  } catch {
    return [...defaults];
  }
}

export function saveDocuments(docs: DocumentItem[]) {
  try {
    if (!isBrowser()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch {
    // noop
  }
}

export function addDocumentFromFile(
  file: File,
  meta?: { channelName?: string; poNumber?: string; originator?: string },
): DocumentItem[] {
  const docs = loadDocuments();
  const item: DocumentItem = {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
    size: formatFileSize(file.size),
    modified: 'Just now',
    status: 'Processing',
    description: `${file.type || 'Unknown type'} document`,
    originator: meta?.originator,
    channelName: meta?.channelName,
    poNumber: meta?.poNumber,
    pageWidth: 800,
    pageHeight: 1100,
    fields: [],
  };
  docs.unshift(item);
  saveDocuments(docs);
  // simulate processing
  setTimeout(() => {
    const latest = loadDocuments();
    const idx = latest.findIndex((d) => d.id === item.id);
    if (idx >= 0) {
      latest[idx] = {
        ...latest[idx],
        status: 'Uploaded',
        modified: 'Just now',
      };
      saveDocuments(latest);
    }
  }, 1200);
  return docs;
}

export function replaceDocument(docId: string, file: File): DocumentItem[] {
  const docs = loadDocuments();
  const idx = docs.findIndex((d) => d.id === docId);
  if (idx >= 0) {
    docs[idx] = {
      ...docs[idx],
      name: file.name,
      type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      size: formatFileSize(file.size),
      modified: 'Just now',
      status: 'Processing',
      fields: [], // reset fields when replacing base document
    };
    saveDocuments(docs);
    setTimeout(() => {
      const latest = loadDocuments();
      const i = latest.findIndex((d) => d.id === docId);
      if (i >= 0) {
        latest[i] = { ...latest[i], status: 'Uploaded' };
        saveDocuments(latest);
      }
    }, 1000);
  }
  return docs;
}

export function updateDocumentFields(
  docId: string,
  fields: DocField[],
): DocumentItem[] {
  const docs = loadDocuments();
  const idx = docs.findIndex((d) => d.id === docId);
  if (idx >= 0) {
    docs[idx] = { ...docs[idx], fields, modified: 'Just now' };
    saveDocuments(docs);
  }
  return docs;
}

export function deleteDocument(docId: string): DocumentItem[] {
  const docs = loadDocuments().filter((d) => d.id !== docId);
  saveDocuments(docs);
  return docs;
}

export function setDocumentPinned(
  docId: string,
  pinned: boolean,
): DocumentItem[] {
  const docs = loadDocuments();
  const idx = docs.findIndex((d) => d.id === docId);
  if (idx >= 0) {
    docs[idx] = { ...docs[idx], pinned };
    saveDocuments(docs);
  }
  return docs;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
