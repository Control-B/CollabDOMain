import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get environment variables from Expo config
const extras: any =
  (Constants as any)?.expoConfig?.extra ||
  (Constants as any)?.manifest?.extra ||
  (Constants as any)?.manifestExtra ||
  {};

// Environment detection
const ENV = extras.ENVIRONMENT || 'development';
const isDevelopment = ENV === 'development';

// Dynamic API URL based on environment
const getApiBaseUrl = () => {
  if (isDevelopment) {
    return extras.API_BASE_URL || 'http://localhost:5000/api';
  }
  return extras.PROD_API_URL || 'https://api.yourbackend.com/api';
};

const API_BASE_URL = getApiBaseUrl();
const WEB_BASE_URL = isDevelopment ? extras.WEB_BASE_URL : extras.PROD_WEB_URL;
const WEBSOCKET_URL = isDevelopment ? extras.WEBSOCKET_URL : extras.PROD_WEBSOCKET_URL;

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    phoneNumber?: string;
    email?: string;
    name?: string;
  };
}

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;
  private webBaseURL: string;
  private websocketURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.webBaseURL = WEB_BASE_URL;
    this.websocketURL = WEBSOCKET_URL;
    this.loadAuthToken();
  }

  // Load auth token from AsyncStorage on initialization
  private async loadAuthToken() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        this.authToken = token;
      }
    } catch (error) {
      console.error('Failed to load auth token:', error);
    }
  }

  async setAuthToken(token: string) {
    this.authToken = token;
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to save auth token:', error);
    }
  }

  async clearAuthToken() {
    this.authToken = null;
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to clear auth token:', error);
    }
  }

  // Get current environment info
  getEnvironmentInfo() {
    return {
      environment: ENV,
      apiUrl: this.baseURL,
      webUrl: this.webBaseURL,
      websocketUrl: this.websocketURL,
      isDevelopment,
    };
  }

  // Method to open web frontend from mobile
  getWebUrl(path: string = '') {
    return `${this.webBaseURL}${path}`;
  }

  // WebSocket connection helper
  createWebSocketConnection(path: string = '') {
    return `${this.websocketURL}${path}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error: ${response.status}`, data);
        return {
          success: false,
          error:
            data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      console.log(`API Success: ${config.method || 'GET'} ${url}`, data);
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Phone authentication endpoints
  async sendPhoneVerification(phoneNumber: string) {
    return this.request('/auth/phone/send-verification', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async verifyPhoneCode(phoneNumber: string, verificationCode: string): Promise<ApiResponse<AuthResponse>> {
    const result = await this.request<AuthResponse>('/auth/phone/verify', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, verificationCode }),
    });
    
    // Auto-set auth token if verification successful
    if (result.success && result.data?.token) {
      await this.setAuthToken(result.data.token);
    }
    
    return result;
  }

  async logout() {
    const result = await this.request('/auth/logout', {
      method: 'POST',
    });
    await this.clearAuthToken();
    return result;
  }

  // Document endpoints
  async getDocuments() {
    return this.request('/docs');
  }

  async getDocument(id: string) {
    return this.request(`/docs/${id}`);
  }

  async uploadDocument(formData: FormData) {
    return this.request('/docs/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData - let the browser set it
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      },
      body: formData,
    });
  }

  async deleteDocument(id: string) {
    return this.request(`/docs/${id}`, {
      method: 'DELETE',
    });
  }

  // E-signature endpoints
  async submitSignature(docId: string, signature: string) {
    return this.request(`/esign/${docId}`, {
      method: 'POST',
      body: JSON.stringify({ signature }),
    });
  }

  async getSignatureStatus(docId: string) {
    return this.request(`/esign/${docId}/status`);
  }

  // Trip management endpoints
  async getTrips() {
    return this.request('/trips');
  }

  async createTrip(trip: any) {
    return this.request('/trips', {
      method: 'POST',
      body: JSON.stringify(trip),
    });
  }

  async updateTrip(id: string, updates: any) {
    return this.request(`/trips/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Check-in endpoints
  async submitCheckIn(tripId: string, checkIn: any) {
    return this.request(`/trips/${tripId}/checkin`, {
      method: 'POST',
      body: JSON.stringify(checkIn),
    });
  }

  async getCheckIns(tripId: string) {
    return this.request(`/trips/${tripId}/checkins`);
  }

  // Notifications: send a check-in request to shipping office (ASP.NET backend)
  async notifyShippingOfficeCheckIn(trip: any) {
    return this.request('/notifications/check-in-request', {
      method: 'POST',
      body: JSON.stringify({ trip, requestedAt: new Date().toISOString() }),
    });
  }

  // Door status endpoints
  async getDoorStatuses() {
    return this.request('/door-status');
  }

  async updateDoorStatus(doorId: string, status: string, location: string) {
    return this.request(`/door-status/${doorId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, location }),
    });
  }

  // Search endpoints
  async searchMessages(query: string, channelId?: string) {
    const params = new URLSearchParams({ q: query });
    if (channelId) params.append('channelId', channelId);
    return this.request(`/search/messages?${params.toString()}`);
  }

  async searchFiles(query: string, type?: string) {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    return this.request(`/search/files?${params.toString()}`);
  }
}

export const apiService = new ApiService();
export default apiService;
