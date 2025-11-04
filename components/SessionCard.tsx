import SessionAddMySchedule from "@/components/SessionAddMySchedule";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { ThemedText } from "@/components/ui/ThemedText";
import { useSessions } from "@/hooks/useSessions";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTimeConverter } from "@/hooks/useTimeConverter";
import { getEventByIdQueryOptions, getEventCategoriesQueryOptions, getEventDetailsQueryOptions, getEventTracksQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Session } from "@/types/Session";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { decode } from 'html-entities';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from "react-native";

interface SessionCardProps {
  session: Session;
  showDate?: boolean;
  showTracks?: boolean;
}

const CardContent = ({ 
  session, 
  showDate, 
  showTracks, 
  textColor, 
  formattedDate, 
  localTime, 
  endLocalTime, 
}: { 
  session: Session;
  showDate?: boolean;
  showTracks?: boolean;
  textColor: string;
  formattedDate: string;
  localTime: string;
  endLocalTime: string;
}) => {
  const { getSpeakersBySession } = useSpeakers();
  const sessionSpeakers = getSpeakersBySession(session);
  const { selectedEventID } = useSelectedEventStore();
  const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
  const { data: tracks } = useQuery(getEventTracksQueryOptions(event?.URL || ''));
  const { data: categories } = useQuery(getEventCategoriesQueryOptions(event?.URL || ''));

  return (
    <>
      <View style={styles.headerContainer}>
        <View>
          {showDate && (
            <ThemedText style={[styles.date, { color: textColor }]}>{formattedDate}</ThemedText>
          )}

          <View style={styles.timeContainer}>
            <ThemedText style={[styles.time, { color: textColor }]}>{localTime}</ThemedText>
            <ThemedText style={{ color: textColor, fontSize: 14 }}>-</ThemedText>
            <ThemedText style={[styles.time, { color: textColor }]}>{endLocalTime}</ThemedText>
          </View>
        </View>

        {session?.meta?._wcpt_session_type !== 'custom' && (
          <SessionAddMySchedule session={session} />
        )}
      </View>

      <ThemedText style={[
        styles.title, 
        { 
          color: textColor,
          fontSize: session?.meta?._wcpt_session_type === 'session' ? 18 : styles.title.fontSize
        }
      ]}>{decode(session.title.rendered)}</ThemedText>

      {showTracks && session.session_track && session.session_track.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginVertical: 10 }}>
          {session.session_track.map((track) => (
            <ThemedText key={track} style={{ color: textColor, fontSize: 14, borderWidth: 1, borderColor: textColor, paddingHorizontal: 5, borderRadius: 10 }}>{decode(tracks?.find((t) => t.id === track)?.name || '')}</ThemedText>
          ))}
        </View>
      )}

      {sessionSpeakers && sessionSpeakers.map((speaker) => (
        <Pressable key={speaker.id} onPress={() => router.push(`/speaker/${speaker.id}`)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 }}>
            <Image source={{ uri: speaker.avatar_urls['96'] || undefined }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            <ThemedText style={{ color: textColor, fontSize: 18 }}>{decode(speaker.title.rendered)}</ThemedText>
          </View>
        </Pressable>
      ))}

      {session.session_category && session.session_category.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginVertical: 10 }}>
          {session.session_category.map((category) => (
            <Pressable key={category} onPress={() => router.push(`/sessions/category/${category}`)}>
              <ThemedText key={category} style={{ color: textColor, fontSize: 14, borderWidth: 1, borderColor: textColor, paddingHorizontal: 5, borderRadius: 10 }}>{decode(categories?.find((c) => c.id === category)?.name || '')}</ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </>
  );
};

export default function SessionCard({ session, showDate = false, showTracks = false }: SessionCardProps) {
    const { convertTime } = useTimeConverter();
    const {selectedEventID} = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const { formatDate } = useSessions();
    const { data: eventDetails } = useQuery(getEventDetailsQueryOptions(event?.URL || ''));

    const { localTime } = event 
      ? convertTime(session.meta?._wcpt_session_time, eventDetails?.gmt_offset || 0)
        : { localTime: session.session_date_time.time };

    const { dateTime } = convertTime(session.meta?._wcpt_session_time, eventDetails?.gmt_offset || 0);

    // Calculate end time by adding duration to local time
    const [hours, minutes] = localTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + Math.floor(session.meta?._wcpt_session_duration / 60);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const endLocalTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    const textColor = useThemeColor({}, 'text');

    // Format the date if showDate is true
    const formattedDate = formatDate(dateTime.toJSDate());

    const cardContent = (
      <CardContent
        session={session}
        showDate={showDate}
        showTracks={showTracks}
        textColor={textColor}
        formattedDate={formattedDate}
        localTime={localTime}
        endLocalTime={endLocalTime}
      />
    );

    return (
      <ThemedCard key={session.id} style={{ borderColor: session?.meta?._wcpt_session_type === 'session' ? useThemeColor({}, 'border') : 'transparent' }}>
          {session?.meta?._wcpt_session_type === 'session' ? (
              <Pressable onPress={() => router.push(`/session/${session.id}`)}>
                  {cardContent}
              </Pressable>
          ) : (
              cardContent
          )}
      </ThemedCard>
    );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    marginRight: 8,
  },
  track: {
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
});