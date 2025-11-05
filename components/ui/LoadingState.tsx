import { ThemedView } from "@/components/ui/ThemedView";
import { ActivityIndicator, StyleSheet, useWindowDimensions } from "react-native";

/**
 * Shared loading state component with a centered activity indicator
 *
 * @component
 * @example
 * ```tsx
 * if (isPending) {
 *   return <LoadingState />;
 * }
 * ```
 */
export function LoadingState() {
  const { height } = useWindowDimensions();

  return (
    <ThemedView style={styles.container} contentContainerStyle={[styles.contentContainer, { minHeight: height - 20 }]}>
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
