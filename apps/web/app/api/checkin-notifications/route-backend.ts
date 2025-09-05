import { NextRequest, NextResponse } from 'next/server';

// Proxy to the real C# backend notification service
const BACKEND_URL = process.env.DMS_CORE_URL || 'http://localhost:5000';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Forward query parameters to backend
    const backendUrl = new URL('/api/notifications/checkin', BACKEND_URL);
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward auth headers if present
        ...(req.headers.get('authorization') && {
          'Authorization': req.headers.get('authorization')!
        })
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const notifications = await response.json();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications from backend:', error);
    
    // Fallback to empty array if backend is unavailable
    return NextResponse.json([]);
  }
}
