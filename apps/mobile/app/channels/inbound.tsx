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
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Phone,
} from 'lucide-react-native';

// Removed unused width to satisfy linter

interface InboundTrip {
  id: string;
  tripNumber: string;
  driverName: string;
  pickupLocation: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'arrived' | 'completed';
  priority: 'low' | 'medium' | 'high';
  scheduledTime: string;
  estimatedArrival: string;
  cargo: string;
  driverPhone: string;
  unreadMessages: number;
  isStarred?: boolean;
}

export default function InboundChannelsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();

  const inboundTrips: InboundTrip[] = [
    {
      id: '1',
      tripNumber: 'INB-2024-001',
      driverName: 'John Smith',
      pickupLocation: 'Warehouse A - Chicago, IL',
      destination: 'Distribution Center - Dallas, TX',
      status: 'in_transit',
      priority: 'high',
      scheduledTime: '08:00 AM',
      estimatedArrival: '2:30 PM',
      cargo: 'Electronics - 15 pallets',
      driverPhone: '+1 (555) 123-4567',
      unreadMessages: 3,
      isStarred: true,
    },
    {
      id: '2',
      tripNumber: 'INB-2024-002',
      driverName: 'Maria Garcia',
      pickupLocation: 'Supplier Hub - Phoenix, AZ',
      destination: 'Main Warehouse - Austin, TX',
      status: 'arrived',
      priority: 'medium',
      scheduledTime: '10:00 AM',
      estimatedArrival: 'Arrived',
      cargo: 'Auto Parts - 8 pallets',
      driverPhone: '+1 (555) 987-6543',
      unreadMessages: 1,
    },
    {
      id: '3',
      tripNumber: 'INB-2024-003',
      driverName: 'Robert Johnson',
      pickupLocation: 'Port Terminal - Houston, TX',
      destination: 'Regional Hub - San Antonio, TX',
      status: 'pending',
      priority: 'low',
      scheduledTime: '02:00 PM',
      estimatedArrival: '6:45 PM',
      cargo: 'Industrial Equipment - 12 pallets',
      driverPhone: '+1 (555) 456-7890',
      unreadMessages: 0,
    },
  ];

  const statusConfig = {
    pending: { color: '#F59E0B', label: 'Pending' },
    in_transit: { color: '#3B82F6', label: 'In Transit' },
    arrived: { color: '#10B981', label: 'Arrived' },
    completed: { color: '#6B7280', label: 'Completed' },
  };

  const priorityConfig = {
    low: { color: '#10B981', label: 'Low' },
    medium: { color: '#F59E0B', label: 'Medium' },
    high: { color: '#EF4444', label: 'High' },
  };

  const filters = [
    { id: 'all', label: 'All Trips', count: inboundTrips.length },
    {
      id: 'pending',
      label: 'Pending',
      count: inboundTrips.filter((t) => t.status === 'pending').length,
    },
    {
      id: 'in_transit',
      label: 'In Transit',
      count: inboundTrips.filter((t) => t.status === 'in_transit').length,
    },
    {
      id: 'arrived',
      label: 'Arrived',
      count: inboundTrips.filter((t) => t.status === 'arrived').length,
    },
  ];

  const filteredTrips = inboundTrips.filter(
    (trip) =>
      trip.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTripPress = (trip: InboundTrip) => {
    router.push(`/chat/${trip.id}`);
  };

  const handleCreateCheckIn = () => {
    router.push('/checkin/inbound');
  };

  const handleCallDriver = (phone: string) => {
    Alert.alert('Call Driver', `Call ${phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => Alert.alert('Calling...', `Dialing ${phone}`),
      },
    ]);
  };

  const renderTripCard = ({ item }: { item: InboundTrip }) => {
    const statusInfo = statusConfig[item.status];
    const priorityInfo = priorityConfig[item.priority];

    return (
      <TouchableOpacity
        style={[
          styles.tripCard,
          item.unreadMessages > 0 && styles.tripCardUnread,
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
              <Text style={styles.estimatedTime}>{item.estimatedArrival}</Text>
            </View>
          </View>

          <View style={styles.driverSection}>
            <View style={styles.driverInfo}>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{item.driverName}</Text>
                <TouchableOpacity
                  style={styles.phoneButton}
                  onPress={() => handleCallDriver(item.driverPhone)}
                >
                  <Phone size={12} color="#10B981" />
                  <Text style={styles.phoneText}>{item.driverPhone}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.routeSection}>
            <View style={styles.routeItem}>
              <Text style={styles.routeText} numberOfLines={1}>
                From: {item.pickupLocation}
              </Text>
            </View>
            <View style={styles.routeItem}>
              <Text style={styles.routeText} numberOfLines={1}>
                To: {item.destination}
              </Text>
            </View>
          </View>

          <View style={styles.cargoSection}>
            <Text style={styles.cargoText}>{item.cargo}</Text>
          </View>

          <View style={styles.tripFooter}>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleText}>
                Scheduled: {item.scheduledTime}
              </Text>
            </View>

            <View style={styles.tripActions}>
              {item.unreadMessages > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadMessages}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.actionButton}>
                <MoreHorizontal size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickStat = (label: string, value: string, color: string) => {
    return (
      <View style={[styles.statCard, { backgroundColor: color + '20' }]}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d29" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Inbound Trips</Text>
            <Text style={styles.subtitle}>Incoming shipments & pickups</Text>
          </View>
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={handleCreateCheckIn}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <ScrollView
          horizontal
          style={styles.statsContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContent}
        >
          {renderQuickStat('Total', inboundTrips.length.toString(), '#3B82F6')}
          {renderQuickStat(
            'In Transit',
            inboundTrips
              .filter((t) => t.status === 'in_transit')
              .length.toString(),
            '#F59E0B'
          )}
          {renderQuickStat(
            'Arrived',
            inboundTrips
              .filter((t) => t.status === 'arrived')
              .length.toString(),
            '#10B981'
          )}
          {renderQuickStat(
            'High Priority',
            inboundTrips.filter((t) => t.priority === 'high').length.toString(),
            '#EF4444'
          )}
        </ScrollView>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trips, drivers, or locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          style={styles.filterTabs}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                activeFilter === filter.id && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter.id && styles.filterTabTextActive,
                ]}
              >
                {filter.label}
              </Text>
              <View
                style={[
                  styles.filterTabBadge,
                  activeFilter === filter.id && styles.filterTabBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabBadgeText,
                    activeFilter === filter.id &&
                      styles.filterTabBadgeTextActive,
                  ]}
                >
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trips List */}
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
  container: {
    flex: 1,
    backgroundColor: '#1a1d29',
  },
  header: {
    backgroundColor: '#1a1d29',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  checkInButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginHorizontal: -20,
    marginBottom: 16,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  filterButton: {
    padding: 4,
  },
  filterTabs: {
    marginHorizontal: -20,
  },
  filterTabsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterTabBadge: {
    backgroundColor: '#374151',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterTabBadgeActive: {
    backgroundColor: '#FFFFFF' + '30',
  },
  filterTabBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  filterTabBadgeTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tripsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  tripCard: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tripCardUnread: {
    backgroundColor: '#3B82F6' + '10',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  tripCardHighPriority: {
    borderTopWidth: 2,
    borderTopColor: '#EF4444',
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    marginBottom: 12,
  },
  tripTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  estimatedTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  driverSection: {
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneText: {
    fontSize: 12,
    color: '#10B981',
  },
  routeSection: {
    marginBottom: 12,
    gap: 6,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  cargoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
  },
  cargoText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleText: {
    fontSize: 12,
    color: '#6B7280',
  },
  tripActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionButton: {
    padding: 4,
  },
});
