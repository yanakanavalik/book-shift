import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookshelfIllustration } from '@/components/BookshelfIllustration';
import { Button, Text } from '@/components/ui';
import { colors, space } from '@/theme';
import { useOnboarding } from '@/store/onboarding';

// Sign-in (Google, with sync and backup) is planned; until then everything stays on this phone.
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { completeWelcome } = useOnboarding();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[4] },
      ]}
      bounces={false}
    >
      <View style={styles.top}>
        <BookshelfIllustration />

        <View style={styles.intro}>
          <Text variant="kicker" color="accentText">
            Welcome
          </Text>
          <Text variant="screenTitle" accessibilityRole="header">
            Every book you read, in one place.
          </Text>
          <Text color="textMuted">
            Log what you’re reading, track your pages and keep a yearly goal. Add books from the
            catalog or enter them yourself.
          </Text>
        </View>
      </View>

      <Button label="Get started" variant="dark" onPress={completeWelcome} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    gap: space[6],
  },
  top: {
    gap: space[6],
  },
  intro: {
    gap: space[2],
  },
});
