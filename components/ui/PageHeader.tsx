import { ThemedText } from "@/components/ui/ThemedText";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

/**
 * Props for the PageHeader component
 */
export interface PageHeaderProps {
  /** Translation key for the header title */
  translationKey: string;
  /** Optional direct title text (if not using translation) */
  title?: string;
}

/**
 * Shared page header component for navigation headers
 * Used in detail screens to show a consistent header title
 *
 * @component
 * @example
 * ```tsx
 * export function SpeakerHeaderTitle() {
 *   return <PageHeader translationKey="speaker.title" />;
 * }
 * ```
 */
export function PageHeader({ translationKey, title }: PageHeaderProps) {
  const { t } = useTranslation();
  const displayTitle = title || t(translationKey);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{displayTitle}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
