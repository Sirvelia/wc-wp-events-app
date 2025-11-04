import SessionCard from "@/components/SessionCard";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useSessions } from "@/hooks/useSessions";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTimeConverter } from "@/hooks/useTimeConverter";
import "@/i18n";
import { getEventByIdQueryOptions, getEventDetailsQueryOptions, getEventTracksQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Track } from "@/types/Session";
import { getDayName, getDayNumber, getMonthName } from "@/utils/dateFormat";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export function CategoryHeaderTitle() {
    const { t, i18n } = useTranslation();
    return (
        <View style={{ alignItems: 'flex-start' }}>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{t('category.title')}</ThemedText>
        </View>
    );
}

export default function CategoryScreen() {
    const { categoryId } = useLocalSearchParams();
    const { getSessionsByCategory, uniqueDates, getSessionsByDate } = useSessions();
    const { convertTime } = useTimeConverter();
    const sessions = getSessionsByCategory(Number(categoryId));

    const { selectedEventID } = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const { data: eventDetails } = useQuery(getEventDetailsQueryOptions(event?.URL || ''));
    const { data: tracks } = useQuery(getEventTracksQueryOptions(event?.URL || ''));

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');

    const filteredSessions = selectedDate
        ? sessions.filter((session) => {
            // Convert UTC timestamp to local time using event's GMT offset
            const {dateTime: localDate} = convertTime(session?.meta?._wcpt_session_time, eventDetails?.gmt_offset || 0);
            const formattedDate = localDate.toFormat('yyyy-MM-dd'); // YYYY-MM-DD format
            return formattedDate === selectedDate;
        })
        : sessions;

    // Get tracks that have sessions on the selected date
    const availableTracks = selectedDate
        ? tracks?.filter((track) =>
            filteredSessions?.some(session =>
                session.session_track.some(t => t === track.id)
            ) ?? false
        )
        : tracks;
        
    // Reset track only when event changes
    useEffect(() => {
        setSelectedTrack(null)
        setSelectedDate(null)
    }, [event]);

    useEffect(() => {
        if (availableTracks && availableTracks.length > 0 && !selectedTrack) {
            setSelectedTrack(availableTracks[0]);
        }
    }, [tracks]);

    useEffect(() => {
        if (availableTracks && availableTracks.length > 0) {
            setSelectedTrack(availableTracks[0]);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (uniqueDates && uniqueDates.length > 0 && !selectedDate) {
            setSelectedDate(uniqueDates[0]);
        }
    }, [uniqueDates]);

    const { t, i18n } = useTranslation();

    return (
        <ThemedView style={{ flex: 1, padding: 10 }}>

            {uniqueDates.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateScrollContent}
                >
                    {uniqueDates.map((date: string, index: number) => (
                        <Pressable
                            key={date}
                            style={[
                                styles.dayFilterButton,
                                selectedDate === date && { backgroundColor: primaryColor },
                                { borderColor: selectedDate === date ? primaryColor : borderColor }
                            ]}
                            onPress={() => setSelectedDate(date)}
                        >
                            <ThemedText style={[styles.dayNumber, { color: selectedDate === date ? 'white' : textColor }]}>{t('program.day', { number: index + 1 })}</ThemedText>
                            <ThemedText style={[styles.dayName, { color: selectedDate === date ? 'white' : textColor }]}>{getDayName(date)}</ThemedText>
                            <ThemedText style={[styles.dayDate, { color: selectedDate === date ? 'white' : textColor }]}>{getDayNumber(date)} {getMonthName(date)}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            {(availableTracks && availableTracks.length > 0) && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.trackScrollContent}
                >
                    {availableTracks.map((track) => (
                        <Pressable
                            key={track.slug}
                            style={[
                                styles.filterButton,
                                selectedTrack?.slug === track.slug && { backgroundColor: primaryColor },
                                { borderColor: selectedTrack?.slug === track.slug ? primaryColor : borderColor }
                            ]}
                            onPress={() => setSelectedTrack(track)}
                        >
                            <ThemedText style={[styles.trackName, { color: selectedTrack?.slug === track.slug ? 'white' : textColor }]}>{track.name}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            {availableTracks && availableTracks.length === 0 && filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
            ))}

            {availableTracks && availableTracks.length > 0 && selectedTrack && filteredSessions
                .filter((session) => session.session_track.some((t) => t === selectedTrack.id))
                .map((session) => (
                    <SessionCard key={session.id} session={session} />
                ))}

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    dateScrollContent: {
        gap: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    trackScrollContent: {
        gap: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    emptyStateContent: {
        padding: 20,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptyStateDescription: {
        fontSize: 16,
        opacity: 0.8,
    },
    noSessions: {
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic',
        marginTop: 20,
    },
    dayFilterButton: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 5,
    },
    dayNumber: {
        fontSize: 16,
        lineHeight: 16,
    },
    dayName: {
        fontSize: 14,
        lineHeight: 14,
        textTransform: 'uppercase',
    },
    dayDate: {
        fontSize: 12,
        lineHeight: 12,
        textTransform: 'uppercase',
    },
    trackName: {
        fontSize: 14,
    },
    filterButton: {
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
        color: 'white',
    }
});