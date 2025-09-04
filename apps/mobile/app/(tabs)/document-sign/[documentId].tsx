import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

export default function DocumentSigningScreen() {
  const { documentId, documentName, fromChat } = useLocalSearchParams<{
    documentId: string;
    documentName: string;
    fromChat: string;
  }>();

  const [isLoading, setIsLoading] = useState(false);

  const handleSign = async () => {
    setIsLoading(true);
    try {
      // Simulate signing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Document signed successfully!');
      if (fromChat === 'true') {
        router.back();
      } else {
        router.push('/home');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign document');
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
        <Text style={styles.headerTitle}>Document Signing</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>Document: {documentName || 'Unknown'}</Text>
          <Text style={styles.documentId}>ID: {documentId}</Text>
        </View>

        <View style={styles.documentPreview}>
          <Text style={styles.previewText}>Document Preview</Text>
          <Text style={styles.previewSubtext}>This is where the document would be displayed</Text>
        </View>

        <TouchableOpacity
          style={[styles.signButton, isLoading && styles.signButtonDisabled]}
          onPress={handleSign}
          disabled={isLoading}
        >
          <CheckCircle size={20} color="#FFFFFF" />
          <Text style={styles.signButtonText}>
            {isLoading ? 'Signing...' : 'Sign Document'}
          </Text>
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
    gap: 20,
  },
  documentInfo: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  documentId: {
    fontSize: 14,
    color: '#94A3B8',
  },
  documentPreview: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  previewSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  signButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  signButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  signButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});