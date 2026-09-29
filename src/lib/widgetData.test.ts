import { createBook, startReading, withCurrentPage } from './books';
import { buildWidgetProps, buildWidgetTimeline } from './widgetData';

// Tuesday 29 September 2026, evening.
const now = new Date(2026, 8, 29, 20);
const at = (day: number) => new Date(2026, 8, day, 9);

const saltRoad = withCurrentPage(
  startReading(createBook({ title: 'The Salt Road', author: 'Mara Ellison', totalPages: 340 }, at(1)), 0, at(1)),
  212,
  at(28),
);
const smallHours = withCurrentPage(
  startReading(createBook({ title: 'Small Hours', author: 'Theo Adeyemi', totalPages: 256 }, at(2)), 0, at(2)),
  64,
  at(27),
);
const finished = createBook({ title: 'Paper Moons', author: 'Leo Brandt', totalPages: 180, status: 'finished' }, at(10));
const toRead = createBook({ title: 'Northern Lines', author: 'Jonah Pike', totalPages: 288 }, at(11));
const library = [smallHours, saltRoad, finished, toRead];

describe('buildWidgetProps', () => {
  it('shows the empty state when nothing is in progress', () => {
    const props = buildWidgetProps({ books: [toRead], readingLog: {}, goal: 24, lastOpenedId: null, now });
    expect(props.state).toBe('empty');
    expect(props.current).toBeNull();
    expect(props.urls.add).toBe('bookshift://add');
  });

  it('picks the last opened book as current, falling back to the latest progress', () => {
    const base = { books: library, readingLog: {}, goal: 30, now };
    expect(buildWidgetProps({ ...base, lastOpenedId: null }).current?.title).toBe('The Salt Road');
    expect(buildWidgetProps({ ...base, lastOpenedId: smallHours.id }).current?.title).toBe('Small Hours');
    // A finished book can't be "current".
    expect(buildWidgetProps({ ...base, lastOpenedId: finished.id }).current?.title).toBe('The Salt Road');
  });

  it('lists books in progress with progress and a deep link', () => {
    const props = buildWidgetProps({ books: library, readingLog: {}, goal: 30, lastOpenedId: null, now });
    expect(props.reading.map((b) => [b.title, b.percent])).toEqual([
      ['The Salt Road', 62],
      ['Small Hours', 25],
    ]);
    expect(props.current?.url).toBe(`bookshift://book/${saltRoad.id}`);
    expect(props.goal).toEqual({ year: 2026, finished: 1, target: 30 });
  });

  it('reports today and the streak when read today', () => {
    const readingLog = { '2026-09-27': 10, '2026-09-28': 12, '2026-09-29': 18 };
    const props = buildWidgetProps({ books: library, readingLog, goal: 30, lastOpenedId: null, now });
    expect(props.today).toEqual({ readToday: true, value: '18 pp' });
    expect(props.streak.label).toBe('3-day streak');
    expect(props.streak.week.at(-1)).toEqual({ letter: 'T', state: 'todayRead' });
  });

  it('nudges to keep the streak when not read yet today', () => {
    const readingLog = { '2026-09-27': 10, '2026-09-28': 12 };
    const props = buildWidgetProps({ books: library, readingLog, goal: 30, lastOpenedId: null, now });
    expect(props.today).toEqual({ readToday: false, value: '0 pp' });
    expect(props.streak.label).toBe('Keep your 2-day streak');
    expect(props.streak.week.at(-1)?.state).toBe('today');
  });
});

describe('buildWidgetTimeline', () => {
  it('schedules resets at the next midnights', () => {
    const readingLog = { '2026-09-29': 18 };
    const timeline = buildWidgetTimeline({ books: library, readingLog, goal: 30, lastOpenedId: null, now });
    const [today, tomorrow, dayAfter] = timeline;
    expect(timeline).toHaveLength(4);
    expect(dayAfter.props.streak.label).toBe('Start a streak today');
    expect(today.props.today.readToday).toBe(true);
    expect(tomorrow.date).toEqual(new Date(2026, 8, 30));
    expect(tomorrow.props.today.readToday).toBe(false);
    expect(tomorrow.props.streak.label).toBe('Keep your 1-day streak');
  });
});
