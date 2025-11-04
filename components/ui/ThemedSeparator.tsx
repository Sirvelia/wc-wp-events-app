import { useThemeColor } from "@/hooks/useThemeColor";
import { View } from "react-native";

export function ThemedSeparator() {
  const borderColor = useThemeColor({}, 'border');
  return <View style={{ height: 1, backgroundColor: borderColor, marginVertical: 20 }} />;
}