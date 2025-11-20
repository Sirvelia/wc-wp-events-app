import { ThemedCard } from '@/components/ui/ThemedCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useContactStore } from '@/stores/contactStore';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import "@/i18n";

export default function EditContactScreen() {
    const { t } = useTranslation();
    const { contactDetails, setContactDetails } = useContactStore();
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [phone, setPhone] = useState('');

    const [errors, setErrors] = useState<{
        fullName?: string;
        email?: string;
    }>({});

    useEffect(() => {
        if (contactDetails) {
            setFullName(contactDetails.fullName || '');
            setEmail(contactDetails.email || '');
            setCompany(contactDetails.company || '');
            setWebsiteUrl(contactDetails.websiteUrl || '');
            setPhone(contactDetails.phone || '');
        }
    }, [contactDetails]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSave = () => {
        const newErrors: { fullName?: string; email?: string } = {};

        if (!fullName.trim()) {
            newErrors.fullName = t('connect.validation.full-name-required');
        }

        if (!email.trim()) {
            newErrors.email = t('connect.validation.email-required');
        } else if (!validateEmail(email)) {
            newErrors.email = t('connect.validation.email-invalid');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setContactDetails({
            fullName: fullName.trim(),
            email: email.trim(),
            company: company.trim(),
            websiteUrl: websiteUrl.trim(),
            phone: phone.trim(),
        });

        router.back();
    };

    return (
        <ThemedView style={{ flex: 1, padding: 10 }}>
            <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10, lineHeight: 32 }}>{t('connect.edit-profile')}</ThemedText>

            <View style={styles.form}>
                <View style={styles.fieldContainer}>
                    <ThemedText style={styles.label}>{t('connect.full-name')} *</ThemedText>
                    <TextInput
                        style={[
                            styles.input,
                            { color: textColor, borderColor },
                            errors.fullName && styles.inputError
                        ]}
                        value={fullName}
                        onChangeText={(text) => {
                            setFullName(text);
                            if (errors.fullName) {
                                setErrors({ ...errors, fullName: undefined });
                            }
                        }}
                        placeholder={t('connect.full-name')}
                        placeholderTextColor="#999"
                    />
                    {errors.fullName && (
                        <ThemedText style={styles.errorText}>{errors.fullName}</ThemedText>
                    )}
                </View>

                <View style={styles.fieldContainer}>
                    <ThemedText style={styles.label}>{t('connect.email')} *</ThemedText>
                    <TextInput
                        style={[
                            styles.input,
                            { color: textColor, borderColor },
                            errors.email && styles.inputError
                        ]}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) {
                                setErrors({ ...errors, email: undefined });
                            }
                        }}
                        placeholder={t('connect.email')}
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {errors.email && (
                        <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
                    )}
                </View>

                <View style={styles.fieldContainer}>
                    <ThemedText style={styles.label}>{t('connect.phone')}</ThemedText>
                    <TextInput
                        style={[styles.input, { color: textColor, borderColor }]}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder={t('connect.phone')}
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <ThemedText style={styles.label}>{t('connect.company')}</ThemedText>
                    <TextInput
                        style={[styles.input, { color: textColor, borderColor }]}
                        value={company}
                        onChangeText={setCompany}
                        placeholder={t('connect.company')}
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <ThemedText style={styles.label}>{t('connect.website-url')}</ThemedText>
                    <TextInput
                        style={[styles.input, { color: textColor, borderColor }]}
                        value={websiteUrl}
                        onChangeText={setWebsiteUrl}
                        placeholder={t('connect.website-url')}
                        placeholderTextColor="#999"
                        keyboardType="url"
                        autoCapitalize="none"
                    />
                </View>
            </View>

            <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                    styles.saveButton,
                    pressed && styles.saveButtonPressed
                ]}
            >
                <ThemedCard style={styles.saveButtonCard}>
                    <ThemedText style={styles.saveButtonText}>
                        {t('connect.save-changes')}
                    </ThemedText>
                </ThemedCard>
            </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    form: {
        gap: 15,
    },
    fieldContainer: {
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    inputError: {
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
    },
    saveButton: {
        marginTop: 20,
    },
    saveButtonPressed: {
        opacity: 0.7,
    },
    saveButtonCard: {
        padding: 15,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
});

