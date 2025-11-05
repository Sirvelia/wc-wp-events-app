import { getEventByIdQueryOptions, getEventSponsorsQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Sponsor } from "@/types/Sponsor";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch and manage event sponsors
 *
 * Fetches sponsors for the currently selected event and removes duplicates
 * based on sponsor ID.
 *
 * @returns {Object} Sponsors data and loading state
 * @returns {Sponsor[]} sponsors - Array of unique sponsors for the selected event
 * @returns {boolean} isLoading - Loading state of the sponsors query
 * @returns {Error | null} error - Error object if the query fails, null otherwise
 *
 * @example
 * const { sponsors, isLoading, error } = useSponsors();
 */
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