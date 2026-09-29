import { requireOptionalNativeModule } from 'expo';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { buildWidgetTimeline } from '@/lib/widgetData';
import { useBooks } from '@/store/books';
import { useGoals } from '@/store/goals';

// Widgets need a development or production build. Expo Go and Android don't have the native module,
// and importing `expo-widgets` without it throws, so the widget is only loaded when it's available.
const widgetsAvailable = Platform.OS === 'ios' && requireOptionalNativeModule('ExpoWidgets') !== null;

/** Pushes the latest library state to the home screen widget whenever it changes. */
export function useWidgetSync() {
  const { books, readingLog, lastOpenedId, loaded } = useBooks();
  const { goalFor, loaded: goalsLoaded } = useGoals();

  useEffect(() => {
    if (!widgetsAvailable || !loaded || !goalsLoaded) return;
    const now = new Date();
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ReadingWidget = require('./ReadingWidget').default as typeof import('./ReadingWidget').default;
      ReadingWidget.updateTimeline(
        buildWidgetTimeline({ books, readingLog, goal: goalFor(now.getFullYear()).value, lastOpenedId, now }),
      );
    } catch (error) {
      console.warn('Failed to update widget', error);
    }
  }, [books, readingLog, lastOpenedId, loaded, goalFor, goalsLoaded]);
}
