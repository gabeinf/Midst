import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

interface TabCornerFlicksProps {
  position: 'left' | 'right';
}

export default function TabCornerFlicks({ position }: TabCornerFlicksProps) {
  const { theme } = useTheme();
  const isLeft = position === 'left';

  return (
    <View style={[styles.container, isLeft ? styles.left : styles.right]}>
      <Svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={styles.svg}
      >
        {isLeft ? (
          // Left corner - background fill with curved cutout for content area
          <Path
            d="M 0 0 L 0 24 L 24 24 Q 0 24 0 0"
            fill={theme.colors.background}
          />
        ) : (
          // Right corner - background fill with curved cutout for content area
          <Path
            d="M 24 0 L 24 24 L 0 24 Q 24 24 24 0"
            fill={theme.colors.background}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 24,
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
});
