import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { StyleSheet, useWindowDimensions } from "react-native";

/**
 * Props for the ErrorState component
 */
export interface ErrorStateProps {
  /** The error message to display. If Error object provided, message will be extracted. */
  error?: Error | string;
  /** Optional custom message prefix. Defaults to "Error: " */
  message?: string;
}

/**
 * Shared error state component for displaying error messages
 *
 * @component
 * @example
 * ```tsx
 * if (error) {
 *   return <ErrorState error={error} message="Error loading data:" />;
 * }
 * ```
 */
export function ErrorState({ error, message = "Error: " }: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error;
  const { height } = useWindowDimensions();

  return (
    <ThemedView style={styles.container} contentContainerStyle={[styles.contentContainer, { minHeight: height - 20 }]}>
      <ThemedText style={styles.errorText}>
        {message}{errorMessage}
      </ThemedText>
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
  errorText: {
    textAlign: 'center',
    color: '#d32f2f',
  },
});
