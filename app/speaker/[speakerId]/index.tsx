import SessionCard from "@/components/SessionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import ThemedRenderHTML from "@/components/ui/ThemedRenderHTML";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useSessions } from "@/hooks/useSessions";
import "@/i18n";
import { getEventByIdQueryOptions, getEventSpeakerByIdQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { decode } from 'html-entities';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from "react-native";

export function SpeakerHeaderTitle() {
  return <PageHeader translationKey="speaker.title" />;
}

export default function SpeakerScreen() {
  const { speakerId } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const { selectedEventID } = useSelectedEventStore();
  const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
  const { data: speaker, isPending, error } = useQuery(getEventSpeakerByIdQueryOptions(event?.URL || '', Number(speakerId)));

  const { getSessionsBySpeaker } = useSessions();
  const sessions = getSessionsBySpeaker(Number(speakerId));

  if (isPending) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} message={t('speaker.error-loading')} />;
  }

  if (!speaker) {
    return <EmptyState title={t('speaker.not-found')} icon="person-outline" />;
  }

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: speaker?.avatar_urls['96'] || undefined }} 
          style={styles.avatar} 
        />
        <ThemedText style={styles.name}>{decode(speaker.title.rendered)}</ThemedText>
      </View>

      {speaker.content.rendered && (
        <View style={styles.bioContainer}>
          <ThemedText style={styles.bioTitle}>{t('speaker.about')}</ThemedText>
          <ThemedRenderHTML html={speaker.content.rendered} />
        </View>
      )}

      {sessions && sessions.length > 0 && (
        <View style={styles.sessionsContainer}>
          <ThemedText style={styles.sessionsTitle}>{t('speaker.sessions-title')}</ThemedText>
          {sessions.map((session) => (
            <SessionCard session={session} key={session.id} showTracks={true} showDate={true} />
          ))}
        </View>
      )}

    </ThemedView>
  );
}

// Set the header title component
SpeakerScreen.navigationOptions = {
  headerTitle: () => <SpeakerHeaderTitle />,
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bioContainer: {
    marginBottom: 24,
  },
  bioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sessionsContainer: {
    marginBottom: 24,
  },
  sessionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
