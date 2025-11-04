
import { getEventByIdQueryOptions, getEventSpeakersQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Session } from "@/types/Session";
import { useQuery } from "@tanstack/react-query";

export const useSpeakers = () => {
    const { selectedEventID } = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const { data: speakers, isLoading, error } = useQuery(getEventSpeakersQueryOptions(event?.URL || ''));

    const getSpeakersBySession = (session: Session) => {
        return speakers?.filter((speaker) => session.session_speakers.some((s) => Number(s.id) === speaker.id));
    };

    const getSpeakerById = (id: number) => {
        return speakers?.find((speaker) => Number(speaker.id) === id);
    };

    return { speakers, isLoading, error, getSpeakerById, getSpeakersBySession };
};