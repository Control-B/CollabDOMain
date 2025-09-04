import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import {
  ArrowLeft,
  Package,
  AlertCircle,
  CheckCircle,
  Loader,
} from 'lucide-react-native';

interface CheckInFormData {
  driverName: string;
  phoneNumber: string;
  vehicleId: string;
  poNumber: string;
  tripId: string;
  appointmentTime: string;
  appointmentISO: string;
  cargoDescription: string;
  specialInstructions: string;
  contactPerson: string;
  contactPhone: string;
  dockNumber: string;
  loadingType: string;
}

export default function InboundCheckInScreen() {
  const router = useRouter();
  const { override } = useLocalSearchParams<{ override?: string }>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CheckInFormData>({
    driverName: 'John Smith',
    phoneNumber: '+1-555-0123',
    vehicleId: 'TRK-001',
    poNumber: 'PO-12345',
    tripId: 'PO-12345', // Use same value as poNumber for consistency
    appointmentTime: '2:30 PM',
    appointmentISO: new Date().toISOString(),
    cargoDescription: 'Electronics - 15 pallets',
    specialInstructions: 'Handle with care - fragile items',
    contactPerson: 'Warehouse Manager',
    contactPhone: '+1-555-0456',
    dockNumber: 'D-15',
    loadingType: 'Standard Loading',
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      setLocationError('Failed to get location');
      console.error('Location error:', error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const tripData = {
        driverName: formData.driverName,
        phoneNumber: formData.phoneNumber,
        vehicleId: formData.vehicleId,
        poNumber: formData.poNumber,
        tripId: formData.tripId,
        appointmentTime: formData.appointmentTime,
        appointmentISO: formData.appointmentISO,
        cargoDescription: formData.cargoDescription,
        specialInstructions: formData.specialInstructions,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        dockNumber: formData.dockNumber,
        loadingType: formData.loadingType,
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        } : null,
        timestamp: new Date().toISOString(),
        override: override === 'true',
      };

      console.log('📱 Submitting check-in data:', tripData);

      // Send to web app
      const response = await fetch('http://127.0.0.1:3010/api/driver-checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Check-in submitted successfully!');
        router.back();
      } else {
        throw new Error('Failed to submit check-in');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit check-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inbound Check-In</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Driver Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Driver Name</Text>
            <TextInput
              style={styles.input}
              value={formData.driverName}
              onChangeText={(text) => setFormData({...formData, driverName: text})}
              placeholder="Enter driver name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
              placeholder="Enter phone number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle ID</Text>
            <TextInput
              style={styles.input}
              value={formData.vehicleId}
              onChangeText={(text) => setFormData({...formData, vehicleId: text})}
              placeholder="Enter vehicle ID"
            />
          </View>

          <Text style={styles.sectionTitle}>Trip Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PO Number</Text>
            <TextInput
              style={styles.input}
              value={formData.poNumber}
              onChangeText={(text) => setFormData({...formData, poNumber: text})}
              placeholder="Enter PO number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trip ID</Text>
            <TextInput
              style={styles.input}
              value={formData.tripId}
              onChangeText={(text) => setFormData({...formData, tripId: text})}
              placeholder="Enter trip ID"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Appointment Time</Text>
            <TextInput
              style={styles.input}
              value={formData.appointmentTime}
              onChangeText={(text) => setFormData({...formData, appointmentTime: text})}
              placeholder="Enter appointment time"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cargo Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.cargoDescription}
              onChangeText={(text) => setFormData({...formData, cargoDescription: text})}
              placeholder="Enter cargo description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dock Number</Text>
            <TextInput
              style={styles.input}
              value={formData.dockNumber}
              onChangeText={(text) => setFormData({...formData, dockNumber: text})}
              placeholder="Enter dock number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.specialInstructions}
              onChangeText={(text) => setFormData({...formData, specialInstructions: text})}
              placeholder="Enter special instructions"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader size={20} color="#FFFFFF" />
            ) : (
              <CheckCircle size={20} color="#FFFFFF" />
            )}
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Submitting...' : 'Submit Inbound Check-In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});