import {
  Circle,
  HStack,
  Image,
  Link,
  Rectangle,
  RoundedRectangle,
  Spacer,
  Text,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import {
  background,
  clipShape,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  kerning,
  lineLimit,
  opacity,
  padding,
  shapes,
  strokeBorder,
  widgetURL,
  type ViewModifier,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { ReadingWidgetProps, WidgetBook } from '@/lib/widgetData';

/**
 * Home screen widget in three sizes. Runs in the widget extension's isolated runtime:
 * everything it needs must be declared inside this function or passed in through props
 * (built by `buildWidgetProps` in the app).
 */
const ReadingWidget = (props: ReadingWidgetProps, environment: WidgetEnvironment) => {
  'widget';

  const c = props.colors;
  const PAD = 16;
  const BAR_SEGMENTS = 50;
  /** Stands in for SwiftUI's `.infinity` in frames. */
  const FILL = 10000;

  // --- Building blocks (must live inside the widget function) ---

  /** Fills the available space, content pinned to the top left. */
  const fillTopLeading = () => frame({ maxWidth: FILL, maxHeight: FILL, alignment: 'topLeading' });

  const text = (
    content: string,
    size: number,
    color: string,
    weight?: 'medium' | 'semibold' | 'bold',
    ...extra: ViewModifier[]
  ) => <Text modifiers={[font({ size, weight }), foregroundStyle(color), ...extra]}>{content}</Text>;

  const percentText = (book: WidgetBook, size: number, color: string = c.text) =>
    text(`${book.percent}%`, size, color, 'semibold');
  const pagesText = (book: WidgetBook, color: string, ...extra: ViewModifier[]) =>
    text(`p. ${book.currentPage} / ${book.totalPages}`, 11, color, undefined, ...extra);

  const kicker = (label: string, color: string) => text(label.toUpperCase(), 10, color, 'semibold', kerning(1.2));

  /** Progress bar from equal segments, so it fills any widget width without measuring. */
  const bar = (percent: number, fill: string, track: string, height: number, trackOpacity = 1) => {
    const filled = Math.round((Math.max(0, Math.min(100, percent)) / 100) * BAR_SEGMENTS);
    return (
      <HStack spacing={0} modifiers={[frame({ height }), clipShape('capsule')]}>
        {Array.from({ length: BAR_SEGMENTS }, (_, i) => (
          <Rectangle
            key={i}
            modifiers={[
              foregroundStyle(i < filled ? fill : track),
              opacity(i < filled ? 1 : trackOpacity),
              frame({ maxWidth: FILL, height }),
            ]}
          />
        ))}
      </HStack>
    );
  };

  const circle = (key: number, size: number, style: ViewModifier) => (
    <Circle key={key} modifiers={[style, frame({ width: size, height: size })]} />
  );

  const dot = (state: string, size: number, key: number) => {
    if (state === 'read') return circle(key, size, foregroundStyle(c.streakRead));
    if (state === 'missed') return circle(key, size, foregroundStyle(c.streakMissed));
    if (state === 'todayRead')
      return (
        <ZStack key={key} modifiers={[frame({ width: size, height: size })]}>
          <Circle modifiers={[foregroundStyle(c.streakToday)]} />
          <Image systemName="checkmark" size={size * 0.5} color={c.background} />
        </ZStack>
      );
    if (state === 'today')
      return circle(key, size, strokeBorder({ color: c.streakToday, style: { lineWidth: 1.5, dash: [2, 2] } }));
    return circle(key, size, strokeBorder({ color: c.streakEmpty, style: { lineWidth: 1 } }));
  };

  const week = (size: number, spacing: number) => (
    <VStack alignment="leading" spacing={3}>
      <HStack spacing={spacing}>{props.streak.week.map((day, i) => dot(day.state, size, i))}</HStack>
      <HStack spacing={spacing}>
        {props.streak.week.map((day, i) => (
          <Text
            key={i}
            modifiers={[
              font({ size: 7, weight: i === props.streak.week.length - 1 ? 'bold' : 'medium' }),
              foregroundStyle(i === props.streak.week.length - 1 ? c.text : c.textMuted),
              frame({ width: size }),
            ]}
          >
            {day.letter}
          </Text>
        ))}
      </HStack>
    </VStack>
  );

  const chipPadding = () => padding({ horizontal: 7, vertical: 3 });

  const todayChip = () =>
    props.today.readToday ? (
      <HStack spacing={3} modifiers={[chipPadding(), background(c.readTodayChip, shapes.capsule())]}>
        <Image systemName="checkmark" size={8} color={c.text} />
        {text('Read today', 10, c.text, 'semibold')}
      </HStack>
    ) : (
      text('Not read yet', 10, c.text, 'semibold', chipPadding(), background(c.notReadChip, shapes.capsule()))
    );

  const cover = (book: WidgetBook, width: number, height: number) => (
    <ZStack alignment="topLeading" modifiers={[frame({ width, height })]}>
      <RoundedRectangle cornerRadius={4} modifiers={[foregroundStyle(book.cover.background)]} />
      {book.cover.border ? (
        <RoundedRectangle
          cornerRadius={4}
          modifiers={[strokeBorder({ color: book.cover.border, style: { lineWidth: 1 } })]}
        />
      ) : null}
      {width >= 40 ? text(book.title, 7, book.cover.text, 'bold', lineLimit(3), padding({ all: 4 })) : null}
    </ZStack>
  );

  // A pill "button" that deep-links into the app, e.g. to start a reading session.
  const actionLink = (url: string, label: string, primary: boolean) => (
    <Link destination={url}>
      <HStack
        spacing={5}
        modifiers={[
          frame({ maxWidth: FILL, height: 30 }),
          background(primary ? c.accent : c.readTodayChip, shapes.capsule()),
        ]}
      >
        <Image systemName="timer" size={11} color={c.onAccent} />
        {text(label, 12, c.onAccent, 'semibold')}
      </HStack>
    </Link>
  );

  const actionLabel = props.today.readToday ? 'Start timer' : 'Read now';

  // --- Small: current book ---

  if (environment.widgetFamily === 'systemSmall') {
    const book = props.current;
    if (!book) {
      return (
        <VStack
          alignment="leading"
          spacing={4}
          modifiers={[
            padding({ all: PAD }),
            fillTopLeading(),
            containerBackground(c.background, 'widget'),
            widgetURL(props.urls.add),
          ]}
        >
          {kicker('Reading', c.textMuted)}
          {text('Add a book to start', 15, c.text, 'semibold')}
          <Spacer />
          <Image systemName="plus.circle.fill" size={28} color={c.accent} />
        </VStack>
      );
    }
    return (
      <VStack
        alignment="leading"
        spacing={4}
        modifiers={[
          padding({ all: PAD }),
          fillTopLeading(),
          containerBackground(book.cover.background, 'widget'),
          widgetURL(book.url),
        ]}
      >
        {kicker('Reading', book.cover.text)}
        {text(book.title, 15, book.cover.text, 'semibold', lineLimit(2))}
        <Spacer />
        {percentText(book, 34, book.cover.text)}
        {bar(book.percent, book.cover.text, book.cover.text, 4, 0.25)}
        {pagesText(book, book.cover.text, opacity(0.8))}
      </VStack>
    );
  }

  // --- Medium: today and current book ---

  if (environment.widgetFamily === 'systemMedium') {
    const book = props.current;
    return (
      <HStack
        spacing={PAD}
        alignment="top"
        modifiers={[
          padding({ all: PAD }),
          containerBackground(c.background, 'widget'),
          widgetURL(book ? book.url : props.urls.add),
        ]}
      >
        <VStack
          alignment="leading"
          spacing={4}
          modifiers={[fillTopLeading()]}
        >
          {kicker('Today', c.textMuted)}
          {text(props.today.value, 30, c.text, 'semibold')}
          {todayChip()}
          <Spacer />
          {text(props.streak.label, 11, c.text, 'semibold')}
          {week(12, 5)}
        </VStack>

        <Rectangle modifiers={[foregroundStyle(c.divider), frame({ width: 1, maxHeight: FILL })]} />

        {book ? (
          <VStack
            alignment="leading"
            spacing={8}
            modifiers={[fillTopLeading()]}
          >
            <HStack spacing={10} alignment="top">
              {cover(book, 44, 60)}
              <VStack alignment="leading" spacing={2}>
                {text(book.title, 13, c.text, 'semibold', lineLimit(2))}
                {pagesText(book, c.textMuted)}
                {percentText(book, 17)}
              </VStack>
            </HStack>
            <Spacer />
            {bar(book.percent, c.accent, c.track, 4)}
            {actionLink(book.timerUrl, actionLabel, !props.today.readToday)}
          </VStack>
        ) : (
          <VStack
            alignment="leading"
            spacing={4}
            modifiers={[fillTopLeading()]}
          >
            {text('Nothing in progress', 13, c.text, 'semibold')}
            {text('Add a book to start', 11, c.textMuted)}
            <Spacer />
            {actionLink(props.urls.add, 'Add a book', true)}
          </VStack>
        )}
      </HStack>
    );
  }

  // --- Large: goal, streak and everything in progress ---

  const DOTS_PER_ROW = 15;
  const MAX_DOTS = 60;
  const target = props.goal.target;
  const rows: number[][] = [];
  if (target <= MAX_DOTS) {
    for (let start = 0; start < target; start += DOTS_PER_ROW) {
      rows.push(Array.from({ length: Math.min(DOTS_PER_ROW, target - start) }, (_, i) => start + i));
    }
  }

  return (
    <VStack
      alignment="leading"
      spacing={12}
      modifiers={[padding({ all: PAD }), containerBackground(c.background, 'widget'), widgetURL(props.urls.home)]}
    >
      <HStack alignment="top">
        <VStack alignment="leading" spacing={2}>
          {kicker(`${props.goal.year} goal`, c.text)}
          <HStack alignment="firstTextBaseline" spacing={3}>
            {text(`${props.goal.finished}`, 28, c.text, 'semibold')}
            {text(`/ ${target}`, 12, c.textMuted)}
          </HStack>
        </VStack>
        <Spacer />
        <VStack alignment="trailing" spacing={2}>
          {kicker('Streak', c.text)}
          <HStack alignment="firstTextBaseline" spacing={3}>
            {text(`${props.streak.days}`, 28, c.text, 'semibold')}
            {text(props.streak.days === 1 ? 'day' : 'days', 12, c.textMuted)}
          </HStack>
        </VStack>
      </HStack>

      {rows.length > 0 ? (
        <VStack alignment="leading" spacing={5}>
          {rows.map((row, r) => (
            <HStack key={r} spacing={5}>
              {row.map((i) => (
                <Circle
                  key={i}
                  modifiers={[
                    foregroundStyle(i < props.goal.finished ? c.accent : c.track),
                    frame({ width: 14, height: 14 }),
                  ]}
                />
              ))}
            </HStack>
          ))}
        </VStack>
      ) : (
        bar((props.goal.finished / Math.max(1, target)) * 100, c.accent, c.track, 6)
      )}

      <Rectangle modifiers={[foregroundStyle(c.divider), frame({ maxWidth: FILL, height: 1 })]} />

      {props.reading.length > 0 ? (
        <VStack alignment="leading" spacing={10}>
          {props.reading.map((book) => (
            <Link key={book.id} destination={book.url}>
              <HStack spacing={10}>
                {cover(book, 26, 36)}
                <VStack alignment="leading" spacing={5}>
                  <HStack>
                    {text(book.title, 13, c.text, 'semibold', lineLimit(1))}
                    <Spacer />
                    {percentText(book, 13)}
                  </HStack>
                  {bar(book.percent, c.accent, c.track, 3)}
                </VStack>
              </HStack>
            </Link>
          ))}
        </VStack>
      ) : (
        <Link destination={props.urls.add}>
          <VStack alignment="leading" spacing={2}>
            {text('Nothing in progress', 13, c.text, 'semibold')}
            {text('Add a book to start →', 12, c.accentText, 'semibold')}
          </VStack>
        </Link>
      )}

      <Spacer />

      <HStack spacing={6}>
        {todayChip()}
        {text(props.today.value, 11, c.textMuted)}
        <Spacer />
        {props.current ? (
          <Link destination={props.current.timerUrl}>
            {text(`${actionLabel} →`, 12, c.accentText, 'semibold')}
          </Link>
        ) : null}
      </HStack>
    </VStack>
  );
};

export default createWidget('ReadingWidget', ReadingWidget);
