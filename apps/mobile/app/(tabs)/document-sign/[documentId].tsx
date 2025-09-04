import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import DocumentViewer from '@/components/DocumentViewer';

export default function DocumentSigningScreen() {
  const { documentId, documentName, fromChat } = useLocalSearchParams<{
    documentId: string;
    documentName: string;
    fromChat: string;
  }>();

  const [signerName, setSignerName] = useState('');
  const [preloadedSignature, setPreloadedSignature] = useState<string[]>([]);

  useEffect(() => {
    // Load user's saved signature if available
    loadSavedSignature();
    // Load user's name
    setSignerName('John Smith'); // In real app, get from user profile
  }, []);

  const loadSavedSignature = async () => {
    try {
      const { default: AsyncStorage } = await import(
        '@react-native-async-storage/async-storage'
      );
      const saved = await AsyncStorage.getItem('savedSignature');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.paths) {
          setPreloadedSignature(data.paths);
        }
      }
    } catch (error) {
      console.warn('Failed to load saved signature:', error);
    }
  };

  const handleDocumentSave = (signedDocument: any) => {
    console.log('Document signed:', signedDocument);

    Alert.alert(
      'Document Signed Successfully',
      'Your signature has been added to the document.',
      [
        {
          text: 'OK',
          onPress: () => {
            if (fromChat === 'true') {
              // Return to chat with signed document
              router.back();
            } else {
              // Return to documents list
              router.push('/documents');
            }
          },
        },
      ]
    );
  };

  const handleClose = () => {
    if (fromChat === 'true') {
      router.back();
    } else {
      router.push('/documents');
    }
  };

  return (
    <View style={styles.container}>
      <DocumentViewer
        documentName={documentName || `Document ${documentId}`}
        onClose={handleClose}
        onSave={handleDocumentSave}
        preloadedSignature={preloadedSignature}
        signerName={signerName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
