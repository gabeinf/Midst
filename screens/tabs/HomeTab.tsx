import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, ImageBackground, Image, PanResponder } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FlickBorder from '../../components/FlickBorder';
import TabContentWrapper from '../../components/TabContentWrapper';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../app/_layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeTab() {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'secretPlace' | 'body'>('secretPlace');

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const username = userProfile?.username || 'Friend';
  const underlinePosition = useRef(new Animated.Value(0)).current;
  const contentPosition = useRef(new Animated.Value(0)).current;

  const switchTab = (tab: 'secretPlace' | 'body', animated: boolean = true) => {
    setActiveTab(tab);

    const targetValue = tab === 'secretPlace' ? 0 : 1;

    if (animated) {
      // Animate underline with ease (no bounce)
      Animated.timing(underlinePosition, {
        toValue: targetValue,
        duration: 250,
        useNativeDriver: true,
      }).start();

      // Animate content slide with ease
      Animated.timing(contentPosition, {
        toValue: targetValue,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      // Set values immediately without animation
      underlinePosition.setValue(targetValue);
      contentPosition.setValue(targetValue);
    }
  };

  // Pan responder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Calculate progress based on swipe
        // For secretPlace (0): swiping left (negative dx) moves toward body (1)
        // For body (1): swiping right (positive dx) moves toward secretPlace (0)
        const progress = -gestureState.dx / SCREEN_WIDTH;
        const currentTab = activeTab === 'secretPlace' ? 0 : 1;
        const newValue = Math.max(0, Math.min(1, currentTab + progress));

        // Update animations to follow the swipe in real-time
        underlinePosition.setValue(newValue);
        contentPosition.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = SCREEN_WIDTH * 0.25;
        let targetTab: 'secretPlace' | 'body' = activeTab;

        if (activeTab === 'secretPlace' && gestureState.dx < -swipeThreshold) {
          // Swiped left from Today -> go to The Body
          targetTab = 'body';
        } else if (activeTab === 'body' && gestureState.dx > swipeThreshold) {
          // Swiped right from The Body -> go to Today
          targetTab = 'secretPlace';
        }

        // Animate to the target tab (either new tab or snap back to current)
        switchTab(targetTab, true);
      },
    })
  ).current;

  // Calculate underline positions to center under each tab text
  // "Today" text width is approximately 50px, with 4px horizontal padding = 58px total
  // "The Body" text width is approximately 75px, with 4px horizontal padding = 83px total
  // Underline is 40px wide, gap between tabs is 12px
  // For "Today": Center 40px underline under 50px text = (50-40)/2 = 5px offset from text start, plus 4px padding = 9px
  // For "The Body": "Today" (58px) + gap (12px) = starts at 70px, center 40px under 75px text = 70 + (75-40)/2 = 70 + 17.5 = 87.5px
  const underlineTranslateX = underlinePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [9, 88], // Better centered under "Today" and "The Body"
  });

  const contentTranslateX = contentPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH], // Slide full screen width to the left
  });

  return (
    <TabContentWrapper>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header with Midst branding and profile picture */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.brandText, { color: theme.colors.text }]}>Midst</Text>
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

      {/* Tab Switcher */}
      <View style={[styles.tabSwitcherContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => switchTab('secretPlace')}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === 'secretPlace' ? theme.colors.text : theme.colors.textSecondary }
            ]}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => switchTab('body')}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === 'body' ? theme.colors.text : theme.colors.textSecondary }
            ]}>
              The Body
            </Text>
          </TouchableOpacity>

          {/* Animated Underline */}
          <Animated.View
            style={[
              styles.underline,
              { backgroundColor: theme.colors.primary },
              {
                transform: [{ translateX: underlineTranslateX }]
              }
            ]}
          />
        </View>
      </View>

      <Animated.View
        style={[
          styles.contentWrapper,
          {
            transform: [{ translateX: contentTranslateX }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Secret Place Page */}
        <View style={styles.page}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Greeting Above Card */}
            <View style={styles.greetingAboveCard}>
              <Text style={[styles.greetingAboveText, { color: theme.colors.text }]}>
                {getGreeting()}, {username}
              </Text>
            </View>

            {/* Devotional Card */}
            <View style={styles.devotionalCard}>
              <ImageBackground
                source={require('../../assets/devotion/christhills.jpg')}
                style={styles.devotionalBackground}
                imageStyle={styles.devotionalImage}
              >
                <View style={styles.devotionalOverlay}>
                  <View style={styles.devotionalHeader}>
                    <Text style={styles.devotionalLabel}>Verse of the Day</Text>
                    <Text style={styles.devotionalReference}>Romans 8:28</Text>
                  </View>

                  <View style={styles.devotionalVerseContainer}>
                    <Text style={styles.devotionalVerse}>
                      "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>

            {/* Guided Scripture Card */}
            <FlickBorder style={[styles.guidedCard, { backgroundColor: theme.colors.card }]}>
              <View style={styles.guidedCardContent}>
                <View style={styles.guidedLeftSection}>
                  <View style={[styles.streakPill, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.streakNumber}>0</Text>
                  </View>
                  <Text style={[styles.guidedLabel, { color: theme.colors.textSecondary }]}>Guided Scripture</Text>
                  <Text style={[styles.guidedTitle, { color: theme.colors.text }]}>God is Faithful to Finish What He Starts</Text>
                  <Text style={[styles.guidedDuration, { color: theme.colors.textSecondary }]}>2-5 min</Text>
                </View>
                <Image
                  source={require('../../assets/devotion/christhills.jpg')}
                  style={styles.guidedImage}
                />
              </View>
            </FlickBorder>

            {/* Guided Prayer Card */}
            <FlickBorder style={[styles.guidedCard, { backgroundColor: theme.colors.card }]}>
              <View style={styles.guidedCardContent}>
                <View style={styles.guidedLeftSection}>
                  <Text style={[styles.guidedLabel, { color: theme.colors.textSecondary }]}>Guided Prayer</Text>
                  <Text style={[styles.guidedTitle, { color: theme.colors.text }]}>God is Faithful to Finish What He Starts</Text>
                  <Text style={[styles.guidedDuration, { color: theme.colors.textSecondary }]}>2-5 min</Text>
                </View>
                <Image
                  source={require('../../assets/devotion/christhills.jpg')}
                  style={styles.guidedImage}
                />
              </View>
            </FlickBorder>

          </ScrollView>
        </View>

        {/* The Body Page */}
        <View style={styles.page}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.bodyHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.bodyTitle, { color: theme.colors.text }]}>The Body</Text>
              <Text style={[styles.bodySubtitle, { color: theme.colors.textSecondary }]}>Connect with the community</Text>
            </View>

            {/* Community Stats */}
            <View style={styles.statsContainer}>
              <FlickBorder style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                <View style={styles.statCardContent}>
                  <Ionicons name="people-circle" size={28} color={theme.colors.primary} />
                  <Text style={[styles.statNumber, { color: theme.colors.text }]}>5.2K</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Members</Text>
                </View>
              </FlickBorder>

              <FlickBorder style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                <View style={styles.statCardContent}>
                  <Ionicons name="chatbubbles" size={28} color={theme.colors.success} />
                  <Text style={[styles.statNumber, { color: theme.colors.text }]}>842</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Discussions</Text>
                </View>
              </FlickBorder>

              <FlickBorder style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                <View style={styles.statCardContent}>
                  <Ionicons name="calendar" size={28} color={theme.colors.warning} />
                  <Text style={[styles.statNumber, { color: theme.colors.text }]}>24</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Events</Text>
                </View>
              </FlickBorder>
            </View>

            {/* Community Feed */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Activity</Text>
            </View>

            {[1, 2, 3].map((item) => (
              <FlickBorder key={item} style={[styles.feedCard, { backgroundColor: theme.colors.card }]}>
                <View style={styles.feedCardContent}>
                  <View style={styles.feedHeader}>
                    <View style={[styles.avatar, { backgroundColor: theme.colors.surface }]}>
                      <Ionicons name="people" size={20} color={theme.colors.textSecondary} />
                    </View>
                    <View style={styles.feedInfo}>
                      <Text style={[styles.feedUsername, { color: theme.colors.text }]}>Community Group {item}</Text>
                      <Text style={[styles.feedTime, { color: theme.colors.textSecondary }]}>1h ago</Text>
                    </View>
                  </View>

                  <Text style={[styles.feedText, { color: theme.colors.text }]}>
                    Join us for our weekly gathering and fellowship. All are welcome!
                  </Text>

                  <View style={styles.feedActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="heart-outline" size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>48</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>12</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </FlickBorder>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
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
  brandText: {
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
  tabSwitcherContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tabSwitcher: {
    flexDirection: 'row',
    position: 'relative',
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabText: {
    fontSize: 18,
    fontWeight: '600' as any,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 2,
  },
  contentWrapper: {
    flexDirection: 'row',
    flex: 1,
    width: SCREEN_WIDTH * 2, // Two full-width pages side by side
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  bodyHeader: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  bodyTitle: {
    fontSize: 24,
    fontWeight: '700' as any,
    marginBottom: 8,
  },
  bodySubtitle: {
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  greetingAboveCard: {
    marginBottom: 16,
  },
  greetingAboveText: {
    fontSize: 18,
    fontWeight: '600' as any,
  },
  devotionalCard: {
    width: '100%',
    aspectRatio: 1, // 1:1 square ratio
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  devotionalBackground: {
    width: '100%',
    height: '100%',
  },
  devotionalImage: {
    borderRadius: 16,
  },
  devotionalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 24,
    justifyContent: 'space-between',
  },
  devotionalHeader: {
    alignItems: 'flex-start',
  },
  devotionalLabel: {
    fontSize: 14,
    fontWeight: '600' as any,
    color: '#FFFFFF',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.9,
  },
  devotionalReference: {
    fontSize: 16,
    fontWeight: '600' as any,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  devotionalVerseContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  devotionalVerse: {
    fontSize: 18,
    fontWeight: '500' as any,
    color: '#FFFFFF',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  guidedCard: {
    marginBottom: 16,
  },
  guidedCardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  guidedLeftSection: {
    flex: 1,
    gap: 8,
  },
  streakPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 14,
    fontWeight: '700' as any,
    color: '#FFFFFF',
  },
  guidedLabel: {
    fontSize: 12,
    fontWeight: '600' as any,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  guidedTitle: {
    fontSize: 16,
    fontWeight: '600' as any,
    lineHeight: 20,
  },
  guidedDuration: {
    fontSize: 14,
  },
  guidedImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statCardContent: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700' as any,
  },
  statLabel: {
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as any,
  },
  feedCard: {
    marginBottom: 16,
  },
  feedCardContent: {
    padding: 16,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedInfo: {
    flex: 1,
  },
  feedUsername: {
    fontSize: 16,
    fontWeight: '600' as any,
  },
  feedTime: {
    fontSize: 12,
  },
  feedText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  feedActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
  },
});
