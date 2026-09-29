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
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { ReadingWidgetProps } from '@/lib/widgetData';

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

  // --- Building blocks (must live inside the widget function) ---

  const kicker = (label: string, color: string) => (
    <Text modifiers={[font({ size: 10, weight: 'semibold' }), kerning(1.2), foregroundStyle(color)]}>
      {label.toUpperCase()}
    </Text>
  );

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
              frame({ maxWidth: 10000, height }),
            ]}
          />
        ))}
      </HStack>
    );
  };

  const dot = (state: string, size: number, key: number) => {
    if (state === 'read')
      return <Circle key={key} modifiers={[foregroundStyle(c.streakRead), frame({ width: size, height: size })]} />;
    if (state === 'missed')
      return <Circle key={key} modifiers={[foregroundStyle(c.streakMissed), frame({ width: size, height: size })]} />;
    if (state === 'todayRead')
      return (
        <ZStack key={key} modifiers={[frame({ width: size, height: size })]}>
          <Circle modifiers={[foregroundStyle(c.streakToday)]} />
          <Image systemName="checkmark" size={size * 0.5} color={c.background} />
        </ZStack>
      );
    if (state === 'today')
      return (
        <Circle
          key={key}
          modifiers={[
            strokeBorder({ color: c.streakToday, style: { lineWidth: 1.5, dash: [2, 2] } }),
            frame({ width: size, height: size }),
          ]}
        />
      );
    return (
      <Circle
        key={key}
        modifiers={[
          strokeBorder({ color: c.streakEmpty, style: { lineWidth: 1 } }),
          frame({ width: size, height: size }),
        ]}
      />
    );
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

  const todayChip = () =>
    props.today.readToday ? (
      <HStack
        spacing={3}
        modifiers={[padding({ horizontal: 7, vertical: 3 }), background(c.readTodayChip, shapes.capsule())]}
      >
        <Image systemName="checkmark" size={8} color={c.text} />
        <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(c.text)]}>Read today</Text>
      </HStack>
    ) : (
      <Text
        modifiers={[
          font({ size: 10, weight: 'semibold' }),
          foregroundStyle(c.text),
          padding({ horizontal: 7, vertical: 3 }),
          background(c.notReadChip, shapes.capsule()),
        ]}
      >
        Not read yet
      </Text>
    );

  const cover = (book: NonNullable<ReadingWidgetProps['current']>, width: number, height: number) => (
    <ZStack alignment="topLeading" modifiers={[frame({ width, height })]}>
      <RoundedRectangle cornerRadius={4} modifiers={[foregroundStyle(book.cover.background)]} />
      {book.cover.border ? (
        <RoundedRectangle
          cornerRadius={4}
          modifiers={[strokeBorder({ color: book.cover.border, style: { lineWidth: 1 } })]}
        />
      ) : null}
      {width >= 40 ? (
        <Text
          modifiers={[
            font({ size: 7, weight: 'bold' }),
            foregroundStyle(book.cover.text),
            lineLimit(3),
            padding({ all: 4 }),
          ]}
        >
          {book.title}
        </Text>
      ) : null}
    </ZStack>
  );

  // A pill "button" that deep-links into the app. Opens the book until a reading timer exists.
  const actionLink = (url: string, label: string, primary: boolean) => (
    <Link destination={url}>
      <HStack
        spacing={5}
        modifiers={[
          frame({ maxWidth: 10000, height: 30 }),
          background(primary ? c.accent : c.readTodayChip, shapes.capsule()),
        ]}
      >
        <Image systemName="book" size={11} color={c.onAccent} />
        <Text modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle(c.onAccent)]}>{label}</Text>
      </HStack>
    </Link>
  );

  const actionLabel = props.today.readToday ? 'Log pages' : 'Read now';

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
            frame({ maxWidth: 10000, maxHeight: 10000, alignment: 'topLeading' }),
            containerBackground(c.background, 'widget'),
            widgetURL(props.urls.add),
          ]}
        >
          {kicker('Reading', c.textMuted)}
          <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(c.text)]}>Add a book to start</Text>
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
          frame({ maxWidth: 10000, maxHeight: 10000, alignment: 'topLeading' }),
          containerBackground(book.cover.background, 'widget'),
          widgetURL(book.url),
        ]}
      >
        {kicker('Reading', book.cover.text)}
        <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(book.cover.text), lineLimit(2)]}>
          {book.title}
        </Text>
        <Spacer />
        <Text
          modifiers={[font({ size: 34, weight: 'semibold' }), foregroundStyle(book.cover.text)]}
        >{`${book.percent}%`}</Text>
        {bar(book.percent, book.cover.text, book.cover.text, 4, 0.25)}
        <Text modifiers={[font({ size: 11 }), foregroundStyle(book.cover.text), opacity(0.8)]}>
          {`p. ${book.currentPage} / ${book.totalPages}`}
        </Text>
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
          modifiers={[frame({ maxWidth: 10000, maxHeight: 10000, alignment: 'topLeading' })]}
        >
          {kicker('Today', c.textMuted)}
          <Text modifiers={[font({ size: 30, weight: 'semibold' }), foregroundStyle(c.text)]}>{props.today.value}</Text>
          {todayChip()}
          <Spacer />
          <Text modifiers={[font({ size: 11, weight: 'semibold' }), foregroundStyle(c.text)]}>
            {props.streak.label}
          </Text>
          {week(12, 5)}
        </VStack>

        <Rectangle modifiers={[foregroundStyle(c.divider), frame({ width: 1, maxHeight: 10000 })]} />

        {book ? (
          <VStack
            alignment="leading"
            spacing={8}
            modifiers={[frame({ maxWidth: 10000, maxHeight: 10000, alignment: 'topLeading' })]}
          >
            <HStack spacing={10} alignment="top">
              {cover(book, 44, 60)}
              <VStack alignment="leading" spacing={2}>
                <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(c.text), lineLimit(2)]}>
                  {book.title}
                </Text>
                <Text
                  modifiers={[font({ size: 11 }), foregroundStyle(c.textMuted)]}
                >{`p. ${book.currentPage} / ${book.totalPages}`}</Text>
                <Text
                  modifiers={[font({ size: 17, weight: 'semibold' }), foregroundStyle(c.text)]}
                >{`${book.percent}%`}</Text>
              </VStack>
            </HStack>
            <Spacer />
            {bar(book.percent, c.accent, c.track, 4)}
            {actionLink(book.url, actionLabel, !props.today.readToday)}
          </VStack>
        ) : (
          <VStack
            alignment="leading"
            spacing={4}
            modifiers={[frame({ maxWidth: 10000, maxHeight: 10000, alignment: 'topLeading' })]}
          >
            <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(c.text)]}>
              Nothing in progress
            </Text>
            <Text modifiers={[font({ size: 11 }), foregroundStyle(c.textMuted)]}>Add a book to start</Text>
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
            <Text
              modifiers={[font({ size: 28, weight: 'semibold' }), foregroundStyle(c.text)]}
            >{`${props.goal.finished}`}</Text>
            <Text modifiers={[font({ size: 12 }), foregroundStyle(c.textMuted)]}>{`/ ${target}`}</Text>
          </HStack>
        </VStack>
        <Spacer />
        <VStack alignment="trailing" spacing={2}>
          {kicker('Streak', c.text)}
          <HStack alignment="firstTextBaseline" spacing={3}>
            <Text
              modifiers={[font({ size: 28, weight: 'semibold' }), foregroundStyle(c.text)]}
            >{`${props.streak.days}`}</Text>
            <Text modifiers={[font({ size: 12 }), foregroundStyle(c.textMuted)]}>
              {props.streak.days === 1 ? 'day' : 'days'}
            </Text>
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

      <Rectangle modifiers={[foregroundStyle(c.divider), frame({ maxWidth: 10000, height: 1 })]} />

      {props.reading.length > 0 ? (
        <VStack alignment="leading" spacing={10}>
          {props.reading.map((book) => (
            <Link key={book.id} destination={book.url}>
              <HStack spacing={10}>
                {cover(book, 26, 36)}
                <VStack alignment="leading" spacing={5}>
                  <HStack>
                    <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(c.text), lineLimit(1)]}>
                      {book.title}
                    </Text>
                    <Spacer />
                    <Text
                      modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(c.text)]}
                    >{`${book.percent}%`}</Text>
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
            <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(c.text)]}>
              Nothing in progress
            </Text>
            <Text modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle(c.accentText)]}>
              Add a book to start →
            </Text>
          </VStack>
        </Link>
      )}

      <Spacer />

      <HStack spacing={6}>
        {todayChip()}
        <Text modifiers={[font({ size: 11 }), foregroundStyle(c.textMuted)]}>{props.today.value}</Text>
        <Spacer />
        {props.current ? (
          <Link destination={props.current.url}>
            <Text
              modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle(c.accentText)]}
            >{`${actionLabel} →`}</Text>
          </Link>
        ) : null}
      </HStack>
    </VStack>
  );
};

export default createWidget('ReadingWidget', ReadingWidget);
