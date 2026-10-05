import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { USES_TAB_ACCESSORY } from '@/components/SessionChip';
import { sizes, space } from '@/theme';
import { useSessions } from '@/store/sessions';

/**
 * Content padding for the scroll view at the root of a tab screen.
 *
 * On iOS, native tabs turn on automatic content insets for the first ScrollView, which already
 * clears the status bar and the tab bar. Android doesn't, so the status bar inset is added by hand
 * (the Material tab bar takes its own space in the layout).
 */
export function useTabScreenPadding() {
  const insets = useSafeAreaInsets();
  const { active } = useSessions();
  // Leave room for the floating session chip where it overlays the screen (no native tab accessory).
  const chipSpace = active && !USES_TAB_ACCESSORY ? sizes.chipHeight + space[3] : 0;
  return {
    paddingTop: (Platform.OS === 'ios' ? 0 : insets.top) + space[4],
    paddingBottom: space[6] + chipSpace,
  };
}
