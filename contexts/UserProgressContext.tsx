import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../app/_layout';
import {
  UserProgress,
  TaskProgress,
  StreakData,
  loadUserProgress,
  saveUserProgress,
  getDefaultUserProgress,
  shouldResetWeeklyProgress,
  calculateStreak,
  updateLastActive,
  saveCompletedGame,
  CompletedGame,
} from '../utils/storage';

interface UserProgressContextType {
  progress: UserProgress;
  loading: boolean;
  completeTask: (taskId: number, xp: number, timeSpent: number) => Promise<void>;
  resetWeeklyProgress: () => Promise<void>;
  getTaskProgress: (taskId: number) => TaskProgress | undefined;
  getCurrentWeekDay: () => number;
  markGameCompleted: (gameId: string, score?: number) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const UserProgressContext = createContext<UserProgressContextType>({
  progress: getDefaultUserProgress(),
  loading: true,
  completeTask: async () => {},
  resetWeeklyProgress: async () => {},
  getTaskProgress: () => undefined,
  getCurrentWeekDay: () => 1,
  markGameCompleted: async () => {},
  refreshProgress: async () => {},
});

export const useUserProgress = () => useContext(UserProgressContext);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(getDefaultUserProgress());
  const [loading, setLoading] = useState(true);

  // Load progress on mount and when user changes
  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const loadedProgress = await loadUserProgress();

      // Check if we need to reset weekly progress
      if (shouldResetWeeklyProgress(loadedProgress.currentWeekStart)) {
        const resetProgress: UserProgress = {
          ...loadedProgress,
          weeklyTasks: getDefaultUserProgress().weeklyTasks,
          currentWeekStart: new Date().toISOString(),
        };
        await saveUserProgress(resetProgress);
        setProgress(resetProgress);
      } else {
        setProgress(loadedProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      setProgress(getDefaultUserProgress());
    } finally {
      setLoading(false);
    }
  };

  const refreshProgress = async () => {
    await loadProgress();
  };

  const completeTask = async (taskId: number, xp: number = 10, timeSpent: number = 5) => {
    try {
      // Update task completion
      const updatedTasks = progress.weeklyTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: true,
              completedAt: new Date().toISOString(),
              xpEarned: xp,
              timeSpent: timeSpent,
            }
          : task
      );

      // Calculate new streak
      const newStreak = await calculateStreak(progress.streak.lastCompletedDate);

      // Update progress
      const updatedProgress: UserProgress = {
        ...progress,
        weeklyTasks: updatedTasks,
        totalXP: progress.totalXP + xp,
        totalTime: progress.totalTime + timeSpent,
        streak: newStreak,
      };

      setProgress(updatedProgress);
      await saveUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const resetWeeklyProgress = async () => {
    try {
      const resetProgress: UserProgress = {
        ...progress,
        weeklyTasks: getDefaultUserProgress().weeklyTasks,
        currentWeekStart: new Date().toISOString(),
      };
      setProgress(resetProgress);
      await saveUserProgress(resetProgress);
    } catch (error) {
      console.error('Error resetting weekly progress:', error);
    }
  };

  const getTaskProgress = (taskId: number): TaskProgress | undefined => {
    return progress.weeklyTasks.find(task => task.id === taskId);
  };

  const getCurrentWeekDay = (): number => {
    const weekStart = new Date(progress.currentWeekStart);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(daysDiff + 1, 7);
  };

  const markGameCompleted = async (gameId: string, score?: number) => {
    try {
      const completedGame: CompletedGame = {
        gameId,
        completedAt: new Date().toISOString(),
        score,
      };
      await saveCompletedGame(completedGame);
    } catch (error) {
      console.error('Error marking game completed:', error);
    }
  };

  return (
    <UserProgressContext.Provider
      value={{
        progress,
        loading,
        completeTask,
        resetWeeklyProgress,
        getTaskProgress,
        getCurrentWeekDay,
        markGameCompleted,
        refreshProgress,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
};
