import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { clampGoal, SUGGESTED_GOAL } from '@/lib/goals';

const STORAGE_KEY = 'book-shift/goals/v1';

/** Yearly reading goals, keyed by year. */
type Goals = Record<string, number>;

type GoalsContextValue = {
  loaded: boolean;
  /** The goal for a year; `suggested` is true until the user picks one. */
  goalFor: (year: number) => { value: number; suggested: boolean };
  setGoal: (year: number, goal: number) => void;
};

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goals>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setGoals(JSON.parse(raw) as Goals);
      })
      .catch((error) => console.warn('Failed to load goals', error))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    // Don't overwrite stored data with the empty initial state before it has loaded.
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals)).catch((error) =>
      console.warn('Failed to save goals', error),
    );
  }, [goals, loaded]);

  const goalFor = useCallback(
    (year: number) => {
      const value = goals[year];
      return value === undefined ? { value: SUGGESTED_GOAL, suggested: true } : { value, suggested: false };
    },
    [goals],
  );

  const setGoal = useCallback((year: number, goal: number) => {
    setGoals((prev) => ({ ...prev, [year]: clampGoal(goal) }));
  }, []);

  const value = useMemo(() => ({ loaded, goalFor, setGoal }), [loaded, goalFor, setGoal]);

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals(): GoalsContextValue {
  const context = useContext(GoalsContext);
  if (!context) throw new Error('useGoals must be used inside <GoalsProvider>');
  return context;
}
