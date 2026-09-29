import { router } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoalEditorCard } from '@/components/home/GoalEditorCard';
import { Button, Text } from '@/components/ui';
import { colors, radius, space } from '@/theme';

export default function GoalScreen() {
  const year = new Date().getFullYear();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      {Platform.OS === 'ios' ? <View style={styles.grabber} /> : null}
      <View style={styles.header}>
        <Text variant="sheetTitle" accessibilityRole="header">
          Reading goal
        </Text>
        <Button label="Done" variant="outline" size="sm" onPress={() => router.back()} />
      </View>
      <Text color="textMuted">How many books do you want to finish in {year}?</Text>
      <GoalEditorCard year={year} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: space[4],
    paddingTop: space[2],
    gap: space[3],
  },
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
