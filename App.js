import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { usePaystashStore } from './src/store/usePaystashStore';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const { setOffline } = usePaystashStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Sync store with actual network state
      // If connected is false (or null during init), we treat as offline
      // Note: isConnected can be null initially, defaulting to true or false depends on UX preference
      // Here we assume if it's explicitly false, we are offline.
      const isOffline = state.isConnected === false;
      setOffline(isOffline);

      if (!isOffline) {
        // We are online (or at least connected to reachability endpoint)
        // Trigger sync
        const { processPendingSync } = usePaystashStore.getState();
        processPendingSync();
      }
    });

    return () => unsubscribe();
  }, [setOffline]);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
