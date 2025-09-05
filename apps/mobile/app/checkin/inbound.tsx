import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import {
  ArrowLeft,
  Package,
  AlertCircle,
  CheckCircle,
  Loader,
} from 'lucide-react-native';
import AutoCompleteInput from '../../components/AutoCompleteInput';

interface CheckInFormData {
  driverName: string;
  phoneNumber: string;
  vehicleId: string;
  trailerNumber: string;
  pickupLocation: string;
  pickupAddress: string;
  pickupPhone: string;
  pickupNumber: string;
  appointmentDate: string;
  appointmentTime: string;
}

export default function InboundCheckInScreen() {
  const router = useRouter();
  const [isLocationChecking, setIsLocationChecking] = useState(true);
  const [isWithinGeofence, setIsWithinGeofence] = useState(false);
  // currentLocation omitted to avoid unused var warning
  const [formData, setFormData] = useState<CheckInFormData>({
    driverName: '',
    phoneNumber: '',
    vehicleId: '',
    trailerNumber: '',
    pickupLocation: '',
    pickupAddress: '',
    pickupPhone: '',
    pickupNumber: '',
    appointmentDate: '',
    appointmentTime: '',
  });
  const [poNumber, setPoNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  useEffect(() => {
    checkLocationPermissionAndGeofence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkLocationPermissionAndGeofence = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'This app needs location permission to verify you are within the pickup geofence.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // For demo purposes, simulate geofence check
      // In real app, you would check distance to pickup location
      const isWithinRange = simulateGeofenceCheck(location);
      setIsWithinGeofence(isWithinRange);
      setIsLocationChecking(false);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your location. Please try again.'
      );
      setIsLocationChecking(false);
    }
  };

  const simulateGeofenceCheck = (
    location: Location.LocationObject
  ): boolean => {
    // Simulate geofence check - in real app, calculate distance to pickup location
    // For demo, randomly determine if within 0.5 mile geofence
    return Math.random() > 0.7; // 30% chance of being within geofence (simulating real scenario)
  };

  const handleInputChange = (field: keyof CheckInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const required = [
      'driverName',
      'phoneNumber',
      'vehicleId',
      'pickupLocation',
      'pickupAddress',
    ];
    for (const field of required) {
      if (!formData[field as keyof CheckInFormData].trim()) {
        Alert.alert(
          'Missing Information',
          `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
        );
        return false;
      }
    }
    
    if (!poNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter the PO Number');
      return false;
    }
    
    return true;
  };

  const sendCheckIn = async () => {
    const checkInData = {
      type: 'inbound',
      driverName: formData.driverName,
      phoneNumber: formData.phoneNumber,
      vehicleId: formData.vehicleId,
      trailerNumber: formData.trailerNumber,
      companyName: formData.pickupLocation,
      pickupAddress: formData.pickupAddress,
      pickupPhone: formData.pickupPhone,
      poNumber: poNumber,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      submittedAt: new Date().toISOString(),
      location: 'Inbound Terminal',
      isGeofenceOverride: !isWithinGeofence,
      overrideReason: overrideReason || null,
    };

    // Send to our web app backend
    const res = await fetch('http://localhost:3010/api/checkin-notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkInData),
    });
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to submit check-in');
    }
    
    // Return formatted data for the success popup
    return {
      driverName: formData.driverName,
      companyName: formData.pickupLocation,
      vehicleId: formData.vehicleId,
      poNumber: poNumber,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
    };
  };

  const handleOverrideCheckIn = () => {
    if (!validateForm()) {
      return;
    }
    setShowOverrideModal(true);
  };

  const submitOverrideCheckIn = async () => {
    if (!overrideReason.trim()) {
      Alert.alert('Override Reason Required', 'Please provide a reason for checking in outside the geofence.');
      return;
    }

    try {
      setSubmitting(true);
      console.log('🚀 Submitting inbound override check-in...');
      
      const checkInData = await sendCheckIn();
      console.log('✅ Inbound override check-in response:', checkInData);
      
      // Close modal first
      setShowOverrideModal(false);
      console.log('🔒 Modal closed, waiting before showing success...');
      
      // Longer delay to ensure modal is fully closed before showing alert
      setTimeout(() => {
        console.log('🎉 Now showing success popup for inbound override check-in');
        Alert.alert(
          'Check-In Submitted Successfully! ✅',
          `Your inbound check-in has been sent to the shipping office:

Driver: ${checkInData.driverName}
Company: ${checkInData.companyName}
Vehicle ID: ${checkInData.vehicleId}
PO Number: ${checkInData.poNumber}
Date: ${checkInData.appointmentDate}
Time: ${checkInData.appointmentTime}

⚠️ Override Reason: ${overrideReason}

The shipping office will create a communication channel for your trip shortly.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }, 800); // Increased delay significantly
    } catch (e: any) {
      console.error('override checkin submit failed', e);
      setShowOverrideModal(false);
      setTimeout(() => {
        Alert.alert('Error', 'Failed to submit check-in. Please try again.');
      }, 100);
    } finally {
      setSubmitting(false);
      setOverrideReason('');
    }
  };

  const handleSubmitCheckIn = () => {
    if (!isWithinGeofence) {
      Alert.alert(
        'Location Required',
        'You must be within 0.5 miles of the pickup location to submit check-in.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    Alert.alert(
      'Submit Check-In',
      'Are you sure you want to submit your check-in form? This will notify the shipping office.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            try {
              setSubmitting(true);
              const checkInData = await sendCheckIn();
              Alert.alert(
                'Check-In Submitted Successfully! ✅',
                `Your inbound check-in has been sent to the shipping office:

Driver: ${checkInData.driverName}
Company: ${checkInData.companyName}
Vehicle ID: ${checkInData.vehicleId}
PO Number: ${checkInData.poNumber}
Date: ${checkInData.appointmentDate}
Time: ${checkInData.appointmentTime}

The shipping office will create a communication channel for your trip shortly.`,
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } catch (e: any) {
              console.error('checkin submit failed', e);
              Alert.alert('Error', 'Failed to submit check-in. Please try again.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  if (isLocationChecking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Loader size={48} color="#3B82F6" />
          <Text style={styles.loadingText}>Checking your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>📥 Inbound Check-In</Text>
      </View>

      {/* Location Status */}
      <View
        style={[
          styles.locationStatus,
          {
            backgroundColor: isWithinGeofence
              ? '#10B981' + '20'
              : '#EF4444' + '20',
          },
        ]}
      >
        <View style={styles.locationHeader}>
          {isWithinGeofence ? (
            <CheckCircle size={20} color="#10B981" />
          ) : (
            <AlertCircle size={20} color="#EF4444" />
          )}
          <Text
            style={[
              styles.locationText,
              {
                color: isWithinGeofence ? '#10B981' : '#EF4444',
              },
            ]}
          >
            {isWithinGeofence
              ? 'Within Pickup Geofence'
              : 'Outside Pickup Geofence'}
          </Text>
        </View>
        <Text style={styles.locationSubtext}>
          {isWithinGeofence
            ? 'You can submit your check-in form'
            : 'Move within 0.5 miles of pickup location to check in'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Driver Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Driver Information</Text>

          <AutoCompleteInput
            label="Driver Name"
            value={formData.driverName}
            onChangeText={(value) => handleInputChange('driverName', value)}
            placeholder="Enter your full name"
            type="company"
            required
          />

          <AutoCompleteInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            placeholder="(XXX) XXX-XXXX"
            type="phone"
            required
          />
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚛 Vehicle Information</Text>

          <AutoCompleteInput
            label="Truck/Vehicle ID"
            value={formData.vehicleId}
            onChangeText={(value) => handleInputChange('vehicleId', value)}
            placeholder="TRK-001"
            type="company"
            required
          />

          <AutoCompleteInput
            label="Trailer Number"
            value={formData.trailerNumber}
            onChangeText={(value) => handleInputChange('trailerNumber', value)}
            placeholder="TRL-001 (if applicable)"
            type="company"
          />

          <AutoCompleteInput
            label="PO Number"
            value={poNumber}
            onChangeText={setPoNumber}
            placeholder="Enter PO Number"
            type="company"
            required
          />
        </View>

        {/* Pickup Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Pickup Information</Text>

          <AutoCompleteInput
            label="Pickup Location Name"
            value={formData.pickupLocation}
            onChangeText={(value) => handleInputChange('pickupLocation', value)}
            placeholder="Warehouse, Store, etc."
            type="company"
            required
          />

          <AutoCompleteInput
            label="Pickup Address"
            value={formData.pickupAddress}
            onChangeText={(value) => handleInputChange('pickupAddress', value)}
            placeholder="123 Main St, City, State ZIP"
            type="address"
            required
          />

          <AutoCompleteInput
            label="Pickup Phone"
            value={formData.pickupPhone}
            onChangeText={(value) => handleInputChange('pickupPhone', value)}
            placeholder="(XXX) XXX-XXXX"
            type="phone"
          />

          <AutoCompleteInput
            label="PO/Pickup Number"
            value={formData.pickupNumber}
            onChangeText={(value) => handleInputChange('pickupNumber', value)}
            placeholder="PO-123456"
            type="company"
          />
        </View>

        {/* Appointment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Appointment Details</Text>

          <AutoCompleteInput
            label="Appointment Date"
            value={formData.appointmentDate}
            onChangeText={(value) =>
              handleInputChange('appointmentDate', value)
            }
            placeholder="MM/DD/YYYY"
            type="company"
          />

          <AutoCompleteInput
            label="Appointment Time"
            value={formData.appointmentTime}
            onChangeText={(value) =>
              handleInputChange('appointmentTime', value)
            }
            placeholder="HH:MM AM/PM"
            type="company"
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        {isWithinGeofence ? (
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
            onPress={handleSubmitCheckIn}
            disabled={submitting}
          >
            {submitting ? (
              <Loader size={20} color="#FFFFFF" />
            ) : (
              <Package size={20} color="#FFFFFF" />
            )}
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Submit Inbound Check-In'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View>
            <View style={styles.geofenceWarning}>
              <AlertCircle size={16} color="#F59E0B" />
              <Text style={styles.geofenceWarningText}>
                You are outside the 0.5 mile pickup zone. Use override to check in.
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.overrideButton, submitting && { opacity: 0.6 }]}
              onPress={handleOverrideCheckIn}
              disabled={submitting}
            >
              <AlertCircle size={20} color="#FFFFFF" />
              <Text style={styles.overrideButtonText}>
                {submitting ? 'Submitting...' : 'Override Check-In'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Override Modal */}
      <Modal
        visible={showOverrideModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOverrideModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Override Check-In</Text>
            <Text style={styles.modalSubtitle}>
              You are outside the pickup geofence. Please provide a reason for checking in:
            </Text>
            
            <TextInput
              style={styles.reasonInput}
              value={overrideReason}
              onChangeText={setOverrideReason}
              placeholder="Enter reason (e.g., Traffic, Emergency, etc.)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowOverrideModal(false);
                  setOverrideReason('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmButton, submitting && { opacity: 0.6 }]}
                onPress={submitOverrideCheckIn}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <AlertCircle size={18} color="#FFFFFF" />
                )}
                <Text style={styles.confirmButtonText}>
                  {submitting ? 'Submitting...' : 'Submit Override'}
                </Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
  locationStatus: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  geofenceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  geofenceWarningText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
  },
  overrideButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  overrideButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
    minHeight: 80,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
