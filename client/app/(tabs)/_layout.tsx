import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: '#FFFFFF',
      tabBarStyle: {
        backgroundColor: '#2D5A3D',
        borderTopWidth: 0,
      },
      headerStyle: {
        backgroundColor: '#1B4332',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
      headerTintColor: '#FFFFFF',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}