import SponsorsList from "@/components/SponsorsList";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import "@/i18n";
import { useTranslation } from 'react-i18next';

export default function SponsorsScreen() {
    const { t, i18n } = useTranslation();

    return (
        <ThemedView style={{ flex: 1, padding: 10 }}>
            <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10, lineHeight: 32 }}>{t('tabs.sponsors')}</ThemedText>

            <SponsorsList />
        </ThemedView >
    );
}