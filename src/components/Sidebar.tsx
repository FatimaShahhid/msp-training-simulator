import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  Users,
  ServerCog,
  Activity,
  BarChart3,
  Settings,
  Headset,
  X,
} from 'lucide-react';
import { useApp } from '../store/AppContext';

const navItems = [
  { label: 'Service Board', path: '/', icon: ClipboardList },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Companies', path: '/companies', icon: Building2 },
  { label: 'Contacts', path: '/contacts', icon: Users },
  { label: 'Configurations', path: '/configurations', icon: ServerCog },
  { label: 'Activities', path: '/activities', icon: Activity },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const { tickets } = useApp();
  const openCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-5 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
            <Headset className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">HelpDesk Pro</span>
            <span className="block text-[10px] font-medium text-gray-400 dark:text-gray-500">MSP Training Simulator</span>
          </div>
          <button onClick={onClose} className="ml-auto rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                <span>{item.label}</span>
                {item.label === 'Service Board' && openCount > 0 && (
                  <span className="ml-auto rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                    {openCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-800">
          <p className="text-[10px] text-gray-400 dark:text-gray-600">v1.0 - Training Environment</p>
        </div>
      </aside>
    </>
  );
}
