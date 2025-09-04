import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

export default function OutboundCheckInScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    driverName: 'John Smith',
    phoneNumber: '+1-555-0123',
    vehicleId: 'TRK-001',
    poNumber: 'PO-12345',
    tripId: 'PO-12345', // Use same value as poNumber for consistency
    appointmentTime: '2:30 PM',
    cargoDescription: 'Electronics - 15 pallets',
    dockNumber: 'D-15',
    specialInstructions: 'Handle with care - fragile items',
  });

  const handleSubmit = async () => {
    try {
      const tripData = {
        ...form,
        timestamp: new Date().toISOString(),
        type: 'outbound',
      };

      console.log('📱 Submitting outbound check-in:', tripData);

      const response = await fetch('http://127.0.0.1:3010/api/driver-checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Outbound check-in submitted successfully!');
        router.back();
      } else {
        throw new Error('Failed to submit check-in');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit check-in. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Outbound Check-In</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Driver Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Driver Name</Text>
            <TextInput
              style={styles.input}
              value={form.driverName}
              onChangeText={(text) => setForm({...form, driverName: text})}
              placeholder="Enter driver name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={form.phoneNumber}
              onChangeText={(text) => setForm({...form, phoneNumber: text})}
              placeholder="Enter phone number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle ID</Text>
            <TextInput
              style={styles.input}
              value={form.vehicleId}
              onChangeText={(text) => setForm({...form, vehicleId: text})}
              placeholder="Enter vehicle ID"
            />
          </View>

          <Text style={styles.sectionTitle}>Trip Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PO Number</Text>
            <TextInput
              style={styles.input}
              value={form.poNumber}
              onChangeText={(text) => setForm({...form, poNumber: text})}
              placeholder="Enter PO number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trip ID</Text>
            <TextInput
              style={styles.input}
              value={form.tripId}
              onChangeText={(text) => setForm({...form, tripId: text})}
              placeholder="Enter trip ID"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Appointment Time</Text>
            <TextInput
              style={styles.input}
              value={form.appointmentTime}
              onChangeText={(text) => setForm({...form, appointmentTime: text})}
              placeholder="Enter appointment time"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cargo Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.cargoDescription}
              onChangeText={(text) => setForm({...form, cargoDescription: text})}
              placeholder="Enter cargo description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dock Number</Text>
            <TextInput
              style={styles.input}
              value={form.dockNumber}
              onChangeText={(text) => setForm({...form, dockNumber: text})}
              placeholder="Enter dock number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.specialInstructions}
              onChangeText={(text) => setForm({...form, specialInstructions: text})}
              placeholder="Enter special instructions"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <CheckCircle size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Outbound Check-In</Text>
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
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});