import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { callId: string } },
) {
  try {
    const { callId } = params;

    // Forward the request to the LiveKit service through the API Gateway
    const apiGatewayUrl =
      process.env.API_GATEWAY_URL || 'http://api-gateway:8000';
    const response = await fetch(`${apiGatewayUrl}/api/calls/${callId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`LiveKit service responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error ending call:', error);
    return NextResponse.json({ error: 'Failed to end call' }, { status: 500 });
  }
}
