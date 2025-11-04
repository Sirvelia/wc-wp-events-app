import * as Notifications from "expo-notifications";
import { createContext, FC, PropsWithChildren, useEffect } from "react";
import { Platform } from "react-native";

interface NotificationsContextType {
    scheduleNotificationAsync: (
        request: Notifications.NotificationRequestInput
    ) => Promise<string>;
    cancelNotificationAsync: (identifier: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(
    undefined
);

const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        const configureNotificationsAsync = async () => {
            const { granted } = await Notifications.requestPermissionsAsync();
            if (!granted) {
                return console.warn("⚠️ Notification Permissions not granted!");
            }

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldPlaySound: true,
                    shouldSetBadge: false,
                    shouldShowBanner: true,
                    shouldShowList: true,
                }),
            });
        };
        configureNotificationsAsync();
    }, []);

    const scheduleNotificationAsync = async (
        request: Notifications.NotificationRequestInput
    ) => {
        // Scheduled notifications are not supported on web
        if (Platform.OS === 'web') {
            console.warn('Scheduled notifications are not supported on web platform');
            return 'web-not-supported';
        }
        
        return await Notifications.scheduleNotificationAsync(request);
    };

    const cancelNotificationAsync = async (identifier: string) => {
        // Scheduled notifications are not supported on web
        if (Platform.OS === 'web') {
            console.warn('Canceling scheduled notifications is not supported on web platform');
            return;
        }
        
        await Notifications.cancelScheduledNotificationAsync(identifier);
    };

    const value = {
        scheduleNotificationAsync,
        cancelNotificationAsync,
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

export { NotificationsContext, NotificationsProvider };

