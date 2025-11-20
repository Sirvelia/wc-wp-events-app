import { ThemedCard } from '@/components/ui/ThemedCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useContactStore } from '@/stores/contactStore';
import { generateVCard } from '@/utils/vcard';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import "@/i18n";

export default function ConnectScreen() {
    const { t } = useTranslation();
    const { contactDetails, _hasHydrated } = useContactStore();
    const [qrValue, setQrValue] = useState<string>('');
    const { width } = useWindowDimensions();
    const qrSize = Math.min(width * 0.7, 300);

    useEffect(() => {
        if (_hasHydrated && contactDetails) {
            const vcard = generateVCard(contactDetails);
            setQrValue(vcard);
        } else {
            setQrValue('');
        }
    }, [contactDetails, _hasHydrated]);

    const hasContactDetails = contactDetails && contactDetails.fullName && contactDetails.email;

    return (
        <ThemedView style={{ flex: 1, padding: 10 }}>
            <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20, lineHeight: 32 }}>{t('connect.my-connection')}</ThemedText>

            {hasContactDetails && qrValue ? (
                <>
                    <View style={{ paddingHorizontal: 20 }}>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={qrValue}
                                size={qrSize}
                                backgroundColor="white"
                                color="black"
                                ecl="H"
                            />
                        </View>
                    </View>

                    <ThemedText style={styles.instructionText}>
                        {t('connect.scan-instruction')}
                    </ThemedText>
                </>
            ) : (
                <View style={styles.emptyState}>
                    <ThemedText style={styles.emptyStateText}>
                        {t('connect.no-contact-details')}
                    </ThemedText>
                    <ThemedText style={styles.emptyStateSubtext}>
                        {t('connect.please-add-details')}
                    </ThemedText>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <Pressable
                    onPress={() => router.push('/connect/edit')}
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                >
                    <ThemedCard style={styles.buttonCard}>
                        <ThemedText style={styles.buttonText}>
                            {t('connect.edit-details')}
                        </ThemedText>
                    </ThemedCard>
                </Pressable>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    qrContainer: {
        backgroundColor: 'white',
        padding: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    emptyState: {
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.7,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        width: '100%',
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonCard: {
        padding: 15,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
});

