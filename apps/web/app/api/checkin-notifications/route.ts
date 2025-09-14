import { NextRequest, NextResponse } from 'next/server';
import { mockNotifications } from '@/lib/mock-notifications';

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

// mockNotifications is available for internal use only
