// Use a global variable to persist data across module reloads in dev mode
declare global {
  var __persistentNotifications: any[] | undefined;
}

// Temporary mock data for testing notification deletion
let mockNotifications: any[] = global.__persistentNotifications || [];

// Initialize with some sample data only if empty AND this is the first load
if (mockNotifications.length === 0 && !global.__persistentNotifications) {
  mockNotifications = [
  {
    id: 'test-notification-1',
    type: 'geofence_checkin',
    title: 'Driver arrived at pickup',
    message: 'Driver John Smith at ACME Warehouse',
    tripSheet: {
      tripNumber: 'TS-1001',
      driverName: 'John Smith',
      driverPhone: '+1-555-0123',
      vehicleNumber: 'TRK-001',
      trailerNumber: 'TRL-010',
      pickupLocationName: 'ACME Warehouse',
      pickupAddress: '123 Main St, City, ST',
      pickupPoNumber: 'PO-12345',
      deliveryLocationName: 'Retail DC',
      deliveryAddress: '987 Market Rd, City, ST',
      loadDescription: 'Electronics',
      pickupAppointmentDate: new Date().toISOString(),
    },
    location: { 
      name: 'ACME Warehouse', 
      address: '123 Main St, City, ST',
      phone: '+1-555-0100'
    },
    checkInDetails: {
      checkInType: 'pickup_arrival',
      timestamp: new Date().toISOString(),
      latitude: 37.7749,
      longitude: -122.4194,
      distanceFromCenter: 45
    },
    recipients: [],
    createdAt: new Date().toISOString(),
    isRead: false,
    channelCreated: false,
  },
  {
    id: 'test-notification-2',
    type: 'geofence_checkin',
    title: 'Driver arrived at delivery',
    message: 'Driver Jane Doe at Customer Site',
    tripSheet: {
      tripNumber: 'TS-1002',
      driverName: 'Jane Doe',
      driverPhone: '+1-555-0456',
      vehicleNumber: 'TRK-002',
      trailerNumber: 'TRL-020',
      pickupLocationName: 'Distribution Center',
      pickupAddress: '456 Industrial Blvd, City, ST',
      pickupPoNumber: 'PO-67890',
      deliveryLocationName: 'Customer Site',
      deliveryAddress: '789 Customer Ave, City, ST',
      loadDescription: 'Furniture',
      pickupAppointmentDate: new Date().toISOString(),
    },
    location: { 
      name: 'Customer Site', 
      address: '789 Customer Ave, City, ST',
      phone: '+1-555-0200'
    },
    checkInDetails: {
      checkInType: 'delivery_arrival',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
      latitude: 37.7849,
      longitude: -122.4094,
      distanceFromCenter: 30
    },
    recipients: [],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: true,
    channelCreated: false,
  }
  ];
  
  // Persist to global for dev mode hot reloading
  global.__persistentNotifications = mockNotifications;
}

// Always sync with global
global.__persistentNotifications = mockNotifications;

export { mockNotifications };


