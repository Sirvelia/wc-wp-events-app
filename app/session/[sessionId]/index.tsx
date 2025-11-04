import SessionAddMySchedule from "@/components/SessionAddMySchedule";
import ThemedRenderHTML from "@/components/ui/ThemedRenderHTML";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useSessions } from "@/hooks/useSessions";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTimeConverter } from "@/hooks/useTimeConverter";
import "@/i18n";
import { getEventByIdQueryOptions, getEventCategoriesQueryOptions, getEventDetailsQueryOptions, getEventTracksQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { getDayName, getDayNumber, getMonthName } from "@/utils/dateFormat";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { decode } from 'html-entities';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";

export function SessionHeaderTitle() {
  const { t, i18n } = useTranslation();
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{t('session.title')}</ThemedText>
    </View>
  );
}
export default function SessionScreen() {
  const { t, i18n } = useTranslation();
  const { sessionId } = useLocalSearchParams();
  const { sessions, isLoading, error } = useSessions();
  const { selectedEventID } = useSelectedEventStore();
  const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
  const { data: eventDetails } = useQuery(getEventDetailsQueryOptions(event?.URL || ''));
  const { getSpeakersBySession } = useSpeakers();
  const { convertTime } = useTimeConverter();
  const session = sessions?.find(s => s.id.toString() === sessionId);
  const sessionSpeakers = session ? getSpeakersBySession(session) : [];
  const { data: tracks } = useQuery(getEventTracksQueryOptions(event?.URL || ''));
  const { data: categories } = useQuery(getEventCategoriesQueryOptions(event?.URL || ''));

  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, padding: 10 }}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={{ flex: 1, padding: 10 }}>
        <ThemedText>{t('session.error-loading')} {error.message}</ThemedText>
      </ThemedView>
    );
  }

  if (!session) {
    return (
      <ThemedView style={{ flex: 1, padding: 10 }}>
        <ThemedText>{t('session.not-found')}</ThemedText>
      </ThemedView>
    );
  }

  const { dateTime: localDate, localTime } = convertTime(session.meta?._wcpt_session_time, eventDetails?.gmt_offset || 0);
  const formattedDate = localDate ? localDate.toFormat('yyyy-MM-dd') : '';

  // Calculate end time by adding duration to local time
  const [hours, minutes] = localTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + Math.floor(session.meta?._wcpt_session_duration / 60);
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  const endLocalTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        <SessionAddMySchedule session={session} />
      </View>

      <ThemedText style={{ fontSize: 22, lineHeight: 28, fontWeight: 'bold', marginBottom: 16 }}>{decode(session.title.rendered)}</ThemedText>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 5 }}>
        <ThemedText style={{ color: textColor, fontSize: 20 }}>{getDayName(formattedDate)}</ThemedText>
        <ThemedText style={{ color: textColor, fontSize: 20 }}>{getDayNumber(formattedDate)}</ThemedText>
        <ThemedText style={{ color: textColor, fontSize: 20 }}>{getMonthName(formattedDate)}</ThemedText>
      </View>

      <View style={styles.timeContainer}>
        <ThemedText style={[styles.time, { color: textColor }]}>{localTime}</ThemedText>
        <ThemedText style={{ color: textColor, fontSize: 14 }}>-</ThemedText>
        <ThemedText style={[styles.time, { color: textColor }]}>{endLocalTime}</ThemedText>
      </View>

      {session.session_track && session.session_track.length > 0 && (
        <View style={{ marginVertical: 10 }}>
          <ThemedText style={{ color: textColor, fontSize: 12, lineHeight: 12, textTransform: 'uppercase', marginBottom: 10 }}>{t('session.tracks')}</ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10}}>
            {session.session_track.map((track) => (
              <ThemedText key={track} style={{ color: textColor, fontSize: 14, borderWidth: 1, borderColor: textColor, paddingHorizontal: 5, borderRadius: 10 }}>
                {decode(tracks?.find((t) => t.id === track)?.name || '')}
              </ThemedText>
            ))}
          </View>
        </View>
      )}

      {session.session_category && session.session_category.length > 0 && (
        <View style={{ marginVertical: 10 }}>
          <ThemedText style={{ color: textColor, fontSize: 12, lineHeight: 12, textTransform: 'uppercase', marginBottom: 10 }}>{t('session.categories')}</ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            {session.session_category.map((category) => (
              <Pressable key={category} onPress={() => router.push(`/sessions/category/${category}`)}>
                <ThemedText key={category} style={{ color: textColor, fontSize: 14, borderWidth: 1, borderColor: textColor, paddingHorizontal: 5, borderRadius: 10 }}>{decode(categories?.find((c) => c.id === category)?.name || '')}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {sessionSpeakers && sessionSpeakers.map((speaker) => (
        <Pressable key={speaker.id} onPress={() => router.push(`/speaker/${speaker.id}`)}>
          <View key={speaker.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 }}>
            <Image source={{ uri: speaker.avatar_urls['96'] || undefined }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            <ThemedText style={{ color: textColor, fontSize: 18 }}>{decode(speaker.title.rendered)}</ThemedText>
          </View>
        </Pressable>
      ))}

      <ThemedRenderHTML html={session.excerpt.rendered} />
    </ThemedView>
  );
}

// Set the header title component
SessionScreen.navigationOptions = {
  headerTitle: () => <SessionHeaderTitle />,
};

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  time: {
    fontSize: 20,
  },
});