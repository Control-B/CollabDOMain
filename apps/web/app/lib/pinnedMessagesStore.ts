export type PinnedMessage = {
  id: string; // original message id
  channelName: string;
  body: string;
  dateMs: number;
  author: string; // email or display
};

const STORAGE_KEY = 'collab_pinned_messages';

function isBrowser() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function listPinnedMessages(): PinnedMessage[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const arr = safeParse<PinnedMessage[]>(raw, []);
  // Sort newest first
  return arr.sort((a, b) => b.dateMs - a.dateMs);
}

export function savePinnedMessages(items: PinnedMessage[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function pinMessage(msg: PinnedMessage): PinnedMessage[] {
  const list = listPinnedMessages();
  if (!list.some((m) => m.id === msg.id)) {
    list.unshift(msg);
    savePinnedMessages(list);
  }
  return list;
}

export function unpinMessage(id: string): PinnedMessage[] {
  const list = listPinnedMessages().filter((m) => m.id !== id);
  savePinnedMessages(list);
  return list;
}
