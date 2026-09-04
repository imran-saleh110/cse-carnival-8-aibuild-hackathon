import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import RoomsScreen from '../screens/RoomsScreen';
import EventsScreen from '../screens/EventsScreen';
import AgentScreen from '../screens/AgentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: '🏠',
  Schedule: '📅',
  Rooms: '🏫',
  Events: '🎉',
  Agent: '🤖',
  Profile: '👤',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.separator,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Rooms" component={RoomsScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Agent" component={AgentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
