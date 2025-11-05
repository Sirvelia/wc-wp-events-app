import { getEventById, getEventCategories, getEventDetails, getEvents, getEventSessions, getEventSingleMedia, getEventSpeakerById, getEventSpeakers, getEventSponsorById, getEventSponsors, getEventTracks, getMediaById } from "@/api";
import { queryOptions } from "@tanstack/react-query";

/**
 * Creates query options for fetching all events
 * @returns Query options object configured for fetching the events list
 */
export const getEventsQueryOptions = () => {
    return queryOptions ({
        queryKey: ['events'],
        queryFn: () => getEvents(),
    })
};

/**
 * Creates query options for fetching a single media item by ID
 * @param mediaId - The ID of the media item to fetch
 * @returns Query options object configured for fetching a specific media item. Query is only enabled when mediaId is provided.
 */
export const getSingleMediaQueryOptions = (mediaId: number) => {
    return queryOptions({
        queryKey: ['media', mediaId],
        queryFn: () => getMediaById(mediaId),
        enabled: !!mediaId,
    })
};

/**
 * Creates query options for fetching a single event by ID
 * @param eventId - The ID of the event to fetch
 * @returns Query options object configured for fetching a specific event. Query is only enabled when eventId is provided.
 */
export const getEventByIdQueryOptions = (eventId: number) => {
    return queryOptions({
        queryKey: ['event', eventId],
        queryFn: () => getEventById(eventId),
        enabled: !!eventId,
    })
};

/**
 * Creates query options for fetching detailed information about an event
 * @param url - The URL of the event to fetch details for
 * @returns Query options object configured for fetching event details. Query is only enabled when url is provided.
 */
export const getEventDetailsQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'details', url],
        queryFn: () => getEventDetails(url),
        enabled: !!url,
    })
};

/**
 * Creates query options for fetching sessions associated with an event
 * @param url - The URL of the event to fetch sessions for
 * @returns Query options object configured for fetching event sessions.
 * Query is only enabled when url is provided. Results are automatically sorted by session time.
 */
export const getEventSessionsQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'sessions', url],
        queryFn: () => getEventSessions(url),
        enabled: !!url,
        select: (data) => {
            return data.sort((a: any, b: any) => Number(a.meta?._wcpt_session_time) - Number(b.meta?._wcpt_session_time));
        },
    })
};

/**
 * Creates query options for fetching speakers associated with an event
 * @param url - The URL of the event to fetch speakers for
 * @returns Query options object configured for fetching event speakers. Query is only enabled when url is provided.
 */
export const getEventSpeakersQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'speakers', url],
        queryFn: () => getEventSpeakers(url),
        enabled: !!url,
    })
};

/**
 * Creates query options for fetching sponsors associated with an event
 * @param url - The URL of the event to fetch sponsors for
 * @returns Query options object configured for fetching event sponsors. Query is only enabled when url is provided.
 */
export const getEventSponsorsQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'sponsors', url],
        queryFn: () => getEventSponsors(url),
        enabled: !!url,
    })
};

/**
 * Creates query options for fetching categories associated with an event
 * @param url - The URL of the event to fetch categories for
 * @returns Query options object configured for fetching event categories. Query is only enabled when url is provided.
 */
export const getEventCategoriesQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'categories', url],
        queryFn: () => getEventCategories(url),
        enabled: !!url,
    })
};

/**
 * Creates query options for fetching tracks associated with an event
 * @param url - The URL of the event to fetch tracks for
 * @returns Query options object configured for fetching event tracks. Query is only enabled when url is provided.
 */
export const getEventTracksQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'tracks', url],
        queryFn: () => getEventTracks(url),
        enabled: !!url,
    })
};

/**
 * Creates query options for fetching a single media item associated with an event
 * @param url - The URL of the event
 * @param mediaId - The ID of the media item to fetch
 * @returns Query options object configured for fetching event-specific media. Query is only enabled when both url and mediaId are provided.
 */
export const getEventSingleMediaQueryOptions = (url: string, mediaId: number) => {
    return queryOptions({
        queryKey: ['event', 'single-media', url, mediaId],
        queryFn: () => getEventSingleMedia(url, mediaId),
        enabled: !!url && !!mediaId,
    })
};

/**
 * Creates query options for fetching a specific speaker by ID from an event
 * @param url - The URL of the event
 * @param speakerId - The ID of the speaker to fetch
 * @returns Query options object configured for fetching a specific event speaker. Query is only enabled when both url and speakerId are provided.
 */
export const getEventSpeakerByIdQueryOptions = (url: string, speakerId: number) => {
    return queryOptions({
        queryKey: ['event', 'speaker', url, speakerId],
        queryFn: () => getEventSpeakerById(url, speakerId),
        enabled: !!url && !!speakerId,
    })
};

/**
 * Creates query options for fetching a specific sponsor by ID from an event
 * @param url - The URL of the event
 * @param sponsorId - The ID of the sponsor to fetch
 * @returns Query options object configured for fetching a specific event sponsor. Query is only enabled when both url and sponsorId are provided.
 */
export const getEventSponsorByIdQueryOptions = (url: string, sponsorId: number) => {
    return queryOptions({
        queryKey: ['event', 'sponsor', url, sponsorId],
        queryFn: () => getEventSponsorById(url, sponsorId),
        enabled: !!url && !!sponsorId,
    })
};