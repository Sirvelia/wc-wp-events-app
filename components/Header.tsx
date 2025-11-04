import { getEventByIdQueryOptions, getSingleMediaQueryOptions } from '@/query-options';
import { useSelectedEventStore } from '@/stores/selectedEventStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAssets } from 'expo-asset';
import { usePathname, useRouter } from 'expo-router';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ui/ThemedText';

import "@/i18n";
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { t, i18n } = useTranslation();

    const insets = useSafeAreaInsets();
    const { selectedEventID } = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));

    const router = useRouter();
    const pathname = usePathname();
    const [assets] = useAssets([require('@/assets/images/icon.png')]);

    const { data: media } = useQuery(getSingleMediaQueryOptions(event?.featured_media || 0));

    const getHeaderIcon = () => {
        if (pathname === '/event-selection' || !event || !media) {
            return assets?.[0] as ImageSourcePropType;
        }
        return { uri: media?.media_details.sizes.medium?.source_url };
    };

    const getHeaderText = () => {

        if (pathname === '/event-selection' || !event) {
            return 'WC & WP Events';
        }
        return event.title.rendered;
    };

    return (
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <Image 
                source={getHeaderIcon()}
                style={styles.eventIcon}
            />
            <View style={styles.titleContainer}>
                <ThemedText style={styles.title}>{getHeaderText()}</ThemedText>
                
                <Pressable 
                    style={styles.eventContainer}
                    onPress={() => router.push('/event-selection')}
                >
                    <ThemedText>{t('header.title')}</ThemedText>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#687076" />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    eventIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
});