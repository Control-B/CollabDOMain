// @ts-nocheck
import { Document, DocumentStatus, User, WorkflowStatus } from '../types';

// Demo users based on your chat store
export const demoUsers: User[] = [
  {
    id: 'user-1',
    fullName: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    role: 'driver',
    company: 'BigRig Co',
    avatar: 'AJ',
    status: 'online',
    // @ts-expect-error demo shape
    permissions: ['read', 'write', 'sign'],
  },
  {
    id: 'user-2',
    fullName: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'dispatcher',
    company: 'BigRig Co',
    avatar: 'SC',
    status: 'online',
    // @ts-expect-error demo shape
    permissions: ['read', 'write', 'sign', 'approve'],
  },
  {
    id: 'user-3',
    fullName: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'manager',
    company: 'BigRig Co',
    avatar: 'MJ',
    status: 'away',
    // @ts-expect-error demo shape
    permissions: ['read', 'write', 'sign', 'approve', 'delete'],
  },
  {
    id: 'user-4',
    fullName: 'Alice Smith',
    email: 'alice.smith@roadrunner.com',
    role: 'driver',
    company: 'RoadRunner Freight',
    avatar: 'AS',
    status: 'online',
    // @ts-expect-error demo shape
    permissions: ['read', 'write', 'sign'],
  },
  {
    id: 'user-5',
    fullName: 'David Lee',
    email: 'david.lee@bigrig.com',
    role: 'driver',
    company: 'BigRig Co',
    avatar: 'DL',
    status: 'busy',
    // @ts-expect-error demo shape
    permissions: ['read', 'write', 'sign'],
  },
];

// Demo documents based on trucking industry
export const demoDocuments: Document[] = [
  {
    id: 'doc-001',
    title: 'Bill of Lading - TRIP-772',
    type: 'bill_of_lading',
    status: 'pending_signature',
    content: {
      pages: 2,
      rawContent:
        'BILL OF LADING\n\nShipper: ABC Manufacturing\nConsignee: XYZ Distribution\n\nItems:\n- 50 pallets of electronics\n- Weight: 2,500 lbs\n- Special handling required\n\nPickup: PU-1102 Warehouse\nDelivery: DL-2208 Distribution Center\n\nDriver: Alex Johnson\nTruck: BIG-RIG-303\n\nSignature required from driver and consignee.',
      format: 'pdf',
      size: '1.2 MB',
    },
    metadata: {
      sender: demoUsers[1], // Sarah Chen (dispatcher)
      recipients: [demoUsers[0], demoUsers[4]], // Alex Johnson, David Lee
      priority: 'high',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      tags: ['trip-772', 'electronics', 'urgent'],
      location: 'PU-1102 Warehouse',
      destination: 'DL-2208 Distribution Center',
    },
    workflow: {
      id: 'wf-001',
      name: 'Trip 772 Approval',
      type: 'sequential',
      status: 'in_progress',
      currentStep: 1,
      steps: [
        {
          id: 'step-1',
          order: 1,
          name: 'Driver Review',
          assignee: demoUsers[0], // Alex Johnson
          status: 'completed',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
        },
        {
          id: 'step-2',
          order: 2,
          name: 'Dispatcher Approval',
          assignee: demoUsers[1], // Sarah Chen
          status: 'in_progress',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        },
        {
          id: 'step-3',
          order: 3,
          name: 'Manager Final Review',
          assignee: demoUsers[2], // Mike Johnson
          status: 'pending',
          dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
        },
      ],
    },
    signatures: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 'doc-002',
    title: 'Maintenance Log - TRK-001',
    type: 'maintenance_log',
    status: 'partially_signed',
    content: {
      pages: 1,
      rawContent:
        'MAINTENANCE LOG\n\nTruck: TRK-001\nDate: Today\n\nMaintenance Items:\n- Oil change (due)\n- Brake inspection (completed)\n- Tire rotation (scheduled)\n\nTechnician: John Smith\nSignature required from driver and technician.\n\nNotes: Brake pads at 30% - replace within 500 miles.',
      format: 'pdf',
      size: '856 KB',
    },
    metadata: {
      sender: demoUsers[4], // Alice Smith
      recipients: [demoUsers[3], demoUsers[2]], // Alice Smith, Mike Johnson
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      tags: ['maintenance', 'trk-001', 'safety'],
      location: 'Maintenance Bay 3',
      destination: 'N/A',
    },
    workflow: {
      id: 'wf-002',
      name: 'Maintenance Approval',
      type: 'parallel',
      status: 'in_progress',
      currentStep: 2,
      steps: [
        {
          id: 'step-1',
          order: 1,
          name: 'Driver Verification',
          assignee: demoUsers[4], // Alice Smith
          status: 'completed',
          dueDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        },
        {
          id: 'step-2',
          order: 2,
          name: 'Technician Sign-off',
          assignee: {
            id: 'tech-1',
            fullName: 'John Smith',
            email: 'john.smith@maintenance.com',
            role: 'technician',
            company: 'Maintenance Co',
            avatar: 'JS',
            status: 'online',
            permissions: ['read', 'write', 'sign'],
          },
          status: 'in_progress',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
        },
        {
          id: 'step-3',
          order: 3,
          name: 'Manager Approval',
          assignee: demoUsers[2], // Mike Johnson
          status: 'pending',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        },
      ],
    },
    signatures: [
      {
        id: 'sig-001',
        userId: demoUsers[4].id,
        userName: demoUsers[4].fullName,
        status: 'signed',
        signedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        type: 'electronic',
        data: { method: 'draw', content: 'svg-paths' },
        location: { page: 1, x: 100, y: 200, width: 150, height: 50 },
      },
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 'doc-003',
    title: 'Delivery Receipt - PO-88421',
    type: 'delivery_receipt',
    status: 'fully_signed',
    content: {
      pages: 1,
      rawContent:
        'DELIVERY RECEIPT\n\nPO Number: PO-88421\nDate: Today\n\nItems Delivered:\n- 25 pallets of automotive parts\n- Weight: 1,800 lbs\n- Condition: Good\n\nPickup: PU-1102 Warehouse\nDelivery: DL-2208 Distribution Center\n\nDriver: Alice Smith\nTruck: TRK-001\n\nAll items received in good condition. Signature confirms delivery completion.',
      format: 'pdf',
      size: '1.8 MB',
    },
    metadata: {
      sender: demoUsers[4], // Alice Smith
      recipients: [
        demoUsers[4],
        {
          id: 'consignee-1',
          fullName: 'Warehouse Manager',
          email: 'manager@warehouse.com',
          role: 'consignee',
          company: 'Warehouse Co',
          avatar: 'WM',
          status: 'online',
          permissions: ['read', 'sign'],
        },
      ],
      priority: 'high',
      dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      tags: ['po-88421', 'delivery', 'completed'],
      location: 'DL-2208 Distribution Center',
      destination: 'N/A',
    },
    workflow: {
      id: 'wf-003',
      name: 'Delivery Confirmation',
      type: 'sequential',
      status: 'completed',
      currentStep: 2,
      steps: [
        {
          id: 'step-1',
          order: 1,
          name: 'Driver Delivery',
          assignee: demoUsers[4], // Alice Smith
          status: 'completed',
          dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        },
        {
          id: 'step-2',
          order: 2,
          name: 'Consignee Receipt',
          assignee: {
            id: 'consignee-1',
            fullName: 'Warehouse Manager',
            email: 'manager@warehouse.com',
            role: 'consignee',
            company: 'Warehouse Co',
            avatar: 'WM',
            status: 'online',
            permissions: ['read', 'sign'],
          },
          status: 'completed',
          dueDate: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
        },
      ],
    },
    signatures: [
      {
        id: 'sig-002',
        userId: demoUsers[4].id,
        userName: demoUsers[4].fullName,
        status: 'signed',
        signedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'electronic',
        data: { method: 'draw', content: 'svg-paths' },
        location: { page: 1, x: 100, y: 300, width: 150, height: 50 },
      },
      {
        id: 'sig-003',
        userId: 'consignee-1',
        userName: 'Warehouse Manager',
        status: 'signed',
        signedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        type: 'electronic',
        data: { method: 'draw', content: 'svg-paths' },
        location: { page: 1, x: 300, y: 300, width: 150, height: 50 },
      },
    ],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
  },
  {
    id: 'doc-004',
    title: 'Contract Renewal - BigRig Co',
    type: 'contract',
    status: 'draft',
    content: {
      pages: 5,
      rawContent:
        'SERVICE CONTRACT RENEWAL\n\nContractor: BigRig Co\nClient: ABC Manufacturing\n\nServices:\n- Freight transportation\n- Warehousing\n- Last-mile delivery\n\nTerm: 2 years\nValue: $2.5M annually\n\nThis contract requires signatures from:\n1. BigRig Co CEO\n2. ABC Manufacturing Procurement Manager\n3. Legal representatives from both parties',
      format: 'docx',
      size: '2.1 MB',
    },
    metadata: {
      sender: demoUsers[2], // Mike Johnson
      recipients: [
        demoUsers[2],
        {
          id: 'ceo-1',
          fullName: 'CEO BigRig',
          email: 'ceo@bigrig.com',
          role: 'executive',
          company: 'BigRig Co',
          avatar: 'CEO',
          status: 'online',
          permissions: ['read', 'write', 'sign', 'approve'],
        },
      ],
      priority: 'high',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
      tags: ['contract', 'renewal', 'bigrig', 'abc-manufacturing'],
      location: 'N/A',
      destination: 'N/A',
    },
    workflow: {
      id: 'wf-004',
      name: 'Contract Approval',
      type: 'sequential',
      status: 'pending',
      currentStep: 0,
      steps: [
        {
          id: 'step-1',
          order: 1,
          name: 'Legal Review',
          assignee: {
            id: 'legal-1',
            fullName: 'Legal Counsel',
            email: 'legal@bigrig.com',
            role: 'legal',
            company: 'BigRig Co',
            avatar: 'LC',
            status: 'online',
            permissions: ['read', 'write', 'sign'],
          },
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        },
        {
          id: 'step-2',
          order: 2,
          name: 'CEO Approval',
          assignee: {
            id: 'ceo-1',
            fullName: 'CEO BigRig',
            email: 'ceo@bigrig.com',
            role: 'executive',
            company: 'BigRig Co',
            avatar: 'CEO',
            status: 'online',
            permissions: ['read', 'write', 'sign', 'approve'],
          },
          status: 'pending',
          dueDate: new Date(
            Date.now() + 10 * 24 * 60 * 60 * 1000
          ).toISOString(), // 10 days
        },
        {
          id: 'step-3',
          order: 3,
          name: 'Client Signature',
          assignee: {
            id: 'client-1',
            fullName: 'Procurement Manager',
            email: 'procurement@abc.com',
            role: 'client',
            company: 'ABC Manufacturing',
            avatar: 'PM',
            status: 'online',
            permissions: ['read', 'sign'],
          },
          status: 'pending',
          dueDate: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(), // 14 days
        },
      ],
    },
    signatures: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'doc-005',
    title: 'Invoice - TRIP-772',
    type: 'invoice',
    status: 'pending_review',
    content: {
      pages: 2,
      rawContent:
        'INVOICE\n\nInvoice #: INV-772-001\nDate: Today\n\nClient: ABC Manufacturing\n\nServices:\n- Freight transportation: PU-1102 to DL-2208\n- Distance: 450 miles\n- Rate: $2.50/mile\n- Total: $1,125.00\n\nAdditional charges:\n- Special handling: $150.00\n- Fuel surcharge: $75.00\n\nGrand Total: $1,350.00\n\nPayment due: 30 days\n\nPlease review and approve for payment processing.',
      format: 'pdf',
      size: '1.5 MB',
    },
    metadata: {
      sender: demoUsers[1], // Sarah Chen
      recipients: [
        demoUsers[2],
        {
          id: 'accounting-1',
          fullName: 'Accounting Manager',
          email: 'accounting@bigrig.com',
          role: 'accounting',
          company: 'BigRig Co',
          avatar: 'AM',
          status: 'online',
          permissions: ['read', 'write', 'sign'],
        },
      ],
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      tags: ['invoice', 'trip-772', 'abc-manufacturing', 'payment'],
      location: 'N/A',
      destination: 'N/A',
    },
    workflow: {
      id: 'wf-005',
      name: 'Invoice Approval',
      type: 'parallel',
      status: 'in_progress',
      currentStep: 1,
      steps: [
        {
          id: 'step-1',
          order: 1,
          name: 'Manager Review',
          assignee: demoUsers[2], // Mike Johnson
          status: 'in_progress',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
        },
        {
          id: 'step-2',
          order: 2,
          name: 'Accounting Review',
          assignee: {
            id: 'accounting-1',
            fullName: 'Accounting Manager',
            email: 'accounting@bigrig.com',
            role: 'accounting',
            company: 'BigRig Co',
            avatar: 'AM',
            status: 'online',
            permissions: ['read', 'write', 'sign'],
          },
          status: 'pending',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
        },
      ],
    },
    signatures: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
];

// Demo document templates
export const demoTemplates = [
  {
    id: 'template-001',
    name: 'Standard Bill of Lading',
    description: 'Standard BOL template for freight transportation',
    type: 'bill_of_lading',
    category: 'transportation',
    usageCount: 45,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'template-002',
    name: 'Maintenance Checklist',
    description: 'Pre-trip maintenance checklist template',
    type: 'maintenance_log',
    category: 'maintenance',
    usageCount: 23,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'template-003',
    name: 'Delivery Receipt',
    description: 'Standard delivery receipt template',
    type: 'delivery_receipt',
    category: 'delivery',
    usageCount: 67,
    lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

// Demo workflow templates
export const demoWorkflows = [
  {
    id: 'workflow-001',
    name: 'Standard Trip Approval',
    description: 'Standard workflow for trip approval and execution',
    type: 'sequential',
    steps: [
      { name: 'Driver Review', role: 'driver', estimatedTime: '2 hours' },
      {
        name: 'Dispatcher Approval',
        role: 'dispatcher',
        estimatedTime: '4 hours',
      },
      { name: 'Manager Review', role: 'manager', estimatedTime: '24 hours' },
    ],
    usageCount: 89,
    lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'workflow-002',
    name: 'Maintenance Approval',
    description: 'Workflow for maintenance requests and approvals',
    type: 'parallel',
    steps: [
      { name: 'Driver Verification', role: 'driver', estimatedTime: '1 hour' },
      {
        name: 'Technician Sign-off',
        role: 'technician',
        estimatedTime: '2 hours',
      },
      { name: 'Manager Approval', role: 'manager', estimatedTime: '24 hours' },
    ],
    usageCount: 34,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper functions
export const getDocumentById = (id: string): Document | undefined => {
  return demoDocuments.find((doc) => doc.id === id);
};

export const getDocumentsByStatus = (status: DocumentStatus): Document[] => {
  return demoDocuments.filter((doc) => doc.status === status);
};

export const getDocumentsByType = (type: DocumentType): Document[] => {
  return demoDocuments.filter((doc) => doc.type === type);
};

export const getDocumentsByUser = (userId: string): Document[] => {
  return demoDocuments.filter(
    (doc) =>
      doc.metadata.sender.id === userId ||
      doc.metadata.recipients.some((recipient) => recipient.id === userId)
  );
};

export const getDocumentsByWorkflowStatus = (
  status: WorkflowStatus
): Document[] => {
  return demoDocuments.filter((doc) => doc.workflow.status === status);
};

export const searchDocuments = (query: string): Document[] => {
  const lowercaseQuery = query.toLowerCase();
  return demoDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(lowercaseQuery) ||
      doc.metadata.tags.some((tag) =>
        tag.toLowerCase().includes(lowercaseQuery)
      ) ||
      doc.metadata.sender.fullName.toLowerCase().includes(lowercaseQuery) ||
      doc.metadata.recipients.some((recipient) =>
        recipient.fullName.toLowerCase().includes(lowercaseQuery)
      )
  );
};

export const getDocumentStats = () => {
  const total = demoDocuments.length;
  const pending = demoDocuments.filter(
    (doc) => doc.status === 'pending_signature'
  ).length;
  const signed = demoDocuments.filter(
    (doc) => doc.status === 'fully_signed'
  ).length;
  const expired = demoDocuments.filter((doc) => {
    const dueDate = new Date(doc.metadata.dueDate);
    return dueDate < new Date() && doc.status !== 'fully_signed';
  }).length;

  return { total, pending, signed, expired };
};
