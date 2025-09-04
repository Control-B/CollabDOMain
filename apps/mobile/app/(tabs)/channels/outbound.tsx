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
  Search,
  Filter,
  ChevronRight,
  MapPin,
  Calendar,
  Package,
  ClipboardCheck,
  Share2,
} from 'lucide-react-native';

interface OutboundShipment {
  id: string;
  reference: string;
  customer: string;
  etd: string;
  status: 'Ready' | 'Loading' | 'Dispatched' | 'Delayed';
  pallets: number;
  items: number;
  dock: string;
}

export default function OutboundChannelsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter] = useState<'all' | OutboundShipment['status']>('all');
  const router = useRouter();

  const shipments: OutboundShipment[] = [
    {
      id: 'OUT-101',
      reference: 'SO-2025-1201',
      customer: 'Contoso Retail',
      etd: 'Today, 16:00',
      status: 'Loading',
      pallets: 15,
      items: 300,
      dock: 'Dock 3',
    },
    {
      id: 'OUT-102',
      reference: 'SO-2025-1202',
      customer: 'Fabrikam Foods',
      etd: 'Tomorrow, 10:30',
      status: 'Ready',
      pallets: 10,
      items: 200,
      dock: 'Dock 1',
    },
    {
      id: 'OUT-103',
      reference: 'SO-2025-1203',
      customer: 'Adventure Works',
      etd: 'Today, 18:45',
      status: 'Dispatched',
      pallets: 22,
      items: 440,
      dock: 'Dock 2',
    },
  ];

  const filteredShipments = shipments.filter((s) => {
    const matchesQuery =
      s.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : s.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleShipmentPress = (shipment: OutboundShipment) => {
    router.push(`/trip-details/${shipment.id}`);
  };

  const StatusPill = ({ status }: { status: OutboundShipment['status'] }) => {
    const colors: Record<OutboundShipment['status'], string> = {
      Ready: '#10B981',
      Loading: '#3B82F6',
      Dispatched: '#8B5CF6',
      Delayed: '#EF4444',
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

  const renderShipment = ({ item }: { item: OutboundShipment }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleShipmentPress(item)}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconWrap}>
          <Share2 size={20} color="#3B82F6" />
        </View>
        <View>
          <Text style={styles.reference}>{item.reference}</Text>
          <View style={styles.row}>
            <MapPin size={12} color="#9CA3AF" />
            <Text style={styles.meta}>{item.dock}</Text>
          </View>
          <View style={styles.row}>
            <Calendar size={12} color="#9CA3AF" />
            <Text style={styles.meta}>{item.etd}</Text>
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
            placeholder="Search reference or customer"
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
          Alert.alert('Start Check-out', 'Initiate outbound check-out flow')
        }
      >
        <ClipboardCheck size={18} color="#FFFFFF" />
        <Text style={styles.ctaText}>Start Outbound Check-out</Text>
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
