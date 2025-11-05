/**
 * @module i18n
 * @description Internationalization configuration module for the WordCamp Events app.
 * Configures i18next with React Native support and loads translation resources for supported languages.
 */

import { getLocales } from 'expo-localization';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./locales/en/translation.json";
import translationEs from "./locales/es/translation.json";

/**
 * Translation resources for all supported languages.
 * Maps language codes to their translation files.
 *
 * @constant
 * @type {Object.<string, {translation: Object}>}
 */
const resources = {
    "en": { translation: translationEn },
    "es": { translation: translationEs },
};

/**
 * Initializes the i18next library with React Native support.
 * Detects the device language and configures i18next with appropriate fallbacks.
 *
 * @async
 * @function initI18n
 * @returns {Promise<void>} Resolves when initialization is complete
 *
 * @description
 * - Detects the device language using expo-localization
 * - Falls back to English if device language is not supported
 * - Configures React integration without suspense mode
 * - Disables escape value for interpolation
 */
const initI18n = async () => {

    const deviceLanguage = getLocales()[0].languageCode || "en";

    await i18n.use(initReactI18next).init({
        resources,
        lng: deviceLanguage,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });
};

initI18n();

/**
 * Configured i18next instance.
 * Used throughout the app for translations via the useTranslation hook.
 *
 * @type {i18n}
 * @default
 */
export default i18n;