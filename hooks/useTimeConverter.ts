import { DateTime } from 'luxon';

/**
 * Custom hook to convert UTC timestamps to local time with timezone offset
 *
 * Provides utilities to convert UTC timestamps to a specific timezone using
 * GMT offset values. Uses Luxon for precise timezone calculations.
 *
 * @returns {Object} Time conversion utilities
 * @returns {Function} convertTime - Function to convert UTC time to local time
 *
 * @example
 * const { convertTime } = useTimeConverter();
 * const { localTime, utcTime, dateTime } = convertTime(1609459200, 2); // GMT+2
 */
export const useTimeConverter = () => {
    /**
     * Converts a UTC timestamp to local time based on GMT offset
     *
     * @param {number} utcTime - Unix timestamp in seconds (UTC)
     * @param {number} gmtOffset - GMT offset in hours (can include decimal for minutes, e.g., 5.5 for GMT+5:30)
     * @returns {Object} Converted time information
     * @returns {DateTime} dateTime - Luxon DateTime object in the target timezone
     * @returns {string} localTime - Formatted local time string (HH:mm format)
     * @returns {string} utcTime - Formatted UTC time string (HH:mm format)
     * @returns {number} gmtOffset - The GMT offset that was used
     */
    const convertTime = (utcTime: number, gmtOffset: number) => {
        // Create a DateTime object from the UTC time
        const utcDateTime = DateTime.fromSeconds(utcTime, { zone: 'utc' });

        // Convert GMT offset to hours and minutes
        const hours = Math.floor(gmtOffset);
        const minutes = Math.round((gmtOffset - hours) * 60);
        
        // Format the timezone string with both hours and minutes
        const tzFormat = `UTC${gmtOffset >= 0 ? '+' : ''}${hours.toString().padStart(2, '0')}:${Math.abs(minutes).toString().padStart(2, '0')}`;
                
        // Convert to the target timezone using the formatted timezone string
        const localDateTime = utcDateTime.setZone(tzFormat);

        return {
            dateTime: localDateTime,
            localTime: localDateTime.toFormat('HH:mm'),
            utcTime: utcDateTime.toFormat('HH:mm'),
            gmtOffset
        };
    };

    return { convertTime };
};