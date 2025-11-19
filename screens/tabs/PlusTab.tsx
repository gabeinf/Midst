import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import TabContentWrapper from '../../components/TabContentWrapper';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../app/_layout';

export default function PlusTab() {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const username = userProfile?.username || 'Friend';

  return (
    <TabContentWrapper>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        {/* Header with Plus title and profile picture */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Plus</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
            >
              {userProfile?.profilePicture ? (
                <Image
                  source={{ uri: userProfile.profilePicture }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={[styles.profilePlaceholder, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.profileInitial}>
                    {username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.text, { color: theme.colors.text }]}>Plus</Text>
        </View>
      </View>
    </TabContentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as any,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as any,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '500',
  },
});
