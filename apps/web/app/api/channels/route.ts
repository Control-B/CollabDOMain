import { NextRequest, NextResponse } from 'next/server';
import { loadChannels } from '../../lib/channelsStore';

export async function GET(request: NextRequest) {
  try {
    const channels = loadChannels();
    
    // Filter channels to only show relevant ones for mobile
    const mobileChannels = channels.map(channel => ({
      id: channel.name,
      name: channel.name,
      description: channel.description,
      category: channel.category,
      poNumber: channel.poNumber,
      vehicleNumber: channel.vehicleNumber,
      doorNumber: channel.doorNumber,
      members: channel.members,
      createdAt: channel.createdAt,
      // Add mobile-specific fields
      driverName: channel.vehicleNumber ? `Driver for ${channel.vehicleNumber}` : 'General Channel',
      status: channel.doorStatus === 'green' ? 'active' : 'inactive',
      unreadCount: Math.floor(Math.random() * 5), // Mock unread count for demo
    }));

    return NextResponse.json(mobileChannels, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error fetching channels:', error);
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
