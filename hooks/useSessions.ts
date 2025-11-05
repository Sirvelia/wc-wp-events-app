import { getEventByIdQueryOptions, getEventDetailsQueryOptions, getEventSessionsQueryOptions } from "@/query-options";
import { useSelectedEventStore } from "@/stores/selectedEventStore";
import { Session } from "@/types/Session";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTimeConverter } from "./useTimeConverter";

/**
 * Custom hook to fetch and manage event sessions
 *
 * Provides comprehensive session management including filtering by date, speaker,
 * category, and tracking currently active sessions. Updates every 30 seconds to
 * maintain accurate current session status.
 *
 * @returns {Object} Sessions data, loading state, and utility functions
 * @returns {Session[]} sessions - Array of all sessions for the selected event
 * @returns {boolean} isLoading - Loading state of the sessions query
 * @returns {Error | null} error - Error object if the query fails, null otherwise
 * @returns {string[]} uniqueDates - Array of unique session dates in YYYY-MM-DD format
 * @returns {Function} getSessionsByDate - Function to retrieve sessions for a specific date
 * @returns {Function} getSessionsBySpeaker - Function to retrieve sessions for a specific speaker
 * @returns {Function} getSessionsByCategory - Function to retrieve sessions by category
 * @returns {Session[]} currentSessions - Array of sessions currently in progress
 * @returns {Function} formatDate - Function to format dates for display in the user's locale
 *
 * @example
 * const { sessions, uniqueDates, getSessionsByDate, currentSessions } = useSessions();
 * const todaySessions = getSessionsByDate('2024-01-15');
 * const activeSessions = currentSessions;
 */
export const useSessions = () => {
    const { i18n } = useTranslation();
    const { convertTime } = useTimeConverter();
    const { selectedEventID } = useSelectedEventStore();
    const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
    const { data: eventDetails } = useQuery(getEventDetailsQueryOptions(event?.URL || ''));
    const { data: sessions, isLoading, error } = useQuery(getEventSessionsQueryOptions(event?.URL || ''));
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {

        setCurrentTime(DateTime.utc().toJSDate());
        // Update current time every 30 seconds
        const timer = setInterval(() => {
            setCurrentTime(DateTime.utc().toJSDate());
        }, 30000);

        return () => clearInterval(timer);
    }, []);

    /**
     * Formats a date for display in the user's locale
     *
     * @param {Date} date - The date to format
     * @returns {string} Formatted date string (e.g., "Monday, 15 January")
     */
    const formatDate = (date: Date): string => {
        const day = date.getDate();
        return date.toLocaleDateString(i18n.language, {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    const uniqueDates = useMemo(() => {
        if (!sessions || !event) return [];
        
        return sessions.reduce((dates: string[], session) => {
            // Convert UTC timestamp to local time using event's GMT offset
            const {dateTime: localDate} = convertTime(session?.meta?._wcpt_session_time, eventDetails?.gmt_offset || 0);
            const formattedDate = localDate.toFormat('yyyy-MM-dd') // Returns YYYY-MM-DD format
            if (!dates.includes(formattedDate)) {
                dates.push(formattedDate);
            }
            return dates;
        }, []);
    }, [sessions, event, convertTime]);

    /**
     * Retrieves all sessions for a specific date
     *
     * Converts session times to local time using the event's GMT offset
     * and filters sessions matching the provided date.
     *
     * @param {string} selectedDate - Date string in YYYY-MM-DD format
     * @returns {Session[]} Array of sessions for the specified date
     */
    const getSessionsByDate = useCallback((selectedDate: string) => {
        if (!sessions || !event) return [];

        return sessions.filter((session) => {
            // Convert UTC timestamp to local time using event's GMT offset
            const {dateTime: localDate} = convertTime(session?.meta?._wcpt_session_time, eventDetails?.gmt_offset || 0);
            const formattedDate = localDate.toFormat('yyyy-MM-dd'); // YYYY-MM-DD format
            return formattedDate === selectedDate;
        });
    }, [sessions, event, convertTime]);

    /**
     * Retrieves all sessions featuring a specific speaker
     *
     * @param {number} speakerId - The ID of the speaker
     * @returns {Session[]} Array of sessions featuring the specified speaker
     */
    const getSessionsBySpeaker = useCallback((speakerId: number) => {
        return sessions?.filter((session: Session) => session.session_speakers.some((s) => Number(s.id) === speakerId)) ?? [];
    }, [sessions]);

    /**
     * Retrieves all sessions in a specific category
     *
     * @param {number} categoryID - The ID of the category
     * @returns {Session[]} Array of sessions in the specified category
     */
    const getSessionsByCategory = useCallback((categoryID: number) => {
        return sessions?.filter((session: Session) => session.session_category.some((category: number) => category === categoryID)) ?? [];
    }, [sessions]);

    const currentSessions = useMemo(() => {
        if (!sessions || !event) return [] as Session[];
        
        return sessions.filter(session => {
            const { dateTime: localDate } = convertTime(session?.meta?._wcpt_session_time, eventDetails?.gmt_offset || 0);

            // Convert session time to JavaScript Date
            const sessionStart = localDate.toJSDate();
            
            // Calculate session end time (multiply duration by 60 to convert minutes to seconds)
            const sessionEnd = localDate.plus({ seconds: session.meta?._wcpt_session_duration }).toJSDate();
            
            const isCurrentSession = currentTime >= sessionStart && currentTime <= sessionEnd;
            
            return isCurrentSession;
        });
    }, [sessions, event, currentTime]);

    return {
        sessions, 
        isLoading, 
        error,
        uniqueDates,
        getSessionsByDate, 
        getSessionsBySpeaker,
        getSessionsByCategory,
        currentSessions,
        formatDate
    };
}