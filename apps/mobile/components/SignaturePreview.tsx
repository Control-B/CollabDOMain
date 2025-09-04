import React from 'react';
import { View, Text as RNText, StyleSheet } from 'react-native';
import Svg, { Text as SvgText, Path } from 'react-native-svg';

export default function SignaturePreview({
  text,
  variant = 'auto',
  signatureData,
}: {
  text: string;
  variant?: 'auto' | 'initials';
  signatureData?: any;
}) {
  const trimmed = (text || '').trim();
  const initials = trimmed
    ? trimmed
        .split(/\s+/)
        .filter(Boolean)
        .map((p) => p[0]?.toUpperCase())
        .join('')
    : 'YN';
  const display = variant === 'initials' ? initials : trimmed || 'Your Name';
  const isAuto = variant === 'auto';

  // If we have saved signature data, render the drawn signature
  if (signatureData && signatureData.paths && signatureData.paths.length > 0) {
    return (
      <View style={styles.container}>
        <Svg
          width="100%"
          height="50"
          viewBox="0 0 200 50"
          style={styles.svgOverlay}
        >
          {signatureData.paths.map((path: string, index: number) => (
            <Path
              key={index}
              d={path}
              stroke="#1F2937"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Primary: RN Text */}
      <RNText
        style={[styles.baseText, isAuto ? styles.auto : styles.initials]}
        numberOfLines={1}
        adjustsFontSizeToFit
        allowFontScaling
      >
        {display}
      </RNText>

      {/* Fallback: SVG Text overlay */}
      <Svg
        width="100%"
        height="50"
        style={styles.svgOverlay}
        pointerEvents="none"
      >
        <SvgText
          x="50%"
          y="50%"
          fill="#1F2937"
          fontSize={isAuto ? 28 : 36}
          fontWeight={isAuto ? '600' : '800'}
          textAnchor="middle"
          alignmentBaseline="central"
          opacity={0.0001}
        >
          {display}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    minHeight: 60,
  },
  svgOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  baseText: {
    color: '#1F2937',
    textAlign: 'center',
    width: '100%',
    minHeight: 36,
  },
  auto: {
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#4F80FF',
  },
  initials: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#8B5CF6',
  },
});
