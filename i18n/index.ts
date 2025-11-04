import { getLocales } from 'expo-localization';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./locales/en/translation.json";
import translationEs from "./locales/es/translation.json";

const resources = {
    "en": { translation: translationEn },
    "es": { translation: translationEs },
};

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

export default i18n;