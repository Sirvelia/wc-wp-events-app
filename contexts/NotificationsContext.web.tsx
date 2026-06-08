import { createContext, FC, PropsWithChildren } from "react";

interface NotificationsContextType {
    scheduleNotificationAsync: (request: unknown) => Promise<string>;
    cancelNotificationAsync: (identifier: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {
    const scheduleNotificationAsync = async (_request: unknown): Promise<string> => {
        return 'web-not-supported';
    };

    const cancelNotificationAsync = async (_identifier: string): Promise<void> => {};

    return (
        <NotificationsContext.Provider value={{ scheduleNotificationAsync, cancelNotificationAsync }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export { NotificationsContext, NotificationsProvider };
