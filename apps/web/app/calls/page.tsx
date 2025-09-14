'use client';

import React from 'react';
import { CallManager } from '@/components/CallManager';

export default function CallsPage() {
  // In a real app, this would come from authentication context
  const userPhoneNumber = '+1234567890'; // This should be dynamic

  return (
    <div className="min-h-screen bg-gray-50">
      <CallManager userPhoneNumber={userPhoneNumber} />
    </div>
  );
}


