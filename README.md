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
    index.tsx       # Library: list of books with progress
    add.tsx         # Add-book modal
    book/[id].tsx   # Book detail: update current page, finish, delete
  components/       # Reusable UI (BookCard, ProgressBar)
  lib/              # Pure logic (book model, progress helpers) and theme
  store/            # BooksProvider: state persisted to AsyncStorage
```

## Releasing

Use [EAS Build](https://docs.expo.dev/build/introduction/) to produce store builds without a local native toolchain:

```sh
npx eas-cli@latest build --platform all
```

The bundle identifier / package name is `com.yanakanavalik.bookshift` (set in `app.json`).
