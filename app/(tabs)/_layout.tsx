import { Tabs } from 'expo-router';
import { View, StatusBar, Image } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function TabsLayout() {
  const { theme, isDark } = useTheme();
  const inactiveIconColor = isDark ? '#FFFFFF' : theme.colors.textTertiary;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
            position: 'absolute',
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/icons/icons8-home-500.png')}
              style={[
                { width: 28, height: 28 },
                { tintColor: focused ? theme.colors.primary : inactiveIconColor }
              ]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plus"
        options={{
          title: 'Plus',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/icons/icons8-plus-500.png')}
              style={[
                { width: 32, height: 32 },
                { tintColor: focused ? theme.colors.primary : inactiveIconColor }
              ]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/icons/icons8-search-500.png')}
              style={[
                { width: 28, height: 28 },
                { tintColor: focused ? theme.colors.primary : inactiveIconColor }
              ]}
            />
          ),
        }}
      />
    </Tabs>
    </View>
  );
}
