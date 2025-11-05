/**
 * Re-export of React Native's useColorScheme hook for native platforms
 *
 * Returns the current color scheme preference ('light', 'dark', or null).
 * This is the native implementation that directly uses the device's color scheme.
 *
 * @see useColorScheme.web.ts for the web-specific implementation with SSR support
 */
export { useColorScheme } from 'react-native';
