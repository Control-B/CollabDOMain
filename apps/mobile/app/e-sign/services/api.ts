import {
  Document,
  User,
  Signature,
  Workflow,
  ApiResponse,
  PaginatedResponse,
  DocumentTemplate,
} from '../types';

// Enterprise E-Signing API Service
// Handles communication with Elixir Phoenix & C# ASP.NET backends

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://api.collabmobile.com';
// const PHOENIX_URL = process.env.EXPO_PUBLIC_PHOENIX_URL || 'wss://phoenix.collabmobile.com/socket';
// const DOTNET_URL = process.env.EXPO_PUBLIC_DOTNET_URL || 'https://dotnet.collabmobile.com';

class ESignApiService {
  private authToken: string | null = null;
  private phoenixSocket: any = null;
  private eventListeners: Map<string, Function[]> = new Map();

  // Authentication
  setAuthToken(token: string) {
    this.authToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Document Management
  async getDocuments(params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
    userId?: string;
  }): Promise<PaginatedResponse<Document>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    const response = await fetch(
      `${API_BASE_URL}/api/v1/documents?${queryParams}`,
      { headers: this.getHeaders() }
    );

    const result = await this.handleResponse<PaginatedResponse<Document>>(
      response
    );
    return result.data!;
  }

  async getDocument(id: string): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/api/v1/documents/${id}`, {
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<Document>(response);
    return result.data!;
  }

  async createDocument(document: Partial<Document>): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/api/v1/documents`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(document),
    });

    const result = await this.handleResponse<Document>(response);
    return result.data!;
  }

  async updateDocument(
    id: string,
    updates: Partial<Document>
  ): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/api/v1/documents/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    const result = await this.handleResponse<Document>(response);
    return result.data!;
  }

  async deleteDocument(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/documents/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete document: ${response.statusText}`);
    }
  }

  // Document Upload & Processing
  async uploadDocument(
    file: File,
    metadata: Partial<Document>
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch(`${API_BASE_URL}/api/v1/documents/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      body: formData,
    });

    const result = await this.handleResponse<Document>(response);
    return result.data!;
  }

  async processDocument(id: string, operations: string[]): Promise<Document> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/documents/${id}/process`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ operations }),
      }
    );

    const result = await this.handleResponse<Document>(response);
    return result.data!;
  }

  // Signature Management
  async addSignature(
    documentId: string,
    signature: Partial<Signature>
  ): Promise<Signature> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/documents/${documentId}/signatures`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(signature),
      }
    );

    const result = await this.handleResponse<Signature>(response);
    return result.data!;
  }

  async updateSignature(
    documentId: string,
    signatureId: string,
    updates: Partial<Signature>
  ): Promise<Signature> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/documents/${documentId}/signatures/${signatureId}`,
      {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      }
    );

    const result = await this.handleResponse<Signature>(response);
    return result.data!;
  }

  async deleteSignature(
    documentId: string,
    signatureId: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/documents/${documentId}/signatures/${signatureId}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete signature: ${response.statusText}`);
    }
  }

  // Workflow Management
  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/api/v1/workflows`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(workflow),
    });

    const result = await this.handleResponse<Workflow>(response);
    return result.data!;
  }

  async updateWorkflow(
    id: string,
    updates: Partial<Workflow>
  ): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/api/v1/workflows/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    const result = await this.handleResponse<Workflow>(response);
    return result.data!;
  }

  async advanceWorkflow(
    id: string,
    stepId: string,
    action: string,
    data?: any
  ): Promise<Workflow> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/workflows/${id}/advance`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ stepId, action, data }),
      }
    );

    const result = await this.handleResponse<Workflow>(response);
    return result.data!;
  }

  // Document Templates
  async getTemplates(category?: string): Promise<DocumentTemplate[]> {
    const queryParams = category ? `?category=${category}` : '';
    const response = await fetch(
      `${API_BASE_URL}/api/v1/templates${queryParams}`,
      { headers: this.getHeaders() }
    );

    const result = await this.handleResponse<DocumentTemplate[]>(response);
    return result.data!;
  }

  async createFromTemplate(
    templateId: string,
    variables: Record<string, any>
  ): Promise<Document> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/templates/${templateId}/create`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ variables }),
      }
    );

    const result = await this.handleResponse<Document>(response);
    return result.data!;
  }

  // User Management
  async getUsers(params: {
    page?: number;
    limit?: number;
    role?: string;
    companyId?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    const response = await fetch(
      `${API_BASE_URL}/api/v1/users?${queryParams}`,
      { headers: this.getHeaders() }
    );

    const result = await this.handleResponse<PaginatedResponse<User>>(response);
    return result.data!;
  }

  // Real-time Communication (Phoenix)
  async connectPhoenix(userId: string): Promise<void> {
    try {
      // Initialize Phoenix Socket connection
      // This would integrate with phoenix.js or similar
      console.log('Connecting to Phoenix socket...');

      // Simulate connection for now
      this.phoenixSocket = {
        connected: true,
        on: (event: string, callback: Function) => {
          if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
          }
          this.eventListeners.get(event)!.push(callback);
        },
        emit: (event: string, data: any) => {
          console.log('Phoenix emit:', event, data);
        },
      };
    } catch (error) {
      console.error('Failed to connect to Phoenix:', error);
      throw error;
    }
  }

  async subscribeToDocument(documentId: string): Promise<void> {
    if (!this.phoenixSocket) {
      throw new Error('Phoenix socket not connected');
    }

    // Subscribe to document updates
    this.phoenixSocket.emit('join_document', { document_id: documentId });
  }

  async unsubscribeFromDocument(documentId: string): Promise<void> {
    if (!this.phoenixSocket) return;

    // Unsubscribe from document updates
    this.phoenixSocket.emit('leave_document', { document_id: documentId });
  }

  // Event Handling
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Utility Methods
  async downloadDocument(
    id: string,
    format: 'pdf' | 'docx' | 'original' = 'pdf'
  ): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/documents/${id}/download?format=${format}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.statusText}`);
    }

    return response.blob();
  }

  async shareDocument(
    id: string,
    recipients: string[],
    message?: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/documents/${id}/share`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ recipients, message }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to share document: ${response.statusText}`);
    }
  }

  // Analytics & Reporting
  async getDocumentAnalytics(documentId: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/documents/${documentId}/analytics`,
      { headers: this.getHeaders() }
    );

    const result = await this.handleResponse<any>(response);
    return result.data!;
  }

  async getUserActivity(userId: string, period: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/${userId}/activity?period=${period}`,
      { headers: this.getHeaders() }
    );

    const result = await this.handleResponse<any>(response);
    return result.data!;
  }
}

// Export singleton instance
export const eSignApi = new ESignApiService();

// Export for testing
export { ESignApiService };
