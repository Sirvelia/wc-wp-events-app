import { useEffect, useMemo, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Custom hook to get the current color scheme (light or dark) for web platforms
 *
 * To support static rendering, this value needs to be re-calculated on the client
 * side for web. Returns 'light' by default during SSR, then switches to the actual
 * color scheme after hydration.
 *
 * @returns {ColorSchemeName} The current color scheme ('light' or 'dark')
 *
 * @example
 * const colorScheme = useColorScheme();
 * const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const colorScheme = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return useMemo(() => {
    return hasHydrated ? colorScheme : 'light';
  }, [hasHydrated, colorScheme]);
}
