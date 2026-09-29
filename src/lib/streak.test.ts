import { currentStreak, dateKey, logPages, recentDays, streakCalendar, type ReadingLog } from './streak';

// Tuesday 29 September 2026.
const today = new Date(2026, 8, 29, 20);

describe('logPages', () => {
  it('adds pages to the day and ignores non-positive values', () => {
    let log: ReadingLog = {};
    log = logPages(log, 12, today);
    log = logPages(log, 8, today);
    log = logPages(log, -5, today);
    expect(log).toEqual({ '2026-09-29': 20 });
  });
});

describe('currentStreak', () => {
  it('counts consecutive days ending today', () => {
    expect(currentStreak({ '2026-09-27': 5, '2026-09-28': 5, '2026-09-29': 5 }, today)).toBe(3);
  });

  it('keeps yesterday’s streak alive until today is over', () => {
    expect(currentStreak({ '2026-09-27': 5, '2026-09-28': 5 }, today)).toBe(2);
  });

  it('resets after a missed day', () => {
    expect(currentStreak({ '2026-09-26': 5, '2026-09-27': 5 }, today)).toBe(0);
    expect(currentStreak({}, today)).toBe(0);
  });
});

describe('streakCalendar', () => {
  it('shows three Monday-first weeks ending with the current one', () => {
    const days = streakCalendar({}, today);
    expect(days).toHaveLength(21);
    // Today is the Tuesday of the last row.
    expect(days[15]).toBe('today');
    expect(days.slice(16).every((d) => d === 'future')).toBe(true);
    expect(days.slice(0, 15).every((d) => d === 'empty')).toBe(true);
  });

  it('marks missed days only after reading started', () => {
    const days = streakCalendar({ '2026-09-24': 10, '2026-09-26': 4, '2026-09-29': 3 }, today);
    const row = (week: number) => days.slice(week * 7, week * 7 + 7);
    expect(row(1)).toEqual(['empty', 'empty', 'empty', 'read', 'missed', 'read', 'missed']);
    expect(row(2).slice(0, 3)).toEqual(['missed', 'todayRead', 'future']);
  });

  it('uses local calendar days', () => {
    expect(dateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('recentDays', () => {
  it('lists the last seven days ending today with weekday initials', () => {
    const days = recentDays({ '2026-09-27': 5, '2026-09-29': 3 }, today);
    expect(days.map((d) => d.letter).join('')).toBe('WTFSSMT');
    expect(days.map((d) => d.state)).toEqual(['empty', 'empty', 'empty', 'empty', 'read', 'missed', 'todayRead']);
  });
});
