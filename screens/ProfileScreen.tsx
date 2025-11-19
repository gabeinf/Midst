import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../app/_layout';
import FlickBorder from '../components/FlickBorder';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { userProfile, signOut } = useAuth();
  const username = userProfile?.username || 'Friend';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
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
          </View>
          <Text style={[styles.username, { color: theme.colors.text }]}>@{username}</Text>
          <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
            Living in the midst of God's grace
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>42</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Posts</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>128</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Following</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>356</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Followers</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => router.push('/edit-profile')}
        >
          <Text style={[styles.editButtonText, { color: theme.colors.text }]}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <FlickBorder style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity style={styles.menuItemContent}>
              <Ionicons name="bookmark-outline" size={24} color={theme.colors.text} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Saved</Text>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </FlickBorder>

          <FlickBorder style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity style={styles.menuItemContent}>
              <Ionicons name="heart-outline" size={24} color={theme.colors.text} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Liked Posts</Text>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </FlickBorder>

          <FlickBorder style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity style={styles.menuItemContent}>
              <Ionicons name="time-outline" size={24} color={theme.colors.text} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Activity</Text>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </FlickBorder>

          <FlickBorder style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity style={styles.menuItemContent}>
              <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Settings</Text>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </FlickBorder>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: theme.colors.error }]}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as any,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '600' as any,
  },
  username: {
    fontSize: 24,
    fontWeight: '700' as any,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as any,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 32,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600' as any,
  },
  menuSection: {
    gap: 12,
    marginBottom: 32,
  },
  menuItem: {
    borderRadius: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500' as any,
  },
  signOutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '700' as any,
    color: '#FFFFFF',
  },
});
