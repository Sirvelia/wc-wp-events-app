/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#0066FF', // Vivid blue for light theme
    // Event status colors
    statusUpcoming: '#4CAF50',
    statusOngoing: '#2196F3',
    statusCompleted: '#9E9E9E',
    statusCancelled: '#F44336',
    // UI element colors
    cardBackground: '#F5F5F5',
    border: '#CCCCCC',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#3D8DFF', // Slightly lighter vivid blue for dark theme
    // Event status colors
    statusUpcoming: '#66BB6A',
    statusOngoing: '#42A5F5',
    statusCompleted: '#BDBDBD',
    statusCancelled: '#EF5350',
    // UI element colors
    cardBackground: '#1E1E1E',
    border: '#404040',
    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FFCA28',
    info: '#42A5F5',
  },
};
