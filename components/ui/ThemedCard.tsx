import { ThemedView } from "@/components/ui/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, ViewStyle } from "react-native";

interface ThemedCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function ThemedCard({ children, style }: ThemedCardProps) {
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'cardBackground');

  return (
    <ThemedView style={[styles.container, { borderColor, backgroundColor }, style]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
  },
});
