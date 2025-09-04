import { useEffect } from 'react';
import { Platform } from 'react-native';

interface FastRefreshProviderProps {
  children: React.ReactNode;
}

export default function FastRefreshProvider({
  children,
}: FastRefreshProviderProps) {
  useEffect(() => {
    if (__DEV__ && Platform.OS !== 'web') {
      // Enable Fast Refresh for React Native
      if (global?.HermesInternal?.enableDebugger) {
        global.HermesInternal.enableDebugger();
      }

      // Log when Fast Refresh is working
      console.log('🔄 Fast Refresh is enabled');
    }
  }, []);

  return <>{children}</>;
}



