export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  email?: string;
  phone?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isPinned?: boolean;
  type: 'general' | 'inbound' | 'outbound';
  doorNumber?: string;
  doorStatus?: 'green' | 'red';
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  channelId: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'document' | 'signature_request';
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  metadata?: {
    documentId?: string;
    documentName?: string;
    documentUrl?: string;
    signatureRequestId?: string;
  };
}

export interface DirectMessage {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface Document {
  id: string;
  name: string;
  description: string;
  size: string;
  modifiedAt: string;
  status: 'uploaded' | 'processing' | 'signed' | 'pending';
  type: 'pdf' | 'docx' | 'xlsx';
}

export interface ActivityItem {
  id: string;
  type:
    | 'channel-created'
    | 'checkin-rejected'
    | 'document-signed'
    | 'signature-pending';
  title: string;
  description: string;
  timestamp: string;
  channelType?: 'inbound' | 'outbound';
}

export interface SystemMetric {
  id: string;
  label: string;
  value: number;
  color: string;
}
