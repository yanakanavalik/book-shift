import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { colors } from '@/theme';

// The system tab bar: Liquid Glass on iOS 26+, Material 3 bottom navigation on Android.
// On iOS 26 the glass background comes from the content behind it, so only colors are set here.
export default function TabsLayout() {
  return (
    <NativeTabs
      tintColor={colors.text}
      iconColor={colors.textMuted}
      labelStyle={{ color: colors.textMuted }}
      backgroundColor={colors.bg}
      indicatorColor={colors.surface}
    >
      <NativeTabs.Trigger name="index" contentStyle={{ backgroundColor: colors.bg }}>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home_filled' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="books" contentStyle={{ backgroundColor: colors.bg }}>
        <NativeTabs.Trigger.Label>My books</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'books.vertical', selected: 'books.vertical.fill' }}
          md="library_books"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
