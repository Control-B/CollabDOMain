import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { callId: string } },
) {
  try {
    const body = await request.json();
    const { callId } = params;

    // Forward the request to the LiveKit service through the API Gateway
    const apiGatewayUrl =
      process.env.API_GATEWAY_URL || 'http://api-gateway:8000';
    const response = await fetch(`${apiGatewayUrl}/api/calls/${callId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`LiveKit service responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error joining call:', error);
    return NextResponse.json({ error: 'Failed to join call' }, { status: 500 });
  }
}
