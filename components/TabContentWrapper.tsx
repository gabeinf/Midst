import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import TabCornerFlicks from './TabCornerFlicks';
import { useTheme } from '../contexts/ThemeContext';

interface TabContentWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function TabContentWrapper({ children, style }: TabContentWrapperProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { backgroundColor: theme.colors.surface }, style]}>
        {children}
      </View>
      {/* Corner mattes at bottom where content meets tab bar */}
      <View style={styles.cornerContainer}>
        <TabCornerFlicks position="left" />
        <TabCornerFlicks position="right" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80, // Account for tab bar height
    position: 'relative',
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginTop: 0,
  },
  cornerContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 24,
    pointerEvents: 'none',
  },
});
