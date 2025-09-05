import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(req: NextRequest) {
  console.log('📱 Fetching mock notifications, count:', mockNotifications.length);
  return NextResponse.json(mockNotifications);
}

export async function POST(req: NextRequest) {
  try {
    const checkInData = await req.json();
    console.log('📱 Received new check-in from mobile app:', checkInData);
    
    // Create a new notification from the mobile check-in data
    const newNotification = {
      id: `checkin-${Date.now()}`,
      type: 'mobile_checkin',
      title: `Driver ${checkInData.type} check-in${checkInData.isGeofenceOverride ? ' (Override)' : ''}`,
      message: `Driver ${checkInData.driverName} checked in at ${checkInData.companyName}${checkInData.isGeofenceOverride ? ' - OVERRIDE USED' : ''}`,
      tripSheet: {
        tripNumber: `TS-${Math.floor(Math.random() * 9999)}`,
        driverName: checkInData.driverName,
        driverPhone: checkInData.phoneNumber,
        vehicleNumber: checkInData.vehicleId,
        trailerNumber: checkInData.trailerNumber || '',
        pickupLocationName: checkInData.companyName,
        pickupAddress: checkInData.pickupAddress || checkInData.deliveryAddress || '',
        pickupPoNumber: checkInData.poNumber,
        deliveryLocationName: checkInData.type === 'outbound' ? 'Delivery Location' : checkInData.companyName,
        deliveryAddress: checkInData.type === 'outbound' ? checkInData.deliveryAddress || '' : '',
        loadDescription: checkInData.loadType || 'General Freight',
        pickupAppointmentDate: checkInData.appointmentDate && checkInData.appointmentTime 
          ? `${checkInData.appointmentDate}T${checkInData.appointmentTime}:00.000Z`
          : new Date().toISOString(),
      },
      location: { 
        name: checkInData.companyName,
        address: checkInData.pickupAddress || checkInData.deliveryAddress || '',
        phone: checkInData.pickupPhone || checkInData.deliveryPhone || ''
      },
      checkInDetails: {
        checkInType: checkInData.type === 'outbound' ? 'delivery_arrival' : 'pickup_arrival',
        timestamp: checkInData.submittedAt,
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01, // Random nearby location
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
        distanceFromCenter: Math.floor(Math.random() * 100)
      },
      recipients: [],
      createdAt: new Date().toISOString(),
      isRead: false,
      channelCreated: false,
      isGeofenceOverride: checkInData.isGeofenceOverride || false,
      overrideReason: checkInData.overrideReason || null,
    };
    
    // Add to the beginning of the array (most recent first)
    mockNotifications.unshift(newNotification);
    
    // Update global persistence
    global.__persistentNotifications = mockNotifications;
    
    console.log('✅ Created new notification:', newNotification.id);
    return NextResponse.json({ success: true, notification: newNotification });
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export { mockNotifications };
