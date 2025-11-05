import { ThemedView } from "@/components/ui/ThemedView";
import { ActivityIndicator, StyleSheet } from "react-native";

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
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
