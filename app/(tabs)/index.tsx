import { CurrentSessions } from "@/components/CurrentSessions";
import { EventDetails } from "@/components/EventDetails";
import { MySchedule } from "@/components/MySchedule";
import { ThemedSeparator } from "@/components/ui/ThemedSeparator";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import "@/i18n";
import { useTranslation } from 'react-i18next';

export default function Index() {  
  const { t, i18n } = useTranslation();

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <EventDetails />

      <ThemedSeparator />

      <ThemedText style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, lineHeight: 20 }}>{t('my-schedule.title')}</ThemedText>

      <MySchedule />

      <ThemedSeparator />

      <ThemedText style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, lineHeight: 20 }}>{t('current-sessions.title')}</ThemedText>
      
      <CurrentSessions />

    </ThemedView>
  );
}

