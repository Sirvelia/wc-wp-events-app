# WC & WP Events App

A cross-platform mobile application built with React Native and Expo for discovering and managing WordCamp and WooCommerce events. Browse upcoming events, view session schedules, explore speakers and sponsors, and create your personal event schedule.

## Features

- **Event Discovery**: Browse upcoming WordCamp events from around the world
- **Event Details**: View comprehensive event information including location, dates, and timezone
- **Session Program**: Browse all sessions organized by tracks and categories
- **Speaker Profiles**: Explore speaker bios, sessions, and contact information
- **Sponsor Directory**: View event sponsors and their details
- **Personal Schedule**: Create and manage your personalized event schedule
- **Push Notifications**: Receive notifications for your scheduled sessions
- **Multi-language Support**: Available in English and Spanish
- **Cross-platform**: Runs on iOS, Android, and Web
- **Offline Support**: Cached data for offline access
- **Dark Mode**: Automatic theme switching based on system preferences

## Tech Stack

### Core
- **React Native** 0.81.4
- **Expo SDK** ~54.0.1
- **TypeScript** ~5.9.2
- **Expo Router** ~6.0.8 (File-based routing)

### State Management & Data Fetching
- **TanStack Query** ^5.90.1 (Data fetching and caching)
- **Zustand** ^5.0.8 (Global state management)
- **AsyncStorage** 2.2.0 (Persistent storage)

### UI & Navigation
- **React Navigation** ^7.1.6
- **Expo Symbols** ~1.0.7
- **React Native Gesture Handler** ~2.28.0
- **React Native Reanimated** ~4.1.0

### Internationalization
- **i18n-js** ^4.5.1
- **react-i18next** ^16.1.6
- **expo-localization** ~17.0.7

### Additional Libraries
- **axios** ^1.12.2 (HTTP client)
- **luxon** ^3.6.1 (Date/time handling)
- **react-native-render-html** ^6.3.4 (HTML content rendering)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Expo CLI
- For iOS development: macOS with Xcode
- For Android development: Android Studio

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wc-wp-events-app
```

2. Install dependencies:
```bash
npm install
```

## Development

### Start the development server:
```bash
npm start
# or
npx expo start
```

### Run on specific platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Linting:
```bash
npm run lint
```

## Project Structure

```
wc-wp-events-app/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── event-selection.tsx  # Event selection screen
│   │   ├── program.tsx          # Event program/schedule
│   │   ├── speakers.tsx         # Speakers list
│   │   └── sponsors.tsx         # Sponsors list
│   ├── session/[sessionId]/     # Session detail screen
│   ├── speaker/[speakerId]/     # Speaker detail screen
│   ├── sponsor/[sponsorId]/     # Sponsor detail screen
│   └── _layout.tsx              # Root layout
├── api/                          # API integration
│   └── index.ts                 # WordPress REST API client
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   │   ├── ThemedCard.tsx
│   │   ├── ThemedText.tsx
│   │   ├── ThemedView.tsx
│   │   └── ThemedRenderHTML.tsx
│   ├── CurrentSessions.tsx
│   ├── EventDetails.tsx
│   ├── MySchedule.tsx
│   ├── SessionCard.tsx
│   ├── SessionProgram.tsx
│   ├── SpeakerCard.tsx
│   ├── SpeakersList.tsx
│   ├── SponsorCard.tsx
│   └── SponsorsList.tsx
├── contexts/                     # React contexts
│   ├── MyScheduleContext.tsx
│   └── NotificationsContext.tsx
├── hooks/                        # Custom React hooks
│   ├── useColorScheme.ts
│   ├── useNotifications.ts
│   ├── useSessions.ts
│   ├── useSpeakers.ts
│   ├── useSponsors.ts
│   ├── useThemeColor.ts
│   └── useTimeConverter.ts
├── i18n/                         # Internationalization
│   ├── locales/
│   │   ├── en/translation.json
│   │   └── es/translation.json
│   └── index.ts
├── stores/                       # Zustand stores
│   └── selectedEventStore.ts
├── types/                        # TypeScript type definitions
│   ├── Event.ts
│   ├── Session.ts
│   ├── Speaker.ts
│   ├── Sponsor.ts
│   └── Media.ts
├── utils/                        # Utility functions
│   └── dateFormat.ts
├── query-options/                # TanStack Query configurations
│   └── index.ts
├── constants/                    # App constants
│   └── Colors.ts
└── assets/                       # Static assets
    ├── images/
    └── fonts/
```

## API Integration

The app integrates with WordPress REST API endpoints:

- **WordCamp Central API**: `https://central.wordcamp.org/wp-json/wp/v2/`
  - Fetches list of upcoming WordCamp events
  - Event filtering by date range (1 week ago to 1 month in the future)

- **Individual Event APIs**: `{event-url}/wp-json/wp/v2/`
  - Sessions: `/sessions`
  - Speakers: `/speakers`
  - Sponsors: `/sponsors`
  - Categories: `/session_category`
  - Tracks: `/session_track`
  - Media: `/media/{id}`

All API calls are managed through TanStack Query with automatic caching and persistence using AsyncStorage.

## Key Features Explained

### Event Selection
Users can browse and select from a list of upcoming WordCamp events. Events are automatically filtered to show only relevant events (from 1 week ago to 1 month in the future).

### Session Management
- View all sessions for selected events
- Filter by categories and tracks
- Add sessions to personal schedule
- Receive notifications before sessions start

### Offline Support
The app uses TanStack Query with AsyncStorage persister to cache API responses, enabling offline access to previously loaded content.

### Internationalization
Supports English and Spanish languages with automatic detection based on device settings. Translation files are located in `i18n/locales/`.

### Theme Support
Automatic dark/light mode switching based on system preferences. Theme colors are defined in `constants/Colors.ts`.

## Building for Production

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## App Configuration

Configuration is managed in `app.json`:
- **Bundle Identifiers**:
  - iOS: `com.sirvelia.wcwpeventsapp`
  - Android: `com.sirvelia.wcwpeventsapp`
- **Version**: 1.7.1
- **Android Version Code**: 1701
- **Supported Locales**: English (en), Spanish (es)
- **URL Scheme**: `wcwpeventsapp://`

## Environment

- **iOS Deployment Target**: 15.1+
- **Android SDK**:
  - Build Tools: 35.0.0
  - Compile SDK: 35
  - Target SDK: 35

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © Sirvelia. All rights reserved.

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

Built with ❤️ by Sirvelia
