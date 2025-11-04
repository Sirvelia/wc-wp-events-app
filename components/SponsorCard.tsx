import { getEventByIdQueryOptions, getEventSingleMediaQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Sponsor } from "@/types/Sponsor";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { decode } from 'html-entities';
import { Image, Pressable, View } from "react-native";
import { ThemedCard } from "./ui/ThemedCard";
import { ThemedText } from "./ui/ThemedText";

export default function SponsorCard({ sponsor }: { sponsor: Sponsor }) {

    const { selectedEventID } = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const { data: media } = useQuery(getEventSingleMediaQueryOptions(event?.URL || '', sponsor.featured_media));

    return (
        <Pressable onPress={() => router.push(`/sponsor/${sponsor.id}`)}>
            <ThemedCard>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Image 
                        source={{ uri: media?.media_details.sizes?.full?.source_url || undefined }} 
                        style={{ 
                            backgroundColor: 'white', 
                            width: 70, 
                            height: 70, 
                            borderRadius: 2,
                            resizeMode: 'contain',
                        }} 
                    />
                    <View style={{ flex: 1 }}>
                        <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {decode(sponsor.title.rendered)}
                        </ThemedText>
                    </View>
                </View>
            </ThemedCard>
        </Pressable>
    );
} 