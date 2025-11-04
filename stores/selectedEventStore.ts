import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SelectedEventStore {
    selectedEventID: number | null;
    setSelectedEventID: (eventID: number | null) => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

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