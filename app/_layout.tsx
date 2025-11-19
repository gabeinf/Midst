import { Stack } from 'expo-router';
import { useEffect, useState, createContext, useContext } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChange, logout, type User } from '../lib/firebase-auth';
import { UserProgressProvider } from '../contexts/UserProgressContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

// Extended user profile type
type UserProfile = {
  uid: string;
  email: string | null;
  username?: string;
  firstName?: string;
  profilePicture?: string;
  displayName: string | null;
};

// Auth Context - Extended with signOut and userProfile
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  userProfile: UserProfile | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  userProfile: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [authLoading]);

  if (authLoading) return null;

  const handleSignOut = async () => {
    await logout();
  };

  // Map user to userProfile
  const userProfile: UserProfile | null = user ? {
    uid: user.uid,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    profilePicture: user.photoURL || undefined,
    displayName: user.displayName,
  } : null;

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ user, isLoading: authLoading, userProfile, signOut: handleSignOut }}>
        <UserProgressProvider>
          <Stack screenOptions={{
            headerShown: false,
            animation: 'none'
          }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="edit-profile" />
          </Stack>
        </UserProgressProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
