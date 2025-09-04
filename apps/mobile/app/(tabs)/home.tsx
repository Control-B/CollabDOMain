import { useState } from 'react';
import {
  Platform,
  ScrollView,
  Alert,
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import { phoenixService } from '../../services/phx';
import api from '../../services/api';
import { User } from 'lucide-react-native';

// Compact home header; remove bulky elements for better mobile layout

export default function HomeScreen() {
  const hookRouter = useRouter();
  const navigateRouter = Platform.OS === 'web' ? router : hookRouter;

  // Override State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedOverrideReason, setSelectedOverrideReason] = useState('');

  const overrideReasons = [
    'Emergency delivery required',
    'Customer requested early arrival',
    'Traffic/routing issues',
    'Weather conditions',
    'Vehicle mechanical issues',
    'Dispatcher authorization',
    'Safety concerns',
    'Other (to be documented)',
  ];

  // Removed geofence simulation; Check-In now flows through Trip Sheet

  // Handle check-in button press
  const handleCheckInPress = () => {
    // Only submit an already saved trip sheet; do not open/create sheets here
    (async () => {
      try {
        let json: string | null = null;
        if (Platform.OS === 'web') {
          try {
            json =
              (globalThis as any).localStorage?.getItem('tripSheetSaved') ??
              null;
          } catch {}
        } else {
          const { default: AsyncStorage } = await import(
            '@react-native-async-storage/async-storage'
          );
          json = await AsyncStorage.getItem('tripSheetSaved');
        }

        const trip = json ? JSON.parse(json) : null;
        if (!trip) {
          Alert.alert(
            'No Saved Trip Sheet',
            'Use the Trip Sheet button to open and save your trip sheet, or Create New Trip to start one. Then tap Check In to submit.'
          );
          return;
        }

        try {
          await phoenixService.notifyShippingOfficeCheckIn(trip);
        } catch (err) {
          console.warn('Phoenix notify failed, using REST fallback:', err);
          await api.notifyShippingOfficeCheckIn(trip);
        }

        // Proceed directly to the check-in flow after successful submit
        navigateRouter.push('/checkin/inbound');
      } catch (e) {
        console.error('Check-in notification failed', e);
        Alert.alert('Error', 'Failed to notify shipping office.');
      }
    })();
  };

  // Navigate to check-in page
  const navigateToCheckIn = (overrideReason?: string) => {
    try {
      if (overrideReason) {
        console.log('Check-in override reason:', overrideReason);
        // In real app, log the override reason to backend
      }
      navigateRouter.push('/checkin/inbound');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Router error:', error);
      Alert.alert('Error', 'Navigation failed: ' + message);
    }
  };

  // Handle override confirmation
  const handleOverrideConfirm = () => {
    if (!selectedOverrideReason) {
      Alert.alert('Required', 'Please select a reason for override');
      return;
    }

    setShowOverrideModal(false);
    setSelectedOverrideReason('');
    navigateToCheckIn(selectedOverrideReason);
  };

  // Mock data for current trip and channel
  const currentTrip = {
    id: 'TS-2024-001',
    status: 'in_progress',
    progress: 65,
    driverName: 'John Smith',
    vehicleId: 'TRK-001',
    pickupLocation: 'Warehouse A - Chicago, IL',
    deliveryLocation: 'Distribution Center - Dallas, TX',
    estimatedArrival: '2:30 PM',
    cargo: 'Electronics - 15 pallets',
  };

  // Navigation handlers
  // removed Trip Sheets card; no direct navigation from Home

  const handleCurrentTripPress = () => {
    try {
      // Open the Trip Sheet page (view/edit/save/share/delete)
      navigateRouter.push('/trip-sheet');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Router error:', error);
      Alert.alert('Error', 'Navigation failed: ' + message);
    }
  };

  const handleCreateTrip = () => {
    try {
      navigateRouter.push('/create-trip');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Router error:', error);
      Alert.alert('Error', 'Navigation failed: ' + message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d29" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentTrip.driverName}</Text>
        <TouchableOpacity style={styles.userAvatar}>
          <User size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Trip - now top of page */}
        <View style={styles.vStackCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleInfo}>
              <Text style={styles.cardTitle}>Current Trip</Text>
              <Text style={styles.cardSubtitle}>Trip #{currentTrip.id}</Text>
            </View>
            {/* Removed header arrow to avoid duplicate navigation to Trip Sheet */}
          </View>

          <View style={styles.cardContent}>
            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Trip Progress</Text>
                <Text style={styles.progressPercent}>
                  {currentTrip.progress}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${currentTrip.progress}%` },
                  ]}
                />
              </View>
            </View>
            {/* Route Info */}
            <View style={styles.routeSection}>
              <View style={styles.routeItem}>
                <Text style={styles.routeText} numberOfLines={1}>
                  From: {currentTrip.pickupLocation}
                </Text>
              </View>
              <View style={styles.routeItem}>
                <Text style={styles.routeText} numberOfLines={1}>
                  To: {currentTrip.deliveryLocation}
                </Text>
              </View>
            </View>
            <View style={styles.tripDetailsRow}>
              <View style={styles.tripDetail}>
                <Text style={styles.tripDetailLabel}>ETA:</Text>
                <Text style={styles.tripDetailText}>
                  {currentTrip.estimatedArrival}
                </Text>
              </View>
              <View style={styles.tripDetail}>
                <Text style={styles.tripDetailLabel}>Cargo:</Text>
                <Text style={styles.tripDetailText} numberOfLines={1}>
                  {currentTrip.cargo}
                </Text>
              </View>
            </View>
            {/* Stacked actions: Check-In, Override, Trip Sheet */}
            <View style={styles.checkInContainer}>
              <View style={styles.buttonStack}>
                <TouchableOpacity
                  style={styles.checkInButton}
                  onPress={handleCheckInPress}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Check In"
                >
                  <Text style={styles.checkInButtonText}>Check In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.overrideButton}
                  onPress={() => setShowOverrideModal(true)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Override Check In"
                >
                  <Text style={styles.overrideButtonText}>Override</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleCurrentTripPress}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Open Trip Sheet"
                >
                  <Text style={styles.secondaryButtonText}>Trip Sheet</Text>
                </TouchableOpacity>
              </View>

              {/* Removed location status text under buttons */}
            </View>
          </View>
        </View>

        {/* Standalone Create New Trip button below Current Trip */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCreateTrip}
        >
          <Text style={styles.primaryButtonText}>Create New Trip</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Override Reason Modal */}
      <Modal
        visible={showOverrideModal}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => {
          setShowOverrideModal(false);
          setSelectedOverrideReason('');
        }}
      >
        <SafeAreaView style={styles.modalFullScreen}>
          <View style={styles.modalContainer}>
            {/* Modal Handle */}
            <View style={styles.modalHandle} />

            {/* Modal Header with Close Button */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleSection}>
                <Text style={styles.modalTitle}>Override Required</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => {
                    setShowOverrideModal(false);
                    setSelectedOverrideReason('');
                  }}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>
                You are outside the delivery zone. Select a reason to proceed
                with check-in:
              </Text>
            </View>

            {/* Scrollable Reasons List */}
            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {overrideReasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonItem,
                    selectedOverrideReason === reason &&
                      styles.reasonItemSelected,
                  ]}
                  onPress={() => setSelectedOverrideReason(reason)}
                  activeOpacity={0.7}
                >
                  <View style={styles.reasonContent}>
                    <View
                      style={[
                        styles.reasonRadio,
                        selectedOverrideReason === reason &&
                          styles.reasonRadioSelected,
                      ]}
                    >
                      {selectedOverrideReason === reason && (
                        <View style={styles.radioDot} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.reasonText,
                        selectedOverrideReason === reason &&
                          styles.reasonTextSelected,
                      ]}
                    >
                      {reason}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Fixed Action Buttons */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowOverrideModal(false);
                  setSelectedOverrideReason('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !selectedOverrideReason && styles.confirmButtonDisabled,
                ]}
                onPress={handleOverrideConfirm}
                disabled={!selectedOverrideReason}
              >
                <Text style={styles.confirmButtonText}>
                  Proceed with Override
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    ...Platform.select({
      android: {
        paddingTop: 10,
      },
    }),
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  statusText: {
    fontSize: 12,
  },
  userImageContainer: {
    alignItems: 'flex-end',
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#06B6D4', // Modern cyan for user avatar
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userImageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  vStackCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTitleInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  cardAction: {
    padding: 8,
  },
  cardContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#334155',
    marginHorizontal: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB', // Bright blue for Create Trip Sheet
    borderRadius: 16,
    paddingVertical: 18,
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891B2', // Cyan for secondary actions
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  routeSection: {
    marginBottom: 16,
    gap: 8,
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
  tripDetailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  tripDetailText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  tripDetailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 4,
  },
  locationStatus: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  channelItem: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  channelItemUnread: {
    backgroundColor: '#3B82F620',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  channelInfo: {
    flex: 1,
  },
  channelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  channelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelParticipants: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  channelLastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  channelTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkInContainer: {
    marginTop: 16,
  },
  buttonStack: {
    gap: 12,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669', // Emerald green for check-in success
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkInButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  checkInButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checkInButtonTextDisabled: {
    color: '#D1D5DB',
  },
  overrideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF', // Dark blue for override action
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  overrideButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  geofenceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
    gap: 6,
  },
  geofenceIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  geofenceStatusText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  // Modal Styles - Mobile Responsive
  modalFullScreen: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#6B7280',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  modalScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalScrollContent: {
    paddingVertical: 20,
  },
  reasonItem: {
    backgroundColor: '#374151',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reasonItemSelected: {
    backgroundColor: '#1D4ED8',
    borderColor: '#3B82F6',
  },
  reasonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  reasonRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  reasonRadioSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1D4ED8',
  },
  reasonText: {
    fontSize: 15,
    color: '#E5E7EB',
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  reasonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Add safe area padding for iOS
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    backgroundColor: '#1F2937',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#7C3AED', // Purple for confirmation actions
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  confirmButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
});
