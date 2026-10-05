import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { palette, radius, space } from '@/theme';

// Geometry measured from the design at a 370 × 293 panel; everything scales with the panel width.
const DESIGN_WIDTH = 370;
const DESIGN_HEIGHT = 293;
const SHELF = { inset: 24, bottom: 28, height: 10 };
const BOOK_GAP = 6;
const BOOK_RADIUS = 5;
/** How far books sink behind the shelf so they read as standing on it. */
const BOOK_OVERLAP = 5;
const RIBBON = { width: 14, height: 23 };

// Same artwork as the app icon: five books on the shelf and one raised book with a bookmark.
const BOOKS = [
  { width: 30, height: 111, color: palette.coolSteel },
  { width: 26, height: 99, color: palette.ground },
  { width: 40, height: 141, color: palette.cinnamon, raised: 50 },
  { width: 28, height: 118, color: palette.tangerine },
  { width: 22, height: 92, color: palette.coolSteel },
  { width: 32, height: 107, color: palette.ground },
];

/** Welcome hero: the app icon's bookshelf on a dark steel panel. Decorative. */
export function BookshelfIllustration() {
  const { width: windowWidth } = useWindowDimensions();
  const panelWidth = windowWidth - space[4] * 2;
  const s = panelWidth / DESIGN_WIDTH;

  return (
    <View
      style={[styles.panel, { width: panelWidth, height: DESIGN_HEIGHT * s }]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <View style={[styles.books, { bottom: (SHELF.bottom + SHELF.height - BOOK_OVERLAP) * s, gap: BOOK_GAP * s }]}>
        {BOOKS.map((book, index) => (
          <View key={index} style={{ marginBottom: book.raised ? (book.raised + BOOK_OVERLAP) * s : 0 }}>
            <View
              style={{
                width: book.width * s,
                height: (book.height + (book.raised ? 0 : BOOK_OVERLAP)) * s,
                borderRadius: BOOK_RADIUS * s,
                backgroundColor: book.color,
              }}
            />
            {book.raised ? <Ribbon scale={s} /> : null}
          </View>
        ))}
      </View>
      <View
        style={[
          styles.shelf,
          { left: SHELF.inset * s, right: SHELF.inset * s, bottom: SHELF.bottom * s, height: SHELF.height * s },
        ]}
      />
    </View>
  );
}

/** Bookmark hanging from the raised book, with a V-notch cut in the panel color. */
function Ribbon({ scale: s }: { scale: number }) {
  const notch = RIBBON.width * 0.7 * s;
  return (
    <View style={[styles.ribbon, { width: RIBBON.width * s, height: RIBBON.height * s }]}>
      <View
        style={[
          styles.notch,
          { width: notch, height: notch, bottom: -notch / 2, left: (RIBBON.width * s - notch) / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: palette.coolSteel700,
    borderRadius: radius.hero,
    overflow: 'hidden',
  },
  books: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  shelf: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: palette.darkCoffee,
  },
  ribbon: {
    position: 'absolute',
    top: '100%',
    alignSelf: 'center',
    backgroundColor: palette.softPeach,
    overflow: 'hidden',
  },
  notch: {
    position: 'absolute',
    backgroundColor: palette.coolSteel700,
    transform: [{ rotate: '45deg' }],
  },
});
