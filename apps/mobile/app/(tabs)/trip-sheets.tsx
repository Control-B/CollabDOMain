import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Activity,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';

// removed unused width

interface TripSheet {
  id: string;
  tripNumber: string;
  status: 'current' | 'upcoming' | 'completed';
  driverName: string;
  vehicleId: string;
  trailerNumber: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupTime: string;
  deliveryTime: string;
  cargo: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  isStarred?: boolean;
  lastUpdate: string;
}

export default function TripSheetsScreen() {
  const [activeTab, setActiveTab] = useState('current');
  const router = useRouter();

  const tripSheets: TripSheet[] = [
    {
      id: '1',
      tripNumber: 'TS-2024-001',
      status: 'current',
      driverName: 'John Smith',
      vehicleId: 'TRK-001',
      trailerNumber: 'TRL-456',
      pickupLocation: 'Warehouse A - Chicago, IL',
      deliveryLocation: 'Distribution Center - Dallas, TX',
      pickupTime: '08:00 AM',
      deliveryTime: '02:30 PM',
      cargo: 'Electronics - 15 pallets',
      priority: 'high',
      progress: 65,
      isStarred: true,
      lastUpdate: '10 min ago',
    },
    {
      id: '2',
      tripNumber: 'TS-2024-002',
      status: 'upcoming',
      driverName: 'Maria Garcia',
      vehicleId: 'TRK-002',
      trailerNumber: 'TRL-789',
      pickupLocation: 'Supplier Hub - Phoenix, AZ',
      deliveryLocation: 'Main Warehouse - Austin, TX',
      pickupTime: '10:00 AM',
      deliveryTime: '04:45 PM',
      cargo: 'Auto Parts - 8 pallets',
      priority: 'medium',
      progress: 0,
      lastUpdate: '2 hours ago',
    },
    {
      id: '3',
      tripNumber: 'TS-2024-003',
      status: 'completed',
      driverName: 'Robert Johnson',
      vehicleId: 'TRK-003',
      trailerNumber: 'TRL-123',
      pickupLocation: 'Port Terminal - Houston, TX',
      deliveryLocation: 'Regional Hub - San Antonio, TX',
      pickupTime: '06:00 AM',
      deliveryTime: '12:00 PM',
      cargo: 'Industrial Equipment - 12 pallets',
      priority: 'low',
      progress: 100,
      lastUpdate: 'Yesterday',
    },
  ];

  const tabs = [
    {
      id: 'current',
      label: 'Current',
      count: tripSheets.filter((t) => t.status === 'current').length,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: tripSheets.filter((t) => t.status === 'upcoming').length,
    },
    {
      id: 'completed',
      label: 'Past Trips',
      count: tripSheets.filter((t) => t.status === 'completed').length,
    },
  ];

  const filteredTrips = tripSheets.filter((trip) =>
    activeTab === 'current'
      ? trip.status === 'current'
      : activeTab === 'upcoming'
      ? trip.status === 'upcoming'
      : trip.status === 'completed'
  );

  const statusConfig = {
    current: { color: '#3B82F6', label: 'In Progress' },
    upcoming: { color: '#F59E0B', label: 'Scheduled' },
    completed: { color: '#10B981', label: 'Completed' },
  } as const;
  const priorityConfig = {
    low: { color: '#10B981', label: 'Low' },
    medium: { color: '#F59E0B', label: 'Medium' },
    high: { color: '#EF4444', label: 'High' },
  } as const;

  const handleTripPress = (trip: TripSheet) => {
    router.push(`/trip-details/${trip.id}`);
  };
  const handleCreateTrip = () => {
    router.push('/create-trip');
  };
  const handleEditTrip = (tripId: string) => {
    Alert.alert('Edit Trip', `Edit trip ${tripId}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK' },
    ]);
  };
  const handleDeleteTrip = (tripId: string) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip sheet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const renderTripCard = ({ item }: { item: TripSheet }) => {
    const statusInfo = statusConfig[item.status];
    const priorityInfo = priorityConfig[item.priority];
    return (
      <TouchableOpacity
        style={[
          styles.tripCard,
          item.priority === 'high' && styles.tripCardHighPriority,
        ]}
        onPress={() => handleTripPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.tripContent}>
          <View style={styles.tripHeader}>
            <View style={styles.tripTitleRow}>
              <Text style={styles.tripNumber}>{item.tripNumber}</Text>
              <View style={styles.tripMeta}>
                {item.isStarred && <Text style={styles.starText}>★</Text>}
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: priorityInfo.color + '20' },
                  ]}
                >
                  <Text
                    style={[styles.priorityText, { color: priorityInfo.color }]}
                  >
                    {priorityInfo.label}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusInfo.color + '20' },
                ]}
              >
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {statusInfo.label}
                </Text>
              </View>
              <Text style={styles.lastUpdate}>{item.lastUpdate}</Text>
            </View>
          </View>
          {item.status === 'current' && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Trip Progress</Text>
                <Text style={styles.progressPercent}>{item.progress}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${item.progress}%`,
                      backgroundColor: statusInfo.color,
                    },
                  ]}
                />
              </View>
            </View>
          )}
          <View style={styles.driverSection}>
            <View style={styles.driverInfo}>
              <View style={styles.driverIcon}>
                <Text style={styles.driverIconText}>D</Text>
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{item.driverName}</Text>
                <Text style={styles.vehicleInfo}>
                  {item.vehicleId} • {item.trailerNumber}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.routeSection}>
            <View style={styles.routeItem}>
              <View style={styles.routeDetails}>
                <Text style={styles.routeLabel}>Pickup</Text>
                <Text style={styles.routeLocation} numberOfLines={1}>
                  {item.pickupLocation}
                </Text>
                <Text style={styles.routeTime}>{item.pickupTime}</Text>
              </View>
            </View>
            <View style={styles.routeDivider}>
              <View style={styles.routeLine} />
              <View style={styles.routeLine} />
            </View>
            <View style={styles.routeItem}>
              <View style={styles.routeDetails}>
                <Text style={styles.routeLabel}>Delivery</Text>
                <Text style={styles.routeLocation} numberOfLines={1}>
                  {item.deliveryLocation}
                </Text>
                <Text style={styles.routeTime}>{item.deliveryTime}</Text>
              </View>
            </View>
          </View>
          <View style={styles.cargoSection}>
            <Text style={styles.cargoText}>{item.cargo}</Text>
          </View>
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: '#3B82F6' + '20' },
              ]}
              onPress={() => handleEditTrip(item.id)}
            >
              <Text style={[styles.actionText, { color: '#3B82F6' }]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: '#EF4444' + '20' },
              ]}
              onPress={() => handleDeleteTrip(item.id)}
            >
              <Text style={[styles.actionText, { color: '#EF4444' }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickStat = (
    label: string,
    value: string,
    color: string,
    icon: any
  ) => {
    const IconComponent = icon;
    return (
      <View style={[styles.statCard, { backgroundColor: color + '20' }]}>
        <IconComponent size={20} color={color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d29" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>Trip Sheets</Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateTrip}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          style={styles.statsContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContent}
        >
          {renderQuickStat(
            'Total',
            tripSheets.length.toString(),
            '#6B7280',
            Calendar
          )}
          {renderQuickStat(
            'Active',
            tripSheets.filter((t) => t.status === 'current').length.toString(),
            '#3B82F6',
            Activity
          )}
          {renderQuickStat(
            'Completed',
            tripSheets
              .filter((t) => t.status === 'completed')
              .length.toString(),
            '#10B981',
            CheckCircle
          )}
          {renderQuickStat(
            'High Priority',
            tripSheets.filter((t) => t.priority === 'high').length.toString(),
            '#EF4444',
            AlertCircle
          )}
        </ScrollView>
        <ScrollView
          horizontal
          style={styles.tabsContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  activeTab === tab.id && styles.tabBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    activeTab === tab.id && styles.tabBadgeTextActive,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.content}>
        <FlatList
          data={filteredTrips}
          renderItem={renderTripCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tripsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1d29' },
  header: {
    backgroundColor: '#1a1d29',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { marginRight: 16 },
  headerTitle: { flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#4B5563', marginTop: 2 },
  createButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: { marginHorizontal: -20, marginBottom: 16 },
  statsContent: { paddingHorizontal: 20, gap: 12 },
  statCard: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statLabel: { fontSize: 10, color: '#4B5563', marginTop: 2 },
  tabsContainer: { marginHorizontal: -20 },
  tabsContent: { paddingHorizontal: 20, gap: 12 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabActive: { backgroundColor: '#3B82F6' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#4B5563' },
  tabTextActive: { color: '#FFFFFF' },
  tabBadge: {
    backgroundColor: '#374151',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeActive: { backgroundColor: '#FFFFFF' + '30' },
  tabBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#4B5563' },
  tabBadgeTextActive: { color: '#FFFFFF' },
  content: { flex: 1 },
  tripsList: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  tripCard: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tripCardHighPriority: { borderTopWidth: 3, borderTopColor: '#EF4444' },
  tripContent: { padding: 16 },
  tripHeader: { marginBottom: 16 },
  tripTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripNumber: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  tripMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  priorityText: { fontSize: 10, fontWeight: 'bold' },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  lastUpdate: { fontSize: 12, color: '#374151' },
  progressSection: { marginBottom: 16 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  progressPercent: { fontSize: 14, color: '#3B82F6', fontWeight: 'bold' },
  progressBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  driverSection: { marginBottom: 16 },
  driverInfo: { flexDirection: 'row', alignItems: 'center' },
  driverIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverIconText: { fontSize: 14, fontWeight: 'bold', color: '#3B82F6' },
  starText: { fontSize: 14, color: '#F59E0B', marginRight: 8 },
  driverDetails: { flex: 1 },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  vehicleInfo: { fontSize: 12, color: '#4B5563' },
  routeSection: { marginBottom: 16 },
  routeItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  routeDetails: { flex: 1 },
  routeLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  routeLocation: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  routeTime: { fontSize: 12, color: '#4B5563' },
  routeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginLeft: 7,
  },
  routeLine: { flex: 1, height: 1, backgroundColor: '#374151' },
  cargoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  cargoText: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  actionsSection: { flexDirection: 'row', gap: 12 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionText: { fontSize: 14, fontWeight: '600' },
});
