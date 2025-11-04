import { useMySchedule } from "@/contexts/MyScheduleContext";
import { useSessions } from "@/hooks/useSessions";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getEventByIdQueryOptions, getEventDetailsQueryOptions, getEventTracksQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Session, Track } from "@/types/Session";
import { getDayName, getDayNumber, getMonthName } from "@/utils/dateFormat";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from "react-native";
import SessionCard from "./SessionCard";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

import { useTimeConverter } from "@/hooks/useTimeConverter";
import "@/i18n";
import { useTranslation } from 'react-i18next';
// Move filtering logic outside component

export function MySchedule() {
    const { t, i18n } = useTranslation();
    const { sessions, isLoading, error } = useSessions();
    const { isSessionSelected } = useMySchedule();
    const { selectedEventID } = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const { data: tracks } = useQuery(getEventTracksQueryOptions(event?.URL || ''));
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const { convertTime } = useTimeConverter();
    const { data: eventDetails } = useQuery(getEventDetailsQueryOptions(event?.URL || ''));
    
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');

    // Memoize selected sessions
    const selectedSessions = useMemo(() => 
        sessions?.filter((session: Session) => isSessionSelected(session.id)) || [],
        [sessions, isSessionSelected]
    );

    // Memoize unique dates from selected sessions
    const uniqueDates = useMemo(() => {
        if (!selectedSessions || !event) return [];

        return selectedSessions.reduce((dates: string[], session) => {
            // Convert UTC timestamp to local time using event's GMT offset
            const { dateTime: localDate } = convertTime(session?.meta?._wcpt_session_time, eventDetails?.gmt_offset || 0);
            const formattedDate = localDate.toFormat('yyyy-MM-dd') // Returns YYYY-MM-DD format
            if (!dates.includes(formattedDate)) {
                dates.push(formattedDate);
            }
            return dates;
        }, []);
    }, [selectedSessions, event, convertTime]);

    const filterSessionsByDate = (sessions: Session[], date: string) => {
        return sessions.filter(session => {
    
            const { dateTime: localDate } = convertTime(session?.meta?._wcpt_session_time, eventDetails?.gmt_offset || 0);
            const formattedDate = localDate.toFormat('yyyy-MM-dd'); // YYYY-MM-DD format
            return formattedDate === selectedDate;
        });
    };
    
    // Memoize filtered sessions and available tracks
    const filteredSessionsForDate = useMemo(() => {
        if (!selectedDate) return [];
        return filterSessionsByDate(selectedSessions, selectedDate);
    }, [selectedSessions, selectedDate]);

    const availableTracks = useMemo(() => {
        if (!selectedDate) return tracks;
        return tracks?.filter((track: Track) =>
            filteredSessionsForDate.some(session =>
                session.session_track.some(t => t === track.id)
            )
        );
    }, [tracks, filteredSessionsForDate, selectedDate]);

    // Reset filters when event changes
    useEffect(() => {
        setSelectedTrack(null);
        setSelectedDate(null);
    }, [event]);

    // Set initial date if not selected
    useEffect(() => {
        if (uniqueDates.length > 0 && !selectedDate) {
            setSelectedDate(uniqueDates[0]);
        }
    }, [uniqueDates]);

    useEffect(() => {
        if (availableTracks && availableTracks.length > 0) {
            setSelectedTrack(availableTracks[0]);
        }
    }, [selectedDate]);

    // Set initial track if not selected
    useEffect(() => {
        if (availableTracks && availableTracks.length > 0 && !selectedTrack) {
            setSelectedTrack(availableTracks[0]);
        }
    }, [tracks, availableTracks]);

    if (!sessions || selectedSessions && selectedSessions.length === 0) {
        return (
            <ThemedView 
                style={styles.container}
                contentContainerStyle={styles.emptyStateContent}
            >
                <ThemedText style={styles.emptyStateTitle}>
                    {t('my-schedule.no-sessions-selected')}
                </ThemedText>
                <ThemedText style={styles.emptyStateDescription}>
                    {!sessions 
                        ? t('my-schedule.browse-sessions')
                        : t('my-schedule.start-building-schedule')
                    }
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ marginBottom: 20 }}>
            {isLoading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}
            {error && <ThemedText>Error: {error.message}</ThemedText>}

            {selectedSessions && selectedSessions.length > 0 && (
                <ThemedText>{selectedSessions.length} sessions selected</ThemedText>
            )}

            {uniqueDates && uniqueDates.length > 0 && (
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
                            <ThemedText style={[styles.dayNumber, { color: selectedDate === date ? 'white' : textColor }]}>Day {index + 1}</ThemedText>
                            <ThemedText style={[styles.dayName, { color: selectedDate === date ? 'white' : textColor }]}>{getDayName(date)}</ThemedText>
                            <ThemedText style={[styles.dayDate, { color: selectedDate === date ? 'white' : textColor }]}>{getDayNumber(date)} {getMonthName(date)}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            {availableTracks && availableTracks.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.trackScrollContent}
                >
                    {availableTracks.map((track: Track) => (
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

            {filteredSessionsForDate.length === 0 && (
                <ThemedText>No sessions available</ThemedText>
            )}

            {selectedTrack 
                ? filteredSessionsForDate
                    .filter((session) => session.session_track.some((t) => t === selectedTrack.id))
                    .map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))
                : filteredSessionsForDate.map((session) => (
                    <SessionCard key={session.id} session={session} />
                ))
            }
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
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