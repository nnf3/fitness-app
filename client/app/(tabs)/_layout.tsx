import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTheme } from '../../theme';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.textSecondary,
      tabBarStyle: {
        backgroundColor: theme.surface,
        borderTopWidth: 0,
      },
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: theme.text,
      },
      headerTintColor: theme.text,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: '個人トレ',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="group-workout"
        options={{
          title: '合トレ',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'フレンド',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user-plus" color={color} />,
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