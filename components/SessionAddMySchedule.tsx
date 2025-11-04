import { useMySchedule } from "@/contexts/MyScheduleContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Session } from "@/types/Session";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { decode } from "html-entities";
import { DateTime } from "luxon";
import { Pressable, StyleSheet } from "react-native";

export default function SessionAddMySchedule( { session }: { session: Session } ) {
    const styles = StyleSheet.create({
        starButton: {
            padding: 5,
        }
    });

    const { isSessionSelected, toggleSessionSelection, getNotificationId } = useMySchedule();
    const primaryColor = useThemeColor({}, 'primary');
    const {scheduleNotificationAsync, cancelNotificationAsync} = useNotifications();

    const toggle = async () => {
        const isSelected = isSessionSelected(session.id);
        if (isSelected) {
            const notificationId = getNotificationId(session.id);
            if (notificationId) {
                await cancelNotificationAsync(notificationId);
            }
            await toggleSessionSelection(session.id);
        } else {
            const sessionTime = DateTime.fromSeconds(session.meta?._wcpt_session_time, { zone: 'utc' }).minus({ minutes: 10 });
            const now = DateTime.now();

            // Only schedule notification if the session is in the future
            if (sessionTime > now) {
                const notificationId = await scheduleNotificationAsync({
                    content: {
                        title: "Session reminder",
                        body: decode(session.title.rendered),
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: sessionTime.toMillis()
                    }
                });

                await toggleSessionSelection(session.id, notificationId);
            } else {
                // If session is in the past, just add to schedule without notification
                await toggleSessionSelection(session.id);
            }
        }
    };

    return (
        <Pressable 
            onPress={toggle}
            style={({ pressed }) => [
                styles.starButton,
                { opacity: pressed ? 0.7 : 1 }
            ]}
        >
            <Ionicons 
                name={isSessionSelected(session.id) ? "star" : "star-outline"} 
                size={24} 
                color={primaryColor}
            />
        </Pressable>
    );
}