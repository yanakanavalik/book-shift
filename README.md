# book-shift
An app for tracking your reading progress

Built with [Expo](https://expo.dev) (SDK 57, React Native 0.86) and TypeScript, targeting iOS and Android from one codebase.

## Getting started

```sh
npm install
npx expo start
```

Then press `i` for the iOS Simulator, `a` for an Android emulator, or scan the QR code with [Expo Go](https://expo.dev/go) on a device.

To build and run the native app locally (needed once you add libraries with custom native code):

```sh
npm run ios       # requires Xcode
npm run android   # requires Android Studio + an emulator or device
```

The `ios/` and `android/` folders are generated from `app.json` on demand and are not checked in.

## Scripts

| Command             | What it does                  |
| ------------------- | ----------------------------- |
| `npm start`         | Start the Metro dev server    |
| `npm run ios`       | Build and run on iOS          |
| `npm run android`   | Build and run on Android      |
| `npm run lint`      | ESLint (`eslint-config-expo`) |
| `npm run typecheck` | TypeScript, no emit           |
| `npm test`          | Jest (`jest-expo` preset)     |

## Project layout

```
src/
  app/              # Expo Router screens (file-based routing)
    _layout.tsx     # Root stack navigator + providers
    (tabs)/         # Native tab bar (Liquid Glass on iOS, Material on Android): Home and My books
    add.tsx         # Add-book modal
    book/[id].tsx   # Book detail: update current page, finish, delete
    goal.tsx        # Yearly goal editor sheet
    welcome.tsx     # First-launch welcome screen
  components/
    add/            # Add-a-book sheet parts: Open Library search, manual entry
    home/           # Home screen cards: empty state, goal and streak summaries, goal editor
    ui/             # Design-system primitives: Text, Button, IconButton, Card, Chip, SegmentedControl,
                    # TextField, BookCover, ProgressBar, StreakDots
  lib/              # Pure logic (book model, goals, dates) and the Open Library client
  store/            # Providers persisted to AsyncStorage (books, goals, onboarding)
  theme/            # Design tokens: colors, typography (Archivo), spacing, radius, sizes
```

## Design system

All colors, fonts and sizes live in `src/theme/` — screens never hard-code them.

- **Colors:** use the semantic `colors` (`bg`, `surface`, `text`, `accent`, `selected`, …), not the raw `palette`. Two accents, two jobs: cinnamon (`accent`) for actions and book progress; Cool Steel (`selected`, `streak*`) for selection, time and streaks. Labels on cinnamon use `onAccent` and on steel `onSelected` — both Dark Coffee, for contrast.
- **Type:** render text with `<Text variant="bookTitle" color="textMuted">` from `@/components/ui`; variants match the type scale (`stat`, `screenTitle`, `sheetTitle`, `bookTitle`, `body`, `label`, `secondary`, `kicker`).
- **Controls:** use `<Button variant="primary | dark | outline | link">`. Cinnamon `primary` is for the one main action on a screen.
- **Icons:** [Lucide](https://lucide.dev), `sizes.icon` / `sizes.iconSmall` with `sizes.iconStroke`.

## Releasing

Use [EAS Build](https://docs.expo.dev/build/introduction/) to produce store builds without a local native toolchain:

```sh
npx eas-cli@latest build --platform all
```

The bundle identifier / package name is `com.yanakanavalik.bookshift` (set in `app.json`).
