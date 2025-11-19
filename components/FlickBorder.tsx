import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface FlickBorderProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  flickColor?: string;
}

export default function FlickBorder({
  children,
  style,
  borderRadius,
  flickColor
}: FlickBorderProps) {
  const { theme } = useTheme();
  const radius = borderRadius ?? theme.borderRadius.lg;
  const flick = flickColor ?? theme.colors.accentFlick;

  return (
    <View style={[styles.container, style, { borderRadius: radius }]}>
      {/* Main border */}
      <View style={[styles.border, { borderRadius: radius, borderColor: theme.colors.border }]} />

      {/* Content */}
      <View style={[styles.content, { borderRadius: radius }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
  },
  content: {
    overflow: 'hidden',
  },
});
