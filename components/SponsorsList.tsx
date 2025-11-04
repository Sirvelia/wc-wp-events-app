import { useSponsors } from "@/hooks/useSponsors";
import { ActivityIndicator } from "react-native";
import SponsorCard from "./SponsorCard";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

export default function SponsorsList() {
    const { sponsors, isLoading, error } = useSponsors();
    
    return (
        <ThemedView>
            {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
            {error && <ThemedText>Error: {error.message}</ThemedText>}

            {sponsors && [...sponsors]
                .sort((a, b) => a.title.rendered.localeCompare(b.title.rendered))
                .map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                ))}
        </ThemedView>
    );
}