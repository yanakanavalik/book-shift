import { greeting } from './dates';
import { booksFinishedIn, clampGoal, goalPace } from './goals';

describe('clampGoal', () => {
  it('keeps goals within 1..365 whole books', () => {
    expect(clampGoal(0)).toBe(1);
    expect(clampGoal(400)).toBe(365);
    expect(clampGoal(12.4)).toBe(12);
  });
});

describe('goalPace', () => {
  it('describes a monthly pace', () => {
    expect(goalPace(24)).toBe('About 2 books a month.');
    expect(goalPace(12)).toBe('About 1 book a month.');
  });

  it('describes slower goals in months per book', () => {
    expect(goalPace(6)).toBe('About one book every 2 months.');
    expect(goalPace(1)).toBe('About one book every 12 months.');
  });
});

describe('greeting', () => {
  const at = (hour: number) => new Date(2026, 8, 29, hour);

  it('changes with the time of day', () => {
    expect(greeting(at(8))).toBe('Good morning');
    expect(greeting(at(14))).toBe('Good afternoon');
    expect(greeting(at(20))).toBe('Good evening');
    expect(greeting(at(2))).toBe('Good evening');
  });
});

describe('booksFinishedIn', () => {
  it('counts only books finished in the year', () => {
    const books = [
      { finishedAt: new Date(2026, 2, 1).toISOString() },
      { finishedAt: new Date(2025, 11, 20).toISOString() },
      {},
    ];
    expect(booksFinishedIn(2026, books)).toBe(1);
  });
});
