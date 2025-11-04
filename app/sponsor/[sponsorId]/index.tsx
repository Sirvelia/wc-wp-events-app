import ThemedRenderHTML from "@/components/ui/ThemedRenderHTML";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import "@/i18n";
import { getEventByIdQueryOptions, getEventSingleMediaQueryOptions, getEventSponsorByIdQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { decode } from 'html-entities';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

export function SponsorHeaderTitle() {
  const { t, i18n } = useTranslation();
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{t('sponsor.title')}</ThemedText>
    </View>
  );
}

export default function SponsorScreen() {
  const { t, i18n } = useTranslation();
  const { sponsorId } = useLocalSearchParams();
  const { selectedEventID } = useSelectedEventStore();
  const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
  const { data: sponsor, isPending, error } = useQuery(getEventSponsorByIdQueryOptions(event?.URL || '', Number(sponsorId)));
  const { data: media } = useQuery(getEventSingleMediaQueryOptions(event?.URL || '', sponsor?.featured_media || 0));

  if (isPending) {
    return (
      <ThemedView style={{ flex: 1, padding: 10 }}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={{ flex: 1, padding: 10 }}>
        <ThemedText>Error loading sponsor: {error.message}</ThemedText>
      </ThemedView>
    );
  }

  if (!sponsor) {
    return (
      <ThemedView style={{ flex: 1, padding: 10 }}>
        <ThemedText>Sponsor not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: media?.media_details.sizes?.full?.source_url || undefined }} 
          style={styles.image} 
        />
        <ThemedText style={styles.title}>{decode(sponsor.title.rendered)}</ThemedText>
      </View>

      {sponsor.content.rendered && (
        <View style={styles.contentContainer}>
          <ThemedRenderHTML html={sponsor.content.rendered} />
        </View>
      )}

      {sponsor.meta._wcpt_sponsor_website && (
        <ThemedText style={styles.website}>{sponsor.meta._wcpt_sponsor_website}</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',
    resizeMode: 'contain',
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    marginBottom: 24,
  },
  website: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
