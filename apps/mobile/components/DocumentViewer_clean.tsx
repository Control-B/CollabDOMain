import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  X,
  Share,
  FileText,
  PenTool,
  Type,
  Save,
  Calendar,
} from 'lucide-react-native';
import SignaturePreview from './SignaturePreview';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SignatureField {
  id: string;
  type: 'signature' | 'initials' | 'text' | 'date';
  x: number;
  y: number;
  width: number;
  height: number;
  value?: string;
  signatureData?: string[];
  isDragging?: boolean;
}

interface DocumentViewerProps {
  documentUrl?: string;
  documentName: string;
  onClose: () => void;
  onSave?: (documentData: any) => void;
  signerName?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentUrl,
  documentName,
  onClose,
  onSave,
  signerName: propSignerName,
}) => {
  const [signatureFields, setSignatureFields] = useState<SignatureField[]>([]);
  const [selectedTool, setSelectedTool] = useState<
    'signature' | 'initials' | 'text' | 'date'
  >('signature');
  const [signerName] = useState(propSignerName || 'John Doe');
  const [isDraggingAny, setIsDraggingAny] = useState(false);
  const containerRef = useRef<View | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [savedSignature, setSavedSignature] = useState<any>(null);

  // Mobile responsiveness
  const isMobile = screenWidth < 768;

  useEffect(() => {
    const loadSavedSignature = async () => {
      try {
        let storedData;
        if (Platform.OS === 'web') {
          storedData = localStorage.getItem('signature_paths');
        } else {
          storedData = await AsyncStorage.getItem('signature_paths');
        }
        if (storedData) {
          const signatureData = JSON.parse(storedData);
          setSavedSignature(signatureData);
        }
      } catch (error) {
        console.log('Error loading signature:', error);
      }
    };
    loadSavedSignature();
  }, []);

  const handleTapToSign = (x: number, y: number) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const baseWidth =
      selectedTool === 'signature'
        ? isMobile
          ? 120
          : 150
        : selectedTool === 'initials'
        ? isMobile
          ? 60
          : 80
        : isMobile
        ? 80
        : 100;
    const baseHeight =
      selectedTool === 'signature'
        ? isMobile
          ? 50
          : 60
        : selectedTool === 'initials'
        ? isMobile
          ? 30
          : 40
        : isMobile
        ? 25
        : 30;

    const newField: SignatureField = {
      id: Date.now().toString(),
      x,
      y,
      width: baseWidth,
      height: baseHeight,
      type: selectedTool,
      isDragging: false,
      value: selectedTool === 'date' ? currentDate : undefined,
    };

    setSignatureFields((prev) => [...prev, newField]);
  };

  const handleDocumentPress = (e: any) => {
    if (isDraggingAny) return;
    const ne = e?.nativeEvent || {};

    const baseWidth =
      selectedTool === 'signature'
        ? isMobile
          ? 120
          : 150
        : selectedTool === 'initials'
        ? isMobile
          ? 60
          : 80
        : isMobile
        ? 80
        : 100;
    const baseHeight =
      selectedTool === 'signature'
        ? isMobile
          ? 50
          : 60
        : selectedTool === 'initials'
        ? isMobile
          ? 30
          : 40
        : isMobile
        ? 25
        : 30;

    const { locationX, locationY } = ne;

    if (typeof locationX !== 'number' || typeof locationY !== 'number') return;

    let x = locationX - baseWidth / 2;
    let y = locationY - baseHeight / 2;
    const maxX = Math.max(0, containerSize.width - baseWidth);
    const maxY = Math.max(0, containerSize.height - baseHeight);
    x = Math.min(Math.max(0, x), maxX || x);
    y = Math.min(Math.max(0, y), maxY || y);
    handleTapToSign(x, y);
  };

  const removeField = (fieldId: string) => {
    setSignatureFields((prev) => prev.filter((f) => f.id !== fieldId));
  };

  const renderSignatureField = (field: SignatureField) => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        setIsDraggingAny(true);
        setSignatureFields((prev) =>
          prev.map((f) => (f.id === field.id ? { ...f, isDragging: true } : f))
        );
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;

        let newX = field.x + dx;
        let newY = field.y + dy;

        const maxX = Math.max(0, containerSize.width - field.width);
        const maxY = Math.max(0, containerSize.height - field.height);
        newX = Math.min(Math.max(0, newX), maxX || newX);
        newY = Math.min(Math.max(0, newY), maxY || newY);

        setSignatureFields((prev) =>
          prev.map((f) =>
            f.id === field.id ? { ...f, x: newX, y: newY, isDragging: true } : f
          )
        );
      },
      onPanResponderRelease: () => {
        setIsDraggingAny(false);
        setSignatureFields((prev) =>
          prev.map((f) => (f.id === field.id ? { ...f, isDragging: false } : f))
        );
      },
    });

    return (
      <View
        key={field.id}
        style={[
          styles.signatureField,
          {
            left: field.x,
            top: field.y,
            width: field.width,
            height: field.height,
            borderColor: field.isDragging ? '#EF4444' : '#3B82F6',
            backgroundColor: field.isDragging
              ? 'rgba(239, 68, 68, 0.2)'
              : 'rgba(59, 130, 246, 0.15)',
            borderWidth: field.isDragging ? 3 : 2,
            zIndex: field.isDragging ? 20 : 10,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {field.type === 'signature' && (
          <View
            style={{
              transform: [{ scale: isMobile ? 0.7 : 0.8 }],
              backgroundColor: '#F8F9FA',
              padding: isMobile ? 4 : 6,
              borderRadius: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              minWidth: isMobile ? 100 : 120,
              minHeight: isMobile ? 30 : 40,
            }}
          >
            <SignaturePreview
              text={signerName}
              variant="auto"
              signatureData={savedSignature}
            />
          </View>
        )}
        {field.type === 'initials' && (
          <View
            style={{
              transform: [{ scale: isMobile ? 0.5 : 0.6 }],
              backgroundColor: '#F8F9FA',
              padding: isMobile ? 4 : 6,
              borderRadius: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              minWidth: isMobile ? 50 : 60,
              minHeight: isMobile ? 25 : 30,
            }}
          >
            <SignaturePreview
              text={signerName}
              variant="initials"
              signatureData={savedSignature}
            />
          </View>
        )}
        {field.type === 'text' && (
          <Text style={styles.textField}>{field.value || 'Text Field'}</Text>
        )}
        {field.type === 'date' && (
          <Text style={styles.dateText}>
            {field.value || new Date().toLocaleDateString()}
          </Text>
        )}

        {/* Close Button */}
        <TouchableOpacity
          style={styles.removeField}
          onPress={() => removeField(field.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <X size={14} color="#EF4444" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleSave = () => {
    if (signatureFields.length === 0) {
      Alert.alert(
        'No Signatures',
        'Please add at least one signature or initial to the document before saving.'
      );
      return;
    }

    const signedDocument = {
      documentName,
      documentUrl,
      signatureFields,
      signedDate: new Date().toISOString(),
      signerName,
    };

    onSave?.(signedDocument);
    Alert.alert('Success', 'Document signed successfully!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{documentName}</Text>
          <Text style={styles.headerSubtitle}>
            Tap to place signature fields
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
            <Save size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbarContent}
        >
          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === 'signature' && styles.toolButtonSignature,
            ]}
            onPress={() => setSelectedTool('signature')}
          >
            <PenTool size={16} color="#FFFFFF" />
            <Text style={styles.toolButtonText}>Signature</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === 'initials' && styles.toolButtonInitials,
            ]}
            onPress={() => setSelectedTool('initials')}
          >
            <Type size={16} color="#FFFFFF" />
            <Text style={styles.toolButtonText}>Initials</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === 'text' && styles.toolButtonTextStyle,
            ]}
            onPress={() => setSelectedTool('text')}
          >
            <FileText size={16} color="#FFFFFF" />
            <Text style={styles.toolButtonText}>Text</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === 'date' && styles.toolButtonDate,
            ]}
            onPress={() => setSelectedTool('date')}
          >
            <Calendar size={16} color="#FFFFFF" />
            <Text style={styles.toolButtonText}>Date</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Document */}
      <ScrollView style={styles.documentScrollView}>
        <TouchableWithoutFeedback onPress={handleDocumentPress}>
          <View
            ref={containerRef}
            style={[
              styles.documentContainer,
              {
                margin: isMobile ? 8 : 12,
                padding: isMobile ? 12 : 16,
                minHeight: screenHeight - (isMobile ? 180 : 200),
                maxWidth: isMobile ? screenWidth - 16 : '100%',
              },
            ]}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setContainerSize({ width, height });
            }}
          >
            <Text style={styles.documentTitle}>Contract Agreement</Text>
            <Text style={styles.documentText}>
              1. PURPOSE: This document outlines the terms and conditions for
              the agreement between the parties involved.
            </Text>
            <Text style={styles.documentText}>
              2. RESPONSIBILITIES: Each party agrees to fulfill their designated
              responsibilities as outlined in this agreement.
            </Text>
            <Text style={styles.documentText}>
              3. SIGNATURES: By signing below, both parties agree to the terms
              outlined in this agreement.
            </Text>

            <View style={styles.signatureSection}>
              <View style={styles.signatureLine}>
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View>
                    <Text style={[styles.signatureLabel, styles.signableText]}>
                      Driver Signature:
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View style={styles.signatureBox} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View>
                    <Text style={[styles.dateLabel, styles.signableText]}>
                      Date: _________
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.signatureLine}>
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View>
                    <Text style={[styles.signatureLabel, styles.signableText]}>
                      Supervisor Initials:
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View style={styles.initialsBox} />
                </TouchableWithoutFeedback>
              </View>
            </View>

            <Text style={styles.documentText}>
              4. EFFECTIVE DATE: This agreement becomes effective upon signature
              by all parties.
            </Text>

            {signatureFields.map(renderSignatureField)}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Select a tool above, then tap anywhere on the document to place it.
          Drag to reposition. Tap X to remove.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  closeButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  toolbar: {
    backgroundColor: 'transparent',
    paddingVertical: screenWidth < 768 ? 6 : 8,
    paddingHorizontal: screenWidth < 768 ? 8 : 16,
    maxHeight: screenWidth < 768 ? 60 : 80,
  },
  toolbarContent: {
    paddingHorizontal: screenWidth < 768 ? 4 : 8,
    alignItems: 'center',
    gap: screenWidth < 768 ? 8 : 12,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth < 768 ? 8 : 12,
    paddingVertical: screenWidth < 768 ? 6 : 8,
    borderRadius: 20,
    backgroundColor: '#6B7280',
    gap: 6,
    minWidth: 90,
    justifyContent: 'center',
  },
  toolButtonSignature: {
    backgroundColor: '#3B82F6',
  },
  toolButtonInitials: {
    backgroundColor: '#10B981',
  },
  toolButtonTextStyle: {
    backgroundColor: '#F59E0B',
  },
  toolButtonDate: {
    backgroundColor: '#8B5CF6',
  },
  toolButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  documentScrollView: {
    flex: 1,
  },
  documentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1F2937',
  },
  documentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
    marginBottom: 16,
  },
  signatureSection: {
    marginBottom: 32,
  },
  signatureLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  signatureLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  signatureBox: {
    width: 200,
    height: 80,
    borderBottomWidth: 2,
    borderBottomColor: '#D1D5DB',
    marginLeft: 16,
  },
  initialsBox: {
    width: 100,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#D1D5DB',
    marginLeft: 16,
  },
  dateLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  signatureField: {
    position: 'absolute',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    minWidth: 80,
    minHeight: 30,
  },
  removeField: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    elevation: 15,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#EF4444',
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textField: {
    fontSize: screenWidth < 768 ? 12 : 14,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: screenWidth < 768 ? 6 : 8,
    paddingVertical: screenWidth < 768 ? 3 : 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  dateText: {
    fontSize: screenWidth < 768 ? 12 : 14,
    color: '#059669',
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: screenWidth < 768 ? 6 : 8,
    paddingVertical: screenWidth < 768 ? 3 : 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#059669',
  },
  instructions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2D3748',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  instructionsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  signableText: {
    color: '#3B82F6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default DocumentViewer;
