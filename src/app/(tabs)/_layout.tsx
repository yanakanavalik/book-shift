import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { SessionAccessory } from '@/components/SessionChip';
import { colors } from '@/theme';
import { useSessions } from '@/store/sessions';

const contentStyle = { backgroundColor: colors.bg };

// The system tab bar: Liquid Glass on iOS 26+, Material 3 bottom navigation on Android.
// On iOS 26 the glass background comes from the content behind it, so only colors are set here.
export default function TabsLayout() {
  const { active } = useSessions();
  return (
    <NativeTabs
      tintColor={colors.text}
      iconColor={colors.textMuted}
      labelStyle={{ color: colors.textMuted }}
      backgroundColor={colors.bg}
      indicatorColor={colors.surface}
    >
      {/* iOS 26+: the minimized reading timer lives in the tab bar's native bottom accessory. */}
      {active ? (
        <NativeTabs.BottomAccessory>
          <SessionAccessory />
        </NativeTabs.BottomAccessory>
      ) : null}
      <NativeTabs.Trigger name="index" contentStyle={contentStyle}>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home_filled' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="books" contentStyle={contentStyle}>
        <NativeTabs.Trigger.Label>My books</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'books.vertical', selected: 'books.vertical.fill' }}
          md="library_books"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
