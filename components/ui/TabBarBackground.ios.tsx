import { useAppTheme } from '@/hooks/theme/AppThemeProvider';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function BlurTabBarBackground() {
  const { colorScheme } = useAppTheme();

  return (
    <BlurView
      tint={colorScheme === 'dark' ? 'dark' : 'light'}
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
