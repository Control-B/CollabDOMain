import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useChatStore } from '@/store/chatStore';

export const ConnectionStatus: React.FC = () => {
  const { isConnected, connectToPhoenix } = useChatStore();

  useEffect(() => {
    // Auto-connect to Phoenix on component mount
    connectToPhoenix();
  }, [connectToPhoenix]);

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: isConnected ? '#10B981' : '#EF4444' }]} />
      <Text style={styles.text}>
        {isConnected ? 'Connected to Chat Server' : 'Connecting...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});





