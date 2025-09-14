import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { phoneNumber: string } },
) {
  try {
    const { phoneNumber } = params;

    // Forward the request to the LiveKit service through the API Gateway
    const apiGatewayUrl =
      process.env.API_GATEWAY_URL || 'http://api-gateway:8000';
    const response = await fetch(
      `${apiGatewayUrl}/api/calls/history/${encodeURIComponent(phoneNumber)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`LiveKit service responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching call history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch call history' },
      { status: 500 },
    );
  }
}
