import { Speaker } from "@/types/Speaker";
import { router } from "expo-router";
import { decode } from 'html-entities';
import { Image, Pressable, View } from "react-native";
import { ThemedCard } from "./ui/ThemedCard";
import { ThemedText } from "./ui/ThemedText";

export default function SpeakerCard({ speaker }: { speaker: Speaker }) {
    return (
        <Pressable onPress={() => router.push(`/speaker/${speaker.id}`)}>
        <ThemedCard>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={{ uri: speaker?.avatar_urls['48'] || undefined }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>{decode(speaker.title.rendered)}</ThemedText>
                </View>
            </ThemedCard>
        </Pressable>
    );
}