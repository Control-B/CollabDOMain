import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo
let mobileCheckins: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📱 Mobile check-in received:', body);
    
    // Create a new driver check-in
    const newCheckin = {
      id: `mobile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      driverName: body.driverName || 'Unknown Driver',
      company: body.company || 'Mobile Check-in',
      poOrTripNumber: body.tripId || body.poNumber || 'PO-UNKNOWN',
      pickupNumber: body.pickupLocation || 'Unknown Location',
      deliveryNumber: body.deliveryLocation || 'Unknown Delivery',
      appointmentISO: new Date().toISOString(),
      vehicleTruckId: body.vehicleId || 'UNKNOWN',
      vehicleTrailerId: body.trailerNumber || '',
      telephone: body.phoneNumber || '+1 (555) 000-0000',
      vehicleId: body.vehicleId || 'UNKNOWN',
      direction: body.direction || 'inbound',
      timestamp: new Date().toISOString(),
      isOverride: body.isOverride || false,
      overrideReason: body.overrideReason || 'None'
    };

    // Store the check-in
    mobileCheckins.unshift(newCheckin);
    
    // Keep only the last 50 check-ins
    if (mobileCheckins.length > 50) {
      mobileCheckins = mobileCheckins.slice(0, 50);
    }

    console.log('✅ Check-in stored successfully. Total check-ins:', mobileCheckins.length);

    return NextResponse.json({ 
      success: true, 
      checkin: newCheckin,
      message: 'Mobile check-in received successfully',
      total: mobileCheckins.length
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('❌ Error processing mobile check-in:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process mobile check-in' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('📱 Fetching mobile check-ins. Total:', mobileCheckins.length);
    
    return NextResponse.json(mobileCheckins, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('❌ Error fetching mobile check-ins:', error);
    return NextResponse.json([], {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}