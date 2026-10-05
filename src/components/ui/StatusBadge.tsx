import { StyleSheet, View } from 'react-native';

import { STATUS_LABELS, type BookStatus } from '@/lib/books';
import { colors, radius, space, type ColorToken } from '@/theme';

import { Text } from './Text';

const BADGES: Record<BookStatus, { background: string; text: ColorToken }> = {
  // Steel marks "To read"; cinnamon text for books in progress.
  'want-to-read': { background: colors.surfaceSteel, text: 'steelText' },
  reading: { background: colors.surface, text: 'accentText' },
  finished: { background: colors.surface, text: 'text' },
};

export function StatusBadge({ status }: { status: BookStatus }) {
  const badge = BADGES[status];
  return (
    <View style={[styles.badge, { backgroundColor: badge.background }]}>
      <Text variant="kicker" color={badge.text}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space[2] + 2,
    paddingVertical: space[1] + 2,
    borderRadius: radius.pill,
  },
});
