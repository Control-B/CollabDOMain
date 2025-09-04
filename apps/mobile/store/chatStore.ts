import { create } from 'zustand';
import {
  User,
  Channel,
  Message,
  DirectMessage,
  Document,
  ActivityItem,
  SystemMetric,
} from '@/types';
import { getSocket, joinChannel } from '../services/phx';
import { apiService } from '../services/api';

interface ChatState {
  users: User[];
  channels: Channel[];
  messages: Record<string, Message[]>;
  directMessages: DirectMessage[];
  documents: Document[];
  activities: ActivityItem[];
  systemMetrics: SystemMetric[];
  currentUser: User;
  isConnected: boolean;
  // Actions
  setMessages: (channelId: string, messages: Message[]) => void;
  addMessage: (channelId: string, message: Message) => void;
  markAsRead: (channelId: string) => void;
  toggleDoorStatus: (channelId: string) => void;
  // Backend integration
  connectToPhoenix: () => void;
  joinPhoenixChannel: (channelId: string) => void;
  sendMessage: (channelId: string, text: string) => void;
  loadDocuments: () => Promise<void>;
  uploadDocument: (file: any) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentUser: {
    id: 'user-1',
    name: 'Alex Johnson',
    avatar: 'AJ',
    status: 'online',
    email: 'alex.johnson@company.com',
    phone: '+15555550123',
  },
  isConnected: false,
  users: [
    {
      id: 'user-1',
      name: 'Alex Johnson',
      avatar: 'AJ',
      status: 'online',
      phone: '+15555550123',
    },
    {
      id: 'user-2',
      name: 'Sarah Chen',
      avatar: 'SC',
      status: 'online',
    },
    {
      id: 'user-3',
      name: 'Mike Johnson',
      avatar: 'MJ',
      status: 'away',
    },
    {
      id: 'user-4',
      name: 'Alice Smith',
      avatar: 'AS',
      status: 'online',
    },
    {
      id: 'user-5',
      name: 'David Lee',
      avatar: 'DL',
      status: 'busy',
    },
  ],
  channels: [
    {
      id: 'general',
      name: 'general',
      description: 'Company-wide announcements and general discussion',
      memberCount: 124,
      isPrivate: false,
      unreadCount: 12,
      lastMessage: 'Welcome to the team!',
      lastMessageTime: '2:30 PM',
      isPinned: true,
      type: 'general',
    },
    {
      id: 'inbound',
      name: 'inbound',
      description: 'Customer support and incoming requests',
      memberCount: 45,
      isPrivate: false,
      unreadCount: 5,
      lastMessage: 'New ticket submitted',
      lastMessageTime: '1:15 PM',
      type: 'inbound',
      doorNumber: 'DOCK-A1',
      doorStatus: 'green',
    },
    {
      id: 'outbound',
      name: 'outbound',
      description: 'Sales and outreach activities',
      memberCount: 32,
      isPrivate: false,
      unreadCount: 0,
      lastMessage: 'Meeting scheduled for tomorrow',
      lastMessageTime: '11:30 AM',
      type: 'outbound',
      doorNumber: 'DOCK-B2',
      doorStatus: 'red',
    },
  ],
  messages: {
    general: [
      {
        id: 'msg-1',
        text: 'Welcome to the general channel! 👋',
        userId: 'user-2',
        channelId: 'general',
        timestamp: '2:30 PM',
        type: 'text',
      },
      {
        id: 'msg-2',
        text: 'Thanks for the warm welcome!',
        userId: 'user-1',
        channelId: 'general',
        timestamp: '2:35 PM',
        type: 'text',
      },
    ],
    inbound: [
      {
        id: 'msg-3',
        text: 'New support ticket received from customer',
        userId: 'user-3',
        channelId: 'inbound',
        timestamp: '1:15 PM',
        type: 'text',
      },
    ],
  },
  directMessages: [
    {
      id: 'dm-1',
      participants: ['user-1', 'user-2'],
      lastMessage: 'Can you review the design mockups?',
      lastMessageTime: '2:45 PM',
      unreadCount: 1,
    },
    {
      id: 'dm-2',
      participants: ['user-1', 'user-3'],
      lastMessage: 'Thanks for the help earlier!',
      lastMessageTime: '1:30 PM',
      unreadCount: 0,
    },
    {
      id: 'dm-3',
      participants: ['user-1', 'user-4'],
      lastMessage: 'Meeting in 10 minutes',
      lastMessageTime: '12:15 PM',
      unreadCount: 3,
    },
    {
      id: 'dm-4',
      participants: ['user-1', 'user-5'],
      lastMessage: "I'll be back after lunch",
      lastMessageTime: '11:45 AM',
      unreadCount: 0,
    },
  ],
  documents: [
    {
      id: 'doc-1',
      name: 'invoice-2024-05.pdf',
      description: 'Invoice document',
      size: '2.1 MB',
      modifiedAt: '2 hours ago',
      status: 'signed',
      type: 'pdf',
    },
    {
      id: 'doc-2',
      name: 'contract-001.docx',
      description: 'Contract document',
      size: '1.8 MB',
      modifiedAt: '1 day ago',
      status: 'pending',
      type: 'docx',
    },
    {
      id: 'doc-3',
      name: 'shipment-log.xlsx',
      description: 'Shipment tracking log',
      size: '856 KB',
      modifiedAt: '3 days ago',
      status: 'uploaded',
      type: 'xlsx',
    },
  ],
  activities: [
    {
      id: 'act-1',
      type: 'channel-created',
      title: 'Channel: TRIP-772-2',
      description:
        'PO: TRIP-772 • Truck: BIG-RIG-303\noutbound channel created from driver check-in form • Driver: David Lee • Company: BigRig Co',
      timestamp: '1:58:30 AM',
      channelType: 'outbound',
    },
    {
      id: 'act-2',
      type: 'checkin-rejected',
      title: 'Check-in rejected',
      description:
        'PO: PO-88421 • Truck: TRK-001 • Pickup: PU-1102 • Delivery: DL-2208\nCheck-in rejected • Reason: documents-missing • Notes: too early • Driver: Alice Smith • Company: RoadRunner Freight',
      timestamp: '1:58:23 AM',
      channelType: 'inbound',
    },
    {
      id: 'act-3',
      type: 'channel-created',
      title: 'Channel: PO-88421-2',
      description:
        'PO: PO-88421 • Truck: TRK-001 • Pickup: PU-1102 • Delivery: DL-2208\ninbound channel created from driver check-in • Driver: Alice Smith • Company: RoadRunner Freight',
      timestamp: '11:59:07 PM',
      channelType: 'inbound',
    },
  ],
  systemMetrics: [
    {
      id: 'active-docs',
      label: 'Active Documents',
      value: 24,
      color: '#4F80FF',
    },
    {
      id: 'pending-sigs',
      label: 'Pending Signatures',
      value: 12,
      color: '#10B981',
    },
    {
      id: 'messages-today',
      label: 'Messages Today',
      value: 156,
      color: '#8B5CF6',
    },
    {
      id: 'geofence-alerts',
      label: 'Geofence Alerts',
      value: 3,
      color: '#EF4444',
    },
  ],
  setMessages: (channelId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [channelId]: messages },
    })),
  addMessage: (channelId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] || []), message],
      },
    })),
  markAsRead: (channelId) =>
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id === channelId ? { ...channel, unreadCount: 0 } : channel
      ),
    })),
  toggleDoorStatus: (channelId) =>
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id === channelId
          ? {
              ...channel,
              doorStatus: channel.doorStatus === 'green' ? 'red' : 'green',
            }
          : channel
      ),
    })),

  // Backend integration methods
  connectToPhoenix: () => {
    try {
      const socket = getSocket();

      socket.onOpen(() => {
        console.log('Phoenix WebSocket connected');
        set({ isConnected: true });
      });

      socket.onClose(() => {
        console.log('Phoenix WebSocket disconnected');
        set({ isConnected: false });
      });

      socket.onError((error: any) => {
        console.error('Phoenix WebSocket error:', error);
        set({ isConnected: false });
      });
    } catch (error) {
      console.error('Failed to connect to Phoenix:', error);
    }
  },

  joinPhoenixChannel: (channelId: string) => {
    try {
      const channel = joinChannel(`room:${channelId}`);

      channel.on('new_message', (payload: any) => {
        const newMessage: Message = {
          id: payload.id || Date.now().toString(),
          text: payload.body,
          userId: payload.user_id,
          channelId: channelId,
          timestamp: payload.inserted_at || new Date().toLocaleTimeString(),
          type: 'text',
        };

        get().addMessage(channelId, newMessage);
      });

      channel.on('user_joined', (payload: any) => {
        console.log('User joined channel:', payload);
      });

      channel.on('user_left', (payload: any) => {
        console.log('User left channel:', payload);
      });
    } catch (error) {
      console.error('Failed to join Phoenix channel:', error);
    }
  },

  sendMessage: (channelId: string, text: string) => {
    try {
      const socket = getSocket();
      const channel = socket.channel(`room:${channelId}`);

      channel.push('new_message', {
        body: text,
        user_id: get().currentUser.id,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },

  loadDocuments: async () => {
    try {
      const result = await apiService.getDocuments();
      if (result.success && Array.isArray(result.data)) {
        set({ documents: result.data as Document[] });
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  },

  uploadDocument: async (file: any) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await apiService.uploadDocument(formData);
      if (result.success) {
        // Reload documents after successful upload
        get().loadDocuments();
      }
    } catch (error) {
      console.error('Failed to upload document:', error);
    }
  },
}));
