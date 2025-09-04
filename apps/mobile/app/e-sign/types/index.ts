// Enterprise E-Signing System Types
// Designed for millions of users in trucking industry

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'driver' | 'dispatcher' | 'manager' | 'admin';
  companyId: string;
  avatar?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: 'document' | 'signature' | 'workflow' | 'user';
  action: 'read' | 'write' | 'sign' | 'approve' | 'delete';
}

export interface Document {
  id: string;
  title: string;
  type:
    | 'contract'
    | 'invoice'
    | 'bill_of_lading'
    | 'delivery_receipt'
    | 'maintenance_log'
    | 'custom';
  status: DocumentStatus;
  content: DocumentContent;
  metadata: DocumentMetadata;
  workflow: Workflow;
  signatures: Signature[];
  auditTrail: AuditEvent[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface DocumentContent {
  rawContent: string; // HTML/PDF content
  mimeType: string;
  size: number;
  pages: number;
  thumbnail?: string;
  version: number;
  checksum: string;
}

export interface DocumentMetadata {
  sender: User;
  recipients: User[];
  cc: User[];
  bcc: User[];
  tags: string[];
  category: string;
  department: string;
  project?: string;
  reference?: string;
  externalId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  type: 'sequential' | 'parallel' | 'conditional';
  steps: WorkflowStep[];
  currentStep: number;
  status: WorkflowStatus;
  assignees: User[];
  deadline?: string;
  autoAdvance: boolean;
  notifications: Notification[];
}

export interface WorkflowStep {
  id: string;
  order: number;
  type: 'signature' | 'approval' | 'review' | 'notification';
  assignee: User;
  action: 'sign' | 'approve' | 'review' | 'acknowledge';
  status: StepStatus;
  completedAt?: string;
  comments?: string;
  required: boolean;
  timeout?: number; // hours
  reminderInterval?: number; // hours
}

export interface Signature {
  id: string;
  userId: string;
  user: User;
  documentId: string;
  type: 'electronic' | 'digital' | 'typed' | 'drawn';
  status: SignatureStatus;
  data: SignatureData;
  location: SignatureLocation;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  certificate?: DigitalCertificate;
}

export interface SignatureData {
  method: 'draw' | 'type' | 'upload' | 'auto';
  content: string; // SVG paths, typed text, or image data
  font?: string;
  size?: number;
  color?: string;
}

export interface SignatureLocation {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fieldName?: string;
}

export interface DigitalCertificate {
  issuer: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  publicKey: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  user: User;
  action: AuditAction;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface Notification {
  id: string;
  type: 'email' | 'push' | 'sms' | 'in_app';
  recipient: User;
  title: string;
  message: string;
  data?: Record<string, any>;
  sentAt?: string;
  readAt?: string;
  status: NotificationStatus;
}

// Enums
export type DocumentStatus =
  | 'draft'
  | 'pending_review'
  | 'pending_signature'
  | 'partially_signed'
  | 'fully_signed'
  | 'completed'
  | 'expired'
  | 'cancelled';

export type WorkflowStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired';

export type StepStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'overdue';

export type SignatureStatus = 'pending' | 'signed' | 'declined' | 'expired';

export type NotificationStatus =
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed';

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'sign'
  | 'approve'
  | 'forward'
  | 'download'
  | 'share';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Real-time Events
export interface RealtimeEvent {
  type:
    | 'document_updated'
    | 'signature_added'
    | 'workflow_advanced'
    | 'notification_sent';
  data: any;
  timestamp: string;
  userId?: string;
}

// Document Templates
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  signatureFields: SignatureField[];
  variables: TemplateVariable[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignatureField {
  id: string;
  name: string;
  type: 'signature' | 'date' | 'text' | 'checkbox' | 'dropdown';
  required: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  defaultValue?: string;
  validation?: ValidationRule[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: any;
  description?: string;
}

export interface ValidationRule {
  type: 'required' | 'min_length' | 'max_length' | 'pattern' | 'custom';
  value: any;
  message: string;
}
