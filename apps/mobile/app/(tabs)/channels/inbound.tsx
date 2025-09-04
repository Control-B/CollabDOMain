import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Truck,
  Search,
  Filter,
  ChevronRight,
  MapPin,
  Calendar,
  Package,
  ClipboardCheck,
} from 'lucide-react-native';

interface InboundShipment {
  id: string;
  reference: string;
  supplier: string;
  eta: string;
  status: 'Arrived' | 'In Transit' | 'Delayed' | 'Scheduled';
  pallets: number;
  items: number;
  warehouse: string;
}

export default function InboundChannelsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter] = useState<'all' | InboundShipment['status']>('all');
  const router = useRouter();

  const shipments: InboundShipment[] = [
    {
      id: 'INB-001',
      reference: 'PO-2025-0456',
      supplier: 'Skyline Electronics',
      eta: 'Today, 14:30',
      status: 'Arrived',
      pallets: 12,
      items: 240,
      warehouse: 'Warehouse A',
    },
    {
      id: 'INB-002',
      reference: 'PO-2025-0457',
      supplier: 'Crescent Textiles',
      eta: 'Tomorrow, 09:00',
      status: 'Scheduled',
      pallets: 20,
      items: 400,
      warehouse: 'Warehouse B',
    },
    {
      id: 'INB-003',
      reference: 'PO-2025-0458',
      supplier: 'Northwind Traders',
      eta: 'Delayed - ETA TBD',
      status: 'Delayed',
      pallets: 8,
      items: 160,
      warehouse: 'Warehouse A',
    },
  ];

  const filteredShipments = shipments.filter((s) => {
    const matchesQuery =
      s.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : s.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleShipmentPress = (shipment: InboundShipment) => {
    router.push(`/trip-details/${shipment.id}`);
  };

  const StatusPill = ({ status }: { status: InboundShipment['status'] }) => {
    const colors: Record<InboundShipment['status'], string> = {
      Arrived: '#10B981',
      'In Transit': '#3B82F6',
      Delayed: '#EF4444',
      Scheduled: '#F59E0B',
    };
    return (
      <View
        style={[styles.statusPill, { backgroundColor: colors[status] + '20' }]}
      >
        <Text style={[styles.statusText, { color: colors[status] }]}>
          {status}
        </Text>
      </View>
    );
  };

  const renderShipment = ({ item }: { item: InboundShipment }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleShipmentPress(item)}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconWrap}>
          <Truck size={20} color="#3B82F6" />
        </View>
        <View>
          <Text style={styles.reference}>{item.reference}</Text>
          <View style={styles.row}>
            <MapPin size={12} color="#9CA3AF" />
            <Text style={styles.meta}>{item.warehouse}</Text>
          </View>
          <View style={styles.row}>
            <Calendar size={12} color="#9CA3AF" />
            <Text style={styles.meta}>{item.eta}</Text>
          </View>
          <View style={styles.row}>
            <Package size={12} color="#9CA3AF" />
            <Text style={styles.meta}>
              {item.pallets} pallets • {item.items} items
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardRight}>
        <StatusPill status={item.status} />
        <ChevronRight size={18} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search reference or supplier"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Filter size={16} color="#9CA3AF" />
        </View>
      </View>

      <FlatList
        data={filteredShipments}
        keyExtractor={(item) => item.id}
        renderItem={renderShipment}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.cta}
        onPress={() =>
          Alert.alert('Start Check-in', 'Initiate inbound check-in flow')
        }
      >
        <ClipboardCheck size={18} color="#FFFFFF" />
        <Text style={styles.ctaText}>Start Inbound Check-in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  searchRow: { padding: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: { flex: 1, color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#3B82F6' + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reference: { color: '#FFFFFF', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  meta: { color: '#9CA3AF', fontSize: 12 },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 12, fontWeight: '600' },
  cta: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: { color: '#FFFFFF', fontWeight: '600' },
});
