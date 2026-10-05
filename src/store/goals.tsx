import { useCallback, useMemo, type ReactNode } from 'react';

import { clampGoal, SUGGESTED_GOAL } from '@/lib/goals';

import { createStoreContext, usePersistedState } from './persisted';

const STORAGE_KEY = 'book-shift/goals/v1';

/** Yearly reading goals, keyed by year. */
type Goals = Record<string, number>;

type GoalsContextValue = {
  loaded: boolean;
  /** The goal for a year; `suggested` is true until the user picks one. */
  goalFor: (year: number) => { value: number; suggested: boolean };
  setGoal: (year: number, goal: number) => void;
};

const [Provider, useGoals] = createStoreContext<GoalsContextValue>('Goals');
export { useGoals };

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals, loaded] = usePersistedState<Goals>(STORAGE_KEY, {}, 'goals');

  const goalFor = useCallback(
    (year: number) => {
      const value = goals[year];
      return value === undefined ? { value: SUGGESTED_GOAL, suggested: true } : { value, suggested: false };
    },
    [goals],
  );

  const setGoal = useCallback(
    (year: number, goal: number) => setGoals((prev) => ({ ...prev, [year]: clampGoal(goal) })),
    [setGoals],
  );

  const value = useMemo(() => ({ loaded, goalFor, setGoal }), [loaded, goalFor, setGoal]);

  return <Provider value={value}>{children}</Provider>;
}
