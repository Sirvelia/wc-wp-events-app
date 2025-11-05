import { getEventByIdQueryOptions } from '@/query-options';
import { useSelectedEventStore } from '@/stores/selectedEventStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Represents data for a session in the user's schedule.
 * @interface SessionData
 * @property {number} sessionId - The unique identifier of the session
 * @property {string} [notificationId] - Optional identifier for the scheduled notification associated with this session
 */
interface SessionData {
  sessionId: number;
  notificationId?: string;
}

/**
 * Context type for managing the user's personalized event schedule.
 * @typedef {Object} MyScheduleContextType
 * @property {Object.<string, SessionData[]>} selectedSessions - Map of event IDs to their selected sessions
 * @property {Function} toggleSessionSelection - Adds or removes a session from the user's schedule
 * @property {Function} isSessionSelected - Checks if a session is in the user's schedule
 * @property {Function} getNotificationId - Retrieves the notification ID for a scheduled session
 * @property {Function} clearSelectedSessions - Removes all sessions for the current event from the schedule
 * @property {Error | null} error - The current error state, if any
 * @property {Function} clearError - Clears the current error state
 */
type MyScheduleContextType = {
  selectedSessions: { [eventId: string]: SessionData[] };
  toggleSessionSelection: (sessionId: number, notificationId?: string) => Promise<void>;
  isSessionSelected: (sessionId: number) => boolean;
  getNotificationId: (sessionId: number) => string | undefined;
  clearSelectedSessions: () => Promise<void>;
  error: Error | null;
  clearError: () => void;
};

/**
 * React context for managing user's personalized event schedule across different events.
 * Provides functionality for selecting sessions, managing notifications, and persisting schedule data.
 * @context MyScheduleContext
 */
const MyScheduleContext = createContext<MyScheduleContextType | undefined>(undefined);

/**
 * Provider component that manages the user's personalized event schedule.
 * Handles session selection, notification management, and persists data to AsyncStorage.
 * Automatically loads saved sessions on mount and provides schedule management functions to children.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the provider
 * @returns {JSX.Element} Provider component wrapping children with schedule context
 */
export function MyScheduleProvider({ children }: { children: React.ReactNode }) {
  const [selectedSessions, setSelectedSessions] = useState<{ [eventId: string]: SessionData[] }>({});
  const [error, setError] = useState<Error | null>(null);
  const { selectedEventID } = useSelectedEventStore();
  const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));

  /**
   * Clears the current error state.
   * @returns {void}
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load saved selected sessions on mount
  useEffect(() => {
    /**
     * Loads previously saved selected sessions from AsyncStorage on component mount.
     * Sets error state if loading fails.
     */
    const loadSavedSessions = async () => {
      try {
        const savedSessions = await AsyncStorage.getItem('selectedSessions');
        if (savedSessions) {
          setSelectedSessions(JSON.parse(savedSessions));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(new Error(`Failed to load saved sessions: ${errorMessage}`));
        console.error('Error loading saved sessions:', error);
      }
    };
    loadSavedSessions();
  }, []);

  /**
   * Toggles the selection state of a session in the user's schedule.
   * If the session is already selected, it will be removed. If not selected, it will be added.
   * Changes are persisted to AsyncStorage.
   * @param {number} sessionId - The ID of the session to toggle
   * @param {string} [notificationId] - Optional notification ID to associate with the session
   * @returns {Promise<void>} Promise that resolves when the operation completes
   */
  const toggleSessionSelection = useCallback(async (sessionId: number, notificationId?: string) => {
    if (!event) return;

    try {
      const eventId = event.id.toString();
      const eventSessions = selectedSessions[eventId] || [];
      let updatedEventSessions: SessionData[];

      if (eventSessions.some(session => session.sessionId === sessionId)) {
        // Remove session if already selected
        updatedEventSessions = eventSessions.filter(session => session.sessionId !== sessionId);
      } else {
        // Add session if not selected
        updatedEventSessions = [...eventSessions, { sessionId, notificationId }];
      }

      const updatedSessions = {
        ...selectedSessions,
        [eventId]: updatedEventSessions
      };

      await AsyncStorage.setItem('selectedSessions', JSON.stringify(updatedSessions));
      setSelectedSessions(updatedSessions);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(new Error(`Failed to update session selection: ${errorMessage}`));
      console.error('Error updating session selection:', error);
    }
  }, [selectedSessions, event]);

  /**
   * Checks if a specific session is currently selected in the user's schedule.
   * @param {number} sessionId - The ID of the session to check
   * @returns {boolean} True if the session is selected, false otherwise
   */
  const isSessionSelected = useCallback((sessionId: number) => {
    if (!event) return false;
    const eventId = event.id.toString();
    return selectedSessions[eventId]?.some(session => session.sessionId === sessionId) || false;
  }, [selectedSessions, event]);

  /**
   * Retrieves the notification ID associated with a selected session.
   * @param {number} sessionId - The ID of the session to look up
   * @returns {string | undefined} The notification ID if found, undefined otherwise
   */
  const getNotificationId = useCallback((sessionId: number) => {
    if (!event) return undefined;
    const eventId = event.id.toString();
    return selectedSessions[eventId]?.find(session => session.sessionId === sessionId)?.notificationId;
  }, [selectedSessions, event]);

  /**
   * Removes all selected sessions for the current event from the user's schedule.
   * Changes are persisted to AsyncStorage.
   * @returns {Promise<void>} Promise that resolves when all sessions are cleared
   */
  const clearSelectedSessions = useCallback(async () => {
    if (!event) return;

    try {
      const eventId = event.id.toString();
      const updatedSessions = { ...selectedSessions };
      delete updatedSessions[eventId];

      await AsyncStorage.setItem('selectedSessions', JSON.stringify(updatedSessions));
      setSelectedSessions(updatedSessions);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(new Error(`Failed to clear selected sessions: ${errorMessage}`));
      console.error('Error clearing selected sessions:', error);
    }
  }, [selectedSessions, event]);

  return (
    <MyScheduleContext.Provider value={{
      selectedSessions,
      toggleSessionSelection,
      isSessionSelected,
      getNotificationId,
      clearSelectedSessions,
      error,
      clearError
    }}>
      {children}
    </MyScheduleContext.Provider>
  );
}

/**
 * Custom hook to access the MySchedule context.
 * Must be used within a MyScheduleProvider.
 * @returns {MyScheduleContextType} The schedule context containing session management functions and state
 * @throws {Error} If used outside of MyScheduleProvider
 */
export function useMySchedule() {
  const context = useContext(MyScheduleContext);
  if (context === undefined) {
    throw new Error('useMySchedule must be used within a MyScheduleProvider');
  }
  return context;
} 