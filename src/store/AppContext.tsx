import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { sampleData, currentUser } from '../data/sampleData';
import type { Ticket, Notification, Company, Contact, Device, TimeEntry, Activity, Site, BoardType } from '../types';

type Theme = 'dark' | 'light';

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
  tickets: Ticket[];
  setTickets: (t: Ticket[]) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  companies: Company[];
  sites: Site[];
  contacts: Contact[];
  devices: Device[];
  boards: BoardType[];
  technicians: string[];
  timeEntries: TimeEntry[];
  activities: Activity[];
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  currentUser: typeof currentUser;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [tickets, setTickets] = useState<Ticket[]>(sampleData.tickets);
  const [notifications, setNotifications] = useState<Notification[]>(sampleData.notifications);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        tickets,
        setTickets,
        updateTicket,
        companies: sampleData.companies,
        sites: sampleData.sites,
        contacts: sampleData.contacts,
        boards: sampleData.boards,
        technicians: sampleData.technicians,
        devices: sampleData.devices,
        timeEntries: sampleData.timeEntries,
        activities: sampleData.activities,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        currentUser,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
