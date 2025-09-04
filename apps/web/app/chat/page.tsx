'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import {
  loadChannels,
  addChannel,
  setDoorStatus,
  canUserToggleDoor,
  addAuthorizedDoorChanger,
  removeAuthorizedDoorChanger,
  isCreator,
  setDocsOk,
  setAlarmActive,
  pinChannel,
  deleteChannel,
  type Channel,
} from '../lib/channelsStore';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from 'react';
import UserBadge from '../components/UserBadge';
import { getUserLanguage, translateText } from '../lib/translation';
import { listCheckins, type DriverCheckin } from '../lib/driverCheckinsStore';
import { addActivity } from '../lib/activityStore';
import DocumentEditorModal from '../components/DocumentEditorModal';
import {
  addDocumentFromFile,
  loadDocuments,
  type DocumentItem,
} from '../lib/documentsStore';
import { globalSearch, type GlobalSearchResult } from '../lib/globalSearch';

// Simple text translator component that renders translated text for the viewer
function TranslateSpan({
  text,
  viewerLang,
  sourceLang,
}: {
  text: string;
  viewerLang: string;
  sourceLang?: string;
}) {
  const [out, setOut] = useState<string>(text);
  const [loading, setLoading] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      try {
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        const t = await translateText(text, viewerLang || 'en', {
          sourceLang: sourceLang || 'auto',
          signal: ctrl.signal,
        });
        if (active) setOut(t);
      } catch {
        if (active) setOut(text);
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
      abortRef.current?.abort();
    };
  }, [text, viewerLang, sourceLang]);

  return (
    <>
      {out}
      {loading ? (
        <span className="ml-2 text-[10px] text-gray-400">…</span>
      ) : null}
    </>
  );
}

function ChatPageInner() {
  const router = useRouter();
  // Sidebar filter & sample data (Slack-like)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [filter, setFilter] = useState('');
  const [openChannels, setOpenChannels] = useState(true);
  const [openDMs, setOpenDMs] = useState(true);

  // Context menu hooks
  const currentUser = 'demo@chatdo.com'; // In real app, get from auth context

  type DMType = {
    name: string;
    online: boolean;
    unread: number;
    role?: string;
    vehicleAssigned?: string;
    department?: string;
  };

  const dms = useMemo(
    (): DMType[] => [
      {
        name: 'Alice Smith',
        online: true,
        unread: 1,
        role: 'Driver',
        vehicleAssigned: 'TRK-001',
      },
      {
        name: 'Bob Johnson',
        online: false,
        unread: 0,
        role: 'Dispatcher',
        department: 'Logistics',
      },
      {
        name: 'Carol Danvers',
        online: true,
        unread: 0,
        role: 'Senior Driver',
        vehicleAssigned: 'BIG-RIG-303',
      },
      {
        name: 'David Lee',
        online: false,
        unread: 2,
        role: 'Driver',
        vehicleAssigned: 'VAN-205',
      },
      {
        name: 'Eve Torres',
        online: true,
        unread: 0,
        role: 'Operations Manager',
        department: 'Operations',
      },
    ],
    [],
  );

  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [filteredDMs, setFilteredDMs] = useState<DMType[]>([]);
  // Top-right kebab menu
  const kebabBtnRef = useRef<HTMLButtonElement | null>(null);
  const kebabPopoverRef = useRef<HTMLDivElement | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const search = useSearchParams();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>('General');
  // Load channels from store and set active from query param
  useEffect(() => {
    const list = loadChannels();
    const allChannelsList = list; // Include all channels for search
    // Only show channel types in the sidebar normally
    const typeNames = new Set(['general', 'inbound', 'outbound']);
    const sidebarChannels = list.filter((c) =>
      typeNames.has(c.name.toLowerCase()),
    );

    setChannels(sidebarChannels);
    setAllChannels(allChannelsList);
    setFilteredChannels(sidebarChannels);
    setFilteredDMs(dms);
    const q = search?.get('channel');
    if (q) setActiveChannel(q);
  }, [search, dms]);

  // Comprehensive search function for channels
  const searchChannels = useCallback(
    (channels: Channel[], searchTerm: string) => {
      if (!searchTerm.trim()) return channels;

      const lower = searchTerm.trim().toLowerCase();
      return channels.filter((c) => {
        // Search in all text fields
        const searchableFields = [
          c.name,
          c.description,
          c.poNumber,
          c.doorNumber,
          c.vehicleNumber,
          c.category,
          c.createdBy,
          ...(c.authorizedDoorChangers || []),
        ].filter(Boolean); // Remove undefined/null values

        return searchableFields.some((field) =>
          field?.toLowerCase().includes(lower),
        );
      });
    },
    [],
  );

  // Comprehensive search function for DMs
  const searchDMs = useCallback((dmsList: DMType[], searchTerm: string) => {
    if (!searchTerm.trim()) return dmsList;

    const lower = searchTerm.trim().toLowerCase();
    return dmsList.filter((d) => {
      // Search in all available DM fields
      const searchableFields = [
        d.name,
        d.role,
        d.vehicleAssigned,
        d.department,
      ].filter(Boolean);

      return searchableFields.some((field) =>
        field?.toLowerCase().includes(lower),
      );
    });
  }, []);

  // Filter channels and DMs as user types
  useEffect(() => {
    const searchTerm = filter.trim();

    // When searching, use all channels; when not searching, use sidebar channels
    const channelsToSearch = searchTerm.length > 0 ? allChannels : channels;
    setFilteredChannels(searchChannels(channelsToSearch, searchTerm));
    setFilteredDMs(searchDMs(dms, searchTerm));

    // Auto-expand sections when searching
    if (searchTerm.length > 0) {
      setOpenChannels(true);
      setOpenDMs(true);
    }
  }, [filter, channels, allChannels, dms, searchChannels, searchDMs]);

  // Messages state
  const [message, setMessage] = useState('');
  const [userMessages, setUserMessages] = useState<
    Array<{
      id: string;
      body: string;
      time: string;
      dateMs: number;
      isOwner?: boolean;
      lang?: string;
    }>
  >([]);

  // Viewer language preference
  const [viewerLang, setViewerLang] = useState<string>('en');
  useEffect(() => {
    setViewerLang(getUserLanguage());
  }, []);
  // Close drawer by default on small screens
  useEffect(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 767px)').matches
      ) {
        setDrawerOpen(false);
      }
    } catch {}
  }, []);
  useEffect(() => {
    const onFocus = () => setViewerLang(getUserLanguage());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiBtnRef = useRef<HTMLButtonElement | null>(null);
  const emojiPopoverRef = useRef<HTMLDivElement | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  // Message actions and preview
  const [msgMenuOpenId, setMsgMenuOpenId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<
    'image' | 'video' | 'audio' | 'document' | null
  >(null);
  const previewAnchorRef = useRef<HTMLDivElement | null>(null);
  // Map messageId -> captured media for preview
  const mediaSrcMapRef = useRef<
    Record<string, { type: 'image' | 'video' | 'audio'; url: string }>
  >({});
  // Document editor
  const [docEditorOpen, setDocEditorOpen] = useState(false);
  const [docToEdit, setDocToEdit] = useState<DocumentItem | null>(null);
  // Hidden inputs for quick actions
  const fileDocInputRef = useRef<HTMLInputElement | null>(null);
  const fileMediaInputRef = useRef<HTMLInputElement | null>(null); // library picker
  const fileMediaCameraInputRef = useRef<HTMLInputElement | null>(null); // camera capture
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [cameraRequesting, setCameraRequesting] = useState(false);
  const [cameraPermMsg, setCameraPermMsg] = useState<string | null>(null);
  // Recording state (video and audio)
  const [videoRecording, setVideoRecording] = useState(false);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const [audioRecording, setAudioRecording] = useState(false);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // Share location modal state
  const [locOpen, setLocOpen] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [address, setAddress] = useState<string | null>(null);
  // Active channel metadata (door/vehicle/docs)
  const [activeMeta, setActiveMeta] = useState<{
    doorNumber?: string;
    vehicleNumber?: string;
    doorStatus?: 'green' | 'red';
    docsOk?: boolean;
    alarmActive?: boolean;
  } | null>(null);
  const [activeAuthorized, setActiveAuthorized] = useState<string[]>([]);
  const demoCurrentUser = 'demo@chatdo.com';
  const avatarUrlFor = (seed: string) =>
    `https://i.pravatar.cc/64?u=${encodeURIComponent(seed)}`;
  // Alarm audio (new implementation uses audioCtxRef/oscRef/gainRef below)
  // Members popover
  const membersBtnRef = useRef<HTMLButtonElement | null>(null);
  const membersPopoverRef = useRef<HTMLDivElement | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);
  // Notifications (driver check-ins)
  const notifBtnRef = useRef<HTMLButtonElement | null>(null);
  const notifPopoverRef = useRef<HTMLDivElement | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  // Reject check-in modal state
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectFor, setRejectFor] = useState<DriverCheckin | null>(null);
  const [rejectCategory, setRejectCategory] =
    useState<string>('documents-missing');
  const [rejectNotes, setRejectNotes] = useState<string>('');
  // Start with empty to match SSR markup; then populate after mount
  const [checkins, setCheckins] = useState<DriverCheckin[]>([]);
  useEffect(() => {
    // refresh on mount (seed may happen lazily)
    setCheckins(listCheckins());
  }, []);
  // No persisted view; forms are rendered stacked with adaptive columns
  useEffect(() => {
    if (!notifOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (notifBtnRef.current?.contains(t)) return;
      if (notifPopoverRef.current?.contains(t)) return;
      setNotifOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [notifOpen]);

  // Global search (top bar)
  const globalSearchRef = useRef<HTMLDivElement | null>(null);
  const [globalQuery, setGlobalQuery] = useState('');
  const [globalOpen, setGlobalOpen] = useState(false);
  const [globalResults, setGlobalResults] = useState<GlobalSearchResult[]>([]);
  useEffect(() => {
    const q = globalQuery.trim();
    if (!q) {
      setGlobalResults([]);
      setGlobalOpen(false);
      return;
    }
    try {
      const res = globalSearch(q, 30);
      setGlobalResults(res);
      setGlobalOpen(true);
    } catch {
      setGlobalResults([]);
      setGlobalOpen(false);
    }
  }, [globalQuery]);
  useEffect(() => {
    if (!globalOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (globalSearchRef.current?.contains(t)) return;
      setGlobalOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGlobalOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [globalOpen]);

  // Demo members per channel (replace with real data source later)
  const membersMap = useMemo(
    () => ({
      general: [
        { name: 'Alice Smith', online: true },
        { name: 'Bob Johnson', online: false },
        { name: 'Carol Danvers', online: true },
        { name: 'David Lee', online: false },
        { name: 'Eve Torres', online: false },
        { name: 'Frank Castle', online: false },
        { name: 'Grace Hopper', online: true },
        { name: 'Hank Pym', online: false },
        { name: 'Ivy Chen', online: false },
        { name: 'Jack Ryan', online: false },
        { name: 'Kate Bishop', online: false },
        { name: 'Leo Messi', online: false },
      ],
      inbound: [
        { name: 'Ops Inbound 1', online: true },
        { name: 'Ops Inbound 2', online: false },
        { name: 'Ops Inbound 3', online: false },
        { name: 'Ops Inbound 4', online: true },
        { name: 'Ops Inbound 5', online: false },
      ],
      outbound: [
        { name: 'Ops Outbound 1', online: true },
        { name: 'Ops Outbound 2', online: false },
        { name: 'Ops Outbound 3', online: false },
        { name: 'Ops Outbound 4', online: false },
      ],
    }),
    [],
  );

  // Close kebab popover on outside click / Esc
  useEffect(() => {
    if (!kebabOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      const btn = kebabBtnRef.current;
      const pop = kebabPopoverRef.current;
      if (btn?.contains(t)) return;
      if (pop?.contains(t)) return;
      setKebabOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setKebabOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [kebabOpen]);

  const chanMembers = useMemo(() => {
    const key = activeChannel.toLowerCase();
    return membersMap[key as keyof typeof membersMap] || membersMap.general;
  }, [activeChannel, membersMap]);
  const totalMembers = chanMembers.length;
  const onlineCount = chanMembers.filter((m) => m.online).length;

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const c = messagesContainerRef.current;
      if (c) c.scrollTop = c.scrollHeight;
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    });
  };

  // Unregister any SW/cache and prep input
  useEffect(() => {
    (async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
        if (typeof window !== 'undefined' && 'caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {}
    })();

    inputRef.current?.focus();
    autoResize();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [userMessages.length]);

  // Resolve active channel metadata from store
  useEffect(() => {
    try {
      const all = loadChannels();
      const found =
        all.find(
          (c) => c.name?.toLowerCase() === activeChannel.toLowerCase(),
        ) || null;
      setActiveMeta(
        found
          ? {
              doorNumber: found.doorNumber,
              vehicleNumber: found.vehicleNumber,
              doorStatus: found.doorStatus ?? 'green',
              docsOk: found.docsOk,
              alarmActive: found.alarmActive ?? false,
            }
          : null,
      );
      setActiveAuthorized(found?.authorizedDoorChangers ?? []);
    } catch {
      setActiveMeta(null);
      setActiveAuthorized([]);
    }
  }, [activeChannel]);

  const toggleDoorStatus = () => {
    const all = loadChannels();
    const channel = all.find(
      (c) => c.name?.toLowerCase() === activeChannel.toLowerCase(),
    );
    if (!channel) return;
    // Permission: creator or authorized list (for now we use demo user id)
    const allowed = canUserToggleDoor(channel, demoCurrentUser);
    if (!allowed) return;
    const next = (channel.doorStatus ?? 'green') === 'green' ? 'red' : 'green';
    setDoorStatus(channel.name, next);
    setActiveMeta((prev) => (prev ? { ...prev, doorStatus: next } : prev));
  };

  const sendMessage = () => {
    const body = message.trim();
    if (!body) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setUserMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        body,
        time,
        dateMs: now.getTime(),
        isOwner: true,
        lang: viewerLang,
      },
    ]);
    setMessage('');
    inputRef.current?.focus();
    scrollToBottom();
  };

  // Test harness removed

  // Quick Action handlers
  const onAttachDoc = useCallback(() => {
    fileDocInputRef.current?.click();
  }, []);

  const onAttachDocFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const channel = allChannels.find(
        (c) => c.name.toLowerCase() === activeChannel.toLowerCase(),
      );
      Array.from(files).forEach((file) => {
        addDocumentFromFile(file, {
          channelName: activeChannel,
          poNumber: channel?.poNumber,
          originator: currentUser,
        });
        // Log activity
        addActivity({
          id: crypto.randomUUID(),
          kind: 'document-updated',
          timestampISO: new Date().toISOString(),
          channelName: activeChannel,
          category: channel?.category as any,
          poNumber: channel?.poNumber,
          createdBy: currentUser,
          description: `Attached document ${file.name}`,
        });
        // Drop a chat note for visibility
        setUserMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            body: `📎 Attached document: ${file.name}`,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            dateMs: Date.now(),
            isOwner: true,
            lang: viewerLang,
          },
        ]);
      });
      // reset input so selecting the same file again works
      e.target.value = '';
      scrollToBottom();
    },
    [activeChannel, allChannels, currentUser, viewerLang],
  );

  const onESign = useCallback(() => {
    try {
      const chan = encodeURIComponent(activeChannel);
      router.push(`/esign?channel=${chan}`);
    } catch {
      router.push('/esign');
    }
  }, [router, activeChannel]);

  const phoneFor = (s: string) => {
    // Simple deterministic placeholder number based on string hash
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
    const n = (Math.abs(hash) % 9000000) + 1000000; // 7 digits
    return `+1${n.toString().padStart(7, '0')}`; // e.g. +1XXXXXXX (placeholder)
  };

  const onStartCall = useCallback(() => {
    const channel = allChannels.find(
      (c) => c.name.toLowerCase() === activeChannel.toLowerCase(),
    );
    const recipient = channel?.isDM
      ? channel.name.replace(/^DM:\s*/, '')
      : channel?.createdBy || activeChannel;
    const tel = `tel:${phoneFor(recipient || activeChannel)}`;
    try {
      window.open(tel, '_self');
    } catch {
      // Drop a message as fallback
      setUserMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          body: `📞 Started call with ${recipient}`,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          dateMs: Date.now(),
          isOwner: true,
          lang: viewerLang,
        },
      ]);
      scrollToBottom();
    }
  }, [activeChannel, allChannels, viewerLang]);

  const onShareLocation = useCallback(async () => {
    setLocOpen(true);
    setLocLoading(true);
    setLocError(null);
    setAddress(null);
    setCoords(null);
    try {
      if (!('geolocation' in navigator)) {
        throw new Error('Geolocation is not available');
      }
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }),
      );
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setCoords({ lat, lon });
      // Try reverse geocoding via OSM Nominatim
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
        const res = await fetch(url, {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          const disp = data?.display_name as string | undefined;
          if (disp) setAddress(disp);
        }
      } catch {}
    } catch (err: any) {
      setLocError(err?.message || 'Unable to retrieve location');
    } finally {
      setLocLoading(false);
    }
  }, []);

  const onPickMedia = useCallback(() => {
    // Open modal to choose Camera or Library
    setMediaPickerOpen(true);
  }, []);

  const openCameraCapture = useCallback(async () => {
    const el = fileMediaCameraInputRef.current;
    if (!el) return;
    try {
      // Hint to use device camera when supported
      el.setAttribute('capture', 'environment');
    } catch {}

    // If mediaDevices is available, request permission explicitly so the user sees a prompt
    const md =
      typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
    if (md && typeof md.getUserMedia === 'function') {
      try {
        setCameraPermMsg(null);
        setCameraRequesting(true);
        const stream = await md.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        // Stop immediately — we're only asking for permission preflight
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {}
        setCameraRequesting(false);
        setMediaPickerOpen(false);
        // slight delay to ensure attribute is applied and modal closed
        setTimeout(() => el.click(), 0);
        return;
      } catch (err: any) {
        setCameraRequesting(false);
        setCameraPermMsg(
          'Camera permission denied or unavailable. You can choose Library instead, or enable camera in your browser settings.',
        );
        return; // keep modal open so user can use Library
      }
    }
    // Fallback: just open the file input (mobile browsers often still trigger camera)
    setMediaPickerOpen(false);
    setTimeout(() => el.click(), 0);
  }, []);

  const onMediaFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const now = new Date();
      const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const out: (typeof userMessages)[number][] = [];
      Array.from(files).forEach((f) => {
        const id = crypto.randomUUID();
        const isVid = f.type.startsWith('video/');
        const url = URL.createObjectURL(f);
        mediaSrcMapRef.current[id] = { type: isVid ? 'video' : 'image', url };
        out.push({
          id,
          body: `${isVid ? '🎬' : '📷'} Shared media: ${f.name}`,
          time,
          dateMs: now.getTime(),
          isOwner: true,
          lang: viewerLang,
        });
      });
      setUserMessages((prev) => [...prev, ...out]);
      // reset input value to allow re-selecting same file
      e.target.value = '';
      setMediaPickerOpen(false);
      scrollToBottom();
    },
    [viewerLang],
  );

  // Start/stop video recording
  const toggleVideoRecording = useCallback(async () => {
    if (videoRecording) {
      try {
        videoRecorderRef.current?.stop();
      } catch {}
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoStreamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : '';
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
      videoChunksRef.current = [];
      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) videoChunksRef.current.push(ev.data);
      };
      rec.onstop = () => {
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {}
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const time = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const filename = `video-${now.toISOString().replace(/[:.]/g, '-')}.webm`;
        const id = crypto.randomUUID();
        mediaSrcMapRef.current[id] = { type: 'video', url };
        setUserMessages((prev) => [
          ...prev,
          {
            id,
            body: `🎬 Shared media: ${filename}`,
            time,
            dateMs: now.getTime(),
            isOwner: true,
            lang: viewerLang,
          },
        ]);
        scrollToBottom();
        setVideoRecording(false);
        videoRecorderRef.current = null;
      };
      videoRecorderRef.current = rec;
      rec.start();
      setVideoRecording(true);
    } catch (err) {
      // ignore
    }
  }, [videoRecording, viewerLang]);

  // Start/stop audio recording
  const toggleAudioRecording = useCallback(async () => {
    if (audioRecording) {
      try {
        audioRecorderRef.current?.stop();
      } catch {}
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
      audioChunksRef.current = [];
      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };
      rec.onstop = () => {
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {}
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const time = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const filename = `voice-${now.toISOString().replace(/[:.]/g, '-')}.webm`;
        const id = crypto.randomUUID();
        mediaSrcMapRef.current[id] = { type: 'audio', url };
        setUserMessages((prev) => [
          ...prev,
          {
            id,
            body: `🎙 Voice clip: ${filename}`,
            time,
            dateMs: now.getTime(),
            isOwner: true,
            lang: viewerLang,
          },
        ]);
        scrollToBottom();
        setAudioRecording(false);
        audioRecorderRef.current = null;
      };
      audioRecorderRef.current = rec;
      rec.start();
      setAudioRecording(true);
    } catch (err) {
      // ignore
    }
  }, [audioRecording, viewerLang]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    const mediaMapAtMount = mediaSrcMapRef.current;
    const videoAtMount = videoStreamRef.current;
    const audioAtMount = audioStreamRef.current;
    return () => {
      try {
        Object.values(mediaMapAtMount).forEach((m) =>
          URL.revokeObjectURL(m.url),
        );
      } catch {}
      try {
        videoAtMount?.getTracks().forEach((t) => t.stop());
        audioAtMount?.getTracks().forEach((t) => t.stop());
      } catch {}
    };
  }, []);

  const autoResize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = '0px';
    const max = 160; // ~8 lines
    const next = Math.min(el.scrollHeight, max);
    el.style.height = next + 'px';
  };

  useEffect(() => {
    autoResize();
  }, [message]);

  // Close emoji popover on outside click
  useEffect(() => {
    if (!emojiOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      const btn = emojiBtnRef.current;
      const pop = emojiPopoverRef.current;
      if (!target) return;
      if (btn?.contains(target)) return;
      if (pop?.contains(target)) return;
      setEmojiOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [emojiOpen]);

  // Close members popover on outside click
  useEffect(() => {
    if (!membersOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      const btn = membersBtnRef.current;
      const pop = membersPopoverRef.current;
      if (!target) return;
      if (btn?.contains(target)) return;
      if (pop?.contains(target)) return;
      setMembersOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [membersOpen]);

  // removed older alarm implementation (startAlarm/stopAlarm)

  // Manage door access popover state/refs
  const manageBtnRef = useRef<HTMLButtonElement | null>(null);
  const managePopoverRef = useRef<HTMLDivElement | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [manageEmail, setManageEmail] = useState('');
  useEffect(() => {
    if (!manageOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      const btn = manageBtnRef.current;
      const pop = managePopoverRef.current;
      if (!target) return;
      if (btn?.contains(target)) return;
      if (pop?.contains(target)) return;
      setManageOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [manageOpen]);

  const insertEmoji = (emoji: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? message.length;
    const end = el.selectionEnd ?? message.length;
    setMessage((prev) => {
      const s = Math.max(0, Math.min(start, prev.length));
      const e = Math.max(s, Math.min(end, prev.length));
      const next = prev.slice(0, s) + emoji + prev.slice(e);
      // Restore caret after state updates
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const pos = s + emoji.length;
          inputRef.current.focus();
          inputRef.current.selectionStart = pos;
          inputRef.current.selectionEnd = pos;
          autoResize();
        }
      });
      return next;
    });
    setEmojiOpen(false);
  };

  // Insert token(s) at the cursor or prefix each selected line with the token
  const insertAtCursor = useCallback(
    (token: string) => {
      const el = inputRef.current;
      if (!el) return;
      const selStart = el.selectionStart ?? message.length;
      const selEnd = el.selectionEnd ?? message.length;

      setMessage((prev) => {
        const start = Math.max(0, Math.min(selStart, prev.length));
        const end = Math.max(start, Math.min(selEnd, prev.length));

        // If there's a selection, prefix each selected line with the token
        if (start !== end) {
          const before = prev.slice(0, start);
          const selected = prev.slice(start, end);
          const after = prev.slice(end);
          const modified = selected
            .split('\n')
            .map((line) => token + line)
            .join('\n');
          const next = before + modified + after;
          // Place caret after the modified block
          requestAnimationFrame(() => {
            if (inputRef.current) {
              const pos = before.length + modified.length;
              inputRef.current.focus();
              inputRef.current.selectionStart = pos;
              inputRef.current.selectionEnd = pos;
              autoResize();
            }
          });
          return next;
        }

        // No selection: insert token at the start of the current line
        const lineStart = prev.lastIndexOf('\n', start - 1) + 1; // 0 if none
        const before = prev.slice(0, lineStart);
        const lineRest = prev.slice(lineStart);
        const next = before + token + lineRest;
        requestAnimationFrame(() => {
          if (inputRef.current) {
            const pos = start + token.length;
            inputRef.current.focus();
            inputRef.current.selectionStart = pos;
            inputRef.current.selectionEnd = pos;
            autoResize();
          }
        });
        return next;
      });
    },
    [message],
  );

  // Alarm sound (Web Audio API) — plays for 10 seconds when toggled on
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const alarmTimerRef = useRef<number | null>(null);
  const alarmIntervalRef = useRef<number | null>(null);

  const localeFor = (lang: string) =>
    lang === 'es'
      ? 'es-ES'
      : lang === 'fr'
        ? 'fr-FR'
        : lang === 'ar'
          ? 'ar-SA'
          : lang === 'hi'
            ? 'hi-IN'
            : lang === 'zh'
              ? 'zh-CN'
              : 'en-US';

  const speakTranslated = useCallback(
    async (text: string) => {
      try {
        const synth = (window as any).speechSynthesis as
          | SpeechSynthesis
          | undefined;
        if (!synth) return;
        try {
          synth.cancel();
        } catch {}
        const t = await translateText(text, viewerLang || 'en', {
          sourceLang: 'en',
        });
        const u = new SpeechSynthesisUtterance(t || text);
        u.lang = localeFor(viewerLang || 'en');
        u.rate = 1;
        u.pitch = 1;
        u.volume = 1;
        synth.speak(u);
      } catch {}
    },
    [viewerLang],
  );

  const stopAlarmSound = useCallback(
    (reason?: 'user' | 'timer' | 'nav' | 'unmount') => {
      if (alarmTimerRef.current) {
        clearTimeout(alarmTimerRef.current);
        alarmTimerRef.current = null;
      }
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
      try {
        if (oscRef.current) {
          oscRef.current.stop();
          oscRef.current.disconnect();
        }
      } catch {}
      try {
        if (gainRef.current) gainRef.current.disconnect();
      } catch {}
      oscRef.current = null;
      gainRef.current = null;
      const ctx = audioCtxRef.current;
      audioCtxRef.current = null;
      if (ctx) {
        try {
          ctx.close();
        } catch {}
      }
      if (reason === 'user' || reason === 'timer') {
        // Translate speech to viewer's language
        speakTranslated('You are ready to go');
      }
    },
    [speakTranslated],
  );

  const startAlarmSound = (durationMs = 10000) => {
    try {
      stopAlarmSound();
      const Ctx: typeof AudioContext =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return; // browser unsupported
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      // best-effort resume without awaiting to keep within gesture
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const volume = 0.18; // louder but still safe
      osc.type = 'square'; // more piercing tone for audibility
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;

      // Pulse the volume (on/off) for a siren-like beep pattern
      let on = false;
      alarmIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || !gainRef.current) return;
        on = !on;
        try {
          gainRef.current.gain.setTargetAtTime(
            on ? volume : 0,
            audioCtxRef.current.currentTime,
            0.03,
          );
        } catch {}
      }, 220);

      alarmTimerRef.current = window.setTimeout(() => {
        stopAlarmSound('timer');
      }, durationMs);
    } catch {
      // ignore audio errors
    }
  };

  // Stop alarm when switching channels or leaving page
  useEffect(() => {
    return () => stopAlarmSound('unmount');
  }, [stopAlarmSound]);
  useEffect(() => {
    stopAlarmSound('nav');
  }, [activeChannel, stopAlarmSound]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex h-screen">
        {/* Mobile overlay */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}
        {/* Left Sidebar as Drawer */}
        <aside
          className={`z-40 inset-y-0 left-0 w-72 flex-col border-r border-gray-800 bg-gray-900 transform transition-transform duration-200 fixed ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:transform-none md:transition-none ${drawerOpen ? 'md:flex' : 'md:hidden'}`}
        >
          {/* Workspace header */}
          <div className="px-3 h-14 flex items-center border-b border-gray-800">
            <div className="text-xl font-semibold text-indigo-400">
              <span>Dispatchar</span>
            </div>
          </div>

          {/* Filter */}
          <div className="px-3 py-2 border-b border-gray-800">
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-gray-300 ${filter.trim().length > 0 ? 'bg-indigo-900/30 border border-indigo-700' : 'bg-gray-800'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm8.707 13.293l-3.387-3.387a8 8 0 10-1.414 1.414l3.387 3.387a1 1 0 001.414-1.414z" />
              </svg>
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Find channel or DM"
                className="bg-transparent outline-none flex-1"
                autoComplete="off"
              />
              {filter.trim().length > 0 && (
                <button
                  onClick={() => setFilter('')}
                  className="text-gray-400 hover:text-gray-200"
                  title="Clear search"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-6">
            {/* Channels section */}
            <div className="group">
              <div className="px-2 flex items-center text-xs font-semibold tracking-wider text-gray-300 select-none">
                <button
                  onClick={() => setOpenChannels((v) => !v)}
                  className="mr-1 text-gray-400 hover:text-gray-200"
                  title={openChannels ? 'Collapse' : 'Expand'}
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${openChannels ? 'rotate-90' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7 5l6 5-6 5z" />
                  </svg>
                </button>
                TEXT CHANNELS
                <Link
                  href="/channels/new"
                  className="ml-auto hidden group-hover:inline-flex items-center justify-center w-5 h-5 rounded bg-gray-800 text-gray-300 hover:text-white border border-gray-700"
                  title="Add channel"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
              </div>
              {openChannels && (
                <div className="mt-2 space-y-1">
                  {filteredChannels.length === 0 && filter.trim().length > 0 ? (
                    <div className="px-3 py-2 text-xs text-gray-500">
                      No channels found for &ldquo;{filter}&rdquo;
                    </div>
                  ) : (
                    filteredChannels
                      .slice(0, filter.trim().length > 0 ? 10 : 3)
                      .map((c) => {
                        // Use button for search results, Link for regular sidebar
                        if (filter.trim().length > 0) {
                          const type = c.name.toLowerCase();
                          const isActive = activeChannel.toLowerCase() === type;
                          const colors =
                            type === 'inbound'
                              ? {
                                  active:
                                    'bg-blue-500/10 text-blue-200 border border-blue-400/30',
                                  base: 'bg-blue-900/15 text-blue-200 border border-blue-800/40 hover:bg-blue-900/25',
                                  hash: 'text-sky-400',
                                  unread: 'bg-blue-900/40 text-blue-200',
                                }
                              : type === 'outbound'
                                ? {
                                    active:
                                      'bg-fuchsia-500/10 text-fuchsia-200 border border-fuchsia-400/30',
                                    base: 'bg-fuchsia-900/15 text-fuchsia-200 border border-fuchsia-800/40 hover:bg-fuchsia-900/25',
                                    hash: 'text-fuchsia-400',
                                    unread:
                                      'bg-fuchsia-900/40 text-fuchsia-200',
                                  }
                                : {
                                    active:
                                      'bg-slate-600/20 text-slate-200 border border-slate-500/30',
                                    base: 'bg-slate-800/30 text-slate-200 border border-slate-700 hover:bg-slate-800/40',
                                    hash: 'text-indigo-400',
                                    unread: 'bg-indigo-900/50 text-indigo-200',
                                  };
                          return (
                            <button
                              key={c.name}
                              onClick={() => {
                                setActiveChannel(c.name);
                                setFilter('');
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
                                isActive ? colors.active : colors.base
                              }`}
                            >
                              <span className={`${colors.hash}`}>#</span>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm truncate block">
                                  {c.name}
                                </span>
                                {(c.vehicleNumber ||
                                  c.doorNumber ||
                                  c.description) && (
                                  <div className="text-xs text-gray-400 truncate">
                                    {[
                                      c.vehicleNumber &&
                                        `Vehicle: ${c.vehicleNumber}`,
                                      c.doorNumber && `Door: ${c.doorNumber}`,
                                      c.description,
                                    ]
                                      .filter(Boolean)
                                      .join(' • ')}
                                  </div>
                                )}
                              </div>
                              <span className="ml-auto flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    try {
                                      const {
                                        pinChannel,
                                      } = require('../lib/channelsStore');
                                      pinChannel(c.name, !(c.pinned ?? false));
                                      const list = loadChannels();
                                      setAllChannels(list);
                                    } catch {}
                                  }}
                                  className={`text-[10px] px-1.5 py-0.5 rounded border ${c.pinned ? 'bg-yellow-700/30 text-yellow-300 border-yellow-700/40' : 'text-gray-400 border-gray-700 hover:bg-gray-800'}`}
                                  title={
                                    c.pinned ? 'Unpin channel' : 'Pin channel'
                                  }
                                >
                                  {c.pinned ? 'Unpin' : 'Pin'}
                                </button>
                                {c.mentions ? (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-700/30">
                                    {c.mentions}
                                  </span>
                                ) : null}
                                {c.unread ? (
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${colors.unread}`}
                                  >
                                    {c.unread}
                                  </span>
                                ) : null}
                              </span>
                            </button>
                          );
                        } else {
                          // Regular sidebar - use Links
                          const dest =
                            c.name.toLowerCase() === 'inbound'
                              ? '/channels/inbound'
                              : c.name.toLowerCase() === 'outbound'
                                ? '/channels/outbound'
                                : '/channels/general';
                          const type = c.name.toLowerCase();
                          const isActive = activeChannel.toLowerCase() === type;
                          const colors =
                            type === 'inbound'
                              ? {
                                  active:
                                    'bg-blue-500/10 text-blue-200 border border-blue-400/30',
                                  base: 'bg-blue-900/15 text-blue-200 border border-blue-800/40 hover:bg-blue-900/25',
                                  hash: 'text-sky-400',
                                  unread: 'bg-blue-900/40 text-blue-200',
                                }
                              : type === 'outbound'
                                ? {
                                    active:
                                      'bg-fuchsia-500/10 text-fuchsia-200 border border-fuchsia-400/30',
                                    base: 'bg-fuchsia-900/15 text-fuchsia-200 border border-fuchsia-800/40 hover:bg-fuchsia-900/25',
                                    hash: 'text-fuchsia-400',
                                    unread:
                                      'bg-fuchsia-900/40 text-fuchsia-200',
                                  }
                                : {
                                    active:
                                      'bg-slate-600/20 text-slate-200 border border-slate-500/30',
                                    base: 'bg-slate-800/30 text-slate-200 border border-slate-700 hover:bg-slate-800/40',
                                    hash: 'text-indigo-400',
                                    unread: 'bg-indigo-900/50 text-indigo-200',
                                  };
                          return (
                            <Link
                              key={c.name}
                              href={dest}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
                                isActive ? colors.active : colors.base
                              }`}
                            >
                              <span className={`${colors.hash}`}>#</span>
                              <span className="text-sm truncate">{c.name}</span>
                              <span className="ml-auto flex items-center gap-1">
                                {c.mentions ? (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-700/30">
                                    {c.mentions}
                                  </span>
                                ) : null}
                                {c.unread ? (
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${colors.unread}`}
                                  >
                                    {c.unread}
                                  </span>
                                ) : null}
                              </span>
                            </Link>
                          );
                        }
                      })
                  )}
                  {/* View all channels link - hide when searching */}
                  {filter.trim().length === 0 && (
                    <a
                      href="/channels"
                      className="block mt-1 px-3 py-2 text-xs text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/20 rounded-md"
                    >
                      View all channels →
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* DMs section */}
            <div className="group">
              <div className="px-2 flex items-center text-xs font-semibold tracking-wider text-gray-300 select-none">
                <button
                  onClick={() => setOpenDMs((v) => !v)}
                  className="mr-1 text-gray-400 hover:text-gray-200"
                  title={openDMs ? 'Collapse' : 'Expand'}
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${openDMs ? 'rotate-90' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7 5l6 5-6 5z" />
                  </svg>
                </button>
                DIRECT MESSAGES
                <button
                  className="ml-auto hidden group-hover:inline-flex items-center justify-center w-5 h-5 rounded bg-gray-800 text-gray-300 hover:text-white border border-gray-700"
                  title="New DM"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              {openDMs && (
                <div className="mt-2 space-y-1">
                  {filteredDMs.length === 0 && filter.trim().length > 0 ? (
                    <div className="px-3 py-2 text-xs text-gray-500">
                      No direct messages found for &ldquo;{filter}&rdquo;
                    </div>
                  ) : (
                    filteredDMs
                      .slice(0, filter.trim().length > 0 ? 10 : 3)
                      .map((d) => (
                        <button
                          key={d.name}
                          onClick={() => {
                            setActiveChannel(`DM: ${d.name}`);
                            setFilter(''); // Clear search after selection
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-md group hover:bg-indigo-900/20"
                        >
                          <span
                            className={`relative inline-block w-2 h-2 rounded-full ${d.online ? 'bg-green-400' : 'bg-gray-500'}`}
                          ></span>
                          <span
                            className={`text-sm truncate ${d.online ? 'text-gray-100' : 'text-gray-300'}`}
                          >
                            {d.name}
                          </span>
                          {filter.trim().length > 0 &&
                            (d.role || d.vehicleAssigned || d.department) && (
                              <span className="text-xs text-gray-400 ml-2">
                                (
                                {[
                                  d.role,
                                  d.vehicleAssigned &&
                                    `Vehicle: ${d.vehicleAssigned}`,
                                  d.department && `Dept: ${d.department}`,
                                ]
                                  .filter(Boolean)
                                  .join(' • ')}
                                )
                              </span>
                            )}
                          <span className="ml-auto flex items-center gap-1">
                            {d.unread ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-900/50 text-indigo-200">
                                {d.unread}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      ))
                  )}
                  {/* View more DMs link - hide when searching */}
                  {filter.trim().length === 0 && (
                    <a
                      href="/direct-messages"
                      className="block mt-1 px-3 py-2 text-xs text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/20 rounded-md"
                    >
                      View more direct messages →
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Documents items (no section header) */}
            <div className="px-2">
              <div className="mt-2 space-y-1">
                <a
                  href="/activity"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md border bg-amber-900/15 text-amber-200 border-amber-800/40 hover:bg-amber-900/25"
                >
                  <svg
                    className="w-4 h-4 text-amber-300"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 7v5l4 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm">Activity</span>
                </a>
                <a
                  href="/shortcuts"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md border bg-emerald-900/15 text-emerald-200 border-emerald-800/40 hover:bg-emerald-900/25"
                >
                  <svg
                    className="w-4 h-4 text-emerald-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 7h18M3 12h12M3 17h6" />
                    <path d="M15 12l6-5v10l-6-5z" />
                  </svg>
                  <span className="text-sm">Shortcuts</span>
                </a>
                <a
                  href="/dms"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md border bg-purple-900/15 text-purple-200 border-purple-800/40 hover:bg-purple-900/25"
                >
                  <svg
                    className="w-4 h-4 text-purple-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16l4-4h10a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  <span className="text-sm">Documents</span>
                </a>
              </div>
            </div>
          </div>

          {/* Current user panel removed; unified with LeftRail user badge */}
        </aside>

        {/* Right Area */}
        <section className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-800 bg-gray-900/60 backdrop-blur relative z-[70]">
            {/* Left: drawer toggle button (truck) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen((v) => !v)}
                className="p-2 rounded-md hover:bg-gray-800"
                title={drawerOpen ? 'Hide menu' : 'Show menu'}
              >
                <svg
                  className={`w-5 h-5 text-indigo-300 transform transition-transform duration-200 ${drawerOpen ? '-scale-x-100' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 7h11v8H3z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M14 10h4l3 3v2h-7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="17" r="2" fill="currentColor" />
                  <circle cx="17" cy="17" r="2" fill="currentColor" />
                </svg>
              </button>
              {/* Channel type badge beside the truck icon */}
              {(() => {
                try {
                  const all = loadChannels();
                  const chan = all.find(
                    (c) =>
                      c.name?.toLowerCase() === activeChannel.toLowerCase(),
                  );
                  const cat = (chan?.category ?? 'general') as
                    | 'general'
                    | 'inbound'
                    | 'outbound';
                  const label = cat.toUpperCase();
                  const cls =
                    cat === 'inbound'
                      ? 'from-sky-500/25 to-blue-600/25 text-sky-200 border-sky-400/40 shadow-sky-900/30'
                      : cat === 'outbound'
                        ? 'from-fuchsia-500/25 to-pink-600/25 text-fuchsia-200 border-fuchsia-400/40 shadow-fuchsia-900/30'
                        : 'from-slate-600/30 to-slate-700/30 text-slate-200 border-slate-500/40 shadow-black/20';
                  return (
                    <span
                      className={`hidden sm:inline-flex items-center uppercase tracking-wider font-semibold text-[11px] sm:text-xs px-3 py-1 rounded-full bg-gradient-to-r border shadow ${cls}`}
                    >
                      {label}
                    </span>
                  );
                } catch {
                  return null;
                }
              })()}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  ref={notifBtnRef}
                  onClick={() => setNotifOpen((v) => !v)}
                  className="p-2 rounded-md hover:bg-gray-800 relative"
                  title="Notifications"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 21a2 2 0 004 0H10z" />
                    <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7z" />
                  </svg>
                  {checkins.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] px-1 py-0.5 rounded-full bg-amber-600 text-white leading-none border border-amber-400/30">
                      {checkins.length}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div
                    ref={notifPopoverRef}
                    className="absolute right-0 mt-2 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl p-3 z-50 w-[44rem] max-w-[95vw]"
                  >
                    <div className="mb-2 text-sm font-semibold">
                      Driver check-ins
                    </div>
                    <div className="space-y-3 pr-1 max-h-[70vh] overflow-y-auto">
                      {checkins.map((c) => {
                        const accentClass =
                          c.direction === 'inbound'
                            ? 'bg-emerald-500'
                            : 'bg-blue-500';
                        const pillClass =
                          c.direction === 'inbound'
                            ? 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-blue-600/15 text-blue-300 border-blue-500/30';
                        // Unify Create channel button color across directions
                        const primaryBtnClass =
                          'bg-indigo-600 hover:bg-indigo-700';
                        const arrowIcon =
                          c.direction === 'inbound' ? (
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M7 7h10v2H9.414l8.293 8.293-1.414 1.414L8 10.414V17H6V7z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17 17H7v-2h7.586L6.293 6.707 7.707 5.293 18 15.586V10h2v7z" />
                            </svg>
                          );
                        // Field count to determine when to split into columns
                        const fieldCount = 10; // driverName, company, direction, vehicleId, vehicleTruckId, po, pickup, delivery, appt, phone
                        const longForm = fieldCount > 8;
                        return (
                          <form
                            key={c.id}
                            className="relative overflow-hidden rounded-xl border border-gray-700/80 bg-gradient-to-b from-gray-800/70 to-gray-900 p-3 hover:border-gray-600 hover:shadow-lg hover:shadow-black/30 transition"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = e.currentTarget as HTMLFormElement;
                              const fd = new FormData(form);
                              const vals = {
                                driverName: String(fd.get('driverName') || ''),
                                company: String(fd.get('company') || ''),
                                direction: String(
                                  fd.get('direction') || 'inbound',
                                ) as 'inbound' | 'outbound',
                                vehicleId: String(fd.get('vehicleId') || ''),
                                vehicleTruckId: String(
                                  fd.get('vehicleTruckId') || '',
                                ),
                                poOrTripNumber: String(
                                  fd.get('poOrTripNumber') || '',
                                ),
                                pickupNumber: String(
                                  fd.get('pickupNumber') || '',
                                ),
                                deliveryNumber: String(
                                  fd.get('deliveryNumber') || '',
                                ),
                                appointmentISO: String(
                                  fd.get('appointmentISO') || '',
                                ),
                                telephone: String(fd.get('telephone') || ''),
                              };
                              try {
                                // Build a new channel from form data
                                const existing = loadChannels();
                                const baseName =
                                  (vals.poOrTripNumber &&
                                    vals.poOrTripNumber.trim()) ||
                                  (vals.vehicleId && vals.vehicleId.trim()) ||
                                  `channel-${new Date().toISOString().slice(0, 10)}`;
                                let name = baseName;
                                let suffix = 2;
                                while (
                                  existing.some(
                                    (x) =>
                                      x.name.trim().toLowerCase() ===
                                      name.trim().toLowerCase(),
                                  )
                                ) {
                                  name = `${baseName}-${suffix++}`;
                                }

                                const newChannel: Channel = {
                                  name,
                                  description: [vals.company, vals.driverName]
                                    .filter(Boolean)
                                    .join(' • '),
                                  poNumber: vals.poOrTripNumber || undefined,
                                  doorNumber: undefined,
                                  category: vals.direction,
                                  vehicleNumber:
                                    vals.vehicleId ||
                                    vals.vehicleTruckId ||
                                    undefined,
                                  doorStatus: 'green',
                                  createdBy: 'demo@chatdo.com',
                                  authorizedDoorChangers: [],
                                  docsOk: false,
                                  alarmActive: false,
                                  pinned: false,
                                  createdAt: new Date().toISOString(),
                                };
                                addChannel(newChannel);
                                setAllChannels(loadChannels());
                                setActiveChannel(name);
                                setFilter('');
                                setNotifOpen(false);
                                addActivity({
                                  id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                                  kind: 'channel-created',
                                  timestampISO: new Date().toISOString(),
                                  channelName: name,
                                  category: newChannel.category,
                                  direction: vals.direction,
                                  vehicleId: newChannel.vehicleNumber,
                                  poNumber: newChannel.poNumber,
                                  pickupNumber: vals.pickupNumber || undefined,
                                  deliveryNumber:
                                    vals.deliveryNumber || undefined,
                                  createdBy: 'demo@chatdo.com',
                                  description: `${vals.direction} channel created from driver check-in form • Driver: ${vals.driverName || '—'} • Company: ${vals.company || '—'}`,
                                });
                                setCheckins((prev) =>
                                  prev.filter((x) => x.id !== c.id),
                                );
                              } catch {}
                            }}
                          >
                            <span
                              className={`absolute inset-y-0 left-0 w-1 ${accentClass}`}
                            />
                            <span
                              className={`absolute top-2 right-2 text-[10px] inline-flex items-center gap-1 rounded-full px-2 py-0.5 border ${pillClass} shadow-sm`}
                            >
                              {arrowIcon}
                              {c.direction}
                            </span>
                            <div className="flex items-center gap-2 text-sm pr-16 mb-2">
                              <span className="text-indigo-400">🚚</span>
                              <span className="font-medium truncate">
                                {c.driverName}
                              </span>
                            </div>
                            <div
                              className={`${longForm ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}`}
                            >
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  Driver name
                                </span>
                                <input
                                  name="driverName"
                                  defaultValue={c.driverName || ''}
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  Company
                                </span>
                                <input
                                  name="company"
                                  defaultValue={c.company || ''}
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  Direction
                                </span>
                                <select
                                  name="direction"
                                  defaultValue={c.direction}
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                  <option value="inbound">inbound</option>
                                  <option value="outbound">outbound</option>
                                </select>
                              </label>
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  Vehicle ID
                                </span>
                                <input
                                  name="vehicleId"
                                  defaultValue={c.vehicleId || ''}
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  Truck
                                </span>
                                <input
                                  name="vehicleTruckId"
                                  defaultValue={c.vehicleTruckId || ''}
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  PO/Trip
                                </span>
                                <input
                                  name="poOrTripNumber"
                                  defaultValue={c.poOrTripNumber || ''}
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  Pickup
                                </span>
                                <input
                                  name="pickupNumber"
                                  defaultValue={c.pickupNumber || ''}
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  Delivery
                                </span>
                                <input
                                  name="deliveryNumber"
                                  defaultValue={c.deliveryNumber || ''}
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  Appointment
                                </span>
                                <input
                                  name="appointmentISO"
                                  type="datetime-local"
                                  defaultValue={
                                    c.appointmentISO
                                      ? new Date(c.appointmentISO)
                                          .toISOString()
                                          .slice(0, 16)
                                      : ''
                                  }
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </label>
                              <label className="block">
                                <span className="block text-xs text-gray-400 mb-1">
                                  Phone
                                </span>
                                <input
                                  name="telephone"
                                  defaultValue={c.telephone || ''}
                                  className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </label>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  const form = (
                                    e.currentTarget as HTMLElement
                                  ).closest('form') as HTMLFormElement | null;
                                  const veh = form
                                    ? (
                                        form.elements.namedItem(
                                          'vehicleId',
                                        ) as HTMLInputElement | null
                                      )?.value
                                    : c.vehicleId;
                                  const v = veh || c.vehicleId;
                                  if (v)
                                    window.location.href = `/driver/${encodeURIComponent(v)}`;
                                }}
                                className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-800 text-gray-200 text-xs border border-gray-700 hover:bg-gray-700"
                              >
                                View driver
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectFor(c);
                                  setRejectCategory('documents-missing');
                                  setRejectNotes('');
                                  setRejectOpen(true);
                                  // Optionally close notifications popover while modal is open
                                  setNotifOpen(false);
                                }}
                                className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-700/20 text-rose-300 text-xs border border-rose-700/40 hover:bg-rose-700/30"
                              >
                                Reject
                              </button>
                              <button
                                type="submit"
                                className={`inline-flex items-center px-2.5 py-1 rounded-md text-white text-xs ${primaryBtnClass}`}
                              >
                                Create channel
                              </button>
                            </div>
                          </form>
                        );
                      })}
                      {checkins.length === 0 && (
                        <div className="text-xs text-gray-400">
                          No new check-ins.
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {rejectOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                      className="absolute inset-0 bg-black/60"
                      onClick={() => setRejectOpen(false)}
                    />
                    <div className="relative w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 shadow-2xl p-4">
                      <div className="text-sm font-semibold mb-2">
                        Reject check-in
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        {rejectFor?.driverName ? (
                          <>
                            Driver:{' '}
                            <span className="text-gray-200">
                              {rejectFor.driverName}
                            </span>{' '}
                            • Company:{' '}
                            <span className="text-gray-200">
                              {rejectFor.company || '—'}
                            </span>{' '}
                            • Direction:{' '}
                            <span className="text-gray-200">
                              {rejectFor.direction}
                            </span>
                          </>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="block">
                          <span className="block text-xs text-gray-400 mb-1">
                            Reason
                          </span>
                          <select
                            value={rejectCategory}
                            onChange={(e) => setRejectCategory(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="documents-missing">
                              Documents missing
                            </option>
                            <option value="appointment-issue">
                              Appointment issue
                            </option>
                            <option value="capacity-full">
                              Dock/door capacity full
                            </option>
                            <option value="early-arrival">
                              Arrived too early
                            </option>
                            <option value="incorrect-details">
                              Incorrect details
                            </option>
                            <option value="other">Other</option>
                          </select>
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="block text-xs text-gray-400 mb-1">
                            Notes (optional)
                          </span>
                          <textarea
                            value={rejectNotes}
                            onChange={(e) => setRejectNotes(e.target.value)}
                            rows={3}
                            placeholder="Add a short explanation for the driver and office log"
                            className="w-full px-2 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </label>
                      </div>
                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setRejectOpen(false)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-800 text-gray-200 text-xs border border-gray-700 hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (!rejectFor) return setRejectOpen(false);
                            try {
                              // Log rejection activity
                              addActivity({
                                id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                                kind: 'checkin-rejected',
                                timestampISO: new Date().toISOString(),
                                channelName: undefined,
                                category:
                                  (rejectFor.direction as any) || 'general',
                                direction: rejectFor.direction,
                                vehicleId:
                                  rejectFor.vehicleId ||
                                  rejectFor.vehicleTruckId,
                                poNumber: rejectFor.poOrTripNumber,
                                pickupNumber: rejectFor.pickupNumber,
                                deliveryNumber: rejectFor.deliveryNumber,
                                createdBy: 'demo@chatdo.com',
                                description: `Check-in rejected • Reason: ${rejectCategory} • Notes: ${rejectNotes || '—'} • Driver: ${rejectFor.driverName || '—'} • Company: ${rejectFor.company || '—'}`,
                              });
                              // Remove the check-in from the list
                              setCheckins((prev) =>
                                prev.filter((x) => x.id !== rejectFor.id),
                              );
                            } catch {}
                            setRejectOpen(false);
                            setRejectFor(null);
                            setRejectNotes('');
                          }}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs"
                        >
                          Reject check-in
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Removed standalone Pins button; moved Pin/Unpin into kebab */}
              <div className="relative">
                <button
                  ref={membersBtnRef}
                  onClick={() => setMembersOpen((v) => !v)}
                  className="p-2 rounded-md hover:bg-gray-800 relative"
                  title="Members"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5C23 14.17 18.33 13 16 13z" />
                  </svg>
                  {/* total members badge */}
                  <span className="absolute -top-1 -right-1 text-[10px] px-1 py-0.5 rounded-full bg-indigo-600 text-white leading-none border border-indigo-400/30">
                    {totalMembers}
                  </span>
                </button>
                {membersOpen && (
                  <div
                    ref={membersPopoverRef}
                    className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-700 bg-gray-900 shadow-xl p-3 z-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold">Members</div>
                      <div className="text-xs text-gray-400">
                        {totalMembers} members • {onlineCount} online
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {chanMembers.map((m) => (
                        <div
                          key={m.name}
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800"
                        >
                          <span
                            className={`relative inline-block w-2 h-2 rounded-full ${m.online ? 'bg-green-400' : 'bg-gray-500'}`}
                          />
                          <span className="text-sm text-gray-200 truncate">
                            {m.name}
                          </span>
                          {m.online && (
                            <span className="ml-auto text-[10px] text-green-300">
                              online
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div ref={globalSearchRef} className="hidden sm:block relative">
                <div className="flex items-center pl-3 pr-2 py-1.5 rounded-md bg-gray-800 text-sm text-gray-300 w-64">
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm8.707 13.293l-3.387-3.387a8 8 0 10-1.414 1.414l3.387 3.387a1 1 0 001.414-1.414z" />
                  </svg>
                  <input
                    value={globalQuery}
                    onChange={(e) => setGlobalQuery(e.target.value)}
                    className="bg-transparent outline-none w-56"
                    placeholder="Search everything…"
                    aria-label="Global search"
                  />
                </div>
                {globalOpen && globalResults.length > 0 && (
                  <div className="absolute right-0 mt-2 w-[32rem] max-w-[90vw] rounded-xl border border-gray-700 bg-gray-900 shadow-2xl z-[90]">
                    <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-gray-800">
                      {/* Channels */}
                      {globalResults.some((r) => r.kind === 'channel') && (
                        <div className="py-1">
                          <div className="px-2 text-[11px] uppercase tracking-wider text-sky-300/80 mb-1">
                            Channels
                          </div>
                          {globalResults
                            .filter((r) => r.kind === 'channel')
                            .slice(0, 5)
                            .map((r) => (
                              <button
                                key={`ch-${r.title}-${(r as any).channelName}`}
                                onClick={() => {
                                  setActiveChannel((r as any).channelName);
                                  setGlobalOpen(false);
                                  setGlobalQuery('');
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-800 text-left"
                              >
                                <span className="text-sky-400">#</span>
                                <div className="min-w-0">
                                  <div className="text-sm truncate">
                                    {r.title}
                                  </div>
                                  {r.subtitle && (
                                    <div className="text-xs text-gray-400 truncate">
                                      {r.subtitle}
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                      {/* DMs */}
                      {globalResults.some((r) => r.kind === 'dm') && (
                        <div className="py-1">
                          <div className="px-2 text-[11px] uppercase tracking-wider text-emerald-300/80 mb-1">
                            Direct Messages
                          </div>
                          {globalResults
                            .filter((r) => r.kind === 'dm')
                            .slice(0, 5)
                            .map((r) => (
                              <button
                                key={`dm-${r.title}-${(r as any).channelName}`}
                                onClick={() => {
                                  setActiveChannel(
                                    `DM: ${(r as any).channelName}`,
                                  );
                                  setGlobalOpen(false);
                                  setGlobalQuery('');
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-800 text-left"
                              >
                                <span className="text-emerald-400">@</span>
                                <div className="min-w-0">
                                  <div className="text-sm truncate">
                                    {r.title}
                                  </div>
                                  {r.subtitle && (
                                    <div className="text-xs text-gray-400 truncate">
                                      {r.subtitle}
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                      {/* Documents */}
                      {globalResults.some((r) => r.kind === 'document') && (
                        <div className="py-1">
                          <div className="px-2 text-[11px] uppercase tracking-wider text-indigo-300/80 mb-1">
                            Documents
                          </div>
                          {globalResults
                            .filter((r) => r.kind === 'document')
                            .slice(0, 5)
                            .map((r) => (
                              <button
                                key={`doc-${(r as any).docId}`}
                                onClick={() => {
                                  try {
                                    router.push(
                                      `/dms?doc=${encodeURIComponent((r as any).docId)}`,
                                    );
                                  } catch {
                                    router.push('/dms');
                                  }
                                  setGlobalOpen(false);
                                  setGlobalQuery('');
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-800 text-left"
                              >
                                <span className="text-indigo-400">📄</span>
                                <div className="min-w-0">
                                  <div className="text-sm truncate">
                                    {r.title}
                                  </div>
                                  {r.subtitle && (
                                    <div className="text-xs text-gray-400 truncate">
                                      {r.subtitle}
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                      {/* Activity */}
                      {globalResults.some((r) => r.kind === 'activity') && (
                        <div className="py-1">
                          <div className="px-2 text-[11px] uppercase tracking-wider text-amber-300/80 mb-1">
                            Activity
                          </div>
                          {globalResults
                            .filter((r) => r.kind === 'activity')
                            .slice(0, 5)
                            .map((r) => (
                              <button
                                key={`act-${(r as any).activityId}`}
                                onClick={() => {
                                  try {
                                    const q = encodeURIComponent(
                                      globalQuery.trim(),
                                    );
                                    router.push(`/activity?q=${q}`);
                                  } catch {
                                    router.push('/activity');
                                  }
                                  setGlobalOpen(false);
                                  setGlobalQuery('');
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-800 text-left"
                              >
                                <span className="text-amber-300">
                                  <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <circle
                                      cx="12"
                                      cy="12"
                                      r="9"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    />
                                    <path
                                      d="M12 7v5l4 2"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                                <div className="min-w-0">
                                  <div className="text-sm truncate">
                                    {r.title}
                                  </div>
                                  {r.subtitle && (
                                    <div className="text-xs text-gray-400 truncate">
                                      {r.subtitle}
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                      {/* Pages */}
                      {globalResults.some((r) => r.kind === 'page') && (
                        <div className="py-1">
                          <div className="px-2 text-[11px] uppercase tracking-wider text-gray-300/80 mb-1">
                            Pages
                          </div>
                          {globalResults
                            .filter((r) => r.kind === 'page')
                            .slice(0, 5)
                            .map((r) => (
                              <button
                                key={`page-${(r as any).href}`}
                                onClick={() => {
                                  router.push((r as any).href);
                                  setGlobalOpen(false);
                                  setGlobalQuery('');
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-800 text-left"
                              >
                                <span className="text-gray-300">🔗</span>
                                <div className="min-w-0">
                                  <div className="text-sm truncate">
                                    {r.title}
                                  </div>
                                  {r.subtitle && (
                                    <div className="text-xs text-gray-400 truncate">
                                      {r.subtitle}
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Replaced Back link with kebab menu */}
              <div className="relative">
                <button
                  ref={kebabBtnRef}
                  onClick={() => setKebabOpen((v) => !v)}
                  className="p-2 rounded-md hover:bg-gray-800"
                  title="Channel actions"
                  aria-haspopup
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                  </svg>
                </button>
                {kebabOpen &&
                  (() => {
                    const chan = loadChannels().find(
                      (c) =>
                        c.name?.toLowerCase() === activeChannel.toLowerCase(),
                    );
                    const pinned = !!chan?.pinned;
                    const core = ['general', 'inbound', 'outbound'].includes(
                      activeChannel.toLowerCase(),
                    );
                    return (
                      <div
                        ref={kebabPopoverRef}
                        className="absolute right-0 top-full mt-3 sm:mt-4 translate-y-0 w-56 rounded-lg border border-gray-700 bg-gray-900 shadow-2xl p-1 z-[80]"
                      >
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-200 hover:bg-gray-800"
                          onClick={() => {
                            try {
                              pinChannel(activeChannel, !pinned);
                              setAllChannels(loadChannels());
                            } catch {}
                            setKebabOpen(false);
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M14 2l4 4-4 4v4l-4 4v-8L6 6l8-4z" />
                          </svg>
                          {pinned ? 'Unpin Channel' : 'Pin Channel'}
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-200 hover:bg-gray-800"
                          onClick={() => {
                            setActiveChannel('General');
                            setKebabOpen(false);
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-sky-300"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M10 6h7a2 2 0 012 2v8a2 2 0 01-2 2h-7" />
                            <path d="M13 16l-4-4 4-4" />
                          </svg>
                          Leave Channel
                        </button>
                        <button
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-gray-800 ${core ? 'text-gray-500 cursor-not-allowed' : 'text-rose-300'}`}
                          disabled={core}
                          onClick={() => {
                            if (core) return;
                            setConfirmDeleteOpen(true);
                            setKebabOpen(false);
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6v-2a1 1 0 011-1h6a1 1 0 011 1v2" />
                            <path d="M6 6l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
                          </svg>
                          Delete Channel
                        </button>
                      </div>
                    );
                  })()}
              </div>
              <ConfirmDialog
                open={confirmDeleteOpen}
                title="Delete this channel?"
                description={`This will permanently remove ${activeChannel}. This cannot be undone.`}
                confirmText="Delete"
                onCancel={() => setConfirmDeleteOpen(false)}
                onConfirm={() => {
                  try {
                    deleteChannel(activeChannel);
                    setAllChannels(loadChannels());
                    setActiveChannel('General');
                  } catch {}
                  setConfirmDeleteOpen(false);
                }}
              />
            </div>
          </div>

          {/* Channel header row with chips */}
          <div className="px-4 py-2 border-b border-gray-800 bg-gray-900 relative">
            {/* Left: Title + chips | Right: actions */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="text-base font-semibold">
                    # {activeChannel}
                  </div>
                  {(() => {
                    const all = loadChannels();
                    const chan = all.find(
                      (c) =>
                        c.name?.toLowerCase() === activeChannel.toLowerCase(),
                    );
                    const cat = chan?.category ?? 'general';
                    if (cat !== 'inbound' && cat !== 'outbound') return null;
                    return activeMeta?.vehicleNumber ? (
                      <a
                        href={`/driver/${encodeURIComponent(activeMeta.vehicleNumber)}`}
                        className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/15"
                        title="View driver details"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 13h2l4 6h8a2 2 0 001.789-1.106l3-6A2 2 0 0020 9H13l-4-6H5a2 2 0 00-2 2v8z" />
                        </svg>
                        Vehicle ID — {activeMeta.vehicleNumber}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-300">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 13h2l4 6h8a2 2 0 001.789-1.106l3-6A2 2 0 0020 9H13l-4-6H5a2 2 0 00-2 2v8z" />
                        </svg>
                        Vehicle ID —
                      </span>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={toggleDoorStatus}
                    disabled={
                      !canUserToggleDoor(
                        loadChannels().find(
                          (c) =>
                            c.name?.toLowerCase() ===
                            activeChannel.toLowerCase(),
                        ),
                        demoCurrentUser,
                      )
                    }
                    className={`inline-flex items-center text-xs px-2 py-1 rounded-md border ${
                      (activeMeta?.doorStatus ?? 'green') === 'green'
                        ? 'bg-green-600/20 text-green-200 border-green-500/30'
                        : 'bg-rose-600/20 text-rose-200 border-rose-500/30'
                    }`}
                    title={
                      (activeMeta?.doorStatus ?? 'green') === 'green'
                        ? `Green: movement allowed (back in/leave)${activeMeta?.docsOk ? '' : ' • Docs pending'}`
                        : 'Red: no movement'
                    }
                  >
                    <span
                      className={`mr-1 text-[10px] ${
                        (activeMeta?.doorStatus ?? 'green') === 'green'
                          ? 'text-green-300'
                          : 'text-rose-300'
                      }`}
                    >
                      ●
                    </span>
                    Door{' '}
                    {activeMeta?.doorNumber
                      ? `— ${activeMeta.doorNumber}`
                      : '—'}{' '}
                    • {(activeMeta?.doorStatus ?? 'green').toUpperCase()}
                  </button>
                  {(() => {
                    const chan = loadChannels().find(
                      (c) =>
                        c.name?.toLowerCase() === activeChannel.toLowerCase(),
                    );
                    const creator = isCreator(chan, demoCurrentUser);
                    if (!creator) return null;
                    return (
                      <div className="relative">
                        <button
                          ref={manageBtnRef}
                          onClick={() => setManageOpen((v) => !v)}
                          className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                          title="Manage door access"
                        >
                          Manage
                        </button>
                        {manageOpen && (
                          <div
                            ref={managePopoverRef}
                            className="absolute z-50 mt-2 w-80 rounded-lg border border-gray-700 bg-gray-900 shadow-xl p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-semibold">
                                Authorized to toggle
                              </div>
                              <div
                                className={`text-[10px] px-1.5 py-0.5 rounded-full border ${activeMeta?.docsOk ? 'bg-green-600/20 text-green-200 border-green-500/30' : 'bg-amber-600/20 text-amber-200 border-amber-500/30'}`}
                              >
                                {activeMeta?.docsOk
                                  ? 'Docs OK'
                                  : 'Docs pending'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                value={manageEmail}
                                onChange={(e) => setManageEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="flex-1 rounded-md bg-gray-800 border border-gray-700 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                              />
                              <button
                                onClick={() => {
                                  const email = manageEmail.trim();
                                  if (!email) return;
                                  addAuthorizedDoorChanger(
                                    activeChannel,
                                    email,
                                  );
                                  const updated = loadChannels().find(
                                    (c) =>
                                      c.name.toLowerCase() ===
                                      activeChannel.toLowerCase(),
                                  );
                                  setActiveAuthorized(
                                    updated?.authorizedDoorChangers ?? [],
                                  );
                                  setManageEmail('');
                                }}
                                className="px-2 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                              >
                                Add
                              </button>
                            </div>
                            <div className="space-y-1 max-h-40 overflow-y-auto mb-2">
                              {activeAuthorized.length === 0 && (
                                <div className="text-xs text-gray-400">
                                  No additional users authorized yet.
                                </div>
                              )}
                              {activeAuthorized.map((u) => (
                                <div
                                  key={u}
                                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800"
                                >
                                  <div className="text-sm text-gray-200 truncate flex-1">
                                    {u}
                                  </div>
                                  <button
                                    onClick={() => {
                                      removeAuthorizedDoorChanger(
                                        activeChannel,
                                        u,
                                      );
                                      const updated = loadChannels().find(
                                        (c) =>
                                          c.name.toLowerCase() ===
                                          activeChannel.toLowerCase(),
                                      );
                                      setActiveAuthorized(
                                        updated?.authorizedDoorChangers ?? [],
                                      );
                                    }}
                                    className="text-xs px-2 py-0.5 rounded-md bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/25"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-400">
                                Document readiness
                              </div>
                              <button
                                className={`text-xs px-2 py-1 rounded-md border ${activeMeta?.docsOk ? 'bg-green-600/20 text-green-200 border-green-500/30' : 'bg-amber-600/20 text-amber-200 border-amber-500/30'}`}
                                onClick={() => {
                                  const curr = loadChannels().find(
                                    (c) =>
                                      c.name.toLowerCase() ===
                                      activeChannel.toLowerCase(),
                                  );
                                  const next = !(curr?.docsOk ?? false);
                                  setDocsOk(activeChannel, next);
                                  setActiveMeta((prev) =>
                                    prev ? { ...prev, docsOk: next } : prev,
                                  );
                                }}
                              >
                                {activeMeta?.docsOk
                                  ? 'Mark pending'
                                  : 'Mark docs OK'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Docs button: link to Documents page */}
                <Link
                  href={`/dms?channel=${encodeURIComponent(activeChannel)}`}
                  className="text-xs px-2 py-1 rounded-md border bg-blue-600/20 text-blue-200 border-blue-500/30 hover:bg-blue-600/25"
                  title="Open Documents"
                >
                  Docs
                </Link>
                {/* Alarm button: always visible; disabled if user isn't creator */}
                {(() => {
                  const chan = loadChannels().find(
                    (c) =>
                      c.name?.toLowerCase() === activeChannel.toLowerCase(),
                  );
                  const creator = chan
                    ? isCreator(chan, demoCurrentUser)
                    : false;
                  const alarm = !!(activeMeta?.alarmActive ?? false);
                  return (
                    <button
                      onClick={() => {
                        if (!creator) return;
                        const curr = loadChannels().find(
                          (c) =>
                            c.name.toLowerCase() ===
                            activeChannel.toLowerCase(),
                        );
                        const next = !(curr?.alarmActive ?? false);
                        setAlarmActive(activeChannel, next);
                        setActiveMeta((prev) =>
                          prev ? { ...prev, alarmActive: next } : prev,
                        );
                        if (next) {
                          // start sound for 10s
                          startAlarmSound(10000);
                        } else {
                          // stop immediately and announce readiness
                          stopAlarmSound('user');
                        }
                      }}
                      disabled={!creator}
                      className={`text-xs px-2 py-1 rounded-md border ${
                        alarm
                          ? 'bg-orange-600/20 text-orange-200 border-orange-500/30'
                          : 'bg-orange-900/15 text-orange-200 border-orange-800/40 hover:bg-orange-900/25'
                      } ${!creator ? 'opacity-60 cursor-not-allowed' : ''}`}
                      title={alarm ? 'Alarm active' : 'Alarm off'}
                    >
                      Alarm
                    </button>
                  );
                })()}
                <button
                  onClick={() => {
                    try {
                      const chan = encodeURIComponent(activeChannel);
                      router.push(`/esign/sign?channel=${chan}`);
                    } catch {
                      router.push('/esign/sign');
                    }
                  }}
                  className="text-xs px-2 py-1 rounded-md bg-purple-600/20 text-purple-300"
                  title="Open signature panel"
                >
                  Sign
                </button>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4"
          >
            {/* user messages with date dividers */}
            {userMessages.map((m, i) => {
              const currDate = new Date(m.dateMs);
              const prev = userMessages[i - 1];
              const prevDate = prev ? new Date(prev.dateMs) : null;

              const isSameDay = (a: Date, b: Date) =>
                a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth() &&
                a.getDate() === b.getDate();

              const ordinal = (n: number) => {
                const s = ['th', 'st', 'nd', 'rd'];
                const v = n % 100;
                return s[(v - 20) % 10] || s[v] || s[0];
              };
              const formatDayLabel = (d: Date) => {
                const today = new Date();
                if (isSameDay(d, today)) return 'Today';
                const weekday = d.toLocaleDateString(undefined, {
                  weekday: 'long',
                });
                const month = d.toLocaleDateString(undefined, {
                  month: 'long',
                });
                const day = d.getDate();
                return `${weekday}, ${month} ${day}${ordinal(day)}`;
              };

              const showDivider = !prevDate || !isSameDay(currDate, prevDate);

              const bubble = () => {
                if (m.isOwner) {
                  // Outgoing (right): avatar FIRST, then header (name/time), then message with kebab
                  return (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[75%] flex items-start gap-3">
                        {/* Avatar first */}
                        <Image
                          src={avatarUrlFor(demoCurrentUser)}
                          alt="demo@chatdo.com"
                          width={32}
                          height={32}
                          unoptimized
                          className="w-8 h-8 rounded-xl object-cover border border-indigo-500/30 bg-indigo-800"
                        />
                        {/* Message block */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold tracking-wide text-gray-100">
                              demo@chatdo.com
                            </span>
                            <span className="text-xs text-gray-500">
                              {m.time}
                            </span>
                            <div className="relative ml-auto">
                              <button
                                onClick={() =>
                                  setMsgMenuOpenId((id) =>
                                    id === m.id ? null : m.id,
                                  )
                                }
                                className="p-1 rounded hover:bg-gray-800"
                                title="More"
                              >
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <circle cx="5" cy="12" r="1.5" />
                                  <circle cx="12" cy="12" r="1.5" />
                                  <circle cx="19" cy="12" r="1.5" />
                                </svg>
                              </button>
                              {msgMenuOpenId === m.id && (
                                <div className="absolute right-0 mt-1 w-48 rounded-md border border-gray-700 bg-gray-900 shadow-xl z-40 py-1">
                                  {/* Pin */}
                                  <button
                                    onClick={() => {
                                      setMsgMenuOpenId(null);
                                      try {
                                        const {
                                          pinMessage,
                                        } = require('../lib/pinnedMessagesStore');
                                        pinMessage({
                                          id: m.id,
                                          channelName: activeChannel,
                                          body: m.body,
                                          dateMs: m.dateMs,
                                          author: 'demo@chatdo.com',
                                        });
                                      } catch {}
                                      router.push('/shortcuts');
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800"
                                  >
                                    <svg
                                      className="w-4 h-4 text-yellow-300"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M14 2l4 4-4 4v4l-4 4v-8L6 6l8-4z" />
                                    </svg>
                                    Pin
                                  </button>
                                  {/* Reply */}
                                  <button
                                    onClick={() => {
                                      setMsgMenuOpenId(null);
                                      router.push(
                                        `/messages/${encodeURIComponent(m.id)}/reply`,
                                      );
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800"
                                  >
                                    <svg
                                      className="w-4 h-4 text-sky-300"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M10 6h7a2 2 0 012 2v8a2 2 0 01-2 2h-7" />
                                      <path d="M13 16l-4-4 4-4" />
                                    </svg>
                                    Reply
                                  </button>
                                  {/* Copy (new) */}
                                  <button
                                    onClick={async () => {
                                      setMsgMenuOpenId(null);
                                      const text = m.body ?? '';
                                      try {
                                        await navigator.clipboard.writeText(
                                          text,
                                        );
                                      } catch {
                                        try {
                                          const ta =
                                            document.createElement('textarea');
                                          ta.value = text;
                                          ta.style.position = 'fixed';
                                          ta.style.opacity = '0';
                                          document.body.appendChild(ta);
                                          ta.focus();
                                          ta.select();
                                          document.execCommand('copy');
                                          document.body.removeChild(ta);
                                        } catch {}
                                      }
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800"
                                  >
                                    <svg
                                      className="w-4 h-4 text-cyan-300"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <rect
                                        x="9"
                                        y="9"
                                        width="10"
                                        height="12"
                                        rx="2"
                                      />
                                      <path d="M5 15V5a2 2 0 012-2h8" />
                                    </svg>
                                    Copy
                                  </button>
                                  {/* Forward */}
                                  <button
                                    onClick={() => {
                                      setMsgMenuOpenId(null);
                                      router.push(
                                        `/messages/${encodeURIComponent(m.id)}/forward`,
                                      );
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800"
                                  >
                                    <svg
                                      className="w-4 h-4 text-violet-300"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M7 5l6 7-6 7" />
                                    </svg>
                                    Forward
                                  </button>
                                  {/* Mark as Read */}
                                  <button
                                    onClick={() => {
                                      setMsgMenuOpenId(null);
                                      router.push(
                                        `/messages/${encodeURIComponent(m.id)}/mark-read`,
                                      );
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800"
                                  >
                                    <svg
                                      className="w-4 h-4 text-green-300"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    Mark as Read
                                  </button>
                                  {/* Mark as Unread */}
                                  <button
                                    onClick={() => {
                                      setMsgMenuOpenId(null);
                                      router.push(
                                        `/messages/${encodeURIComponent(m.id)}/mark-unread`,
                                      );
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800"
                                  >
                                    <svg
                                      className="w-4 h-4 text-amber-300"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    Mark as Unread
                                  </button>
                                  {/* Edit */}
                                  <button
                                    onClick={() => {
                                      setMsgMenuOpenId(null);
                                      router.push(
                                        `/messages/${encodeURIComponent(m.id)}/edit`,
                                      );
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800"
                                  >
                                    <svg
                                      className="w-4 h-4 text-indigo-300"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M12 20h9" />
                                      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                                    </svg>
                                    Edit
                                  </button>
                                  {/* Delete */}
                                  <button
                                    onClick={() => {
                                      setMsgMenuOpenId(null);
                                      router.push(
                                        `/messages/${encodeURIComponent(m.id)}/delete`,
                                      );
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800 text-rose-400"
                                  >
                                    <svg
                                      className="w-4 h-4 text-rose-400"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M8 6v-2a1 1 0 011-1h6a1 1 0 011 1v2" />
                                      <path d="M6 6l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 text-gray-200 break-words">
                            {/* Clickable media/doc expansion */}
                            <button
                              className="text-left hover:underline"
                              aria-label="Open in viewer or editor"
                              onClick={() => {
                                const body = m.body;
                                // Prefer stored src if available
                                const stored = mediaSrcMapRef.current[m.id];
                                if (stored) {
                                  setPreviewType(stored.type);
                                  setPreviewName(
                                    body.replace(/^.[^:]*:\s*/, ''),
                                  );
                                  setPreviewSrc(stored.url);
                                  setPreviewOpen(true);
                                  return;
                                }
                                // Heuristics for messages without stored src
                                if (
                                  body.startsWith('📷 Shared media:') ||
                                  body.startsWith('🎬 Shared media:')
                                ) {
                                  setPreviewType(
                                    body.startsWith('🎬') ? 'video' : 'image',
                                  );
                                  setPreviewName(
                                    body.replace(/^.[^:]*:\s*/, ''),
                                  );
                                  setPreviewSrc('');
                                  setPreviewOpen(true);
                                } else if (body.startsWith('🎙 Voice clip:')) {
                                  setPreviewType('audio');
                                  setPreviewName(
                                    body.replace(/^.[^:]*:\s*/, ''),
                                  );
                                  setPreviewSrc('');
                                  setPreviewOpen(true);
                                } else if (
                                  body.startsWith('📎 Attached document:')
                                ) {
                                  const name = body.replace(/^.[^:]*:\s*/, '');
                                  const all = loadDocuments();
                                  const match =
                                    all.find((d) => d.name === name) || null;
                                  if (match) {
                                    setDocToEdit(match);
                                    setDocEditorOpen(true);
                                  } else {
                                    setPreviewType('document');
                                    setPreviewName(name);
                                    setPreviewSrc('');
                                    setPreviewOpen(true);
                                  }
                                }
                              }}
                            >
                              <TranslateSpan
                                text={m.body}
                                viewerLang={viewerLang}
                                sourceLang={m.lang}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Incoming (left): keep existing bubble style
                return (
                  <div key={m.id} className="flex justify-start">
                    <div className="max-w-[75%] flex items-start gap-2">
                      <Image
                        src={avatarUrlFor('user@example.com')}
                        alt="User"
                        width={28}
                        height={28}
                        unoptimized
                        className="w-7 h-7 rounded-md object-cover border border-gray-600 bg-gray-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">User</span>
                          <span className="text-xs text-gray-500">
                            {m.time}
                          </span>
                        </div>
                        <div className="mt-1 inline-block px-3 py-2 rounded-lg bg-gray-800 text-gray-200">
                          <TranslateSpan
                            text={m.body}
                            viewerLang={viewerLang}
                            sourceLang={m.lang}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              };

              return (
                <div key={m.id + '-wrap'} className="space-y-3">
                  {showDivider && (
                    <div className="relative my-4">
                      <div className="border-t border-gray-800" />
                      <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-gray-900 px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-700 flex items-center gap-1">
                        {formatDayLabel(currDate)}
                        <svg
                          className="w-3 h-3 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M7 8l3 3 3-3" />
                        </svg>
                      </span>
                    </div>
                  )}
                  {bubble()}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions panel (above composer) */}
          <div className="px-4 pt-3 bg-gray-900/40">
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1">
              <div className="text-[14px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
                Quick actions:
              </div>
              <button
                onClick={onAttachDoc}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600/20 text-blue-200 border border-blue-400/30 hover:bg-blue-600/25 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16l4-4h10a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                <span className="font-semibold text-xs">Attach Doc</span>
              </button>

              <button
                onClick={onESign}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600/20 text-purple-200 border border-purple-400/30 hover:bg-purple-600/25 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l4 4-7 7-2 5 5-2 7-7 4 4" />
                </svg>
                <span className="font-semibold text-xs">E-Sign</span>
              </button>

              <button
                onClick={onStartCall}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-green-600/20 text-green-200 border border-green-400/30 hover:bg-green-600/25 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92V21a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12.81 19.79 19.79 0 010 4.18 2 2 0 012 2h4.09a2 2 0 012 1.72 12.66 12.66 0 00.7 2.81 2 2 0 01-.45 2.11L7 9c.5 2 2.5 4 4.5 4.5l.36-.36a2 2 0 012.11-.45 12.66 12.66 0 002.81.7A2 2 0 0118.28 15.9z" />
                </svg>
                <span className="font-semibold text-xs">Start Call</span>
              </button>

              <button
                onClick={onShareLocation}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600/20 text-amber-200 border border-amber-400/30 hover:bg-amber-600/25 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 21s8-4.5 8-10A8 8 0 104 11c0 5.5 8 10 8 10z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                <span className="font-semibold text-xs">Share Location</span>
              </button>

              <button
                onClick={onPickMedia}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600/20 text-rose-200 border border-rose-400/30 hover:bg-rose-600/25 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15V8a5 5 0 10-10 0v9a3 3 0 006 0V9a1 1 0 10-2 0v8a1 1 0 11-2 0V8a3 3 0 016 0v7a5 5 0 11-10 0V9" />
                </svg>
                <span className="font-semibold text-xs">Image/Video</span>
              </button>

              {/* Test utilities: translation */}
              {/* Test utilities removed */}
              {/* Hidden inputs for quick actions */}
              <input
                ref={fileDocInputRef}
                type="file"
                multiple
                onChange={onAttachDocFiles}
                accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                aria-hidden="true"
                aria-label="Hidden document file input"
                title="Attach document"
                className="hidden"
              />
              <input
                ref={fileMediaInputRef}
                type="file"
                multiple
                onChange={onMediaFiles}
                accept="image/*,video/*"
                aria-hidden="true"
                aria-label="Hidden media file input"
                title="Attach image or video"
                className="hidden"
              />
              <input
                ref={fileMediaCameraInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={onMediaFiles}
                aria-hidden="true"
                aria-label="Hidden camera capture input"
                title="Capture image or video"
                className="hidden"
              />
            </div>
          </div>

          {/* Input area (match screenshot) */}
          <div className="px-4 pb-5 pt-3 bg-gray-900/40">
            {/* Gradient border wrapper for colorful outline */}
            <div className="group rounded-2xl p-[2px] bg-gradient-to-r from-sky-500 via-fuchsia-500 to-emerald-500 transition-[background-position] bg-[length:120%_120%] focus-within:from-sky-400 focus-within:via-indigo-500 focus-within:to-emerald-400">
              <div className="rounded-2xl bg-[#2C3543] border border-[#1F2834] hover:bg-[#2A3340] transition-colors focus-within:border-transparent">
                {/* Top row: plus, textarea + hint, right icons */}
                <div className="flex items-start gap-2 px-3 pt-2 pb-1">
                  {/* Plus / Add button (left) */}
                  <Link
                    href="/channels/new"
                    className="mt-0.5 shrink-0 grid place-items-center w-8 h-8 rounded-full text-gray-300 hover:text-white hover:bg-[#242A33]"
                    title="Add"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </Link>

                  {/* Expanding textarea + hint */}
                  <div className="flex-1 min-w-0">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      placeholder={`Message #${activeChannel.toLowerCase()}`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onInput={autoResize}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (message.trim()) sendMessage();
                        }
                      }}
                      className="w-full bg-transparent outline-none resize-none max-h-40 overflow-y-auto leading-relaxed placeholder:text-[#B9BBBE] text-[15px] caret-white py-1.5"
                    />
                    {message.trim().length === 0 && (
                      <div className="text-[11px] text-gray-400 select-none -mt-0.5">
                        Use Shift + Enter for new line
                      </div>
                    )}
                  </div>

                  {/* Right-side controls */}
                  <div className="flex items-center gap-1.5 pr-1">
                    {/* Emoji */}
                    <div className="relative">
                      <button
                        ref={emojiBtnRef}
                        onClick={() => setEmojiOpen((v) => !v)}
                        className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-[#242A33]"
                        title="Emoji"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 22a10 10 0 100-20 10 10 0 000 20zm-3-9a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2zM7.5 14a4.5 4.5 0 009 0H7.5z" />
                        </svg>
                      </button>
                      {emojiOpen && (
                        <div
                          ref={emojiPopoverRef}
                          className="absolute bottom-full right-0 mb-2 z-50 w-56 rounded-xl border border-gray-700 bg-gray-900 shadow-xl p-2"
                        >
                          <div className="px-1 pb-1 text-[10px] uppercase tracking-wider text-gray-400">
                            Quick emojis
                          </div>
                          <div className="grid grid-cols-8 gap-1">
                            {[
                              '😀',
                              '😅',
                              '😂',
                              '🤣',
                              '😊',
                              '😉',
                              '😍',
                              '😘',
                              '😎',
                              '🤔',
                              '🤨',
                              '🙃',
                              '🙌',
                              '👍',
                              '🙏',
                              '💯',
                              '🔥',
                              '🎉',
                              '🚀',
                              '❤️',
                              '🤝',
                              '😢',
                              '😡',
                              '🥳',
                              '💡',
                              '📎',
                              '📷',
                              '📄',
                              '📍',
                              '✅',
                              '❌',
                            ].map((e) => (
                              <button
                                key={e}
                                onClick={() => insertEmoji(e)}
                                className="grid place-items-center h-8 rounded-md hover:bg-gray-800 text-base"
                                title={e}
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Record video (moved here, larger) */}
                    <button
                      onClick={toggleVideoRecording}
                      className={`p-2 rounded-full hover:bg-[#242A33] ${videoRecording ? 'text-green-300' : 'text-gray-300 hover:text-white'}`}
                      title="Record video clip"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="7" width="12" height="10" rx="2" />
                        <path d="M15 9l6-3v12l-6-3z" />
                      </svg>
                    </button>
                    {/* Record voice (moved here, larger) */}
                    <button
                      onClick={toggleAudioRecording}
                      className={`p-2 rounded-full hover:bg-[#242A33] ${audioRecording ? 'text-green-300' : 'text-gray-300 hover:text-white'}`}
                      title="Record voice clip"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 3a3 3 0 00-3 3v5a3 3 0 006 0V6a3 3 0 00-3-3z" />
                        <path d="M19 11a7 7 0 01-14 0" />
                        <path d="M12 19v3" />
                      </svg>
                    </button>
                    {/* Send (rounded square) */}
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="ml-1 grid place-items-center w-10 h-9 rounded-lg bg-[#42546A] text-white hover:bg-[#3B4C60] disabled:bg-[#42546A]/40 disabled:cursor-not-allowed"
                      title="Send"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3.4 20.4l17.8-8.4-17.8-8.4L3 10l12 2-12 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#2B3340] mx-3" />

                {/* Bottom formatting toolbar */}
                <div className="flex items-center gap-0.5 pr-1.5 pl-[52px] py-0.5 text-sm text-gray-300">
                  <button
                    className="px-0.5 py-0.5 rounded hover:bg-[#242A33]"
                    title="Bold"
                  >
                    B
                  </button>
                  <span className="text-gray-500 text-[12px]">/</span>
                  <button
                    className="px-0.5 py-0.5 rounded hover:bg-[#242A33]"
                    title="Italic"
                  >
                    I
                  </button>
                  <span className="text-gray-500 text-[12px]">/</span>
                  <button
                    className="px-0.5 py-0.5 rounded hover:bg-[#242A33]"
                    title="Strikethrough"
                  >
                    S
                  </button>
                  <span className="text-gray-500 text-[12px]">/</span>
                  <button
                    className="px-0.5 py-0.5 rounded hover:bg-[#242A33]"
                    title="Code"
                  >
                    &lt;&gt;
                  </button>
                  {/* Separator between code and lists */}
                  <div className="mx-0 h-3 w-px bg-[#2B3340]" />
                  {/* Ordered list */}
                  <button
                    onClick={() => insertAtCursor('1. ')}
                    className="px-0.5 py-0.5 rounded hover:bg-[#242A33]"
                    title="Ordered list"
                  >
                    <svg
                      className="w-[14px] h-[14px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M8 6h13M8 12h13M8 18h13" />
                      <path d="M3 6h2" />
                      <path d="M3 12h2" />
                      <path d="M3 18h2" />
                    </svg>
                  </button>
                  {/* Bulleted list */}
                  <button
                    onClick={() => insertAtCursor('- ')}
                    className="px-0.5 py-0.5 rounded hover:bg-[#242A33]"
                    title="Bulleted list"
                  >
                    <svg
                      className="w-[14px] h-[14px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M8 6h13M8 12h13M8 18h13" />
                      <circle cx="4" cy="6" r="1" />
                      <circle cx="4" cy="12" r="1" />
                      <circle cx="4" cy="18" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System preview removed */}
          {/* Media picker modal */}
          {mediaPickerOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setMediaPickerOpen(false)}
              />
              <div className="relative z-[101] w-[92vw] max-w-sm rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-200">
                    Choose source
                  </div>
                  <button
                    onClick={() => setMediaPickerOpen(false)}
                    aria-label="Close"
                    title="Close"
                    className="p-1.5 rounded-md hover:bg-gray-800 text-gray-300"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={() => {
                      if (!cameraRequesting) {
                        openCameraCapture();
                      }
                    }}
                    disabled={cameraRequesting}
                    className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border transition-colors text-sm ${
                      cameraRequesting
                        ? 'bg-rose-600/10 text-rose-300 border-rose-400/20 cursor-not-allowed'
                        : 'bg-rose-600/20 text-rose-200 border-rose-400/30 hover:bg-rose-600/25'
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 7h4l2-3h4l2 3h4v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    Camera
                  </button>
                  <button
                    onClick={() => {
                      setMediaPickerOpen(false);
                      setTimeout(() => fileMediaInputRef.current?.click(), 0);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600/20 text-indigo-200 border border-indigo-400/30 hover:bg-indigo-600/25 transition-colors text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 7h18M3 12h12M3 17h6" />
                    </svg>
                    Library
                  </button>
                </div>
                <div className="pt-3 text-[11px] text-gray-500 space-y-1">
                  <div>
                    Camera uses your device capture (permission required).
                    Library opens your photo/video files.
                  </div>
                  {cameraRequesting && (
                    <div className="text-rose-200/80">
                      Requesting camera permission…
                    </div>
                  )}
                  {cameraPermMsg && (
                    <div className="text-rose-300">{cameraPermMsg}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Share Location modal */}
          {locOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setLocOpen(false)}
              />
              <div className="relative z-[101] w-[92vw] max-w-md rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-200">
                    Share Location
                  </div>
                  <button
                    onClick={() => setLocOpen(false)}
                    aria-label="Close"
                    title="Close"
                    className="p-1.5 rounded-md hover:bg-gray-800 text-gray-300"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {locLoading && (
                  <div className="text-sm text-gray-400">
                    Getting your location…
                  </div>
                )}
                {!locLoading && locError && (
                  <div className="text-sm text-rose-300">{locError}</div>
                )}
                {!locLoading && !locError && (
                  <div className="space-y-3">
                    {coords ? (
                      <div className="text-xs text-gray-300">
                        Coordinates:{' '}
                        <span className="text-gray-200 font-mono">
                          {coords!.lat.toFixed(5)}, {coords!.lon.toFixed(5)}
                        </span>
                      </div>
                    ) : null}
                    {address ? (
                      <div className="text-xs text-gray-300">
                        Address:{' '}
                        <span className="text-gray-200">{address}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        Address lookup unavailable
                      </div>
                    )}
                    {coords ? (
                      <a
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-200 border border-amber-500/30 hover:bg-amber-600/25 text-xs"
                        href={`https://www.openstreetmap.org/?mlat=${coords!.lat}&mlon=${coords!.lon}#map=16/${coords!.lat}/${coords!.lon}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 21s8-4.5 8-10A8 8 0 104 11c0 5.5 8 10 8 10z" />
                          <circle cx="12" cy="11" r="3" />
                        </svg>
                        Open in OpenStreetMap
                      </a>
                    ) : null}
                    <div className="pt-1 text-[11px] text-gray-500">
                      Only your approximate location is used. No data is stored.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Media/Document preview modal */}
          {previewOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/70"
                onClick={() => setPreviewOpen(false)}
              />
              <div className="relative z-[121] w-[94vw] max-w-3xl rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-200 truncate pr-4">
                    {previewName ||
                      (previewType === 'image'
                        ? 'Image'
                        : previewType === 'video'
                          ? 'Video'
                          : 'Document')}
                  </div>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    aria-label="Close"
                    title="Close"
                    className="p-1.5 rounded-md hover:bg-gray-800 text-gray-300"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 grid place-items-center bg-gray-800/50 rounded-xl border border-gray-700 min-h-[40vh]">
                  {previewType === 'image' && previewSrc ? (
                    <div className="relative w-full h-[60vh]">
                      <Image
                        src={previewSrc}
                        alt={previewName || 'Image preview'}
                        fill
                        sizes="(max-width: 768px) 90vw, 800px"
                        className="object-contain rounded-lg"
                        unoptimized
                      />
                    </div>
                  ) : previewType === 'video' && previewSrc ? (
                    <video
                      src={previewSrc}
                      controls
                      className="max-h-[70vh] max-w-full rounded-lg"
                    />
                  ) : previewType === 'audio' && previewSrc ? (
                    <audio src={previewSrc} controls className="w-full" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-300 p-6">
                      <svg
                        className="w-10 h-10 mb-3 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16l4-4h10a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      <div className="text-sm">
                        {previewName || 'No preview available'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {previewType === 'image'
                          ? 'Image preview not available.'
                          : previewType === 'video'
                            ? 'Video preview not available.'
                            : 'Document preview not available.'}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="rounded bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Document Editor modal mount */}
          <DocumentEditorModal
            document={docToEdit}
            isOpen={docEditorOpen}
            onClose={() => {
              setDocEditorOpen(false);
              setDocToEdit(null);
            }}
            onSaved={() => {
              // Optionally, drop a chat note or refresh any dependent views
            }}
          />
        </section>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gray-900 text-gray-100" />}
    >
      <ChatPageInner />
    </Suspense>
  );
}
