import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, sizes } from '@/theme';

import { Text } from './Text';

export type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
  /** Optional count shown after the label, e.g. "Reading 2". */
  count?: number;
};

export type SegmentedControlProps<T extends string> = {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** `sm` uses smaller labels, for four or more segments. */
  size?: 'md' | 'sm';
  /** `inset` uses the ground color for the track, for controls placed on a peach card. */
  tone?: 'default' | 'inset';
};

/** Peach track; the selected segment is a Cool Steel fill with Dark Coffee text. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  tone = 'default',
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.track, tone === 'inset' && styles.inset]} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        const hasCount = option.count !== undefined;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={hasCount ? `${option.label}, ${option.count}` : option.label}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.selected]}
          >
            <Text
              variant={size === 'sm' ? 'secondaryStrong' : 'label'}
              color={selected ? 'onSelected' : 'text'}
              numberOfLines={1}
            >
              {option.label}
              {hasCount ? (
                <Text variant={size === 'sm' ? 'secondary' : 'body'} color={selected ? 'onSelected' : 'textMuted'}>
                  {` ${option.count}`}
                </Text>
              ) : null}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const TRACK_PADDING = 4;

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: TRACK_PADDING,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  inset: {
    backgroundColor: colors.bg,
  },
  segment: {
    flex: 1,
    minHeight: sizes.minTouch - TRACK_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: TRACK_PADDING,
    borderRadius: radius.pill,
  },
  selected: {
    backgroundColor: colors.selected,
  },
});
