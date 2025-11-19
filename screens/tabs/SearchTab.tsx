import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TabContentWrapper from '../../components/TabContentWrapper';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../app/_layout';
import FlickBorder from '../../components/FlickBorder';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Sample data for discover content
const DISCOVER_CATEGORIES = [
  { id: '1', name: 'Faith', icon: 'heart' },
  { id: '2', name: 'Prayer', icon: 'hands' },
  { id: '3', name: 'Worship', icon: 'musical-notes' },
  { id: '4', name: 'Bible Study', icon: 'book' },
  { id: '5', name: 'Community', icon: 'people' },
  { id: '6', name: 'Devotionals', icon: 'bookmarks' },
];

const TRENDING_TOPICS = [
  {
    id: '1',
    title: 'Walking in Faith',
    description: 'Daily encouragement for your spiritual journey',
    image: require('../../assets/devotion/christhills.jpg'),
    followers: '12.5K',
  },
  {
    id: '2',
    title: 'Morning Prayer Warriors',
    description: 'Join thousands starting their day in prayer',
    image: require('../../assets/devotion/christhills.jpg'),
    followers: '8.3K',
  },
  {
    id: '3',
    title: 'Verse of the Week',
    description: 'Deep dive into scripture together',
    image: require('../../assets/devotion/christhills.jpg'),
    followers: '15.2K',
  },
];

const FEATURED_CONTENT = [
  {
    id: '1',
    type: 'devotional',
    title: 'Finding Peace in Chaos',
    author: 'Sarah Johnson',
    image: require('../../assets/devotion/christhills.jpg'),
    likes: 234,
    comments: 45,
  },
  {
    id: '2',
    type: 'prayer',
    title: 'Prayer for Strength',
    author: 'Michael Chen',
    image: require('../../assets/devotion/christhills.jpg'),
    likes: 189,
    comments: 32,
  },
  {
    id: '3',
    type: 'testimony',
    title: 'How God Answered',
    author: 'Emily Rodriguez',
    image: require('../../assets/devotion/christhills.jpg'),
    likes: 412,
    comments: 67,
  },
  {
    id: '4',
    type: 'study',
    title: 'Romans 8 Deep Dive',
    author: 'Pastor David',
    image: require('../../assets/devotion/christhills.jpg'),
    likes: 567,
    comments: 89,
  },
];

const SUGGESTED_USERS = [
  { id: '1', name: 'Grace Fellowship', username: 'gracefellowship', followers: '2.3K' },
  { id: '2', name: 'Worship Leader', username: 'worshipleader', followers: '5.1K' },
  { id: '3', name: 'Bible Teacher', username: 'bibleteacher', followers: '8.7K' },
];

export default function SearchTab() {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const username = userProfile?.username || 'Friend';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <TabContentWrapper>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        {/* Header with Search title and profile picture */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Discover</Text>
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

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search topics, people, groups..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {DISCOVER_CATEGORIES.map((category) => (
                <FlickBorder key={category.id} style={[styles.categoryChip, { backgroundColor: theme.colors.card }]}>
                  <TouchableOpacity
                    style={styles.categoryChipContent}
                    onPress={() => setActiveCategory(category.id)}
                  >
                    <Ionicons name={category.icon as any} size={20} color={theme.colors.primary} />
                    <Text style={[styles.categoryChipText, { color: theme.colors.text }]}>{category.name}</Text>
                  </TouchableOpacity>
                </FlickBorder>
              ))}
            </ScrollView>
          </View>

          {/* Trending Topics */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trending Topics</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingContainer}
            >
              {TRENDING_TOPICS.map((topic) => (
                <FlickBorder key={topic.id} style={[styles.trendingCard, { backgroundColor: theme.colors.card }]}>
                  <TouchableOpacity style={styles.trendingCardContent}>
                    <Image source={topic.image} style={styles.trendingImage} />
                    <View style={styles.trendingOverlay}>
                      <Text style={styles.trendingTitle}>{topic.title}</Text>
                      <Text style={styles.trendingDescription}>{topic.description}</Text>
                      <View style={styles.trendingFooter}>
                        <Ionicons name="people" size={16} color="#FFFFFF" />
                        <Text style={styles.trendingFollowers}>{topic.followers} followers</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </FlickBorder>
              ))}
            </ScrollView>
          </View>

          {/* Featured Content */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.featuredGrid}>
              {FEATURED_CONTENT.map((item) => (
                <FlickBorder key={item.id} style={[styles.featuredCard, { backgroundColor: theme.colors.card }]}>
                  <TouchableOpacity style={styles.featuredCardContent}>
                    <Image source={item.image} style={styles.featuredImage} />
                    <View style={styles.featuredInfo}>
                      <View style={[styles.typeBadge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.typeBadgeText}>{item.type}</Text>
                      </View>
                      <Text style={[styles.featuredTitle, { color: theme.colors.text }]} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={[styles.featuredAuthor, { color: theme.colors.textSecondary }]}>
                        by {item.author}
                      </Text>
                      <View style={styles.featuredStats}>
                        <View style={styles.statItem}>
                          <Ionicons name="heart-outline" size={16} color={theme.colors.textSecondary} />
                          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{item.likes}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
                          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{item.comments}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </FlickBorder>
              ))}
            </View>
          </View>

          {/* Suggested Users */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Suggested for You</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            {SUGGESTED_USERS.map((user) => (
              <FlickBorder key={user.id} style={[styles.userCard, { backgroundColor: theme.colors.card }]}>
                <TouchableOpacity style={styles.userCardContent}>
                  <View style={[styles.userAvatar, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: theme.colors.text }]}>{user.name}</Text>
                    <Text style={[styles.userUsername, { color: theme.colors.textSecondary }]}>@{user.username}</Text>
                    <Text style={[styles.userFollowers, { color: theme.colors.textSecondary }]}>
                      {user.followers} followers
                    </Text>
                  </View>
                  <TouchableOpacity style={[styles.followButton, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.followButtonText}>Follow</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </FlickBorder>
            ))}
          </View>
        </ScrollView>
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
    paddingBottom: 12,
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
  searchSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as any,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600' as any,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryChip: {
    borderRadius: 12,
  },
  categoryChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600' as any,
  },
  trendingContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  trendingCard: {
    width: SCREEN_WIDTH * 0.7,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  trendingCardContent: {
    flex: 1,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: '700' as any,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trendingDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  trendingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendingFollowers: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  featuredGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featuredCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredCardContent: {
    flex: 1,
  },
  featuredImage: {
    width: '100%',
    height: 120,
  },
  featuredInfo: {
    padding: 12,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700' as any,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '600' as any,
    marginBottom: 4,
    lineHeight: 18,
  },
  featuredAuthor: {
    fontSize: 12,
    marginBottom: 8,
  },
  featuredStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  userCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: '700' as any,
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as any,
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    marginBottom: 2,
  },
  userFollowers: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600' as any,
    color: '#FFFFFF',
  },
});
