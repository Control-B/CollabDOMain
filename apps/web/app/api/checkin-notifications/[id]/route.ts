import { NextRequest, NextResponse } from 'next/server';

// Access the global persistent notifications
declare global {
  var __persistentNotifications: any[] | undefined;
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  console.log('🗑️ Deleting notification:', id);
  
  // Get current notifications from global
  const mockNotifications = global.__persistentNotifications || [];
  
  const idx = mockNotifications.findIndex((n: any) => n.id === id);
  if (idx === -1) {
    console.log('❌ Notification not found:', id);
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  
  const removed = mockNotifications.splice(idx, 1);
  
  // Update global persistence
  global.__persistentNotifications = mockNotifications;
  
  console.log('✅ Notification deleted:', removed[0]?.id);
  console.log('📊 Remaining notifications:', mockNotifications.length);
  
  return NextResponse.json({ ok: true, deleted: removed[0]?.id });
}
