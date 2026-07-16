import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, ChevronDown, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme, notifications, markAllNotificationsRead, currentUser, tickets, companies, contacts, searchQuery, setSearchQuery } = useApp();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{ type: string; label: string; sub: string; path: string }[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results: { type: string; label: string; sub: string; path: string }[] = [];

    tickets.forEach((t) => {
      if (t.summary.toLowerCase().includes(q) || t.ticketNumber.includes(q)) {
        results.push({ type: 'Ticket', label: `#${t.ticketNumber} - ${t.summary}`, sub: 'Ticket', path: `/tickets/${t.id}` });
      }
    });
    companies.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        results.push({ type: 'Company', label: c.name, sub: 'Company', path: `/companies/${c.id}` });
      }
    });
    contacts.forEach((c) => {
      const name = `${c.firstName} ${c.lastName}`;
      if (name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) {
        results.push({ type: 'Contact', label: name, sub: 'Contact', path: `/contacts/${c.id}` });
      }
    });
    setSearchResults(results.slice(0, 8));
  }, [searchQuery, tickets, companies, contacts]);

  const handleResultClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
      <button onClick={onMenuClick} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          placeholder="Search tickets, companies, contacts..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
        {searchFocused && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => handleResultClick(r.path)}
                className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-700/50 last:border-0"
              >
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">{r.sub}</span>
                <span className="truncate text-gray-700 dark:text-gray-300">{r.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700/50">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
                <button onClick={markAllNotificationsRead} className="text-xs font-medium text-sky-600 hover:underline dark:text-sky-400">
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-700/50 ${!n.read ? 'bg-sky-50/50 dark:bg-sky-500/5' : ''}`}
                  >
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.type === 'alert' ? 'bg-red-500' : n.type === 'system' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">{n.description}</p>
                      <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-600">{new Date(n.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white">
              {currentUser.avatar}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-gray-900 dark:text-white">{currentUser.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{currentUser.role}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700/50">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{currentUser.email}</p>
              </div>
              <div className="py-1">
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                  <User className="h-4 w-4" /> My Profile
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  <SettingsIcon className="h-4 w-4" /> Settings
                </button>
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
