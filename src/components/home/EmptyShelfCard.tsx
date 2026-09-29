import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { colors, radius, sizes, space } from '@/theme';

// Three dashed "slots" shrinking into the distance.
const SLOTS = [
  { width: 64, height: 96, borderColor: colors.accent },
  { width: 56, height: 84, borderColor: colors.outlineSoft },
  { width: 48, height: 72, borderColor: colors.outlineFaint },
];

export function EmptyShelfCard() {
  return (
    <Card style={styles.card}>
      <View style={styles.slots} accessible={false} importantForAccessibility="no-hide-descendants">
        {SLOTS.map((slot, index) => (
          <View key={index} style={[styles.slot, slot]}>
            {index === 0 ? <Plus size={sizes.icon} strokeWidth={sizes.iconStroke} color={colors.accentText} /> : null}
          </View>
        ))}
      </View>
      <View style={styles.copy}>
        <Text variant="sheetTitle">Your shelf is empty</Text>
        <Text color="textMuted">
          Start with the book you’re reading now. You can also add ones you’ve finished this year or want to read
          next.
        </Text>
      </View>
      <Button label="Add your first book" icon={Plus} onPress={() => router.push('/add')} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.hero,
    paddingTop: space[8] + space[4],
    gap: space[4],
  },
  slots: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[3],
  },
  slot: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radius.cover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: space[1],
  },
});
