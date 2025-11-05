/**
 * @module api
 * @description API client module for interacting with WordCamp.org and individual WordCamp event APIs.
 * Provides functions to fetch events, sessions, speakers, sponsors, and related data.
 */

const axios = require('axios').default;
import { Event, EventDetails, SelectedEvent } from '@/types/Event';
import { Media } from '@/types/Media';
import { Category, Session, Track } from '@/types/Session';
import { Speaker } from '@/types/Speaker';
import { Sponsor } from '@/types/Sponsor';
import { DateTime } from 'luxon';

/**
 * Axios instance for making API requests.
 *
 * @constant
 * @type {AxiosInstance}
 */
const api = axios.create();

/**
 * Fetches scheduled WordCamp events from the central WordCamp.org API.
 * Filters events to show only those happening within a specific time window
 * (from one week ago to one month from now).
 *
 * @async
 * @function getEvents
 * @returns {Promise<SelectedEvent[]>} A promise that resolves to an array of selected events,
 *                                     sorted by start date
 *
 * @description
 * - Retrieves up to 100 scheduled WordCamp events
 * - Filters events by date range (1 week ago to 1 month from now)
 * - Sorts events by start date in ascending order
 * - Maps event data to SelectedEvent type with essential fields
 *
 * @example
 * const events = await getEvents();
 * console.log(`Found ${events.length} upcoming events`);
 */
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

/**
 * Fetches media details from the central WordCamp.org API by media ID.
 *
 * @async
 * @function getMediaById
 * @param {number} mediaId - The ID of the media item to fetch
 * @returns {Promise<Media>} A promise that resolves to the media object with id, alt_text, and media_details
 *
 * @example
 * const media = await getMediaById(12345);
 * console.log(media.alt_text);
 */
export const getMediaById = async (mediaId: number): Promise<Media> => {
    const response = await api.get(`https://central.wordcamp.org/wp-json/wp/v2/media/${mediaId}`);
    const data = await response.data;

    return {
        id: data.id,
        alt_text: data.alt_text,
        media_details: data.media_details,
    };
};

/**
 * Fetches complete event details from the central WordCamp.org API by event ID.
 *
 * @async
 * @function getEventById
 * @param {number} eventId - The ID of the WordCamp event to fetch
 * @returns {Promise<Event>} A promise that resolves to the complete event object
 *
 * @example
 * const event = await getEventById(67890);
 * console.log(event.title);
 */
export const getEventById = async (eventId: number): Promise<Event> => {
    const response = await api.get(`https://central.wordcamp.org/wp-json/wp/v2/wordcamps/${eventId}`);
    return await response.data;
};

/**
 * Fetches detailed information about a specific WordCamp event from its individual site API.
 *
 * @async
 * @function getEventDetails
 * @param {string} url - The base URL of the WordCamp event site
 * @returns {Promise<EventDetails>} A promise that resolves to event details including
 *                                   timezone, description, and site information
 *
 * @description
 * - Cleans the URL by removing trailing slashes
 * - Fetches data from the event's wp-json root endpoint
 * - Returns essential event metadata like timezone and description
 *
 * @example
 * const details = await getEventDetails('https://europe.wordcamp.org/2024');
 * console.log(details.timezone_string);
 */
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

/**
 * Fetches all sessions for a specific WordCamp event.
 *
 * @async
 * @function getEventSessions
 * @param {string} url - The base URL of the WordCamp event site
 * @returns {Promise<Session[]>} A promise that resolves to an array of session objects
 *
 * @description
 * - Cleans the URL by removing trailing slashes
 * - Fetches up to 100 sessions from the event's API
 *
 * @example
 * const sessions = await getEventSessions('https://europe.wordcamp.org/2024');
 * console.log(`Found ${sessions.length} sessions`);
 */
export const getEventSessions = async (url: string): Promise<Session[]> => {
    // Remove trailing slash from url before concatenating
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + '/wp-json/wp/v2/sessions?per_page=100';
    const response = await api.get(apiURL);
    return await response.data;
};

/**
 * Fetches all speakers for a specific WordCamp event.
 *
 * @async
 * @function getEventSpeakers
 * @param {string} url - The base URL of the WordCamp event site
 * @returns {Promise<Speaker[]>} A promise that resolves to an array of speaker objects
 *
 * @description
 * - Cleans the URL by removing trailing slashes
 * - Fetches up to 100 speakers from the event's API
 * - Maps speaker data to the Speaker type with relevant fields
 *
 * @example
 * const speakers = await getEventSpeakers('https://europe.wordcamp.org/2024');
 * speakers.forEach(speaker => console.log(speaker.title));
 */
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

/**
 * Fetches all sponsors for a specific WordCamp event.
 *
 * @async
 * @function getEventSponsors
 * @param {string} url - The base URL of the WordCamp event site
 * @returns {Promise<Sponsor[]>} A promise that resolves to an array of sponsor objects
 *
 * @description
 * - Cleans the URL by removing trailing slashes
 * - Fetches up to 100 sponsors from the event's API
 * - Maps sponsor data to the Sponsor type with relevant fields including metadata
 *
 * @example
 * const sponsors = await getEventSponsors('https://europe.wordcamp.org/2024');
 * sponsors.forEach(sponsor => console.log(sponsor.title));
 */
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

/**
 * Fetches all session categories for a specific WordCamp event.
 *
 * @async
 * @function getEventCategories
 * @param {string} url - The base URL of the WordCamp event site
 * @returns {Promise<Category[]>} A promise that resolves to an array of category objects
 *
 * @description
 * - Cleans the URL by removing trailing slashes
 * - Fetches up to 100 session categories from the event's API
 * - Maps category data to the Category type with id, name, and slug
 *
 * @example
 * const categories = await getEventCategories('https://europe.wordcamp.org/2024');
 * categories.forEach(cat => console.log(cat.name));
 */
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

/**
 * Fetches all session tracks for a specific WordCamp event.
 *
 * @async
 * @function getEventTracks
 * @param {string} url - The base URL of the WordCamp event site
 * @returns {Promise<Track[]>} A promise that resolves to an array of track objects
 *
 * @description
 * - Cleans the URL by removing trailing slashes
 * - Fetches up to 100 session tracks from the event's API
 * - Maps track data to the Track type with id, name, and slug
 *
 * @example
 * const tracks = await getEventTracks('https://europe.wordcamp.org/2024');
 * tracks.forEach(track => console.log(track.name));
 */
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

/**
 * Fetches a single media item from a specific WordCamp event's API.
 *
 * @async
 * @function getEventSingleMedia
 * @param {string} url - The base URL of the WordCamp event site
 * @param {number} mediaId - The ID of the media item to fetch
 * @returns {Promise<Media>} A promise that resolves to the media object with id, alt_text, and media_details
 *
 * @description
 * - Cleans the URL by removing trailing slashes
 * - Fetches media details from the event's media endpoint
 *
 * @example
 * const media = await getEventSingleMedia('https://europe.wordcamp.org/2024', 456);
 * console.log(media.alt_text);
 */
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

/**
 * Fetches details for a specific speaker from a WordCamp event's API.
 *
 * @async
 * @function getEventSpeakerById
 * @param {string} url - The base URL of the WordCamp event site
 * @param {number} speakerId - The ID of the speaker to fetch
 * @returns {Promise<Speaker>} A promise that resolves to the complete speaker object
 *
 * @description
 * - Cleans the URL by removing trailing slashes
 * - Fetches detailed speaker information from the event's speakers endpoint
 *
 * @example
 * const speaker = await getEventSpeakerById('https://europe.wordcamp.org/2024', 123);
 * console.log(speaker.title);
 */
export const getEventSpeakerById = async (url: string, speakerId: number): Promise<Speaker> => {
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + `/wp-json/wp/v2/speakers/${speakerId}`;
    const response = await api.get(apiURL);
    return await response.data;
};

/**
 * Fetches details for a specific sponsor from a WordCamp event's API.
 *
 * @async
 * @function getEventSponsorById
 * @param {string} url - The base URL of the WordCamp event site
 * @param {number} sponsorId - The ID of the sponsor to fetch
 * @returns {Promise<Sponsor>} A promise that resolves to the complete sponsor object
 *
 * @description
 * - Cleans the URL by removing trailing slashes
 * - Fetches detailed sponsor information from the event's sponsors endpoint
 *
 * @example
 * const sponsor = await getEventSponsorById('https://europe.wordcamp.org/2024', 789);
 * console.log(sponsor.title);
 */
export const getEventSponsorById = async (url: string, sponsorId: number): Promise<Sponsor> => {
    const cleanUrl = url.replace(/\/$/, '');
    const apiURL = cleanUrl + `/wp-json/wp/v2/sponsors/${sponsorId}`;
    const response = await api.get(apiURL);
    return await response.data;
};