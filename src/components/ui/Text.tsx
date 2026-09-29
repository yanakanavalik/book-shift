import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, typography, type ColorToken, type TypographyVariant } from '@/theme';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorToken;
};

/** All app text goes through here so it picks up Archivo and the type scale. */
export function Text({ variant = 'body', color = 'text', style, ...props }: TextProps) {
  return <RNText style={[typography[variant], { color: colors[color] }, style]} {...props} />;
}
