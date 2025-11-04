import { useSessions } from '@/hooks/useSessions';
import "@/i18n";
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import SessionCard from './SessionCard';
import { ThemedText } from './ui/ThemedText';

export function CurrentSessions() {
    const { currentSessions } = useSessions();
    const { t, i18n } = useTranslation();

    if (currentSessions.length === 0) {
        return (
            <View style={{ marginBottom: 20 }}>
                <ThemedText style={styles.noSessions}>{t('current-sessions.no-sessions')}</ThemedText>
            </View>
        );
    }

    return (
        <View style={{ marginBottom: 20 }}>
            {currentSessions.map(session => (
                <SessionCard key={session.id} session={session} showDate={false} showTracks={true} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    noSessions: {
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic',
    },
}); 