import i18n from "@/i18n";

/**
 * Extracts and formats the day number from a date string.
 *
 * @param {string} dateString - The date string in YYYY-MM-DD format
 * @returns {string} The localized day number (e.g., "15", "01")
 *
 * @example
 * getDayNumber("2024-03-15") // Returns "15"
 */
export const getDayNumber = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    return date.toLocaleDateString(i18n.language, { day: 'numeric' });
}

/**
 * Extracts and formats the abbreviated weekday name from a date string.
 * Uses the current i18n language setting for localization.
 *
 * @param {string} dateString - The date string in YYYY-MM-DD format
 * @returns {string} The localized abbreviated weekday name (e.g., "Mon", "Tue")
 *
 * @example
 * getDayName("2024-03-15") // Returns "Fri" (in English)
 */
export const getDayName = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    return date.toLocaleDateString(i18n.language, { weekday: 'short' });
}

/**
 * Extracts and formats the abbreviated month name from a date string.
 * Uses the current i18n language setting for localization.
 *
 * @param {string} dateString - The date string in YYYY-MM-DD format
 * @returns {string} The localized abbreviated month name (e.g., "Jan", "Feb")
 *
 * @example
 * getMonthName("2024-03-15") // Returns "Mar" (in English)
 */
export const getMonthName = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    return date.toLocaleDateString(i18n.language, { month: 'short' });
}