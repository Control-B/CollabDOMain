'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  DriverCheckin,
  getCheckinByVehicle,
} from '../../lib/driverCheckinsStore';

export default function DriverPage() {
  const params = useParams<{ vehicleId: string }>();
  const vehicleId = decodeURIComponent(params.vehicleId || '');
  const [checkin, setCheckin] = useState<DriverCheckin | null>(null);

  useEffect(() => {
    setCheckin(getCheckinByVehicle(vehicleId));
  }, [vehicleId]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Driver</h1>
          <Link
            href="/chat"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Chat
          </Link>
        </div>

        {!checkin ? (
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <div className="text-gray-300">
              No driver found for vehicle ID “{vehicleId}”.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Driver name" value={checkin.driverName} />
                <Field label="Company" value={checkin.company} />
                <Field label="PO/Trip #" value={checkin.poOrTripNumber} />
                <Field label="Pickup #" value={checkin.pickupNumber} />
                <Field label="Delivery #" value={checkin.deliveryNumber} />
                <Field
                  label="Appointment"
                  value={
                    checkin.appointmentISO
                      ? new Date(checkin.appointmentISO).toLocaleString()
                      : ''
                  }
                />
                <Field label="Truck ID" value={checkin.vehicleTruckId} />
                <Field label="Trailer ID" value={checkin.vehicleTrailerId} />
                <Field label="Telephone" value={checkin.telephone} />
                <Field label="Direction" value={checkin.direction} />
                <Field label="Vehicle (link key)" value={checkin.vehicleId} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-gray-200">{value || '—'}</div>
    </div>
  );
}
