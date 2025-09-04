import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Chrome as Home,
  MessageCircle,
  Radio,
  FileText,
  MoveHorizontal as MoreHorizontal,
} from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom || 0;
  const BASE_HEIGHT = 70; // previous fixed height

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Active: brighter blue; Inactive: lighter blue
        tabBarActiveTintColor: '#93C5FD',
        tabBarInactiveTintColor: '#60A5FA',
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: '#151937',
          borderTopWidth: 1,
          borderTopColor: '#334155',
          paddingTop: 8,
          // Add safe area bottom inset so the tab bar sits above the home indicator
          paddingBottom: 8 + bottomInset,
          height: BASE_HEIGHT + bottomInset,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dms"
        options={{
          title: 'DMs',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="channels"
        options={{
          title: 'Channels',
          tabBarIcon: ({ size, color }) => <Radio size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Files',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ size, color }) => (
            <MoreHorizontal size={size} color={color} />
          ),
        }}
      />
      {/* Hidden routes beneath tabs to keep TabBar visible across app */}
      {/* Ensure signature route renders but is hidden from the tab bar */}
      {/* Do not declare a signature tab here; the route file hides itself via options.href = null */}
      <Tabs.Screen name="documents" options={{ href: null }} />
      <Tabs.Screen name="trip-sheets" options={{ href: null }} />
      <Tabs.Screen name="create-trip" options={{ href: null }} />
      <Tabs.Screen name="document-sign/[documentId]" options={{ href: null }} />
      <Tabs.Screen name="chat/[id]" options={{ href: null }} />
      <Tabs.Screen name="chat/[channel]" options={{ href: null }} />
      <Tabs.Screen name="channels/general" options={{ href: null }} />
      <Tabs.Screen name="channels/inbound" options={{ href: null }} />
      <Tabs.Screen name="channels/outbound" options={{ href: null }} />
      <Tabs.Screen name="checkin/inbound" options={{ href: null }} />
      <Tabs.Screen name="checkin/outbound" options={{ href: null }} />
      <Tabs.Screen name="trip-details/[id]" options={{ href: null }} />
    </Tabs>
  );
}
