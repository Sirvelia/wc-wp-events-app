/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Custom hook to get theme-aware colors
 *
 * Returns the appropriate color value based on the current color scheme (light or dark).
 * Allows for custom color overrides via props, falling back to predefined theme colors.
 *
 * @param {Object} props - Custom color overrides
 * @param {string} [props.light] - Custom color to use in light mode
 * @param {string} [props.dark] - Custom color to use in dark mode
 * @param {string} colorName - Name of the color from the Colors constant
 * @returns {string} The color value appropriate for the current theme
 *
 * @example
 * // Use predefined theme color
 * const backgroundColor = useThemeColor({}, 'background');
 *
 * @example
 * // Override with custom colors
 * const textColor = useThemeColor(
 *   { light: '#000000', dark: '#FFFFFF' },
 *   'text'
 * );
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
