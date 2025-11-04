import { getEventByIdQueryOptions, getEventSpeakersQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Speaker } from "@/types/Speaker";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
import SpeakerCard from "./SpeakerCard";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

export default function SpeakersList() {

    const { selectedEventID } = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const { data: speakers, isPending, error } = useQuery(getEventSpeakersQueryOptions(event?.URL || ''));

    return (
        <ThemedView>
            {isPending && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
            {error && <ThemedText>Error: {error.message}</ThemedText>}

            {speakers && [...speakers]
            .sort((a, b) => a.title.rendered.localeCompare(b.title.rendered))
            .map((speaker: Speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
        </ThemedView>
    );
}