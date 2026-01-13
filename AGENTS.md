# AGENTS.md - WC & WP Events App

This guide provides coding agents with essential information about this React Native/Expo project.

## Build, Lint, and Test Commands

### Development
```bash
npm start                    # Start Expo development server
npm run ios                  # Run on iOS simulator
npm run android              # Run on Android emulator
npm run web                  # Run on web browser
```

### Code Quality
```bash
npm run lint                 # Run ESLint on codebase
npx expo lint                # Alternative lint command
```

### Testing
**Note:** No test framework is currently configured in this project. Tests would need to be set up using Jest or similar.

## Project Architecture

### Tech Stack
- **React Native 0.81.5** with **React 19.1.0**
- **Expo SDK ~54.0** with Expo Router (file-based routing)
- **TypeScript 5.9** (strict mode enabled)
- **TanStack Query v5** for server state management
- **Zustand** for client state management
- **AsyncStorage** for persistence (offline-first)
- **i18n-js & react-i18next** for internationalization (en, es)
- **Luxon** for date/time handling
- **Axios** for HTTP requests

### Directory Structure
```
app/                    # Expo Router pages (file-based routing)
api/                    # API integration layer
components/             # Reusable UI components
  ui/                   # Themed base components
contexts/               # React Context providers
hooks/                  # Custom React hooks
i18n/                   # Internationalization files
stores/                 # Zustand state stores
types/                  # TypeScript type definitions
query-options/          # TanStack Query configurations
constants/              # App constants (Colors, etc.)
utils/                  # Utility functions
assets/                 # Static assets
```

## Code Style Guidelines

### File Naming Conventions
- **Components**: PascalCase (`SessionCard.tsx`, `ThemedView.tsx`)
- **Hooks**: camelCase with "use" prefix (`useSessions.ts`, `useThemeColor.ts`)
- **Types**: PascalCase singular (`Session.ts`, `Speaker.ts`, `Event.ts`)
- **Stores**: camelCase with "Store" suffix (`selectedEventStore.ts`)
- **Contexts**: PascalCase with "Context" suffix (`MyScheduleContext.tsx`)
- **Utils**: camelCase descriptive names (`dateFormat.ts`, `vcard.ts`)
- **Routes**: Follow Expo Router conventions (`_layout.tsx`, `index.tsx`, `[id]/index.tsx`)

### Import Organization
**CRITICAL**: Use the `@/` path alias for ALL internal imports. Never use relative paths (`../`, `./`).

```typescript
// 1. External libraries (React, React Native, third-party)
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { decode } from 'html-entities';

// 2. Internal imports using @/ alias (grouped by type)
// Query options
import { getEventSessionsQueryOptions } from "@/query-options";

// Stores
import { useSelectedEventStore } from "@/stores/selectedEventStore";

// Types
import { Session } from "@/types/Session";
import { Speaker } from "@/types/Speaker";

// Hooks
import { useSessions } from "@/hooks/useSessions";
import { useThemeColor } from "@/hooks/useThemeColor";

// Components (UI components first, then feature components)
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import SessionCard from "@/components/SessionCard";

// Utils
import { getDayName } from "@/utils/dateFormat";

// Constants
import { Colors } from "@/constants/Colors";

// Contexts
import { useMySchedule } from "@/contexts/MyScheduleContext";

// i18n
import "@/i18n";
import { useTranslation } from 'react-i18next';
```

### TypeScript Patterns
- Use `type` for domain models: `export type Session = {...}`
- Use `interface` for component props: `interface SessionCardProps {...}`
- Enable strict mode (already configured in tsconfig.json)
- Always type function parameters and return values
- Use optional properties with `?` when appropriate
- Mirror WordPress REST API structure for API types (nested objects like `title: { rendered: string }`)

```typescript
// Domain model
export type Session = {
    id: number;
    title: { rendered: string };
    meta: {
        _wcpt_session_time: number;
        _wcpt_session_duration: number;
    };
}

// Component props
interface SessionCardProps {
  session: Session;
  showDate?: boolean;
  showTracks?: boolean;
}
```

### Component Structure
```typescript
// 1. Imports (organized as shown above)

// 2. Interface/Type definitions
interface ComponentProps {
  prop1: Type;
  prop2?: OptionalType;
}

// 3. Component function (default export)
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 4. Hook calls at the top
  const { data, isLoading, error } = useQuery(...);
  const store = useStore();
  
  // 5. Derived state and memoized values
  const computedValue = useMemo(() => {...}, [deps]);
  
  // 6. Event handlers
  const handleClick = useCallback(() => {...}, [deps]);
  
  // 7. Early returns for loading/error states
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState />;
  
  // 8. Main render
  return (
    <ThemedView>
      {/* Component JSX */}
    </ThemedView>
  );
}

// 9. StyleSheet at the bottom
const styles = StyleSheet.create({
  container: {...},
});
```

### Error Handling
Use the three-tier error handling pattern:

```typescript
// 1. Loading state
if (isLoading || isPending) {
  return <LoadingState />;
}

// 2. Error state with message
if (error) {
  return <ErrorState error={error} message={t('session.error-loading')} />;
}

// 3. Empty state when no data
if (!data || data.length === 0) {
  return <EmptyState title={t('session.not-found')} icon="calendar-outline" />;
}

// 4. For async operations in contexts/handlers
try {
  // operation
  setError(null);
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  setError(new Error(`Failed: ${errorMessage}`));
  console.error('Error details:', error);
}
```

### State Management Patterns

#### Zustand Store Pattern
```typescript
export const useSelectedEventStore = create<StoreInterface>()(
  persist(
    (set) => ({
      // State
      selectedEventID: null,
      _hasHydrated: false,
      
      // Actions
      setSelectedEventID: (eventID: number | null) => set({ selectedEventID: eventID }),
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'storeName',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
)
```

#### TanStack Query Pattern
```typescript
// query-options/ - Centralized query configuration
export const getEventSessionsQueryOptions = (url: string) => {
  return queryOptions({
    queryKey: ['event', 'sessions', url],
    queryFn: () => getEventSessions(url),
    enabled: !!url,
  })
};

// hooks/ - Custom hook wrapping query
export const useSessions = () => {
  const { selectedEventID } = useSelectedEventStore();
  const { data: event } = useQuery(getEventByIdQueryOptions(selectedEventID as number));
  const { data: sessions, isLoading, error } = useQuery(
    getEventSessionsQueryOptions(event?.URL || '')
  );
  
  // Additional logic
  return { sessions, isLoading, error };
}
```

#### React Context Pattern
```typescript
// 1. Type definition
type ContextType = {
  state: StateType;
  action: (param: Type) => Promise<void>;
};

// 2. Create context
const Context = createContext<ContextType | undefined>(undefined);

// 3. Provider with AsyncStorage persistence
export function Provider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(...);
  
  useEffect(() => {
    // Load from AsyncStorage
    const load = async () => { /* ... */ };
    load();
  }, []);
  
  const action = useCallback(async (...) => {
    // Update and save to AsyncStorage
  }, [deps]);
  
  return <Context.Provider value={{ state, action }}>{children}</Context.Provider>;
}

// 4. Custom hook with error guard
export function useContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useContext must be used within Provider');
  }
  return context;
}
```

### Naming Conventions
- **Components**: PascalCase, descriptive nouns (`SessionCard`, `SpeakersList`)
- **Hooks**: camelCase with "use" prefix (`useSessions`, `useThemeColor`)
- **Functions**: camelCase, verb-first (`getSessionsByDate`, `formatDate`)
- **Variables**: camelCase (`selectedEvent`, `currentTime`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config objects
- **Types/Interfaces**: PascalCase (`Session`, `SessionCardProps`)

### JSDoc Documentation
Add comprehensive JSDoc comments to hooks, utility functions, and complex logic:

```typescript
/**
 * Custom hook to fetch and manage event sessions
 *
 * Provides comprehensive session management including filtering by date, speaker,
 * category, and tracking currently active sessions.
 *
 * @returns {Object} Sessions data, loading state, and utility functions
 * @returns {Session[]} sessions - Array of all sessions
 * @returns {boolean} isLoading - Loading state
 * @returns {Function} getSessionsByDate - Retrieve sessions for a specific date
 *
 * @example
 * const { sessions, getSessionsByDate } = useSessions();
 * const todaySessions = getSessionsByDate('2024-01-15');
 */
```

### Formatting and Style
- **Indentation**: 2 spaces (not tabs)
- **Quotes**: Single quotes for strings, double quotes in JSX
- **Semicolons**: Use consistently (configured in ESLint)
- **Line length**: Reasonable (no strict limit, but break long lines for readability)
- **Trailing commas**: Use in multi-line objects/arrays
- **Arrow functions**: Preferred for components and callbacks

### Internationalization
- Always use `useTranslation()` hook for user-facing text
- Never hardcode English strings in components
- Translation keys follow dot notation: `session.error-loading`, `speaker.not-found`
- Use `decode()` from `html-entities` for WordPress rendered content

```typescript
const { t } = useTranslation();
return <ThemedText>{t('session.title')}</ThemedText>;
```

### Theme Support
- Use themed components: `ThemedView`, `ThemedText`, `ThemedCard`
- Get theme colors with `useThemeColor()` hook
- Support automatic light/dark mode switching
- Colors defined in `constants/Colors.ts`

## Common Patterns

### Date/Time Handling
- Use Luxon for all date operations
- Convert UTC to local time using event's GMT offset
- Use `useTimeConverter()` hook for timezone conversions
- Format dates with user's locale via `formatDate()`

### HTML Content
- Always decode HTML entities with `html-entities` library
- Use `react-native-render-html` for rich HTML content rendering

### Navigation
- Use `router.push()` from `expo-router` for navigation
- Dynamic routes: `/session/[sessionId]`, `/speaker/[speakerId]`
- Use typed routes (enabled in app.json: `typedRoutes: true`)

### API Integration
- All API calls through TanStack Query
- Query options centralized in `query-options/`
- WordPress REST API endpoints with nested object structures
- Automatic caching with 24-hour stale time
- AsyncStorage persistence for offline support

## Key Principles

1. **Offline-first**: All state persists to AsyncStorage
2. **Type safety**: Strict TypeScript, no `any` types
3. **Separation of concerns**: API → Query options → Hooks → Components
4. **Absolute imports**: Always use `@/` alias, never relative paths
5. **Consistent structure**: Follow established file organization patterns
6. **Theme support**: Use themed components throughout
7. **Internationalization**: All user-facing text must be translatable
8. **Documentation**: Add JSDoc comments to hooks and utilities
9. **Error handling**: Always handle loading, error, and empty states
10. **Performance**: Use `useMemo` and `useCallback` appropriately

## Notes for Agents

- **No tests currently exist** - test setup would be needed for TDD
- **Expo Router** uses file-based routing - file structure defines routes
- **New Arch enabled** (`newArchEnabled: true` in app.json)
- **Supported locales**: English (en), Spanish (es)
- **Bundle ID**: `com.sirvelia.wcwpeventsapp`
- **Version**: 1.8.1
