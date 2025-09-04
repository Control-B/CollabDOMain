import { loadChannels, type Channel } from './channelsStore';
import { loadDocuments, type DocumentItem } from './documentsStore';
import { listActivities, type ActivityItem } from './activityStore';

export type GlobalSearchResult =
  | {
      kind: 'channel';
      title: string;
      subtitle?: string;
      channelName: string;
      category?: Channel['category'];
      score: number;
    }
  | {
      kind: 'dm';
      title: string;
      subtitle?: string;
      channelName: string;
      score: number;
    }
  | {
      kind: 'document';
      title: string;
      subtitle?: string;
      docId: string;
      channelName?: string;
      score: number;
    }
  | {
      kind: 'activity';
      title: string;
      subtitle?: string;
      activityId: string;
      score: number;
    }
  | {
      kind: 'page';
      title: string;
      subtitle?: string;
      href: string;
      score: number;
    };

const staticPages: Array<{
  title: string;
  subtitle?: string;
  href: string;
  keywords: string[];
}> = [
  { title: 'Chat', href: '/', keywords: ['chat', 'home', 'messages'] },
  {
    title: 'Activity',
    href: '/activity',
    keywords: ['activity', 'recent', 'events', 'log'],
  },
  {
    title: 'Documents',
    subtitle: 'DMS & E‑Sign',
    href: '/dms',
    keywords: ['dms', 'documents', 'docs', 'esign', 'e-sign', 'signature'],
  },
  {
    title: 'Direct Messages',
    href: '/direct-messages',
    keywords: ['dm', 'direct', 'messages'],
  },
  {
    title: 'All Channels',
    href: '/channels',
    keywords: ['channels', 'browse'],
  },
  {
    title: 'Inbound Channels',
    href: '/channels/inbound',
    keywords: ['inbound'],
  },
  {
    title: 'Outbound Channels',
    href: '/channels/outbound',
    keywords: ['outbound'],
  },
  {
    title: 'General Channels',
    href: '/channels/general',
    keywords: ['general'],
  },
  {
    title: 'Help & Guide',
    href: '/help',
    keywords: ['help', 'guide', 'how to'],
  },
  {
    title: 'Language',
    href: '/language',
    keywords: ['language', 'translate', 'translation'],
  },
  { title: 'Shortcuts', href: '/shortcuts', keywords: ['shortcuts', 'pinned'] },
];

export function globalSearch(query: string, limit = 20): GlobalSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: GlobalSearchResult[] = [];

  // Channels and DMs
  try {
    const channels = loadChannels();
    for (const c of channels) {
      const vals = [
        c.name,
        c.description,
        c.poNumber,
        c.doorNumber,
        c.vehicleNumber,
        c.category,
        c.createdBy,
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      const matched = vals.some((v) => v.includes(q));
      if (matched) {
        const core = `${c.name}${c.poNumber ? ` • ${c.poNumber}` : ''}${c.vehicleNumber ? ` • ${c.vehicleNumber}` : ''}`;
        const sub =
          c.description ||
          [c.category, c.doorNumber].filter(Boolean).join(' • ') ||
          undefined;
        const score =
          (c.name.toLowerCase().includes(q) ? 3 : 0) +
          (c.poNumber?.toLowerCase().includes(q) ? 2 : 0) +
          (c.vehicleNumber?.toLowerCase().includes(q) ? 2 : 0) +
          1;
        if (c.isDM) {
          results.push({
            kind: 'dm',
            title: c.name,
            subtitle: sub,
            channelName: c.name,
            score,
          });
        } else {
          results.push({
            kind: 'channel',
            title: core,
            subtitle: sub,
            channelName: c.name,
            category: c.category,
            score,
          });
        }
      }
    }
  } catch {}

  // Documents
  try {
    const docs = loadDocuments();
    for (const d of docs) {
      const vals = [d.name, d.channelName, d.poNumber, d.originator]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      if (vals.some((v) => v.includes(q))) {
        const title = d.name;
        const sub =
          [d.channelName, d.poNumber].filter(Boolean).join(' • ') || undefined;
        const score =
          (d.name.toLowerCase().includes(q) ? 3 : 0) +
          (d.channelName?.toLowerCase().includes(q) ? 2 : 0) +
          1;
        results.push({
          kind: 'document',
          title,
          subtitle: sub,
          docId: d.id,
          channelName: d.channelName,
          score,
        });
      }
    }
  } catch {}

  // Activity
  try {
    const acts = listActivities();
    for (const a of acts) {
      const vals = [
        a.kind,
        a.channelName,
        a.category,
        a.direction,
        a.vehicleId,
        a.poNumber,
        a.createdBy,
        a.description,
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      if (vals.some((v) => v.includes(q))) {
        const title = a.description || a.kind;
        const sub =
          [a.channelName, a.vehicleId, a.poNumber]
            .filter(Boolean)
            .join(' • ') || undefined;
        const score =
          (a.channelName?.toLowerCase().includes(q) ? 2 : 0) +
          (a.description?.toLowerCase().includes(q) ? 2 : 0) +
          1;
        results.push({
          kind: 'activity',
          title,
          subtitle: sub,
          activityId: a.id,
          score,
        });
      }
    }
  } catch {}

  // Static pages
  for (const p of staticPages) {
    const hay = [p.title, p.subtitle, ...p.keywords]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase());
    if (hay.some((v) => v.includes(q))) {
      const score = (p.title.toLowerCase().includes(q) ? 2 : 0) + 1;
      results.push({
        kind: 'page',
        title: p.title,
        subtitle: p.subtitle,
        href: p.href,
        score,
      });
    }
  }

  results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return results.slice(0, limit);
}
