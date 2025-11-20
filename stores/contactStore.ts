import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Contact details interface for user's personal information.
 */
export interface ContactDetails {
    /** Full name (required) */
    fullName: string;
    /** Email address (required) */
    email: string;
    /** Company name (optional) */
    company: string;
    /** Personal website/portfolio URL (optional) */
    websiteUrl: string;
    /** Phone number (optional) */
    phone: string;
}

/**
 * Store interface for managing user contact details.
 * This store persists contact information locally on the device.
 */
interface ContactStore {
    /** User's contact details */
    contactDetails: ContactDetails | null;

    /** Updates the contact details */
    setContactDetails: (details: ContactDetails | null) => void;

    /** Internal flag indicating whether the store has been rehydrated from storage */
    _hasHydrated: boolean;

    /** Sets the hydration state flag */
    setHasHydrated: (state: boolean) => void;
}

/**
 * Zustand store for managing user contact details.
 *
 * This store persists contact details to AsyncStorage and rehydrates it on app launch.
 * It also tracks the hydration state to ensure data is loaded before being accessed.
 *
 * @example
 * ```tsx
 * const { contactDetails, setContactDetails, _hasHydrated } = useContactStore();
 *
 * // Set contact details
 * setContactDetails({
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   company: 'Tech Corp',
 *   websiteUrl: '',
 *   phone: ''
 * });
 *
 * // Clear contact details
 * setContactDetails(null);
 *
 * // Check if hydration is complete
 * if (_hasHydrated) {
 *   console.log('Current contact:', contactDetails);
 * }
 * ```
 */
export const useContactStore = create<ContactStore>()(
    persist(
        (set) => ({
            contactDetails: null,
            setContactDetails: (details: ContactDetails | null) => set({ contactDetails: details }),
            _hasHydrated: false,
            setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
        }),
        {
            name: 'contactDetails',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
)

