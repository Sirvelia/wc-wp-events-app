import * as Notifications from "expo-notifications";
import { useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { NotificationsContext } from "../contexts/NotificationsContext";

/**
 * Custom hook to manage notifications
 *
 * Provides access to notification functionality including scheduling and canceling
 * notifications. On web platforms, scheduled notifications are not supported and
 * an empty array is returned.
 *
 * @returns {Object} Notification data and management functions
 * @returns {Notifications.NotificationRequest[]} notifications - Array of scheduled notifications (empty on web)
 * @returns {Function} scheduleNotificationAsync - Function to schedule a new notification
 * @returns {Function} cancelNotificationAsync - Function to cancel a scheduled notification
 *
 * @throws {Error} Throws if used outside of NotificationsProvider
 *
 * @example
 * const { notifications, scheduleNotificationAsync, cancelNotificationAsync } = useNotifications();
 * await scheduleNotificationAsync(content, trigger);
 * await cancelNotificationAsync(notificationId);
 */
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