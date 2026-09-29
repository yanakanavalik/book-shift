import { Cloud, Smartphone, type LucideIcon } from 'lucide-react-native';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookshelfIllustration } from '@/components/BookshelfIllustration';
import { Button, Card, Divider, Text } from '@/components/ui';
import { colors, sizes, space } from '@/theme';
import { useOnboarding } from '@/store/onboarding';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { completeWelcome } = useOnboarding();

  // Accounts aren't implemented yet; let people continue locally instead of dead-ending.
  const signInUnavailable = () => {
    Alert.alert(
      'Accounts are coming soon',
      'For now your books are saved on this phone. You can sign in later to sync them.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue without account', onPress: completeWelcome },
      ],
    );
  };

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

        <Card style={styles.options}>
          <Option
            icon={Cloud}
            title="With an account"
            description="Your books sync across devices and are backed up."
          />
          <Divider />
          <Option
            icon={Smartphone}
            title="Without an account"
            description="Everything stays on this phone. You can sign in any time."
          />
        </Card>
      </View>

      <View style={styles.actions}>
        <Button label="Continue with Google" variant="dark" onPress={signInUnavailable} />
        <Button label="Skip for now" variant="link" onPress={completeWelcome} />
      </View>
    </ScrollView>
  );
}

function Option({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <View style={styles.option}>
      <Icon size={sizes.icon} strokeWidth={sizes.iconStroke} color={colors.text} />
      <View style={styles.optionText}>
        <Text variant="label">{title}</Text>
        <Text variant="secondary" color="textMuted">
          {description}
        </Text>
      </View>
    </View>
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
  options: {
    paddingVertical: space[2],
    gap: 0,
  },
  option: {
    flexDirection: 'row',
    gap: space[3],
    paddingVertical: space[3],
  },
  optionText: {
    flex: 1,
    gap: space[1],
  },
  actions: {
    gap: space[2],
  },
});
