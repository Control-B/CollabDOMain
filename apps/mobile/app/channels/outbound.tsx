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
  ArrowLeft,
  Search,
  Navigation,
  Plus,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  Send,
} from 'lucide-react-native';

interface OutboundChannel {
  id: string;
  tripId: string;
  driverName: string;
  vehicleId: string;
  origin: string;
  destination: string;
  status: 'scheduled' | 'loading' | 'in_transit' | 'delivered';
  createdAt: string;
  memberCount: number;
  unreadCount: number;
}

export default function OutboundChannelsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const outboundChannels: OutboundChannel[] = [
    {
      id: 'trip_out_001',
      tripId: 'OUT-2024-001',
      driverName: 'Mike Wilson',
      vehicleId: 'TRK-012',
      origin: 'Houston Warehouse',
      destination: 'Dallas Distribution Center',
      status: 'in_transit',
      createdAt: '1 hour ago',
      memberCount: 4,
      unreadCount: 1,
    },
    {
      id: 'trip_out_002',
      tripId: 'OUT-2024-002',
      driverName: 'Sarah Davis',
      vehicleId: 'TRK-007',
      origin: 'Houston Warehouse',
      destination: 'Austin Retail Store',
      status: 'loading',
      createdAt: '15 minutes ago',
      memberCount: 2,
      unreadCount: 3,
    },
    {
      id: 'trip_out_003',
      tripId: 'OUT-2024-003',
      driverName: 'Carlos Martinez',
      vehicleId: 'TRK-020',
      origin: 'Houston Warehouse',
      destination: 'San Antonio Mall',
      status: 'delivered',
      createdAt: '3 hours ago',
      memberCount: 3,
      unreadCount: 0,
    },
    {
      id: 'trip_out_004',
      tripId: 'OUT-2024-004',
      driverName: 'Lisa Thompson',
      vehicleId: 'TRK-005',
      origin: 'Houston Warehouse',
      destination: 'Fort Worth Store',
      status: 'scheduled',
      createdAt: '30 minutes ago',
      memberCount: 1,
      unreadCount: 0,
    },
  ];

  const filteredChannels = outboundChannels.filter(
    (channel) =>
      channel.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#6B7280';
      case 'loading':
        return '#F59E0B';
      case 'in_transit':
        return '#8B5CF6';
      case 'delivered':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return Clock;
      case 'loading':
        return Package;
      case 'in_transit':
        return Navigation;
      case 'delivered':
        return CheckCircle;
      default:
        return Send;
    }
  };

  const handleChannelPress = (channel: OutboundChannel) => {
    router.push(`/chat/outbound-${channel.tripId}`);
  };

  const handleCreateCheckIn = () => {
    Alert.alert(
      'Driver Check-In',
      'To create an outbound check-in channel, you need to:\n\n1. Be within 0.5 miles of pickup/delivery location\n2. Submit your trip sheet\n3. Wait for approval from shipping office',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Check-In',
          onPress: () => router.push('/checkin/outbound'),
        },
      ]
    );
  };

  const renderChannel = ({ item }: { item: OutboundChannel }) => {
    const StatusIcon = getStatusIcon(item.status);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() => handleChannelPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.channelContent}>
          <View style={styles.channelHeader}>
            <View style={styles.channelTitle}>
              <View
                style={[
                  styles.statusIcon,
                  { backgroundColor: statusColor + '20' },
                ]}
              >
                <StatusIcon size={16} color={statusColor} />
              </View>
              <View style={styles.tripInfo}>
                <Text style={styles.tripId}>{item.tripId}</Text>
                <Text style={styles.driverName}>
                  {item.driverName} • {item.vehicleId}
                </Text>
              </View>
            </View>
            <View style={styles.rightInfo}>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                </View>
              )}
              <Text style={styles.timestamp}>{item.createdAt}</Text>
            </View>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.routeItem}>
              <Send size={12} color="#6B7280" />
              <Text style={styles.routeText}>From: {item.origin}</Text>
            </View>
            <View style={styles.routeItem}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.routeText}>To: {item.destination}</Text>
            </View>
          </View>

          <View style={styles.channelMeta}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColor + '20' },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberText}>{item.memberCount} members</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Outbound Channels</Text>
          <Text style={styles.headerSubtitle}>
            {filteredChannels.length} active trips
          </Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCheckIn}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by trip ID, driver, or destination..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#6B7280"
        />
      </View>

      {/* Channels List */}
      <FlatList
        data={filteredChannels}
        renderItem={renderChannel}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.channelsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    margin: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  channelsList: {
    padding: 16,
  },
  channelItem: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  channelContent: {
    flex: 1,
  },
  channelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  channelTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  driverName: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  unreadCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 10,
    color: '#6B7280',
  },
  routeInfo: {
    marginBottom: 12,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  channelMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 4,
  },
});
