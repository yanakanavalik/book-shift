import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoalEditorCard } from '@/components/home/GoalEditorCard';
import { SheetGrabber, SheetHeader, Text } from '@/components/ui';
import { colors, space } from '@/theme';

export default function GoalScreen() {
  const year = new Date().getFullYear();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <SheetGrabber />
      <SheetHeader title="Reading goal" action="Done" onAction={() => router.back()} />
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
});
