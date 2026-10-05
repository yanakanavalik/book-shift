import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, space } from '@/theme';

import { Button } from './Button';
import { Text } from './Text';

/** Drag handle for iOS sheets; Android presents these screens full screen, so it renders nothing there. */
export function SheetGrabber({ style }: { style?: StyleProp<ViewStyle> }) {
  if (Platform.OS !== 'ios') return null;
  return <View style={[styles.grabber, style]} />;
}

/** Sheet title with a small outlined action on the right, e.g. "Cancel" or "Done". */
export function SheetHeader({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return (
    <View style={styles.header}>
      <Text variant="sheetTitle" accessibilityRole="header">
        {title}
      </Text>
      <Button label={action} variant="outline" size="sm" onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space[2],
  },
});
