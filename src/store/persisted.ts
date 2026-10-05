import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';

/** How a value is stored: `encode` returning null removes the key. Defaults to JSON. */
type Codec<T> = {
  decode: (raw: string) => T;
  encode: (value: T) => string | null;
};

const json: Codec<unknown> = { decode: (raw) => JSON.parse(raw), encode: (value) => JSON.stringify(value) };

/**
 * `useState` backed by AsyncStorage: loads once on mount, then saves every change.
 * `label` names the data in warnings, e.g. "books".
 */
export function usePersistedState<T>(
  key: string,
  initial: T,
  label: string,
  codec: Codec<T> = json as Codec<T>,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  const { decode, encode } = codec;

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (raw !== null) setValue(decode(raw));
      })
      .catch((error) => console.warn(`Failed to load ${label}`, error))
      .finally(() => setLoaded(true));
    // Load once; the codec is expected to be stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    // Don't overwrite stored data with the empty initial state before it has loaded.
    if (!loaded) return;
    const raw = encode(value);
    (raw === null ? AsyncStorage.removeItem(key) : AsyncStorage.setItem(key, raw)).catch((error) =>
      console.warn(`Failed to save ${label}`, error),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value, loaded]);

  return [value, setValue, loaded];
}

/** A context plus a hook that throws when used outside its provider. */
export function createStoreContext<T>(name: string) {
  const Context = createContext<T | null>(null);
  function useStore(): T {
    const context = useContext(Context);
    if (!context) throw new Error(`use${name} must be used inside <${name}Provider>`);
    return context;
  }
  return [Context.Provider, useStore] as const;
}
