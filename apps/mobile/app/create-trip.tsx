import React, { useEffect, useMemo, useState } from 'react';
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
  Share,
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
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

type FormData = {
  driverName: string;
  companyName: string;
  phoneNumber: string;
  pickupLocationName: string;
  pickupAddress: string;
  pickupPhone: string;
  pickupNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  vehicleNumber: string;
  trailerNumber: string;
  deliveryLocationName: string;
  deliveryAddress: string;
  deliveryPhone: string;
  loadDetails: string;
  specialInstructions: string;
};

const EMPTY_FORM: FormData = {
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
};

export default function CreateTripScreen() {
  const navigation = useNavigation<any>();
  const params = useLocalSearchParams<{ mode?: string }>();
  const isCheckInMode = (params?.mode as string) === 'checkin';

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isEditing, setIsEditing] = useState(true);

  const storageKey = useMemo(
    () => (isCheckInMode ? 'tripSheetDraft' : 'tripSheetSaved'),
    [isCheckInMode]
  );

  // Driver profile persistence
  type DriverProfile = Pick<
    FormData,
    'driverName' | 'companyName' | 'phoneNumber'
  >;
  const DRIVER_PROFILE_KEY = 'driverProfile';
  const loadDriverProfile = async (): Promise<DriverProfile | null> => {
    try {
      if (Platform.OS === 'web') {
        const json = (globalThis as any).localStorage?.getItem(
          DRIVER_PROFILE_KEY
        );
        return json ? (JSON.parse(json) as DriverProfile) : null;
      } else {
        const { default: AsyncStorage } = await import(
          '@react-native-async-storage/async-storage'
        );
        const json = await AsyncStorage.getItem(DRIVER_PROFILE_KEY);
        return json ? (JSON.parse(json) as DriverProfile) : null;
      }
    } catch {
      return null;
    }
  };
  const saveDriverProfile = async (profile: DriverProfile) => {
    try {
      const json = JSON.stringify(profile);
      if (Platform.OS === 'web') {
        (globalThis as any).localStorage?.setItem(DRIVER_PROFILE_KEY, json);
      } else {
        const { default: AsyncStorage } = await import(
          '@react-native-async-storage/async-storage'
        );
        await AsyncStorage.setItem(DRIVER_PROFILE_KEY, json);
      }
    } catch {}
  };

  // Load saved data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        let json: string | null = null;
        if (Platform.OS === 'web') {
          try {
            json =
              (globalThis as any).localStorage?.getItem(storageKey) ?? null;
          } catch {}
        } else {
          const { default: AsyncStorage } = await import(
            '@react-native-async-storage/async-storage'
          );
          json = await AsyncStorage.getItem(storageKey);
        }
        if (!mounted) return;
        if (json) {
          const data = JSON.parse(json) as FormData;
          setFormData(data);
          // In check-in mode keep editable; otherwise default to read-only
          setIsEditing(isCheckInMode ? true : false);
        } else {
          // No saved/draft data; prefill from driver profile if available
          const profile = await loadDriverProfile();
          if (profile) {
            const prefilled: FormData = {
              ...EMPTY_FORM,
              driverName: profile.driverName,
              companyName: profile.companyName,
              phoneNumber: profile.phoneNumber,
            };
            setFormData(prefilled);
          } else {
            setFormData(EMPTY_FORM);
          }
          setIsEditing(true);
        }
      } catch {
        console.warn('Failed to load trip sheet state');
      }
    };
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, isCheckInMode]);

  const setStorageItem = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      try {
        (globalThis as any).localStorage?.setItem(key, value);
      } catch {}
    } else {
      const { default: AsyncStorage } = await import(
        '@react-native-async-storage/async-storage'
      );
      await AsyncStorage.setItem(key, value);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (
      !formData.driverName ||
      !formData.companyName ||
      !formData.vehicleNumber ||
      !formData.pickupAddress
    ) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const saveCurrent = async (key: string) => {
    try {
      const json = JSON.stringify(formData);
      await setStorageItem(key, json);
    } catch {
      console.warn('Failed to save trip sheet');
    }
  };

  const handleSaveTrip = async () => {
    if (!validateForm()) return;
    if (isCheckInMode) {
      // In check-in mode allow saving a snapshot if needed
      await saveCurrent('tripSheetDraft');
      Alert.alert('Saved', 'Trip sheet saved. You can proceed to Check-In.');
      return;
    }
    await saveCurrent('tripSheetSaved');
    // Persist driver profile fields to avoid redundant typing next time
    await saveDriverProfile({
      driverName: formData.driverName,
      companyName: formData.companyName,
      phoneNumber: formData.phoneNumber,
    });
    setIsEditing(false);
    Alert.alert('Saved', 'Trip sheet saved.');
  };

  // Removed handleCancel; navigation is handled via the header back arrow

  // No separate submit flow; Check-In happens from Home after a saved sheet exists

  const renderInputField = (
    label: string,
    field: keyof FormData,
    icon: React.ReactNode,
    placeholder: string,
    required = false,
    multiline = false,
    textColor?: string
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
        style={[
          styles.input,
          !isEditing && styles.inputReadOnly,
          multiline && styles.multilineInput,
          textColor ? { color: textColor } : null,
        ]}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        editable={isEditing}
        selectTextOnFocus={isEditing}
      />
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const handleBack = () => {
    try {
      if (
        navigation &&
        typeof navigation.canGoBack === 'function' &&
        navigation.canGoBack()
      ) {
        navigation.goBack();
      } else {
        router.replace('/(tabs)/home');
      }
    } catch {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Trip Sheet</Text>

        {/* spacer to balance back button width */}
        <View style={{ width: 32 }} />
      </View>

      {/* Removed inline Back/Cancel button; rely on header back arrow */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Driver Information */}
        {renderSection(
          'DRIVER INFORMATION',
          <>
            {renderInputField(
              'Driver Name',
              'driverName',
              <User size={16} color="#10B981" />,
              'Enter driver full name',
              true,
              false,
              '#10B981'
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

        {/* Vehicle Information */}
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

        {/* Pickup Information */}
        {renderSection(
          'PICKUP LOCATION',
          <>
            {renderInputField(
              'Location Name',
              'pickupLocationName',
              <MapPin size={16} color="#24AEFF" />,
              'e.g., Warehouse A, Store Name',
              true
            )}
            {renderInputField(
              'Address',
              'pickupAddress',
              <MapPin size={16} color="#24AEFF" />,
              'Enter complete pickup address',
              true
            )}
            {renderInputField(
              'Contact Phone',
              'pickupPhone',
              <Phone size={16} color="#2323FF" />,
              'Pickup location phone number'
            )}
            {renderInputField(
              'PO/Pickup Number',
              'pickupNumber',
              <Package size={16} color="#9F7560" />,
              'Purchase order or pickup reference number'
            )}
          </>
        )}

        {/* Appointment Information */}
        {renderSection(
          'APPOINTMENT',
          <>
            {renderInputField(
              'Date',
              'appointmentDate',
              <Calendar size={16} color="#AAD31E" />,
              'MM/DD/YYYY',
              true
            )}
            {renderInputField(
              'Time',
              'appointmentTime',
              <Clock size={16} color="#807D52" />,
              'HH:MM AM/PM',
              true
            )}
          </>
        )}

        {/* Delivery Information */}
        {renderSection(
          'DELIVERY LOCATION',
          <>
            {renderInputField(
              'Location Name',
              'deliveryLocationName',
              <MapPin size={16} color="#D4AF9F" />,
              'e.g., Customer Store, Delivery Point'
            )}
            {renderInputField(
              'Address',
              'deliveryAddress',
              <MapPin size={16} color="#D4AF9F" />,
              'Enter complete delivery address'
            )}
            {renderInputField(
              'Contact Phone',
              'deliveryPhone',
              <Phone size={16} color="#525034" />,
              'Delivery location phone number'
            )}
          </>
        )}

        {/* Load Information */}
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

        {/* Bottom horizontal action bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionBar}
          style={{ marginTop: 8 }}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => setIsEditing(true)}
            accessibilityRole="button"
            accessibilityLabel="Edit Trip Sheet"
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={handleSaveTrip}
            accessibilityRole="button"
            accessibilityLabel="Save Trip Sheet"
          >
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={async () => {
              try {
                const summary = `Trip Sheet\nDriver: ${
                  formData.driverName
                }\nCompany: ${formData.companyName}\nPhone: ${
                  formData.phoneNumber
                }\nVehicle: ${formData.vehicleNumber}\nPickup: ${
                  formData.pickupLocationName || formData.pickupAddress
                }\nDelivery: ${
                  formData.deliveryLocationName || formData.deliveryAddress
                }`;
                await Share.share({ message: summary });
              } catch {
                Alert.alert('Share Failed', 'Unable to open share sheet.');
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Share Trip Sheet"
          >
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonDanger]}
            onPress={async () => {
              Alert.alert(
                'Delete Trip Sheet',
                'Are you sure you want to delete this trip sheet?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        if (Platform.OS === 'web') {
                          try {
                            (globalThis as any).localStorage?.removeItem(
                              'tripSheetSaved'
                            );
                          } catch {}
                        } else {
                          const { default: AsyncStorage } = await import(
                            '@react-native-async-storage/async-storage'
                          );
                          await AsyncStorage.removeItem('tripSheetSaved');
                        }
                        setFormData(EMPTY_FORM);
                        setIsEditing(true);
                        Alert.alert('Deleted', 'Trip sheet deleted.');
                      } catch {
                        Alert.alert('Error', 'Failed to delete trip sheet.');
                      }
                    },
                  },
                ]
              );
            }}
            accessibilityRole="button"
            accessibilityLabel="Delete Trip Sheet"
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomPadding} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1E293B',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  // header right spacer now; no save button
  editButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  // removed inline cancel styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A3AEC2',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  required: {
    color: '#525034',
  },
  input: {
    backgroundColor: '#182235',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#22C55E',
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  inputReadOnly: {
    backgroundColor: '#111827',
    borderColor: '#4B5563',
    color: '#22C55E',
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  actionBar: {
    paddingVertical: 8,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 12,
  },
  actionButtonPrimary: {
    backgroundColor: '#10B981',
  },
  actionButtonSecondary: {
    backgroundColor: '#374151',
  },
  actionButtonDanger: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomPadding: {
    height: 32,
  },
});
