import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { coverStyles, radius, space } from '@/theme';

import { Text } from './Text';

export type BookCoverProps = {
  title: string;
  author?: string;
  coverUrl?: string;
  /** Stable id used to pick the fallback style, so a book keeps the same look. */
  seed: string;
  width: number;
};

const ASPECT = 1.5;
/** Below this width the fallback cover is a plain color block; the title wouldn't be legible. */
const MIN_WIDTH_FOR_TITLE = 72;

function fallbackStyle(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return coverStyles[Math.abs(hash) % coverStyles.length];
}

/**
 * Cover image when available; otherwise one of the six typographic styles, assigned by `seed`.
 */
export function BookCover({ title, author, coverUrl, seed, width }: BookCoverProps) {
  const [failed, setFailed] = useState(false);
  const height = width * ASPECT;
  const small = width < MIN_WIDTH_FOR_TITLE;
  const frame = { width, height, borderRadius: small ? radius.coverSmall : radius.cover };

  if (coverUrl && !failed) {
    return (
      <Image
        source={coverUrl}
        style={frame}
        contentFit="cover"
        transition={150}
        accessibilityIgnoresInvertColors
        onError={() => setFailed(true)}
      />
    );
  }

  const style = fallbackStyle(seed);
  return (
    <View
      style={[
        frame,
        styles.fallback,
        { backgroundColor: style.background },
        'border' in style && { borderWidth: small ? 1.5 : 2, borderColor: style.border },
      ]}
    >
      {small ? null : (
        <>
          <Text variant="label" numberOfLines={4} style={{ color: style.text }}>
            {title}
          </Text>
          {author ? (
            <Text
              variant="kicker"
              numberOfLines={2}
              // Long single-word surnames would otherwise truncate on narrow covers.
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              style={[styles.author, { color: style.text }]}
            >
              {author}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    padding: space[2],
    justifyContent: 'space-between',
  },
  author: {
    opacity: 0.8,
  },
});
