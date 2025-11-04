import { SessionProgram } from "@/components/SessionProgram";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import "@/i18n";
import { useTranslation } from 'react-i18next';

export default function ProgramScreen() {
  const { t, i18n } = useTranslation();

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10, lineHeight: 32 }}>{t('program.title')}</ThemedText>
      <SessionProgram />
    </ThemedView>
  );
}