import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography } from '../../src/components/theme';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.background,
                    borderTopColor: Colors.border,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: 20,
                    height: 70,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: '#64748b',
                tabBarLabelStyle: {
                    ...Typography.label,
                    fontSize: 10,
                },
            }}
        >
            <Tabs.Screen
                name="education"
                options={{
                    title: 'Education',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="menu-book" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="show-chart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="exercises"
                options={{
                    title: 'Exercises',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="favorite" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
