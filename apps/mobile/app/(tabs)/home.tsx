import { useState, useEffect } from 'react';
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
import { User } from 'lucide-react-native';

export default function HomeScreen() {
  const hookRouter = useRouter();
  const navigateRouter = Platform.OS === 'web' ? router : hookRouter;

  // Override State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedOverrideReason, setSelectedOverrideReason] = useState('');
  
  // Channels State
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);

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

  // Fetch channels from web app
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3010/api/channels');
        if (response.ok) {
          const channelsData = await response.json();
          setChannels(channelsData);
          
          console.log('📱 Fetched channels:', channelsData.length);
          
          // Find the most recent channel with a vehicle number (trip-related)
          const tripChannels = channelsData.filter(channel => 
            channel.vehicleNumber && 
            (channel.category === 'inbound' || channel.category === 'outbound')
          );
          
          const currentTripId = 'PO-12345';
          const currentVehicleId = 'TRK-001';
          
          // Look for channels that match our current trip data
          const exactMatchChannels = tripChannels.filter(channel => 
            channel.poNumber === currentTripId || channel.name === currentTripId
          );
          
          const vehicleMatchChannels = tripChannels.filter(channel => 
            channel.vehicleNumber === currentVehicleId
          );
          
          const matchingChannels = exactMatchChannels.length > 0 ? exactMatchChannels : 
                                   vehicleMatchChannels.length > 0 ? vehicleMatchChannels : 
                                   tripChannels;
          
          if (matchingChannels.length > 0) {
            const mostRecentChannel = matchingChannels.sort((a, b) => 
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            )[0];
            setCurrentChannel(mostRecentChannel);
            console.log('📱 Current channel set:', mostRecentChannel);
          }
        }
      } catch (error) {
        console.error('📱 Error fetching channels:', error);
      }
    };

    fetchChannels();
    const interval = setInterval(fetchChannels, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = () => {
    console.log('📱 Check In button pressed');
    navigateRouter.push('/checkin/inbound');
  };

  const handleOverride = () => {
    console.log('📱 Override button pressed');
    setShowOverrideModal(true);
  };

  const handleOverrideSubmit = () => {
    if (!selectedOverrideReason) {
      Alert.alert('Error', 'Please select a reason for override');
      return;
    }
    
    console.log('📱 Override submitted with reason:', selectedOverrideReason);
    navigateRouter.push('/checkin/inbound?override=true');
    setShowOverrideModal(false);
    setSelectedOverrideReason('');
  };

  const handleCurrentTripPress = () => {
    if (currentChannel) {
      console.log('📱 Current trip pressed, navigating to chat:', currentChannel);
      navigateRouter.push({
        pathname: '/chat/[id]',
        params: {
          id: currentChannel.poNumber || currentChannel.name,
          title: currentChannel.poNumber || currentChannel.name,
          vehicleId: currentChannel.vehicleNumber,
          type: 'channel',
          channelType: currentChannel.category,
          doorNumber: currentChannel.doorNumber || 'D-15',
          doorStatus: currentChannel.doorStatus || 'green',
        },
      });
    } else {
      Alert.alert('No Active Trip', 'No active trip channel found. Please check in first.');
    }
  };

  const handleTripSheet = () => {
    console.log('📱 Trip Sheet button pressed');
    navigateRouter.push('/trip-sheets');
  };

  const handleCreateNewTrip = () => {
    console.log('📱 Create New Trip button pressed');
    navigateRouter.push('/create-trip');
  };

  const tripChannels = channels.filter(channel => 
    channel.vehicleNumber && 
    (channel.category === 'inbound' || channel.category === 'outbound')
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>John Smith</Text>
        <TouchableOpacity style={styles.userButton}>
          <User size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Trip Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Trip</Text>
          
          <TouchableOpacity style={styles.tripCard} onPress={handleCurrentTripPress}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripTitle}>Trip #{currentChannel?.poNumber || 'PO-12345'}</Text>
              <View style={styles.statusDot} />
            </View>
            
            <Text style={styles.tripChannels}>
              Trip Channels: {tripChannels.length} | Current: {currentChannel ? 'Active' : 'None'}
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressText}>65%</Text>
            </View>
            
            <View style={styles.tripDetails}>
              <Text style={styles.tripDetail}>From: Warehouse A - Chicago, IL</Text>
              <Text style={styles.tripDetail}>To: Distribution Center - Dallas, TX</Text>
              <Text style={styles.tripDetail}>ETA: 2:30 PM</Text>
              <Text style={styles.tripDetail}>CARGO: Electronics - 15 pallets</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
            <Text style={styles.buttonText}>Check In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.overrideButton} onPress={handleOverride}>
            <Text style={styles.buttonText}>Override</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tripSheetButton} onPress={handleTripSheet}>
            <Text style={styles.buttonText}>Trip Sheet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.createTripButton} onPress={handleCreateNewTrip}>
            <Text style={styles.buttonText}>Create New Trip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Override Modal */}
      <Modal
        visible={showOverrideModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOverrideModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Override Reason</Text>
            <Text style={styles.modalSubtitle}>Please select a reason for the override:</Text>
            
            <ScrollView style={styles.reasonsList}>
              {overrideReasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonItem,
                    selectedOverrideReason === reason && styles.reasonItemSelected
                  ]}
                  onPress={() => setSelectedOverrideReason(reason)}
                >
                  <Text style={[
                    styles.reasonText,
                    selectedOverrideReason === reason && styles.reasonTextSelected
                  ]}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowOverrideModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleOverrideSubmit}
              >
                <Text style={styles.submitButtonText}>Submit Override</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tripCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  tripChannels: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  tripDetails: {
    gap: 4,
  },
  tripDetail: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  actionsSection: {
    gap: 12,
  },
  checkInButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  overrideButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tripSheetButton: {
    backgroundColor: '#06B6D4',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createTripButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
  },
  reasonsList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  reasonItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reasonItemSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  reasonText: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  reasonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#6B7280',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#3B82F6',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});