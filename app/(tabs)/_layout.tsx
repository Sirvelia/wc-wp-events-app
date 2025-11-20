import Header from '@/components/Header';
import { useSelectedEventStore } from '@/stores/selectedEventStore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Redirect, Tabs, usePathname, useRootNavigationState } from 'expo-router';
import { useEffect, useState } from 'react';

import "@/i18n";
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const { selectedEventID, _hasHydrated } = useSelectedEventStore();
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const rootNavigationState = useRootNavigationState();

  const [needsRedirect, setNeedsRedirect] = useState(false);

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (!_hasHydrated) return; // Wait for store to hydrate before checking

    // Redirect if no event is selected (not just if query returns no data)
    if (selectedEventID === null && pathname !== '/event-selection') {
      setNeedsRedirect(true);
    }
  }, [selectedEventID, pathname, rootNavigationState, _hasHydrated]);

  // Show nothing while store is hydrating
  if (!_hasHydrated) return null;

  if (needsRedirect) return <Redirect href="/event-selection" />;

  return (
    <Tabs screenOptions={{
      header: () => <Header />,
    }}>
      <Tabs.Screen name="index" options={{
        tabBarLabel: t('tabs.home'),
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="home" color={color} size={size} />
        ),
      }} />
      <Tabs.Screen name="program" options={{
        tabBarLabel: t('tabs.program'),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="calendar-clear" color={color} size={size} />
        ),
      }} />
      <Tabs.Screen name="speakers" options={{
        tabBarLabel: t('tabs.speakers'),
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="people" color={color} size={size} />
        ),
      }} />
      <Tabs.Screen name="sponsors" options={{
        tabBarLabel: t('tabs.sponsors'),
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="table-restaurant" color={color} size={size} />
        ),
      }} />
      <Tabs.Screen name="connect" options={{
        tabBarLabel: t('tabs.connect'),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="git-compare-outline" color={color} size={size} />
        ),
      }} />
      <Tabs.Screen name="event-selection" options={{
        href: null,
      }} />
    </Tabs>
  );
}