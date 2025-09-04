import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function SignaturePad({
  onChange,
  onStartDrawing,
  onEndDrawing,
  onSave,
  penColor = '#FFFFFF',
  penWidth = 3,
  padHeight = 260,
}: {
  onChange?: (paths: string[]) => void;
  onStartDrawing?: () => void;
  onEndDrawing?: () => void;
  onSave?: (paths: string[]) => void;
  penColor?: string;
  penWidth?: number;
  padHeight?: number;
}) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const drawingAreaRef = useRef<View>(null);

  // PanResponder for actual drawing (stabilized with useRef)
  const panResponder = useRef(
    PanResponder.create({
      // Always capture gestures that start/move inside the pad
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        const start = `M ${locationX.toFixed(2)} ${locationY.toFixed(2)}`;
        setCurrentPath(start);
        onStartDrawing?.();
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        // Functional update avoids stale closures
        setCurrentPath((prev) => {
          const moveTo = `M ${locationX.toFixed(2)} ${locationY.toFixed(2)}`;
          return prev
            ? `${prev} L ${locationX.toFixed(2)} ${locationY.toFixed(2)}`
            : moveTo;
        });
      },
      onPanResponderRelease: () => {
        setCurrentPath((finalPath) => {
          if (finalPath) setPaths((prev) => [...prev, finalPath]);
          return null;
        });
        onEndDrawing?.();
      },
      onPanResponderTerminate: () => {
        setCurrentPath((finalPath) => {
          if (finalPath) setPaths((prev) => [...prev, finalPath]);
          return null;
        });
        onEndDrawing?.();
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  useEffect(() => {
    console.log('SignaturePad mounted on platform:', Platform.OS);
    console.log('Component props:', {
      onChange: !!onChange,
      onStartDrawing: !!onStartDrawing,
      onEndDrawing: !!onEndDrawing,
    });
  }, [onChange, onStartDrawing, onEndDrawing]);

  // Notify parent when paths change; avoid calling setState during render
  useEffect(() => {
    console.log('SignaturePad: paths changed, calling onChange with:', paths);
    if (onChange) {
      onChange(paths);
    }
  }, [paths, onChange]);

  const clearPad = () => {
    setPaths([]);
    setCurrentPath(null);
  };

  const handleSave = () => {
    console.log('SignaturePad: Save button pressed, paths:', paths);
    if (onSave && paths.length > 0) {
      onSave(paths);
    } else if (paths.length === 0) {
      console.log('SignaturePad: No paths to save');
    }
  };

  return (
    <View style={[styles.container, { height: padHeight }]}>
      {/* Header with platform info */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Signature Pad - {Platform.OS}</Text>
      </View>

      {/* Drawing area */}
      <View
        ref={drawingAreaRef}
        style={[styles.drawingArea, { height: padHeight - 120 }]}
        {...panResponder.panHandlers}
      >
        <Svg style={styles.svg} pointerEvents="none">
          {paths.map((d, idx) => (
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
        {!paths.length && !currentPath && (
          <Text style={styles.instructionText} pointerEvents="none">
            Touch and drag to draw
          </Text>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearPad}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4F80FF',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  drawingArea: {
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    // Improve UX on web
    ...(Platform.OS === 'web'
      ? ({ cursor: 'crosshair', touchAction: 'none' } as any)
      : null),
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
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
