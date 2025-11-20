import { MyScheduleProvider } from '@/contexts/MyScheduleContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SessionHeaderTitle } from './session/[sessionId]';
import { CategoryHeaderTitle } from './sessions/category/[categoryId]';
import { SpeakerHeaderTitle } from './speaker/[speakerId]';
import { SponsorHeaderTitle } from './sponsor/[sponsorId]';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import {
  QueryClient
} from '@tanstack/react-query';

import "@/i18n";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

function AppContent() {
  const colorScheme = useColorScheme();
  const { t, i18n } = useTranslation();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{
            headerShown: false,
            headerBackTitle: t('common.back'),
          }}
        />

        <Stack.Screen 
          name="session/[sessionId]/index" 
          options={{
            headerShown: true,
            headerTitle: () => <SessionHeaderTitle />,
            headerBackTitle: t('common.back'),
          }}
        />

        <Stack.Screen 
          name="speaker/[speakerId]/index" 
          options={{
            headerShown: true,
            headerTitle: () => <SpeakerHeaderTitle />,
            headerBackTitle: t('common.back'),
          }}
        />

        <Stack.Screen 
          name="sponsor/[sponsorId]/index" 
          options={{
            headerShown: true,
            headerTitle: () => <SponsorHeaderTitle />,
            headerBackTitle: t('common.back'),
          }}
        />

        <Stack.Screen 
          name="sessions/category/[categoryId]/index" 
          options={{
            headerShown: true,
            headerTitle: () => <CategoryHeaderTitle />,
            headerBackTitle: t('common.back'),
          }}
        />

        <Stack.Screen 
          name="connect/edit" 
          options={{
            headerShown: true,
            headerTitle: t('connect.edit-profile'),
            headerBackTitle: t('common.back'),
          }}
        />

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function Layout() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <MyScheduleProvider>
        <NotificationsProvider>
          <AppContent />
        </NotificationsProvider>
      </MyScheduleProvider>
      {Platform.OS === 'web' && <ReactQueryDevtools initialIsOpen={false} />}

    </PersistQueryClientProvider>
  );
}