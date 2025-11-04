import * as Notifications from "expo-notifications";
import { useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { NotificationsContext } from "../contexts/NotificationsContext";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notifications.NotificationRequest[]>([]);
    const context = useContext(NotificationsContext);

    if (!context) {
        throw new Error("useNotifications must be used within a NotificationsProvider");
    }

    useEffect(() => {
        const getNotifications = async () => {
            // getAllScheduledNotificationsAsync is not available on web
            if (Platform.OS === 'web') {
                // On web, we'll use an empty array as fallback
                // since scheduled notifications are not supported on web
                setNotifications([]);
                return;
            }
            
            try {
                const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
                setNotifications(scheduledNotifications);
            } catch (error) {
                console.warn('Failed to get scheduled notifications:', error);
                setNotifications([]);
            }
        };

        getNotifications();
    }, []);

    return {
        notifications,
        scheduleNotificationAsync: context.scheduleNotificationAsync,
        cancelNotificationAsync: context.cancelNotificationAsync,
    };
};