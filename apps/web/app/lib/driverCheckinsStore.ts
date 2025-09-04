export type DriverCheckin = {
  id: string;
  driverName: string;
  company: string;
  poOrTripNumber?: string;
  pickupNumber?: string;
  deliveryNumber?: string;
  appointmentISO?: string; // ISO date-time
  vehicleTruckId?: string;
  vehicleTrailerId?: string;
  telephone?: string;
  vehicleId: string; // primary identifier for linking
  direction: 'inbound' | 'outbound';
};

const STORAGE_KEY = 'driverCheckins';

function seedIfEmpty() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return;
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    const demo: DriverCheckin[] = [
      {
        id: 'chk-1',
        driverName: 'Alice Smith',
        company: 'RoadRunner Freight',
        poOrTripNumber: 'PO-88421',
        pickupNumber: 'PU-1102',
        deliveryNumber: 'DL-2208',
        appointmentISO: inOneHour.toISOString(),
        vehicleTruckId: 'TRK-001',
        vehicleTrailerId: 'TRL-19B',
        telephone: '+1 (555) 123-9876',
        vehicleId: 'TRK-001',
        direction: 'inbound',
      },
      {
        id: 'chk-2',
        driverName: 'David Lee',
        company: 'BigRig Co',
        poOrTripNumber: 'TRIP-772',
        appointmentISO: new Date(
          now.getTime() + 2 * 60 * 60 * 1000,
        ).toISOString(),
        vehicleTruckId: 'BIG-RIG-303',
        vehicleTrailerId: 'TRL-77Z',
        telephone: '+1 (555) 888-1001',
        vehicleId: 'BIG-RIG-303',
        direction: 'outbound',
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  } catch {}
}

export function listCheckins(): DriverCheckin[] {
  seedIfEmpty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DriverCheckin[]) : [];
  } catch {
    return [];
  }
}

export function getCheckinByVehicle(vehicleId: string): DriverCheckin | null {
  if (!vehicleId) return null;
  const all = listCheckins();
  return (
    all.find((c) => c.vehicleId.toLowerCase() === vehicleId.toLowerCase()) ||
    null
  );
}

export function upsertCheckin(c: DriverCheckin) {
  try {
    const all = listCheckins();
    const i = all.findIndex((x) => x.id === c.id);
    if (i >= 0) all[i] = c;
    else all.push(c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

export function clearAllCheckins() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
