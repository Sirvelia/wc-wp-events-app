import EventSelectionItem from '@/components/EventSelectionItem';
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedCard } from "@/components/ui/ThemedCard";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { getEventsQueryOptions } from '@/query-options';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import "@/i18n";
import { useTranslation } from 'react-i18next';
export default function EventSelectionScreen() {
    const [searchTerm, setSearchTerm] = useState('');

    const { t, i18n } = useTranslation();

    const { data, isPending, error, refetch } = useQuery(getEventsQueryOptions());

    const filteredEvents = useMemo(() => {
        if (!data) return [];
        if (!searchTerm.trim()) return data;

        return data.filter((event) =>
            event.title.rendered.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    if (isPending) {
        return (
            <ThemedView style={{ flex: 1 }}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={{ flex: 1 }}>
                <ThemedText>Error loading events: {error.message}</ThemedText>
            </ThemedView>
        );
    }

    if (!data || data.length === 0) {
        return (
            <ThemedView style={{ flex: 1 }}>
                <ThemedText>No events available</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <ThemedText type="subtitle" style={{ marginBottom: 20 }}>{t('event-selection.description')}</ThemedText>
            
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('event-selection.search-placeholder')}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeholderTextColor="#666"
                />
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            </View>

            {filteredEvents.length === 0 ? (
                <ThemedText style={styles.noResultsText}>
                    {searchTerm ? t('event-selection.no-results-found') : t('event-selection.no-results-available')}
                </ThemedText>
            ) : (
                filteredEvents.map((event) => (
                    <EventSelectionItem key={event.id} event={event} />
                ))
            )}

            <Pressable 
                style={styles.refreshButton}
                onPress={() => refetch()}
            >
                <ThemedCard>
                    <View style={styles.refreshButtonContent}>
                        <Ionicons name="refresh" size={24} color="#007AFF" />
                        <ThemedText>{t('event-selection.refresh-events')}</ThemedText>
                    </View>
                </ThemedCard>
            </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
    },
    contentContainer: {
        padding: 10,
    },
    searchContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 40,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        top: 12,
    },
    noResultsText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        fontStyle: 'italic',
    },
    refreshButton: {
        marginTop: 20,
    },
    refreshButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 10,
    },
});