import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Store interface for managing the selected event.
 * This store persists the currently selected event ID across app sessions.
 */
interface SelectedEventStore {
    /** The ID of the currently selected event, or null if no event is selected */
    selectedEventID: number | null;

    /** Updates the selected event ID */
    setSelectedEventID: (eventID: number | null) => void;

    /** Internal flag indicating whether the store has been rehydrated from storage */
    _hasHydrated: boolean;

    /** Sets the hydration state flag */
    setHasHydrated: (state: boolean) => void;
}

/**
 * Zustand store for managing the currently selected event.
 *
 * This store persists the selected event ID to AsyncStorage and rehydrates it on app launch.
 * It also tracks the hydration state to ensure data is loaded before being accessed.
 *
 * @example
 * ```tsx
 * const { selectedEventID, setSelectedEventID, _hasHydrated } = useSelectedEventStore();
 *
 * // Set the selected event
 * setSelectedEventID(123);
 *
 * // Clear the selection
 * setSelectedEventID(null);
 *
 * // Check if hydration is complete
 * if (_hasHydrated) {
 *   console.log('Current selection:', selectedEventID);
 * }
 * ```
 */
export const useSelectedEventStore = create<SelectedEventStore>()(
    persist(
        (set) => ({
            selectedEventID: null,
            setSelectedEventID: (eventID: number | null) => set({ selectedEventID: eventID }),
            _hasHydrated: false,
            setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
        }),
        {
            name: 'selectedEvent',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
)