import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { router } from 'expo-router';
import { Timer } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useNow } from '@/hooks/useNow';
import { elapsedMs, formatClock, isPaused } from '@/lib/sessions';
import { colors, radius, sizes, space } from '@/theme';
import { useBooks } from '@/store/books';
import { useSessions } from '@/store/sessions';

/** iOS 26+ hosts the chip in the native tab bar's bottom accessory; elsewhere it floats over tab screens. */
export const USES_TAB_ACCESSORY = Platform.OS === 'ios' && Number.parseInt(String(Platform.Version), 10) >= 26;

type ChipProps = {
  /** `inline` is the compact form iOS uses when the tab bar shrinks while scrolling. */
  placement?: 'regular' | 'inline';
};

/** Minimized reading timer: the running clock, the book and its state. Opens the full timer. */
export function SessionChip({ placement = 'regular' }: ChipProps) {
  const { active } = useSessions();
  const { books } = useBooks();
  const now = useNow();
  const book = books.find((b) => b.id === active?.bookId);
  if (!active || !book) return null;

  const paused = isPaused(active);
  const clock = formatClock(elapsedMs(active, now));
  const status = paused ? 'Session paused' : 'Reading…';

  return (
    <Pressable
      onPress={() => router.push('/session')}
      accessibilityRole="button"
      accessibilityLabel={`Reading session, ${book.title}, ${clock}, ${status}. Open timer`}
      style={({ pressed }) => [styles.chip, placement === 'inline' && styles.inline, pressed && styles.pressed]}
    >
      <Timer size={sizes.iconSmall} strokeWidth={sizes.iconStroke} color={colors.text} />
      <Text variant="label" style={styles.clock}>
        {clock}
      </Text>
      {placement === 'regular' ? (
        <>
          <Text variant="secondary" numberOfLines={1} style={styles.title}>
            {book.title}
          </Text>
          <Text variant="secondary">{status}</Text>
        </>
      ) : null}
    </Pressable>
  );
}

/** Content for `<NativeTabs.BottomAccessory>`; adapts to the accessory's current placement. */
export function SessionAccessory() {
  const placement = NativeTabs.BottomAccessory.usePlacement();
  return <SessionChip placement={placement === 'inline' ? 'inline' : 'regular'} />;
}

/** Floating chip for platforms without the native accessory. Render last inside a tab screen. */
export function SessionChipOverlay() {
  const { active } = useSessions();
  if (USES_TAB_ACCESSORY || !active) return null;
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <SessionChip />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    minHeight: sizes.chipHeight,
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    backgroundColor: colors.steel,
  },
  inline: {
    minHeight: sizes.controlHeightSmall,
    paddingHorizontal: space[3],
  },
  pressed: {
    opacity: 0.8,
  },
  clock: {
    fontVariant: ['tabular-nums'],
  },
  title: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: space[4],
    right: space[4],
    bottom: space[3],
  },
});
