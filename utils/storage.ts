import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'user_progress',
  WEEKLY_TASKS: 'weekly_tasks',
  STREAK_DATA: 'streak_data',
  LAST_ACTIVE: 'last_active',
  COMPLETED_GAMES: 'completed_games',
};

// Types
export interface TaskProgress {
  id: number;
  completed: boolean;
  completedAt?: string;
  xpEarned: number;
  timeSpent: number; // in minutes
}

export interface StreakData {
  currentStreak: number;
  lastCompletedDate: string;
  longestStreak: number;
}

export interface UserProgress {
  weeklyTasks: TaskProgress[];
  streak: StreakData;
  totalXP: number;
  totalTime: number;
  currentWeekStart: string;
}

export interface CompletedGame {
  gameId: string;
  completedAt: string;
  score?: number;
}

// Initialize default user progress
export const getDefaultUserProgress = (): UserProgress => ({
  weeklyTasks: [
    { id: 1, completed: false, xpEarned: 0, timeSpent: 0 },
    { id: 2, completed: false, xpEarned: 0, timeSpent: 0 },
    { id: 3, completed: false, xpEarned: 0, timeSpent: 0 },
    { id: 4, completed: false, xpEarned: 0, timeSpent: 0 },
    { id: 5, completed: false, xpEarned: 0, timeSpent: 0 },
    { id: 6, completed: false, xpEarned: 0, timeSpent: 0 },
    { id: 7, completed: false, xpEarned: 0, timeSpent: 0 },
  ],
  streak: {
    currentStreak: 0,
    lastCompletedDate: '',
    longestStreak: 0,
  },
  totalXP: 0,
  totalTime: 0,
  currentWeekStart: new Date().toISOString(),
});

// Save user progress
export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    const jsonData = JSON.stringify(progress);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, jsonData);
  } catch (error) {
    // Silent fail - storage might not be available in dev mode
    // Don't throw - allow app to continue even if save fails
  }
};

// Load user progress
export const loadUserProgress = async (): Promise<UserProgress> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (data) {
      return JSON.parse(data);
    }
    return getDefaultUserProgress();
  } catch (error) {
    // Silent fail and return defaults - storage might not be available in dev mode
    return getDefaultUserProgress();
  }
};

// Save completed games
export const saveCompletedGame = async (game: CompletedGame): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_GAMES);
    const games: CompletedGame[] = existing ? JSON.parse(existing) : [];
    games.push(game);
    const jsonData = JSON.stringify(games);
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_GAMES, jsonData);
  } catch (error) {
    // Silent fail - storage might not be available in dev mode
    // Don't throw - allow app to continue
  }
};

// Load completed games
export const loadCompletedGames = async (): Promise<CompletedGame[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_GAMES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    // Silent fail - storage might not be available in dev mode
    return [];
  }
};

// Update last active date
export const updateLastActive = async (): Promise<void> => {
  try {
    const dateString = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, dateString);
  } catch (error) {
    // Silently fail - this is not critical
    // console.error('Error updating last active:', error);
  }
};

// Get last active date
export const getLastActive = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
  } catch (error) {
    console.error('Error getting last active:', error);
    return null;
  }
};

// Check if we need to reset weekly progress
export const shouldResetWeeklyProgress = (currentWeekStart: string): boolean => {
  const weekStart = new Date(currentWeekStart);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff >= 7;
};

// Calculate streak
export const calculateStreak = async (lastCompletedDate: string): Promise<StreakData> => {
  const lastActive = await getLastActive();
  if (!lastActive || !lastCompletedDate) {
    return {
      currentStreak: 0,
      lastCompletedDate: '',
      longestStreak: 0,
    };
  }

  const lastDate = new Date(lastCompletedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  const progress = await loadUserProgress();

  if (daysDiff === 0) {
    // Same day, maintain streak
    return progress.streak;
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    return {
      ...progress.streak,
      currentStreak: progress.streak.currentStreak + 1,
      lastCompletedDate: today.toISOString(),
      longestStreak: Math.max(progress.streak.longestStreak, progress.streak.currentStreak + 1),
    };
  } else {
    // Streak broken
    return {
      currentStreak: 1,
      lastCompletedDate: today.toISOString(),
      longestStreak: progress.streak.longestStreak,
    };
  }
};

// Clear all data (useful for testing or logout)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROGRESS,
      STORAGE_KEYS.WEEKLY_TASKS,
      STORAGE_KEYS.STREAK_DATA,
      STORAGE_KEYS.LAST_ACTIVE,
      STORAGE_KEYS.COMPLETED_GAMES,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
