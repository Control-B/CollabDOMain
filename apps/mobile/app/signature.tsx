import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  CreditCard as Edit3,
  SquareCheck as CheckSquare,
  User,
  Upload,
  RotateCcw,
} from 'lucide-react-native';
import { router } from 'expo-router';
// import SignaturePad from '@/components/SignaturePad';
// import SignaturePreview from '@/components/SignaturePreview';
// storage is loaded lazily to avoid native crashes when unavailable

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error] = useState<null | string>(null);
  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#FCA5A5', fontWeight: '700', marginBottom: 8 }}>
          Signature screen failed to render
        </Text>
        <Text style={{ color: '#FCA5A5' }}>{error}</Text>
      </View>
    );
  }
  return (
    <View
      style={{ flex: 1 }}
      onLayout={() => {
        // no-op; exist to ensure this component is in the tree
      }}
    >
      {children}
    </View>
  );
}

export default function SignatureScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<
    'draw' | 'auto' | 'initials'
  >('auto');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [signaturePaths, setSignaturePaths] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlag, setSavedFlag] = useState(false);
  const signaturePadKey = useRef(0);

  useEffect(() => {
    if (__DEV__) {
      console.log('[SignatureScreen] mounted');
    }
  }, []);

  const handleCompleteSignature = () => {
    // Handle signature completion logic here
    console.log('Signature completed');
    console.log('Signature paths:', signaturePaths);
    console.log('Full name:', fullName);
    console.log('Email:', email);
    console.log('Method:', selectedMethod);
    router.back();
  };

  const clearSignature = () => {
    setSignaturePaths([]);
    signaturePadKey.current += 1;
  };

  const saveSignature = async () => {
    if (!signaturePaths.length) return;
    try {
      setIsSaving(true);
      const payload = {
        type: 'paths-v1',
        paths: signaturePaths,
        createdAt: new Date().toISOString(),
      };
      const json = JSON.stringify(payload);
      if (Platform.OS === 'web') {
        try {
          (globalThis as any).localStorage?.setItem('savedSignature', json);
        } catch {
          console.warn('localStorage unavailable; skipping web save');
        }
      } else {
        const { default: AsyncStorage } = await import(
          '@react-native-async-storage/async-storage'
        );
        await AsyncStorage.setItem('savedSignature', json);
      }
      setSavedFlag(true);
      setTimeout(() => setSavedFlag(false), 1500);
    } catch (err) {
      console.warn('Failed to save signature', err);
    } finally {
      setIsSaving(false);
    }
  };

  const signatureMethods = [
    {
      id: 'draw',
      title: 'Draw Signature',
      description: 'Use mouse or touch to draw',
      icon: Edit3,
      color: '#4F80FF',
    },
    {
      id: 'auto',
      title: 'Auto-Generate',
      description: 'Create from your typed name',
      icon: CheckSquare,
      color: '#10B981',
    },
    {
      id: 'initials',
      title: 'Initials',
      description: 'Auto-generate from your name',
      icon: User,
      color: '#8B5CF6',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#4F80FF" />
        </TouchableOpacity>
        <View pointerEvents="none" style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Create Signature</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        {/* Steps Indicator */}
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={[styles.stepCircle, styles.stepCompleted]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepCompletedText]}>
              Info
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Add Your Signature</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Signature Method Selection */}
        <View style={styles.methodSection}>
          <Text style={styles.sectionTitle}>Choose Signature Method</Text>

          <View style={styles.methodsGrid}>
            {signatureMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && styles.methodCardSelected,
                  { borderColor: method.color },
                ]}
                onPress={() => setSelectedMethod(method.id as any)}
              >
                <method.icon size={24} color={method.color} />
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodDescription}>
                  {method.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Section */}
        <View style={styles.generateSection}>
          <Text style={styles.sectionTitle}>Signature Preview</Text>

          <ErrorBoundary>
            {/* Force render preview card - always visible */}
            <View style={styles.previewCard}>
              {selectedMethod === 'auto' && (
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <SignaturePreview text={fullName} variant="auto" />
                  <Text style={styles.previewHint}>
                    Auto‑generated signature
                  </Text>
                </View>
              )}

              {selectedMethod === 'initials' && (
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <SignaturePreview text={fullName} variant="initials" />
                  <Text style={styles.previewHint}>Initials signature</Text>
                </View>
              )}

              {selectedMethod === 'draw' && (
                <>
                  <SignaturePad
                    key={signaturePadKey.current}
                    onChange={setSignaturePaths}
                    onStartDrawing={() => setScrollEnabled(false)}
                    onEndDrawing={() => setScrollEnabled(true)}
                    padHeight={360}
                  />
                  <View style={styles.drawingControls}>
                    <View style={styles.controlsLeft}>
                      <TouchableOpacity
                        style={styles.clearButton}
                        onPress={clearSignature}
                      >
                        <RotateCcw size={16} color="#EF4444" />
                        <Text style={styles.clearButtonText}>Clear</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveSignature}
                        disabled={!signaturePaths.length || isSaving}
                      >
                        <Text style={styles.saveButtonText}>
                          {isSaving ? 'Saving…' : 'Save'}
                        </Text>
                      </TouchableOpacity>
                      {savedFlag && <Text style={styles.savedPill}>Saved</Text>}
                    </View>
                    <Text style={styles.previewHint}>
                      {signaturePaths.length} stroke
                      {signaturePaths.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </ErrorBoundary>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.uploadButton}>
            <Upload size={16} color="#9CA3AF" />
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>

          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete Signature</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteSignature}
            >
              <Text style={styles.completeButtonText}>Complete Signature</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: { padding: 6, marginRight: 8 },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 0,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  step: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCompleted: {
    backgroundColor: '#10B981',
  },
  stepActive: {
    backgroundColor: '#4F80FF',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  stepCompletedText: {
    color: '#10B981',
  },
  stepActiveText: {
    color: '#4F80FF',
  },
  stepConnector: {
    width: 60,
    height: 2,
    backgroundColor: '#334155',
    marginHorizontal: 16,
  },
  formSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  methodSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  methodsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  methodCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#334155',
    padding: 16,
    alignItems: 'center',
  },
  methodCardSelected: {
    borderWidth: 2,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
    flexWrap: 'wrap',
  },
  generateSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  previewCard: {
    marginTop: 16,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#4F80FF',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    shadowColor: '#4F80FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  previewAuto: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: 16,
    // Prefer default system font on Android to avoid device-specific issues
    fontFamily:
      Platform.OS === 'ios' ? ('Times New Roman' as any) : (undefined as any),
    // Force visibility
    opacity: 1,
    zIndex: 10,
  },
  previewInitials: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    // Force visibility
    opacity: 1,
    zIndex: 10,
  },
  previewHint: { color: '#6B7280', marginTop: 6, fontSize: 12 },
  generateDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    marginBottom: 24,
    gap: 8,
  },
  uploadButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  completeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4F80FF',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  drawingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  controlsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 4,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  saveButtonText: {
    color: '#0B1221',
    fontSize: 12,
    fontWeight: '700',
  },
  savedPill: {
    marginLeft: 6,
    backgroundColor: '#065F46',
    color: '#A7F3D0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 10,
    overflow: 'hidden',
  },
});
