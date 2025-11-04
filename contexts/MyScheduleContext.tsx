import { getEventByIdQueryOptions } from '@/query-options';
import { useSelectedEventStore } from '@/stores/selectedEventStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface SessionData {
  sessionId: number;
  notificationId?: string;
}

type MyScheduleContextType = {
  selectedSessions: { [eventId: string]: SessionData[] };
  toggleSessionSelection: (sessionId: number, notificationId?: string) => Promise<void>;
  isSessionSelected: (sessionId: number) => boolean;
  getNotificationId: (sessionId: number) => string | undefined;
  clearSelectedSessions: () => Promise<void>;
  error: Error | null;
  clearError: () => void;
};

const MyScheduleContext = createContext<MyScheduleContextType | undefined>(undefined);

export function MyScheduleProvider({ children }: { children: React.ReactNode }) {
  const [selectedSessions, setSelectedSessions] = useState<{ [eventId: string]: SessionData[] }>({});
  const [error, setError] = useState<Error | null>(null);
  const { selectedEventID } = useSelectedEventStore();
  const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load saved selected sessions on mount
  useEffect(() => {
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

  const isSessionSelected = useCallback((sessionId: number) => {
    if (!event) return false;
    const eventId = event.id.toString();
    return selectedSessions[eventId]?.some(session => session.sessionId === sessionId) || false;
  }, [selectedSessions, event]);

  const getNotificationId = useCallback((sessionId: number) => {
    if (!event) return undefined;
    const eventId = event.id.toString();
    return selectedSessions[eventId]?.find(session => session.sessionId === sessionId)?.notificationId;
  }, [selectedSessions, event]);

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

export function useMySchedule() {
  const context = useContext(MyScheduleContext);
  if (context === undefined) {
    throw new Error('useMySchedule must be used within a MyScheduleProvider');
  }
  return context;
} 