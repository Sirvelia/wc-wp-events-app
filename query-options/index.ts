import { getEventById, getEventCategories, getEventDetails, getEvents, getEventSessions, getEventSingleMedia, getEventSpeakerById, getEventSpeakers, getEventSponsorById, getEventSponsors, getEventTracks, getMediaById } from "@/api";
import { queryOptions } from "@tanstack/react-query";

export const getEventsQueryOptions = () => {
    return queryOptions ({
        queryKey: ['events'],
        queryFn: () => getEvents(),
    })
};

export const getSingleMediaQueryOptions = (mediaId: number) => {
    return queryOptions({
        queryKey: ['media', mediaId],
        queryFn: () => getMediaById(mediaId),
        enabled: !!mediaId,
    })
};

export const getEventByIdQueryOptions = (eventId: number) => {
    return queryOptions({
        queryKey: ['event', eventId],
        queryFn: () => getEventById(eventId),
        enabled: !!eventId,
    })
};

export const getEventDetailsQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'details', url],
        queryFn: () => getEventDetails(url),
        enabled: !!url,
    })
};

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

export const getEventSpeakersQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'speakers', url],
        queryFn: () => getEventSpeakers(url),
        enabled: !!url,
    })
};

export const getEventSponsorsQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'sponsors', url],
        queryFn: () => getEventSponsors(url),
        enabled: !!url,
    })
};

export const getEventCategoriesQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'categories', url],
        queryFn: () => getEventCategories(url),
        enabled: !!url,
    })
};

export const getEventTracksQueryOptions = (url: string) => {
    return queryOptions({
        queryKey: ['event', 'tracks', url],
        queryFn: () => getEventTracks(url),
        enabled: !!url,
    })
};

export const getEventSingleMediaQueryOptions = (url: string, mediaId: number) => {
    return queryOptions({
        queryKey: ['event', 'single-media', url, mediaId],
        queryFn: () => getEventSingleMedia(url, mediaId),
        enabled: !!url && !!mediaId,
    })
};

export const getEventSpeakerByIdQueryOptions = (url: string, speakerId: number) => {
    return queryOptions({
        queryKey: ['event', 'speaker', url, speakerId],
        queryFn: () => getEventSpeakerById(url, speakerId),
        enabled: !!url && !!speakerId,
    })
};

export const getEventSponsorByIdQueryOptions = (url: string, sponsorId: number) => {
    return queryOptions({
        queryKey: ['event', 'sponsor', url, sponsorId],
        queryFn: () => getEventSponsorById(url, sponsorId),
        enabled: !!url && !!sponsorId,
    })
};