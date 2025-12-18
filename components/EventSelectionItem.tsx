
import { useTimeConverter } from "@/hooks/useTimeConverter";
import "@/i18n";
import { getEventDetailsQueryOptions, getSingleMediaQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { SelectedEvent } from "@/types/Event";
import { useQuery } from "@tanstack/react-query";
import { useAssets } from "expo-asset";
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";
import { ThemedCard } from "./ui/ThemedCard";
import { ThemedText } from "./ui/ThemedText";

export default function EventSelectionItem({event}: {event: SelectedEvent}) {

    const { t, i18n } = useTranslation();

    const [assets] = useAssets([require('@/assets/images/icon.png')]);

    const { setSelectedEventID } = useSelectedEventStore();

    const router = useRouter();
    
    const handleEventSelect = async (event: SelectedEvent) => {
        await setSelectedEventID(event.id);
        router.replace('/(tabs)');
    };

    const { convertTime } = useTimeConverter();
    const { data: eventDetails } = useQuery(getEventDetailsQueryOptions(event.URL));

    const { data: media } = useQuery(getSingleMediaQueryOptions(event.featured_media));

    const startDate = convertTime(Number(event['Start Date (YYYY-mm-dd)']), eventDetails?.gmt_offset || 0);
    const endDate = convertTime(Number(event['End Date (YYYY-mm-dd)']), eventDetails?.gmt_offset || 0);

    return (
        <Pressable
            key={event.id}
            onPress={() => handleEventSelect(event)}
        >
            <ThemedCard>
                <View style={styles.eventContent}>
                    <View style={styles.eventImageContainer}>
                        <Image source={media?.media_details.sizes.medium?.source_url ? { uri: media?.media_details.sizes.medium?.source_url } : assets?.[0] as ImageSourcePropType} style={styles.eventImage} alt={event.title.rendered} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <ThemedText>{event.title.rendered}</ThemedText>
                        <ThemedText>{event?._venue_country_name}</ThemedText>
                        <View style={styles.dateContainer}>
                            <ThemedText>{startDate.dateTime.toFormat(t('date-format.date'), { locale: i18n.language })}</ThemedText>
                            {event['End Date (YYYY-mm-dd)'] && event['End Date (YYYY-mm-dd)'] !== '' && event['End Date (YYYY-mm-dd)'] !== event['Start Date (YYYY-mm-dd)'] && (
                                <>
                                    <ThemedText> - </ThemedText>
                                    <ThemedText>{endDate.dateTime.toFormat(t('date-format.date'), { locale: i18n.language })}</ThemedText>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </ThemedCard>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    eventContent: {
        flexDirection: 'row',
        gap: 10,
    },
    eventImageContainer: {
        padding: 2,
    },
    eventImage: {
        width: 50,
        height: 50,
        backgroundColor: '#ccc',
        borderRadius: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        gap: 10,
    },
});