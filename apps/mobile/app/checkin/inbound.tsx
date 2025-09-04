import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
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
    // For demo, randomly determine if within geofence (you can set this to true for testing)
    return Math.random() > 0.3; // 70% chance of being within geofence
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
    return true;
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
          onPress: () => {
            // In real app, submit to backend
            Alert.alert(
              'Check-In Submitted',
              'Your check-in has been submitted to the shipping office. They will create a communication channel for your trip.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
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
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: isWithinGeofence ? '#3B82F6' : '#6B7280',
              opacity: isWithinGeofence ? 1 : 0.5,
            },
          ]}
          onPress={handleSubmitCheckIn}
          disabled={!isWithinGeofence}
        >
          <Package size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Submit Inbound Check-In</Text>
        </TouchableOpacity>
      </View>
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
});
