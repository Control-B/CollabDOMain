import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  PanResponder,
  GestureResponderEvent,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PenTool, Type, RotateCcw, X, Check } from 'lucide-react-native';
import {
  useFonts,
  DancingScript_400Regular,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';

// no-op

interface SignatureInterfaceProps {
  onSave?: (signatureData: SignatureData) => void;
  onCancel?: () => void;
  mode?: 'signature' | 'initials';
  documentTitle?: string;
  penColor?: string;
  penWidth?: number;
  padHeight?: number;
  // When true, renders an internal header row. Defaults to false to avoid duplicate headers.
  showHeader?: boolean;
}

interface SignatureData {
  type: 'draw' | 'type';
  content: string;
  mode: 'signature' | 'initials';
  timestamp: string;
}

function SignatureInterface(
  {
    onSave,
    onCancel,
    mode = 'signature',
    documentTitle = 'Document',
    penColor = '#FFFFFF',
    penWidth = 3,
    padHeight = 400,
    showHeader = false,
  }: SignatureInterfaceProps,
  ref: React.Ref<SignatureInterfaceHandle>
) {
  const [signatureMethod, setSignatureMethod] = useState<'draw' | 'type'>(
    'draw'
  );
  const [typedText, setTypedText] = useState('');
  const [drawnPaths, setDrawnPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const drawingAreaRef = useRef<View>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [fontsLoaded] = useFonts({
    DancingScript_400Regular,
    DancingScript_700Bold,
  });

  useEffect(() => {
    console.log('SignatureInterface mounted:', { mode, signatureMethod });
  }, [mode, signatureMethod]);

  // PanResponder for drawing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => signatureMethod === 'draw',
      onMoveShouldSetPanResponder: () => signatureMethod === 'draw',
      onStartShouldSetPanResponderCapture: () => signatureMethod === 'draw',
      onMoveShouldSetPanResponderCapture: () => signatureMethod === 'draw',

      onPanResponderGrant: (evt: GestureResponderEvent) => {
        // Lock scroll while drawing so the canvas doesn't move
        setScrollEnabled(false);
        const { locationX, locationY } = evt.nativeEvent;
        const start = `M ${locationX.toFixed(2)} ${locationY.toFixed(2)}`;
        setCurrentPath(start);
      },

      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath((prev) => {
          const moveTo = `M ${locationX.toFixed(2)} ${locationY.toFixed(2)}`;
          return prev
            ? `${prev} L ${locationX.toFixed(2)} ${locationY.toFixed(2)}`
            : moveTo;
        });
      },

      onPanResponderRelease: () => {
        setCurrentPath((finalPath) => {
          if (finalPath) {
            setDrawnPaths((prev) => [...prev, finalPath]);
          }
          return null;
        });
        // Re-enable scroll after drawing ends
        setScrollEnabled(true);
      },

      onPanResponderTerminate: () => {
        setCurrentPath((finalPath) => {
          if (finalPath) {
            setDrawnPaths((prev) => [...prev, finalPath]);
          }
          return null;
        });
        // Ensure scroll is re-enabled if gesture terminates
        setScrollEnabled(true);
      },

      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const clearSignature = () => {
    if (signatureMethod === 'draw') {
      setDrawnPaths([]);
      setCurrentPath(null);
    } else {
      setTypedText('');
    }
  };

  const handleSave = () => {
    let signatureData: SignatureData;

    if (signatureMethod === 'draw') {
      if (drawnPaths.length === 0) {
        Alert.alert('Error', `Please draw your ${mode} before saving`);
        return;
      }
      signatureData = {
        type: 'draw',
        content: drawnPaths.join(' '),
        mode,
        timestamp: new Date().toISOString(),
      };
    } else {
      if (!typedText.trim()) {
        Alert.alert(
          'Error',
          `Please enter your ${
            mode === 'signature' ? 'name' : 'initials'
          } before saving`
        );
        return;
      }
      signatureData = {
        type: 'type',
        content: typedText.trim(),
        mode,
        timestamp: new Date().toISOString(),
      };
    }

    console.log('SignatureInterface: Saving signature data:', signatureData);
    onSave?.(signatureData);
  };

  // Expose imperative methods to parent components (e.g., header menu actions)
  useImperativeHandle(ref, () => ({
    clear: clearSignature,
    save: handleSave,
    hasContent: () =>
      signatureMethod === 'draw'
        ? drawnPaths.length > 0
        : typedText.trim().length > 0,
  }));

  const renderMethodSelector = () => (
    <View style={styles.methodSelector}>
      <TouchableOpacity
        style={[
          styles.methodButton,
          signatureMethod === 'draw' && styles.methodButtonActive,
        ]}
        onPress={() => setSignatureMethod('draw')}
      >
        <PenTool
          size={20}
          color={signatureMethod === 'draw' ? '#FFFFFF' : '#9CA3AF'}
        />
        <Text
          style={[
            styles.methodButtonText,
            signatureMethod === 'draw' && styles.methodButtonTextActive,
          ]}
        >
          Draw Signature
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodButton,
          signatureMethod === 'type' && styles.methodButtonActive,
        ]}
        onPress={() => setSignatureMethod('type')}
      >
        <Type
          size={20}
          color={signatureMethod === 'type' ? '#FFFFFF' : '#9CA3AF'}
        />
        <Text
          style={[
            styles.methodButtonText,
            signatureMethod === 'type' && styles.methodButtonTextActive,
          ]}
        >
          Type Signature
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDrawInterface = () => (
    <View style={styles.drawContainer}>
      <View
        ref={drawingAreaRef}
        style={[styles.drawingArea, { height: padHeight - 60 }]}
        {...panResponder.panHandlers}
      >
        <Svg style={styles.svg} pointerEvents="none">
          {drawnPaths.map((d, idx) => (
            <Path
              key={idx}
              d={d}
              stroke={penColor}
              strokeWidth={penWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath && (
            <Path
              d={currentPath}
              stroke={penColor}
              strokeWidth={penWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
        {!drawnPaths.length && !currentPath && (
          <Text style={styles.instructionText} pointerEvents="none">
            Touch and drag to draw your {mode}
          </Text>
        )}
      </View>
    </View>
  );

  const renderTypeInterface = () => (
    <View style={styles.typeContainer}>
      <Text style={styles.typeLabel}>
        {mode === 'signature'
          ? 'Enter your full name:'
          : 'Enter your initials:'}
      </Text>

      <TextInput
        style={styles.typeInput}
        value={typedText}
        onChangeText={setTypedText}
        placeholder={mode === 'signature' ? 'Your Full Name' : 'Your Initials'}
        placeholderTextColor="#6B7280"
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={mode === 'signature' ? 50 : 5}
      />

      {typedText.length > 0 && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Preview:</Text>
          <View style={styles.cursivePreview}>
            <Text
              style={{
                color: penColor,
                fontSize: mode === 'signature' ? 28 : 36,
                textAlign: 'center',
                fontFamily: fontsLoaded ? 'DancingScript_700Bold' : undefined,
                fontStyle: fontsLoaded ? undefined : 'italic',
              }}
            >
              {typedText}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const hasContent =
    signatureMethod === 'draw'
      ? drawnPaths.length > 0
      : typedText.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Optional internal header (hidden by default to avoid duplication) */}
      {showHeader && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <X size={20} color="#EF4444" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {mode === 'signature' ? 'Sign Document' : 'Add Initials'}
            </Text>
            <Text
              style={styles.headerSubtitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {documentTitle}
            </Text>
          </View>

          <View style={{ width: 80 }} />
        </View>
      )}

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={scrollEnabled}
      >
        {/* Method Selector */}
        {renderMethodSelector()}

        {/* Signature Interface */}
        <View style={styles.signatureContainer}>
          {signatureMethod === 'draw'
            ? renderDrawInterface()
            : renderTypeInterface()}
        </View>
      </ScrollView>

      {/* Fixed Action Buttons at Bottom */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={clearSignature}
          disabled={!hasContent}
        >
          <RotateCcw size={16} color={hasContent ? '#FFFFFF' : '#6B7280'} />
          <Text
            style={[
              styles.actionButtonText,
              !hasContent && styles.disabledText,
            ]}
          >
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.saveButton,
            hasContent && styles.saveButtonActive,
          ]}
          onPress={handleSave}
          disabled={!hasContent}
        >
          <Check size={16} color={hasContent ? '#FFFFFF' : '#6B7280'} />
          <Text
            style={[
              styles.actionButtonText,
              !hasContent && styles.disabledText,
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default forwardRef(SignatureInterface);

export type SignatureInterfaceHandle = {
  clear: () => void;
  save: () => void;
  hasContent: () => boolean;
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
    paddingVertical: 16,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  cancelButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },

  headerContent: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  methodSelector: {
    backgroundColor: '#1E293B',
    margin: 16,
    borderRadius: 8,
    padding: 8,
  },

  methodButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 12,
    minHeight: 60,
    marginBottom: 8,
    backgroundColor: '#334155',
  },

  methodButtonActive: {
    backgroundColor: '#4F80FF',
  },

  methodButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },

  methodButtonTextActive: {
    color: '#FFFFFF',
  },

  signatureContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    minHeight: 300,
  },

  // Draw Interface Styles
  drawContainer: {
    flex: 1,
  },

  drawingArea: {
    backgroundColor: '#334155',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4F80FF',
    borderStyle: 'dashed',
    minHeight: 200,
    marginVertical: 12,
  },

  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  instructionText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  // Type Interface Styles
  typeContainer: {
    flex: 1,
    paddingVertical: 20,
    gap: 16,
  },

  typeLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  typeInput: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#4F80FF',
    minHeight: 50,
  },

  previewContainer: {
    marginTop: 32,
    paddingVertical: 16,
  },

  previewLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },

  cursivePreview: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#10B981',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 12,
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },

  clearButton: {
    backgroundColor: '#374151',
  },

  saveButton: {
    backgroundColor: '#374151',
  },

  saveButtonActive: {
    backgroundColor: '#10B981',
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  disabledText: {
    color: '#6B7280',
  },

  scrollContent: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Extra space for fixed action buttons
  },
});
