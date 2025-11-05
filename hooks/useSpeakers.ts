
import { getEventByIdQueryOptions, getEventSpeakersQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Session } from "@/types/Session";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch and manage event speakers
 *
 * Provides access to speakers data for the currently selected event and utility
 * functions to retrieve speakers by session or ID.
 *
 * @returns {Object} Speakers data, loading state, and utility functions
 * @returns {Speaker[]} speakers - Array of all speakers for the selected event
 * @returns {boolean} isLoading - Loading state of the speakers query
 * @returns {Error | null} error - Error object if the query fails, null otherwise
 * @returns {Function} getSpeakerById - Function to retrieve a speaker by their ID
 * @returns {Function} getSpeakersBySession - Function to retrieve all speakers for a given session
 *
 * @example
 * const { speakers, isLoading, getSpeakerById, getSpeakersBySession } = useSpeakers();
 * const speaker = getSpeakerById(123);
 * const sessionSpeakers = getSpeakersBySession(session);
 */
export const useSpeakers = () => {
    const { selectedEventID } = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const { data: speakers, isLoading, error } = useQuery(getEventSpeakersQueryOptions(event?.URL || ''));

    /**
     * Retrieves speakers associated with a given session
     *
     * @param {Session} session - The session to get speakers for
     * @returns {Speaker[] | undefined} Array of speakers for the session
     */
    const getSpeakersBySession = (session: Session) => {
        return speakers?.filter((speaker) => session.session_speakers.some((s) => Number(s.id) === speaker.id));
    };

    /**
     * Retrieves a specific speaker by their ID
     *
     * @param {number} id - The speaker ID
     * @returns {Speaker | undefined} The speaker object if found
     */
    const getSpeakerById = (id: number) => {
        return speakers?.find((speaker) => Number(speaker.id) === id);
    };

    return { speakers, isLoading, error, getSpeakerById, getSpeakersBySession };
};