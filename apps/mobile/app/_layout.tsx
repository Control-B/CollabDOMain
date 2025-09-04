import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import FastRefreshProvider from '@/components/FastRefreshProvider';

export default function RootLayout() {
  useFrameworkReady();

  // Enable development mode logging
  useEffect(() => {
    if (__DEV__) {
      console.log('🚀 App started in development mode');
      console.log('🔄 Hot reload should be working');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <FastRefreshProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </FastRefreshProvider>
    </SafeAreaProvider>
  );
}
