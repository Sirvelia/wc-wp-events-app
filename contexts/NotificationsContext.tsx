import * as Notifications from "expo-notifications";
import { createContext, FC, PropsWithChildren, useEffect } from "react";
import { Platform } from "react-native";

/**
 * Context type for managing notification operations.
 * @property {Function} scheduleNotificationAsync - Schedules a notification to be delivered at a specified time
 * @property {Function} cancelNotificationAsync - Cancels a previously scheduled notification by its identifier
 */
interface NotificationsContextType {
    scheduleNotificationAsync: (
        request: Notifications.NotificationRequestInput
    ) => Promise<string>;
    cancelNotificationAsync: (identifier: string) => Promise<void>;
}

/**
 * React context for providing notification scheduling and cancellation functionality throughout the app.
 * @context NotificationsContext
 */
const NotificationsContext = createContext<NotificationsContextType | undefined>(
    undefined
);

/**
 * Provider component that manages notification permissions and provides notification scheduling capabilities.
 * Automatically requests notification permissions on mount and configures notification behavior.
 * @param {PropsWithChildren} props - Component props including children to render
 * @returns {JSX.Element} Provider component wrapping children with notification context
 */
const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        /**
         * Configures notification permissions and behavior on component mount.
         * Requests notification permissions and sets up notification handler with display preferences.
         */
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

    /**
     * Schedules a notification to be delivered at a specified time.
     * Note: Scheduled notifications are not supported on web platform.
     * @param {Notifications.NotificationRequestInput} request - Notification request configuration including content and trigger
     * @returns {Promise<string>} Promise resolving to the notification identifier, or 'web-not-supported' on web platform
     */
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

    /**
     * Cancels a previously scheduled notification by its identifier.
     * Note: Canceling scheduled notifications is not supported on web platform.
     * @param {string} identifier - The unique identifier of the notification to cancel
     * @returns {Promise<void>} Promise that resolves when the notification is successfully canceled
     */
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

