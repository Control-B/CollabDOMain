import { NextRequest, NextResponse } from 'next/server';
import { mockNotifications } from '@/lib/mock-notifications';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  console.log('📖 Marking notification as read:', id);
  
  const notification = mockNotifications.find((x: any) => x.id === id);
  if (!notification) {
    console.log('❌ Notification not found:', id);
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  
  notification.isRead = true;
  console.log('✅ Notification marked as read:', id);
  
  return NextResponse.json({ ok: true });
}
