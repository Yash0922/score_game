import { Stack } from 'expo-router';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ResponsiveProvider } from '../ context/ResponsiveContext';

export default function RootLayout() {
  // Set status bar appearance
  React.useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ResponsiveProvider>
        <Stack screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#fff' }
        }}>
          <Stack.Screen name="index" />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              animation: 'fade' 
            }} 
          />
        </Stack>
      </ResponsiveProvider>
    </GestureHandlerRootView>
  );
}