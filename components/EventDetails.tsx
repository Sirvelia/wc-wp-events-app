import { useTimeConverter } from "@/hooks/useTimeConverter";
import "@/i18n";
import { getEventByIdQueryOptions, getEventDetailsQueryOptions, getSingleMediaQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { useQuery } from "@tanstack/react-query";
import { useAssets } from "expo-asset";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { ThemedCard } from "./ui/ThemedCard";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";


export function EventDetails() {

    const { t, i18n } = useTranslation();

    const { selectedEventID } = useSelectedEventStore();
    const { data: event, isLoading: isEventLoading } = useQuery(getEventByIdQueryOptions(selectedEventID as number));

    const [assets] = useAssets([require('@/assets/images/icon.png')]);

    const { convertTime } = useTimeConverter();
    const { data: eventDetails, isLoading: isEventDetailsLoading } = useQuery(getEventDetailsQueryOptions(event?.URL || ''));

    const { data: media, isLoading: isMediaLoading } = useQuery(getSingleMediaQueryOptions(event?.featured_media || 0));

    const isLoading = isEventLoading || isEventDetailsLoading || isMediaLoading;

    const startDate = convertTime(Number(event?.['Start Date (YYYY-mm-dd)'] || ''), eventDetails?.gmt_offset || 0);
    const endDate = convertTime(Number(event?.['End Date (YYYY-mm-dd)'] || ''), eventDetails?.gmt_offset || 0);

    if (isLoading) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, lineHeight: 20 }}>{t('event-details.title')}</ThemedText>
                <ThemedCard>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" />
                        <ThemedText style={styles.loadingText}>{t('event-details.loading')}</ThemedText>
                    </View>
                </ThemedCard>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, lineHeight: 20 }}>{t('event-details.title')}</ThemedText>
            
            <ThemedCard>
                <View style={styles.eventContent}>
                    <View style={styles.eventImageContainer}>
                        <Image source={media?.media_details.sizes.medium?.source_url ? { uri: media?.media_details.sizes.medium?.source_url } : assets?.[0] as ImageSourcePropType} style={styles.eventImage} alt={event?.title.rendered || ''} />
                    </View>
                    <View>
                        <ThemedText style={{ fontSize: 18, fontWeight: "bold", lineHeight: 18 }}>{event?.title.rendered}</ThemedText>
                        <ThemedText>{event?._venue_country_name}</ThemedText>
                        <View style={styles.dateContainer}>
                            <ThemedText>{startDate.dateTime.toFormat(t('date-format.date'), { locale: i18n.language })}</ThemedText>
                            {event?.['End Date (YYYY-mm-dd)'] && event?.['End Date (YYYY-mm-dd)'] !== '' && event?.['End Date (YYYY-mm-dd)'] !== event?.['Start Date (YYYY-mm-dd)'] && (
                                <>
                                    <ThemedText> - </ThemedText>
                                    <ThemedText>{endDate.dateTime.toFormat(t('date-format.date'), { locale: i18n.language })}</ThemedText>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </ThemedCard>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 10,
    },
    loadingText: {
        fontSize: 16,
        opacity: 0.7,
    },
    eventContent: {
        flexDirection: 'row',
        gap: 16,
    },
    eventImageContainer: {
        width: 50,
        height: 50,
    },
    eventImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});