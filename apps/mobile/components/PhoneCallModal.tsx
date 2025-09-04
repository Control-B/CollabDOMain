import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  Linking,
  Alert,
} from 'react-native';

export default function PhoneCallModal({
  visible,
  onClose,
  defaultNumber,
}: {
  visible: boolean;
  onClose: () => void;
  defaultNumber?: string;
}) {
  const [number, setNumber] = useState(defaultNumber || '');

  const startCall = async () => {
    if (!number.trim()) return;
    const uri = `${
      Platform.OS === 'ios' ? 'telprompt' : 'tel'
    }:${number.trim()}`;
    const can = await Linking.canOpenURL(uri);
    if (!can) {
      Alert.alert(
        'Cannot start call',
        'Phone calling is not supported on this device'
      );
      return;
    }
    onClose();
    await Linking.openURL(uri);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Start Call</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor="#6B7280"
            value={number}
            onChangeText={setNumber}
          />
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.btn, styles.cancel]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={startCall}
              style={[styles.btn, styles.primary]}
            >
              <Text style={styles.primaryText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: { color: '#FFFFFF', fontWeight: '700', marginBottom: 12 },
  input: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    color: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  cancel: { backgroundColor: '#334155' },
  cancelText: { color: '#FFFFFF' },
  primary: { backgroundColor: '#4F80FF' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
});
