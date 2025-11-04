const axios = require('axios').default;
import { Event, EventDetails, SelectedEvent } from '@/types/Event';
import { Media } from '@/types/Media';
import { Category, Session, Track } from '@/types/Session';
import { Speaker } from '@/types/Speaker';
import { Sponsor } from '@/types/Sponsor';
import { DateTime } from 'luxon';

const api = axios.create();

export const getEvents = async (): Promise<SelectedEvent[]> => {
    const response = await api.get('https://central.wordcamp.org/wp-json/wp/v2/wordcamps?status=wcpt-scheduled&per_page=100');
    const data = await response.data;

    const oneWeekAgo = DateTime.utc().minus({ weeks: 1 }).toSeconds();
    const oneMonthFromNow = DateTime.utc().plus({ months: 1 }).toSeconds();

    return data
        .filter((event: any) => {
            const startDate = Number(event['Start Date (YYYY-mm-dd)']);
            const endDate = Number(event['End Date (YYYY-mm-dd)']);
            return startDate >= oneWeekAgo && endDate <= oneMonthFromNow;
        })
        .sort((a: any, b: any) => Number(a['Start Date (YYYY-mm-dd)']) - Number(b['Start Date (YYYY-mm-dd)']))
        .map((event: any): SelectedEvent => ({
            title: event.title,
            id: event.id,
            featured_media: event.featured_media,
            URL: event.URL,
            _venue_country_name: event._venue_country_name,
            'Start Date (YYYY-mm-dd)': event['Start Date (YYYY-mm-dd)'],
            'End Date (YYYY-mm-dd)': event['End Date (YYYY-mm-dd)'],
        }));
};

export const getMediaById = async (mediaId: number): Promise<Media> => {
    const response = await api.get(`https://central.wordcamp.org/wp-json/wp/v2/media/${mediaId}`);
    const data = await response.data;

    return {
        id: data.id,
        alt_text: data.alt_text,
        media_details: data.media_details,
    };
};

export const getEventById = async (eventId: number): Promise<Event> => {
    const response = await api.get(`https://central.wordcamp.org/wp-json/wp/v2/wordcamps/${eventId}`);
    return await response.data;
};

export const getEventDetails = async (url: string): Promise<EventDetails> => {
    // Remove trailing slash from url before concatenating
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + '/wp-json/';
    const response = await api.get(apiURL);
    const data = await response.data;

    return {
        id: data.id,
        name: data.name,
        description: data.description,
        url: data.url,
        gmt_offset: data.gmt_offset,
        timezone_string: data.timezone_string,
    };
};

export const getEventSessions = async (url: string): Promise<Session[]> => {
    // Remove trailing slash from url before concatenating
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + '/wp-json/wp/v2/sessions?per_page=100';
    const response = await api.get(apiURL);
    return await response.data;
};

export const getEventSpeakers = async (url: string): Promise<Speaker[]> => {
    // Remove trailing slash from url before concatenating
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + '/wp-json/wp/v2/speakers?per_page=100';
    const response = await api.get(apiURL);
    const data = await response.data;

    return data
        .map((speaker: any): Speaker => ({
            id: speaker.id,
            slug: speaker.slug,
            link: speaker.link,
            title: speaker.title,
            content: speaker.content,
            featured_media: speaker.featured_media,
            avatar_urls: speaker.avatar_urls,
        }));
};

export const getEventSponsors = async (url: string): Promise<Sponsor[]> => {
    // Remove trailing slash from url before concatenating
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + '/wp-json/wp/v2/sponsors?per_page=100';
    const response = await api.get(apiURL);
    const data = await response.data;

    return data
        .map((sponsor: any): Sponsor => ({
            id: sponsor.id,
            slug: sponsor.slug,
            link: sponsor.link,
            title: sponsor.title,
            content: sponsor.content,
            featured_media: sponsor.featured_media,
            meta: sponsor.meta,
        }));
};

export const getEventCategories = async (url: string): Promise<Category[]> => {
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + '/wp-json/wp/v2/session_category?per_page=100';
    const response = await api.get(apiURL);
    const data = await response.data;

    return data
        .map((track: any): Category => ({
            id: track.id,
            name: track.name,
            slug: track.slug,
        }));
};

export const getEventTracks = async (url: string): Promise<Track[]> => {
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + '/wp-json/wp/v2/session_track?per_page=100';
    const response = await api.get(apiURL);
    const data = await response.data;

    return data
        .map((track: any): Track => ({
            id: track.id,
            name: track.name,
            slug: track.slug,
        }));
};

export const getEventSingleMedia = async (url: string, mediaId: number): Promise<Media> => {
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + `/wp-json/wp/v2/media/${mediaId}`;
    const response = await api.get(apiURL);
    const data = await response.data;

    return {
        id: data.id,
        alt_text: data.alt_text,
        media_details: data.media_details,
    };
};

export const getEventSpeakerById = async (url: string, speakerId: number): Promise<Speaker> => {
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + `/wp-json/wp/v2/speakers/${speakerId}`;
    const response = await api.get(apiURL);
    return await response.data;
};

export const getEventSponsorById = async (url: string, sponsorId: number): Promise<Sponsor> => {
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + `/wp-json/wp/v2/sponsors/${sponsorId}`;
    const response = await api.get(apiURL);
    return await response.data;
};