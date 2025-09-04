import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  User,
  Phone,
  Truck,
  MapPin,
  Calendar,
  Package,
  Clock,
  Save,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function CreateTripScreen() {
  const [formData, setFormData] = useState({
    driverName: '',
    companyName: '',
    phoneNumber: '',
    vehicleNumber: '',
    trailerNumber: '',
    pickupLocationName: '',
    pickupAddress: '',
    pickupPhone: '',
    pickupNumber: '',
    appointmentDate: '',
    appointmentTime: '',
    deliveryLocationName: '',
    deliveryAddress: '',
    deliveryPhone: '',
    loadDetails: '',
    specialInstructions: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveTrip = () => {
    if (
      !formData.driverName ||
      !formData.companyName ||
      !formData.vehicleNumber ||
      !formData.pickupAddress
    ) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const tripNumber = `TRP-${Date.now().toString().slice(-6)}-2024`;

    Alert.alert(
      'Trip Created Successfully!',
      `Trip ${tripNumber} has been created.\n\nDriver: ${
        formData.driverName
      }\nVehicle: ${formData.vehicleNumber}\nPickup: ${
        formData.pickupLocationName || formData.pickupAddress
      }\n\nThe trip is now active and location tracking has started.`,
      [
        { text: 'View Trip', onPress: () => router.replace('/trip-sheets') },
        {
          text: 'Create Another',
          style: 'cancel',
          onPress: () => {
            setFormData({
              driverName: '',
              companyName: '',
              phoneNumber: '',
              vehicleNumber: '',
              trailerNumber: '',
              pickupLocationName: '',
              pickupAddress: '',
              pickupPhone: '',
              pickupNumber: '',
              appointmentDate: '',
              appointmentTime: '',
              deliveryLocationName: '',
              deliveryAddress: '',
              deliveryPhone: '',
              loadDetails: '',
              specialInstructions: '',
            });
          },
        },
      ]
    );
  };

  const renderInputField = (
    label: string,
    field: string,
    icon: any,
    placeholder: string,
    required = false,
    multiline = false
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        {icon}
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={formData[field as keyof typeof formData]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

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
        <Text style={styles.headerTitle}>Create Trip Sheet</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTrip}>
          <Save size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection(
          'DRIVER INFORMATION',
          <>
            {renderInputField(
              'Driver Name',
              'driverName',
              <User size={16} color="#10B981" />,
              'Enter driver full name',
              true
            )}
            {renderInputField(
              'Phone Number',
              'phoneNumber',
              <Phone size={16} color="#10B981" />,
              'Enter phone number',
              true
            )}
            {renderInputField(
              'Company Name',
              'companyName',
              <User size={16} color="#10B981" />,
              'Enter company name',
              true
            )}
          </>
        )}

        {renderSection(
          'VEHICLE INFORMATION',
          <>
            {renderInputField(
              'Truck/Vehicle Number',
              'vehicleNumber',
              <Truck size={16} color="#3B82F6" />,
              'Enter vehicle ID or number',
              true
            )}
            {renderInputField(
              'Trailer Number',
              'trailerNumber',
              <Truck size={16} color="#3B82F6" />,
              'Enter trailer number (optional)'
            )}
          </>
        )}

        {renderSection(
          'PICKUP LOCATION',
          <>
            {renderInputField(
              'Location Name',
              'pickupLocationName',
              <MapPin size={16} color="#0EA5E9" />,
              'e.g., Warehouse A, Store Name',
              true
            )}
            {renderInputField(
              'Address',
              'pickupAddress',
              <MapPin size={16} color="#0EA5E9" />,
              'Enter complete pickup address',
              true
            )}
            {renderInputField(
              'Contact Phone',
              'pickupPhone',
              <Phone size={16} color="#06B6D4" />,
              'Pickup location phone number'
            )}
            {renderInputField(
              'PO/Pickup Number',
              'pickupNumber',
              <Package size={16} color="#8B5CF6" />,
              'Purchase order or pickup reference number'
            )}
          </>
        )}

        {renderSection(
          'APPOINTMENT',
          <>
            {renderInputField(
              'Date',
              'appointmentDate',
              <Calendar size={16} color="#10B981" />,
              'MM/DD/YYYY',
              true
            )}
            {renderInputField(
              'Time',
              'appointmentTime',
              <Clock size={16} color="#059669" />,
              'HH:MM AM/PM',
              true
            )}
          </>
        )}

        {renderSection(
          'DELIVERY LOCATION',
          <>
            {renderInputField(
              'Location Name',
              'deliveryLocationName',
              <MapPin size={16} color="#F59E0B" />, 
              'e.g., Customer Store, Delivery Point'
            )}
            {renderInputField(
              'Address',
              'deliveryAddress',
              <MapPin size={16} color="#F59E0B" />,
              'Enter complete delivery address'
            )}
            {renderInputField(
              'Contact Phone',
              'deliveryPhone',
              <Phone size={16} color="#F97316" />,
              'Delivery location phone number'
            )}
          </>
        )}

        {renderSection(
          'LOAD DETAILS',
          <>
            {renderInputField(
              'Load Description',
              'loadDetails',
              <Package size={16} color="#06B6D4" />,
              'e.g., Electronics - 50 boxes, Furniture - 20 items'
            )}
            {renderInputField(
              'Special Instructions',
              'specialInstructions',
              <Package size={16} color="#06B6D4" />,
              'Any special handling or delivery instructions',
              false,
              true
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.saveButtonLarge}
          onPress={handleSaveTrip}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Create Trip Sheet</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151937' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1E293B',
  },
  backButton: { padding: 8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: { backgroundColor: '#10B981', borderRadius: 8, padding: 8 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  inputContainer: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginLeft: 8 },
  required: { color: '#7C2D12' },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#22C55E',
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  multilineInput: { height: 80, textAlignVertical: 'top' },
  saveButtonLarge: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomPadding: { height: 32 },
});
