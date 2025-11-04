import { ActivityIndicator, Pressable } from "react-native";

import { useSessions } from "@/hooks/useSessions";
import { useThemeColor } from "@/hooks/useThemeColor";
import "@/i18n";
import { getEventByIdQueryOptions, getEventTracksQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Track } from "@/types/Session";
import { getDayName, getDayNumber, getMonthName } from "@/utils/dateFormat";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from "react-native";
import SessionCard from "./SessionCard";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

import { Trans } from 'react-i18next';

export function SessionProgram() {
    const { t, i18n } = useTranslation();
    const { sessions, isLoading, error, uniqueDates, getSessionsByDate } = useSessions();
    const {selectedEventID} = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');

    const { data: tracks } = useQuery(getEventTracksQueryOptions(event?.URL || ''));

    const filteredSessions = selectedDate 
        ? getSessionsByDate(selectedDate)
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
        if (uniqueDates.length > 0 && !selectedDate) {
            setSelectedDate(uniqueDates[0]);
        }
    }, [uniqueDates]);

    return (
        <ThemedView>
            {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
            {error && <ThemedText>Error: {error.message}</ThemedText>}

            {uniqueDates.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
                >
                    {uniqueDates.map((date: string, index: number) => (
                        <Pressable 
                            key={date} 
                            style={[
                                styles.dayFilterButton,
                                selectedDate === date && { backgroundColor: primaryColor},
                                { borderColor: selectedDate === date ? primaryColor : borderColor}
                            ]} 
                            onPress={() => setSelectedDate(date)}
                        >
                            <ThemedText style={{ fontSize: 16, lineHeight: 16, color: selectedDate === date ? 'white' : textColor }}><Trans i18nKey="program.day" values={{ number: index + 1 }} /></ThemedText>
                            <ThemedText style={{ fontSize: 14, lineHeight: 14, textTransform: 'uppercase', color: selectedDate === date ? 'white' : textColor }}>{getDayName(date)}</ThemedText>
                            <ThemedText style={{ fontSize: 12, lineHeight: 12, textTransform: 'uppercase', color: selectedDate === date ? 'white' : textColor }}>{getDayNumber(date)} {getMonthName(date)}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            {(availableTracks && availableTracks.length > 0) && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
                >
                    {availableTracks.map((track) => (
                        <Pressable 
                            key={track.slug} 
                            style={[
                                styles.filterButton,
                                selectedTrack?.slug === track.slug && { backgroundColor: primaryColor},
                                { borderColor: selectedTrack?.slug === track.slug ? primaryColor : borderColor }
                            ]} 
                            onPress={() => setSelectedTrack(track)}
                        >
                            <ThemedText style={{ fontSize: 14, color: selectedTrack?.slug === track.slug ? 'white' : textColor }}>{track.name}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            {availableTracks && availableTracks.length === 0 && filteredSessions?.map((session) => (
                <SessionCard key={session.id} session={session} />
            ))}

            {availableTracks && availableTracks.length > 0 && selectedTrack && filteredSessions
                ?.filter((session) => session.session_track.some((t) => t === selectedTrack.id))
                .map((session) => (
                    <SessionCard key={session.id} session={session} />
                ))}

            {selectedTrack === null && filteredSessions?.filter((session) => session.session_track.length === 0).length === 0 && 
                <ThemedText>{t('program.no-untracked-sessions')}</ThemedText>}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
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
    filterButton: {
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
        color: 'white',
    }
});