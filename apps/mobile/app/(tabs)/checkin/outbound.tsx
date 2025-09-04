import { useState } from 'react';
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
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import AutoCompleteInput from '@/components/AutoCompleteInput';

export default function OutboundCheckInScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    driverName: '',
    phoneNumber: '',
    vehicleId: '',
    trailerNumber: '',
    deliveryLocation: '',
    deliveryAddress: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const handleInputChange = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    const required = [
      'driverName',
      'phoneNumber',
      'vehicleId',
      'deliveryLocation',
      'deliveryAddress',
    ];
    for (const key of required) {
      if (!(form as any)[key]?.trim()) {
        Alert.alert('Missing Info', `Please fill in ${key}`);
        return;
      }
    }
    Alert.alert('Outbound Check-In Submitted', 'Your check-in was submitted.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📤 Outbound Check-In</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Driver</Text>
          <AutoCompleteInput
            label="Driver Name"
            value={form.driverName}
            onChangeText={(v) => handleInputChange('driverName', v)}
            placeholder="Full name"
            type="company"
            required
          />
          <AutoCompleteInput
            label="Phone Number"
            value={form.phoneNumber}
            onChangeText={(v) => handleInputChange('phoneNumber', v)}
            placeholder="(XXX) XXX-XXXX"
            type="phone"
            required
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚛 Vehicle</Text>
          <AutoCompleteInput
            label="Truck/Vehicle ID"
            value={form.vehicleId}
            onChangeText={(v) => handleInputChange('vehicleId', v)}
            placeholder="TRK-001"
            type="company"
            required
          />
          <AutoCompleteInput
            label="Trailer Number"
            value={form.trailerNumber}
            onChangeText={(v) => handleInputChange('trailerNumber', v)}
            placeholder="TRL-001 (optional)"
            type="company"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Delivery</Text>
          <AutoCompleteInput
            label="Delivery Location"
            value={form.deliveryLocation}
            onChangeText={(v) => handleInputChange('deliveryLocation', v)}
            placeholder="Warehouse / Store"
            type="company"
            required
          />
          <AutoCompleteInput
            label="Delivery Address"
            value={form.deliveryAddress}
            onChangeText={(v) => handleInputChange('deliveryAddress', v)}
            placeholder="123 Main St, City, State ZIP"
            type="address"
            required
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Appointment</Text>
          <AutoCompleteInput
            label="Date"
            value={form.appointmentDate}
            onChangeText={(v) => handleInputChange('appointmentDate', v)}
            placeholder="MM/DD/YYYY"
            type="company"
          />
          <AutoCompleteInput
            label="Time"
            value={form.appointmentTime}
            onChangeText={(v) => handleInputChange('appointmentTime', v)}
            placeholder="HH:MM AM/PM"
            type="company"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <CheckCircle size={20} color="#FFFFFF" />
          <Text style={styles.submitText}>Submit Outbound Check-In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151937' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  content: { flex: 1 },
  section: { margin: 16, marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#334155' },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
