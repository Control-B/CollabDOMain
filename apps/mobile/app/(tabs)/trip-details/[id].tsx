import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  User,
  Phone,
  Truck,
  Navigation,
  CheckCircle,
  Edit,
  Trash2,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

const mockTrips = [
  {
    id: '1',
    tripNumber: 'TRP-001-2024',
    status: 'active',
    driverName: 'John Doe',
    phoneNumber: '+1 (555) 123-4567',
    vehicleNumber: 'TRK-001',
    trailerNumber: 'TRL-001',
    pickupLocation: 'Warehouse A',
    pickupAddress: '123 Main St, New York, NY 10001',
    pickupPhone: '+1 (555) 111-2222',
    pickupNumber: 'PO-2024-001',
    deliveryLocation: 'Store B',
    deliveryAddress: '456 Oak Ave, Brooklyn, NY 11201',
    deliveryPhone: '+1 (555) 333-4444',
    appointmentTime: '2024-09-01 14:00',
    loadDetails: 'Electronics - 50 boxes (Laptops, Tablets, Accessories)',
    specialInstructions: 'Handle with care. Fragile items. Use loading dock B.',
    createdAt: '2024-09-01 08:00',
    timeline: [
      { time: '08:00', status: 'created', description: 'Trip sheet created' },
      { time: '08:30', status: 'dispatched', description: 'Driver dispatched' },
      { time: '09:00', status: 'en_route', description: 'En route to pickup' },
      {
        time: '10:30',
        status: 'arrived_pickup',
        description: 'Arrived at pickup location',
      },
      { time: '11:00', status: 'loading', description: 'Loading in progress' },
      {
        time: '12:00',
        status: 'departed_pickup',
        description: 'Departed pickup location',
      },
      {
        time: 'current',
        status: 'en_route_delivery',
        description: 'En route to delivery',
      },
    ],
  },
];

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    const foundTrip = mockTrips.find((t) => t.id === id);
    setTrip(foundTrip);
  }, [id]);

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#151937" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading trip details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'en_route_delivery':
        return '#10B981';
      case 'completed':
        return '#059669';
      case 'scheduled':
        return '#3B82F6';
      case 'cancelled':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const handleEditTrip = () => {
    Alert.alert('Edit Trip', `Edit trip ${trip.tripNumber}`);
  };

  const handleDeleteTrip = () => {
    Alert.alert('Delete Trip', `Delete trip ${trip.tripNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const handleNavigate = (address: string, name: string) => {
    Alert.alert('Navigate', `Open navigation to ${name}?\n\n${address}`);
  };

  const renderInfoCard = (
    title: string,
    children: React.ReactNode,
    color = '#1E293B'
  ) => (
    <View style={[styles.infoCard, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderInfoRow = (
    icon: any,
    label: string,
    value: string,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.infoRow}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      {icon}
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {onPress && <Navigation size={16} color="#6B7280" />}
    </TouchableOpacity>
  );

  const renderTimelineItem = (item: any, index: number, isLast: boolean) => {
    const isCurrent = item.time === 'current';
    const isPast = !isCurrent && index < trip.timeline.length - 1;

    return (
      <View key={index} style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
          <View
            style={[
              styles.timelineIndicator,
              {
                backgroundColor: isCurrent
                  ? '#10B981'
                  : isPast
                  ? '#059669'
                  : '#374151',
              },
            ]}
          />
          {!isLast && <View style={styles.timelineLine} />}
        </View>
        <View style={styles.timelineContent}>
          <Text style={styles.timelineTime}>
            {isCurrent ? 'Current' : item.time}
          </Text>
          <Text style={styles.timelineDescription}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{trip.tripNumber}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(trip.status) + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(trip.status) },
              ]}
            >
              {trip.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleEditTrip}
          >
            <Edit size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.deleteButton]}
            onPress={handleDeleteTrip}
          >
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderInfoCard(
          'DRIVER & VEHICLE',
          <>
            {renderInfoRow(
              <User size={16} color="#10B981" />,
              'Driver',
              trip.driverName
            )}
            {renderInfoRow(
              <Phone size={16} color="#10B981" />,
              'Phone',
              trip.phoneNumber
            )}
            {renderInfoRow(
              <Truck size={16} color="#3B82F6" />,
              'Vehicle',
              `${trip.vehicleNumber} ${
                trip.trailerNumber ? `• ${trip.trailerNumber}` : ''
              }`
            )}
          </>,
          '#10B981'
        )}

        {renderInfoCard(
          'PICKUP LOCATION',
          <>
            {renderInfoRow(
              <MapPin size={16} color="#F59E0B" />,
              'Location',
              trip.pickupLocation
            )}
            {renderInfoRow(
              <Navigation size={16} color="#F59E0B" />,
              'Address',
              trip.pickupAddress,
              () => handleNavigate(trip.pickupAddress, trip.pickupLocation)
            )}
            {renderInfoRow(
              <Phone size={16} color="#F59E0B" />,
              'Contact',
              trip.pickupPhone
            )}
            {renderInfoRow(
              <Package size={16} color="#F59E0B" />,
              'PO Number',
              trip.pickupNumber
            )}
          </>,
          '#F59E0B'
        )}

        {renderInfoCard(
          'DELIVERY LOCATION',
          <>
            {renderInfoRow(
              <MapPin size={16} color="#EF4444" />,
              'Location',
              trip.deliveryLocation
            )}
            {renderInfoRow(
              <Navigation size={16} color="#EF4444" />,
              'Address',
              trip.deliveryAddress,
              () => handleNavigate(trip.deliveryAddress, trip.deliveryLocation)
            )}
            {renderInfoRow(
              <Phone size={16} color="#EF4444" />,
              'Contact',
              trip.deliveryPhone
            )}
          </>,
          '#EF4444'
        )}

        {renderInfoCard(
          'APPOINTMENT & LOAD',
          <>
            {renderInfoRow(
              <Calendar size={16} color="#8B5CF6" />,
              'Appointment',
              trip.appointmentTime
            )}
            {renderInfoRow(
              <Package size={16} color="#06B6D4" />,
              'Load Details',
              trip.loadDetails
            )}
            {trip.specialInstructions &&
              renderInfoRow(
                <Package size={16} color="#06B6D4" />,
                'Instructions',
                trip.specialInstructions
              )}
          </>,
          '#8B5CF6'
        )}

        <View style={[styles.infoCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.cardTitle}>TRIP TIMELINE</Text>
          <View style={styles.timeline}>
            {trip.timeline.map((item: any, index: number) =>
              renderTimelineItem(
                item,
                index,
                index === trip.timeline.length - 1
              )
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => Alert.alert('Status', 'Update status')}
          >
            <CheckCircle size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Update Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              handleNavigate(trip.pickupAddress, trip.pickupLocation)
            }
          >
            <Navigation size={20} color="#10B981" />
            <Text style={styles.secondaryButtonText}>Navigate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151937' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#9CA3AF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1E293B',
  },
  backButton: { padding: 8, marginRight: 8 },
  headerContent: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row' },
  headerButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: { backgroundColor: '#7F1D1D' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  infoContent: { flex: 1, marginLeft: 12 },
  infoLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  timeline: { paddingLeft: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 16 },
  timelineLeft: { alignItems: 'center', marginRight: 16 },
  timelineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#374151' },
  timelineContent: { flex: 1 },
  timelineTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  timelineDescription: { fontSize: 14, color: '#D1D5DB' },
  actionButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  primaryButton: {
    flex: 1,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  bottomPadding: { height: 32 },
});
