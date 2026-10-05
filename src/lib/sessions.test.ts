import {
  createSession,
  elapsedMs,
  formatClock,
  isPaused,
  logMinutes,
  normalizeSession,
  pauseSession,
  readingActivity,
  resumeSession,
  sessionMinutes,
  type ReadingSession,
} from './sessions';

const at = (h: number, m: number, s = 0) => new Date(2026, 8, 30, h, m, s);

describe('session timing', () => {
  const session = createSession('b1', 40, at(9, 0));

  it('measures elapsed time while running', () => {
    expect(elapsedMs(session, at(9, 0, 45))).toBe(45_000);
    expect(session.startPage).toBe(40);
  });

  it('stops the clock while paused and continues after resuming', () => {
    const paused = pauseSession(session, at(9, 10));
    expect(isPaused(paused)).toBe(true);
    expect(elapsedMs(paused, at(9, 30))).toBe(10 * 60_000);

    const resumed = resumeSession(paused, at(9, 30));
    expect(elapsedMs(resumed, at(9, 35))).toBe(15 * 60_000);
  });

  it('rounds any time read up to a whole minute', () => {
    expect(sessionMinutes(session, at(9, 0))).toBe(0);
    expect(sessionMinutes(session, at(9, 0, 8))).toBe(1);
    expect(sessionMinutes(session, at(9, 34))).toBe(34);
  });

  it('never goes negative if the clock moves back', () => {
    expect(elapsedMs(session, at(8, 0))).toBe(0);
  });

  it('formats the clock', () => {
    expect(formatClock(2_000)).toBe('00:02');
    expect(formatClock(754_000)).toBe('12:34');
    expect(formatClock(3_723_000)).toBe('1:02:03');
  });

  it('upgrades sessions saved before pausing existed', () => {
    const legacy = { bookId: 'b1', startedAt: at(9, 0).toISOString() } as ReadingSession;
    expect(elapsedMs(normalizeSession(legacy), at(9, 5))).toBe(5 * 60_000);
  });
});

describe('minutes log', () => {
  it('adds minutes to the day and ignores empty sessions', () => {
    let log = logMinutes({}, 20, at(21, 0));
    log = logMinutes(log, 14, at(21, 0));
    log = logMinutes(log, 0, at(21, 0));
    expect(log).toEqual({ '2026-09-30': 34 });
  });

  it('counts days with pages or minutes as reading activity', () => {
    expect(readingActivity({ '2026-09-28': 12 }, { '2026-09-29': 30, '2026-09-30': 0 })).toEqual({
      '2026-09-28': 12,
      '2026-09-29': 30,
    });
  });
});
