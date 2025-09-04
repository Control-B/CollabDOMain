export type Channel = {
  name: string;
  description?: string;
  members?: number;
  unread?: number;
  mentions?: number;
  poNumber?: string;
  doorNumber?: string;
  category?: 'general' | 'inbound' | 'outbound';
  vehicleNumber?: string;
  doorStatus?: 'green' | 'red';
  createdBy?: string;
  authorizedDoorChangers?: string[];
  docsOk?: boolean;
  alarmActive?: boolean;
  pinned?: boolean;
  createdAt?: string;
  isDM?: boolean;
};

const STORAGE_KEY = 'collab_channels';

const defaults: Channel[] = [
  // Channel types shown in the sidebar
  {
    name: 'General',
    unread: 12,
    mentions: 0,
    category: 'general',
    doorStatus: 'green',
    authorizedDoorChangers: [],
    docsOk: false,
    alarmActive: false,
    createdBy: 'demo@chatdo.com',
    pinned: false,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Inbound',
    category: 'inbound',
    doorStatus: 'green',
    authorizedDoorChangers: [],
    docsOk: false,
    alarmActive: false,
    createdBy: 'demo@chatdo.com',
    pinned: false,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Outbound',
    category: 'outbound',
    doorStatus: 'green',
    authorizedDoorChangers: [],
    docsOk: false,
    alarmActive: false,
    createdBy: 'demo@chatdo.com',
    pinned: false,
    createdAt: new Date().toISOString(),
  },
  // Other channels appear on the All Channels page
  {
    name: 'support',
    mentions: 2,
    category: 'general',
    doorStatus: 'green',
    authorizedDoorChangers: [],
    docsOk: false,
    alarmActive: false,
  },
  {
    name: 'maintenance',
    category: 'general',
    doorStatus: 'green',
    authorizedDoorChangers: [],
    docsOk: false,
    alarmActive: false,
  },
  // Sample channels with vehicle IDs and door numbers for testing search
  {
    name: 'TRK-001-Delivery',
    description: 'Amazon delivery route',
    poNumber: 'PO-12345',
    doorNumber: 'D-15',
    vehicleNumber: 'TRK-001',
    category: 'inbound',
    doorStatus: 'green',
    authorizedDoorChangers: ['driver1@company.com'],
    docsOk: true,
    alarmActive: false,
    createdBy: 'dispatch@company.com',
  },
  {
    name: 'VAN-205-Pickup',
    description: 'Walmart pickup run',
    poNumber: 'PO-67890',
    doorNumber: 'D-08',
    vehicleNumber: 'VAN-205',
    category: 'outbound',
    doorStatus: 'red',
    authorizedDoorChangers: ['driver2@company.com'],
    docsOk: false,
    alarmActive: false,
    createdBy: 'dispatch@company.com',
  },
  {
    name: 'BIG-RIG-303',
    description: 'Cross-country haul to Texas',
    poNumber: 'PO-11111',
    doorNumber: 'D-22',
    vehicleNumber: 'BIG-RIG-303',
    category: 'outbound',
    doorStatus: 'green',
    authorizedDoorChangers: ['senior-driver@company.com'],
    docsOk: true,
    alarmActive: false,
    createdBy: 'logistics@company.com',
  },
  // Sample DMs
  {
    name: 'DM: Alice Johnson',
    isDM: true,
    members: 2,
    createdBy: 'demo@chatdo.com',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'DM: Yard Supervisor',
    isDM: true,
    members: 2,
    createdBy: 'demo@chatdo.com',
    createdAt: new Date().toISOString(),
  },
];

function isBrowser() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

export function loadChannels(): Channel[] {
  try {
    if (!isBrowser()) return [...defaults];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return [...defaults];
    }
    const parsed = JSON.parse(raw) as Channel[];
    if (!Array.isArray(parsed)) return [...defaults];
    // Merge in any new defaults that might not be present yet
    const byName = new Map(
      parsed.map((c) => [c.name.toLowerCase(), c] as const),
    );
    let changed = false;
    for (const d of defaults) {
      if (!byName.has(d.name.toLowerCase())) {
        parsed.push({ ...d });
        changed = true;
      }
    }
    // Migration: ensure category exists on every channel
    for (const c of parsed) {
      if (!c.category) {
        const n = c.name?.toLowerCase() || '';
        if (n === 'inbound') c.category = 'inbound';
        else if (n === 'outbound') c.category = 'outbound';
        else c.category = 'general';
        changed = true;
      }
      if (!c.doorStatus) {
        c.doorStatus = 'green';
        changed = true;
      }
      if (!c.authorizedDoorChangers) {
        c.authorizedDoorChangers = [];
        changed = true;
      }
      if (typeof c.docsOk === 'undefined') {
        c.docsOk = false;
        changed = true;
      }
      if (typeof c.alarmActive === 'undefined') {
        c.alarmActive = false;
        changed = true;
      }
      if (typeof c.pinned === 'undefined') {
        c.pinned = false;
        changed = true;
      }
      if (!c.createdAt) {
        c.createdAt = new Date().toISOString();
        changed = true;
      }
      // Backfill channel creator for demo user if missing (local dev)
      if (!c.createdBy) {
        c.createdBy = 'demo@chatdo.com';
        changed = true;
      }
    }
    if (changed) saveChannels(parsed);
    return parsed;
  } catch {
    return [...defaults];
  }
}

export function saveChannels(channels: Channel[]) {
  try {
    if (!isBrowser()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
  } catch {
    // noop
  }
}

export function addChannel(newChannel: Channel): Channel[] {
  const list = loadChannels();
  const exists = list.some(
    (c) => c.name.trim().toLowerCase() === newChannel.name.trim().toLowerCase(),
  );
  if (!exists) {
    list.push({
      ...newChannel,
      category: newChannel.category ?? 'general',
      doorStatus: newChannel.doorStatus ?? 'green',
      authorizedDoorChangers: newChannel.authorizedDoorChangers ?? [],
      docsOk: newChannel.docsOk ?? false,
      alarmActive: newChannel.alarmActive ?? false,
      pinned: newChannel.pinned ?? false,
      createdAt: newChannel.createdAt ?? new Date().toISOString(),
    });
    saveChannels(list);
  }
  return list;
}

export function setDoorStatus(
  channelName: string,
  status: 'green' | 'red',
): Channel[] {
  const list = loadChannels();
  const idx = list.findIndex(
    (c) => c.name.trim().toLowerCase() === channelName.trim().toLowerCase(),
  );
  if (idx >= 0) {
    list[idx] = { ...list[idx], doorStatus: status };
    saveChannels(list);
  }
  return list;
}

export function addAuthorizedDoorChanger(
  channelName: string,
  user: string,
): Channel[] {
  const list = loadChannels();
  const idx = list.findIndex(
    (c) => c.name.trim().toLowerCase() === channelName.trim().toLowerCase(),
  );
  if (idx >= 0) {
    const current = list[idx].authorizedDoorChangers ?? [];
    if (!current.includes(user)) {
      list[idx] = { ...list[idx], authorizedDoorChangers: [...current, user] };
      saveChannels(list);
    }
  }
  return list;
}

export function canUserToggleDoor(
  channel: Channel | undefined,
  user: string,
): boolean {
  if (!channel) return false;
  if (!user) return false;
  if (channel.createdBy && channel.createdBy === user) return true;
  const list = channel.authorizedDoorChangers ?? [];
  return list.includes(user);
}

export function isCreator(channel: Channel | undefined, user: string): boolean {
  if (!channel || !user) return false;
  return !!channel.createdBy && channel.createdBy === user;
}

export function removeAuthorizedDoorChanger(
  channelName: string,
  user: string,
): Channel[] {
  const list = loadChannels();
  const idx = list.findIndex(
    (c) => c.name.trim().toLowerCase() === channelName.trim().toLowerCase(),
  );
  if (idx >= 0) {
    const current = list[idx].authorizedDoorChangers ?? [];
    const next = current.filter((u) => u !== user);
    list[idx] = { ...list[idx], authorizedDoorChangers: next };
    saveChannels(list);
  }
  return list;
}

export function setDocsOk(channelName: string, docsOk: boolean): Channel[] {
  const list = loadChannels();
  const idx = list.findIndex(
    (c) => c.name.trim().toLowerCase() === channelName.trim().toLowerCase(),
  );
  if (idx >= 0) {
    list[idx] = { ...list[idx], docsOk };
    saveChannels(list);
  }
  return list;
}

export function setAlarmActive(
  channelName: string,
  active: boolean,
): Channel[] {
  const list = loadChannels();
  const idx = list.findIndex(
    (c) => c.name.trim().toLowerCase() === channelName.trim().toLowerCase(),
  );
  if (idx >= 0) {
    list[idx] = { ...list[idx], alarmActive: active };
    saveChannels(list);
  }
  return list;
}

export function pinChannel(channelName: string, pinned: boolean): Channel[] {
  const list = loadChannels();
  const idx = list.findIndex(
    (c) => c.name.trim().toLowerCase() === channelName.trim().toLowerCase(),
  );
  if (idx >= 0) {
    list[idx] = { ...list[idx], pinned };
    saveChannels(list);
  }
  return list;
}

export function editChannel(
  originalName: string,
  updates: Partial<Channel>,
): Channel[] {
  const list = loadChannels();
  const idx = list.findIndex(
    (c) => c.name.trim().toLowerCase() === originalName.trim().toLowerCase(),
  );
  if (idx >= 0) {
    // If name is being changed, check for conflicts
    if (
      updates.name &&
      updates.name.trim().toLowerCase() !== originalName.trim().toLowerCase()
    ) {
      const nameExists = list.some(
        (c, i) =>
          i !== idx &&
          c.name.trim().toLowerCase() === updates.name!.trim().toLowerCase(),
      );
      if (nameExists) {
        throw new Error('A channel with this name already exists');
      }
    }

    list[idx] = { ...list[idx], ...updates };
    saveChannels(list);
  }
  return list;
}

export function deleteChannel(channelName: string): Channel[] {
  const list = loadChannels();
  const filteredList = list.filter(
    (c) => c.name.trim().toLowerCase() !== channelName.trim().toLowerCase(),
  );
  saveChannels(filteredList);
  return filteredList;
}

export function canUserEdit(
  channel: Channel | undefined,
  user: string,
): boolean {
  if (!channel || !user) return false;
  // Core channels (General, Inbound, Outbound) cannot be edited/deleted
  if (['general', 'inbound', 'outbound'].includes(channel.name.toLowerCase())) {
    return false;
  }
  // Creator can edit
  if (channel.createdBy && channel.createdBy === user) return true;
  // For now, only creator can edit. Could expand this later
  return false;
}

export function canUserDelete(
  channel: Channel | undefined,
  user: string,
): boolean {
  if (!channel || !user) return false;
  // Core channels (General, Inbound, Outbound) cannot be deleted
  if (['general', 'inbound', 'outbound'].includes(channel.name.toLowerCase())) {
    return false;
  }
  // Creator can delete
  if (channel.createdBy && channel.createdBy === user) return true;
  // For now, only creator can delete. Could expand this later
  return false;
}
