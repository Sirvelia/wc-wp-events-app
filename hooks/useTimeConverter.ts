import { DateTime } from 'luxon';

export const useTimeConverter = () => {
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