import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useWindowDimensions, View } from "react-native";

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
  /** The title to display */
  title: string;
  /** Optional description text */
  message?: string;
  /** Optional icon name from Ionicons */
  icon?: keyof typeof Ionicons.glyphMap;
}

/**
 * Shared empty state component for displaying "not found" or "no data" messages
 *
 * @component
 * @example
 * ```tsx
 * if (!data || data.length === 0) {
 *   return <EmptyState title="No events available" icon="calendar-outline" />;
 * }
 * ```
 */
export function EmptyState({ title, message, icon }: EmptyStateProps) {
  const { height } = useWindowDimensions();

  return (
    <ThemedView style={styles.container} contentContainerStyle={[styles.contentContainer, { minHeight: height - 20 }]}>
      <View style={styles.content}>
        {icon && (
          <Ionicons name={icon} size={48} color="#999" style={styles.icon} />
        )}
        <ThemedText style={styles.title}>{title}</ThemedText>
        {message && <ThemedText style={styles.message}>{message}</ThemedText>}
      </View>
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
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});
