// hooks/useTokens.ts
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useTokens() {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme]; // returns the whole palette
}
