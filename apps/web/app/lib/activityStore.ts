export type ActivityItem = {
  id: string;
  kind: 'channel-created' | 'document-updated' | 'note' | string;
  timestampISO: string;
  // core fields for channel creation
  channelName?: string;
  category?: 'general' | 'inbound' | 'outbound';
  direction?: 'inbound' | 'outbound';
  vehicleId?: string;
  poNumber?: string;
  pickupNumber?: string;
  deliveryNumber?: string;
  createdBy?: string;
  description?: string;
};

const STORAGE_KEY = 'activityFeed';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function listActivities(): ActivityItem[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const arr = safeParse<ActivityItem[]>(raw, []);
  // sort desc by time
  return arr.sort((a, b) =>
    (b.timestampISO || '').localeCompare(a.timestampISO || ''),
  );
}

export function saveActivities(items: ActivityItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function addActivity(item: ActivityItem): ActivityItem[] {
  const list = listActivities();
  list.push(item);
  saveActivities(list);
  return list;
}

export function searchActivities(query: string): ActivityItem[] {
  const list = listActivities();
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((a) => {
    const values: (string | undefined)[] = [
      a.timestampISO,
      a.kind,
      a.channelName,
      a.category,
      a.direction,
      a.vehicleId,
      a.poNumber,
      a.pickupNumber,
      a.deliveryNumber,
      a.createdBy,
      a.description,
    ];
    return values.filter(Boolean).some((v) => v!.toLowerCase().includes(q));
  });
}
