import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

interface LinearGradientProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: ReactNode;
}

export function LinearGradient({ colors, style, children }: LinearGradientProps) {
  return (
    <View style={[{ backgroundColor: colors?.[0] ?? '#000' }, style]}>
      {children}
    </View>
  );
}
