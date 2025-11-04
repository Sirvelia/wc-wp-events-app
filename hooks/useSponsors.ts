import { getEventByIdQueryOptions, getEventSponsorsQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Sponsor } from "@/types/Sponsor";
import { useQuery } from "@tanstack/react-query";

export const useSponsors = () => {
    const { selectedEventID } = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const { data: sponsors, isLoading, error } = useQuery(getEventSponsorsQueryOptions(event?.URL || ''));

    const uniqueSponsors = sponsors?.reduce((uniqueSponsors: Sponsor[], sponsor: Sponsor) => {
        if (!uniqueSponsors.some(s => s.id === sponsor.id)) {
            uniqueSponsors.push(sponsor);
        }
        return uniqueSponsors;
    }, []) ?? [];

    return {
        sponsors: uniqueSponsors,
        isLoading,
        error,
    };
};