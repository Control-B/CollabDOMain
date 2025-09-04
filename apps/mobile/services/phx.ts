import { Socket, Channel } from 'phoenix';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for better TypeScript support
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Message {
  id: string;
  content: string;
  user: User;
  timestamp: string;
  type: 'message' | 'document' | 'signature_request' | 'system';
  metadata?: {
    documentId?: string;
    documentName?: string;
    documentUrl?: string;
    signatureRequests?: SignatureRequest[];
  };
}

export interface SignatureRequest {
  id: string;
  documentId: string;
  requesterId: string;
  requesterName: string;
  recipientId: string;
  recipientName: string;
  status: 'pending' | 'signed' | 'declined';
  signatureBoxes: SignatureBox[];
  createdAt: string;
  signedAt?: string;
}

export interface SignatureBox {
  id: string;
  type: 'signature' | 'initial' | 'date';
  x: number;
  y: number;
  width: number;
  height: number;
  signedData?: string; // Base64 encoded signature or date string
  signedBy?: string;
  signedAt?: string;
}

export interface DocumentShare {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: User;
  uploadedAt: string;
  requiresSignature: boolean;
  signatureRequests: SignatureRequest[];
}

class PhoenixService {
  private socket: Socket | null = null;
  private channels: Map<string, Channel> = new Map();
  private user: User | null = null;
  private isConnected: boolean = false;

  // Configuration - should be moved to env variables in production
  private getEndpoint(): string {
    // For development, use localhost. In production, use your Azure Container Apps URL
    const isDev = __DEV__;
    return isDev
      ? 'ws://localhost:4000/socket'
      : 'wss://your-phoenix-backend.azurecontainerapps.io/socket';
  }

  async initialize(user: User): Promise<void> {
    this.user = user;
    await this.connect();
  }

  private async ensureInitialized(): Promise<void> {
    if (this.user && this.isConnected && this.socket) return;
    // Fallback anonymous user for development if not provided
    if (!this.user) {
      this.user = {
        id: 'anonymous-driver',
        name: 'Driver',
        email: 'driver@example.com',
        role: 'driver',
      };
    }
    await this.connect();
  }

  private async connect(): Promise<void> {
    if (this.socket) {
      this.socket.disconnect();
    }

    // Get stored auth token (you'll need to implement auth first)
    const token = await this.getAuthToken();

    this.socket = new Socket(this.getEndpoint(), {
      params: { token, user_id: this.user?.id },
      logger: (kind: any, msg: any, data: any) => {
        if (__DEV__) {
          console.log(`[Phoenix] ${kind}: ${msg}`, data);
        }
      },
      reconnectAfterMs: (tries: any) => {
        // Exponential backoff: 1s, 2s, 5s, 10s, then 10s intervals
        if (tries < 4) {
          return [1000, 2000, 5000, 10000][tries - 1];
        }
        return 10000;
      },
    });

    this.socket.onOpen(() => {
      this.isConnected = true;
      console.log('[Phoenix] Connected to server');
    });

    this.socket.onClose(() => {
      this.isConnected = false;
      console.log('[Phoenix] Disconnected from server');
    });

    this.socket.onError((error: any) => {
      console.error('[Phoenix] Connection error:', error);
    });

    this.socket.connect();
  }

  private async getAuthToken(): Promise<string> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return token || 'anonymous'; // Fallback for development
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return 'anonymous';
    }
  }

  async joinChatChannel(
    channelId: string,
    callbacks: {
      onMessage?: (message: Message) => void;
      onDocumentShare?: (document: DocumentShare) => void;
      onSignatureRequest?: (request: SignatureRequest) => void;
      onUserJoined?: (user: User) => void;
      onUserLeft?: (user: User) => void;
      onTyping?: (user: User) => void;
    } = {}
  ): Promise<Channel> {
    if (!this.socket || !this.isConnected) {
      throw new Error('Phoenix socket not connected');
    }

    const topic = `chat:${channelId}`;

    // Leave existing channel if already joined
    if (this.channels.has(topic)) {
      this.channels.get(topic)?.leave();
    }

    const channel = this.socket.channel(topic, { user: this.user });

    // Set up event listeners
    if (callbacks.onMessage) {
      channel.on('new_message', callbacks.onMessage);
    }

    if (callbacks.onDocumentShare) {
      channel.on('document_shared', callbacks.onDocumentShare);
    }

    if (callbacks.onSignatureRequest) {
      channel.on('signature_requested', callbacks.onSignatureRequest);
    }

    if (callbacks.onUserJoined) {
      channel.on('user_joined', callbacks.onUserJoined);
    }

    if (callbacks.onUserLeft) {
      channel.on('user_left', callbacks.onUserLeft);
    }

    if (callbacks.onTyping) {
      channel.on('user_typing', callbacks.onTyping);
    }

    // Join the channel
    await new Promise<any>((resolve, reject) => {
      channel
        .join()
        .receive('ok', resolve)
        .receive('error', reject)
        .receive('timeout', () => reject(new Error('Channel join timeout')));
    });

    this.channels.set(topic, channel);
    console.log(`[Phoenix] Joined channel: ${topic}`);

    return channel;
  }

  private async joinOrGetChannel(topic: string): Promise<Channel> {
    if (!this.socket || !this.isConnected) {
      await this.ensureInitialized();
    }
    if (this.channels.has(topic)) {
      return this.channels.get(topic)!;
    }
    const channel = this.socket!.channel(topic, { user: this.user });
    await new Promise<any>((resolve, reject) => {
      channel
        .join()
        .receive('ok', resolve)
        .receive('error', reject)
        .receive('timeout', () => reject(new Error('Channel join timeout')));
    });
    this.channels.set(topic, channel);
    return channel;
  }

  /**
   * Notify shipping office that a driver requested check-in.
   * The shipping web app should subscribe to topic `notifications:shipping_office`
   * and handle event `check_in_requested`.
   */
  async notifyShippingOfficeCheckIn(trip: any): Promise<void> {
    await this.ensureInitialized();
    const topic = 'notifications:shipping_office';
    const channel = await this.joinOrGetChannel(topic);

    const payload = {
      type: 'check_in_requested',
      trip,
      requested_at: new Date().toISOString(),
      user: this.user,
    };

    await new Promise<void>((resolve, reject) => {
      channel
        .push('check_in_requested', payload)
        .receive('ok', () => resolve())
        .receive('error', (err: any) => reject(err))
        .receive('timeout', () => reject(new Error('Notification timeout')));
    });
  }

  async sendMessage(
    channelId: string,
    content: string,
    type: 'message' | 'document' = 'message',
    metadata?: any
  ): Promise<void> {
    const topic = `chat:${channelId}`;
    const channel = this.channels.get(topic);

    if (!channel) {
      throw new Error(`Not joined to channel: ${channelId}`);
    }

    channel.push('new_message', {
      content,
      type,
      metadata,
      user: this.user,
    });
  }

  async shareDocument(
    channelId: string,
    document: DocumentShare
  ): Promise<void> {
    const topic = `chat:${channelId}`;
    const channel = this.channels.get(topic);

    if (!channel) {
      throw new Error(`Not joined to channel: ${channelId}`);
    }

    channel.push('share_document', {
      document,
      user: this.user,
    });
  }

  async requestSignature(
    channelId: string,
    documentId: string,
    recipientIds: string[],
    signatureBoxes: Omit<SignatureBox, 'id'>[]
  ): Promise<void> {
    const topic = `chat:${channelId}`;
    const channel = this.channels.get(topic);

    if (!channel) {
      throw new Error(`Not joined to channel: ${channelId}`);
    }

    channel.push('request_signature', {
      document_id: documentId,
      recipient_ids: recipientIds,
      signature_boxes: signatureBoxes,
      requester: this.user,
    });
  }

  async submitSignature(
    channelId: string,
    signatureRequestId: string,
    signatureBoxId: string,
    signatureData: string
  ): Promise<void> {
    const topic = `chat:${channelId}`;
    const channel = this.channels.get(topic);

    if (!channel) {
      throw new Error(`Not joined to channel: ${channelId}`);
    }

    channel.push('submit_signature', {
      signature_request_id: signatureRequestId,
      signature_box_id: signatureBoxId,
      signature_data: signatureData,
      signer: this.user,
    });
  }

  async sendTypingIndicator(channelId: string): Promise<void> {
    const topic = `chat:${channelId}`;
    const channel = this.channels.get(topic);

    if (!channel) {
      return; // Don't throw error for typing indicators
    }

    channel.push('user_typing', { user: this.user });
  }

  leaveChannel(channelId: string): void {
    const topic = `chat:${channelId}`;
    const channel = this.channels.get(topic);

    if (channel) {
      channel.leave();
      this.channels.delete(topic);
      console.log(`[Phoenix] Left channel: ${topic}`);
    }
  }

  disconnect(): void {
    // Leave all channels first
    this.channels.forEach((channel, topic) => {
      channel.leave();
    });
    this.channels.clear();

    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnected = false;
    console.log('[Phoenix] Disconnected and cleaned up');
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getCurrentUser(): User | null {
    return this.user;
  }
}

// Export singleton instance
export const phoenixService = new PhoenixService();

// For backward compatibility
export const createSocket = async (user: User): Promise<Socket | null> => {
  await phoenixService.initialize(user);
  return phoenixService['socket']; // Access private socket for legacy code
};

export const getSocket = (): Socket | null => {
  return phoenixService['socket'];
};

export const joinChannel = async (
  channelId: string,
  callbacks: any = {}
): Promise<Channel> => {
  return phoenixService.joinChatChannel(channelId, callbacks);
};
