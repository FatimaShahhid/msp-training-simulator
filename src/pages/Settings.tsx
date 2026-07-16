import { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Bell, Shield } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageHeader, Card, CardHeader } from '../components/ui';

export default function Settings() {
  const { theme, toggleTheme, currentUser, notifications } = useApp();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [slaAlerts, setSlaAlerts] = useState(true);

  const toggleClass = (on: boolean) =>
    `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-700'}`;

  const knobClass = (on: boolean) =>
    `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your training environment preferences" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card>
          <CardHeader title="Profile" subtitle="Your technician profile" />
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xl font-bold text-white">
                {currentUser.avatar}
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{currentUser.name}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">{currentUser.role}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader title="Appearance" subtitle="Theme and display settings" />
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="h-5 w-5 text-gray-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Currently using {theme} mode</p>
                </div>
              </div>
              <button onClick={toggleTheme} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader title="Notifications" subtitle="Alert and notification preferences" />
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">In-app notifications for ticket updates</p>
                </div>
              </div>
              <button onClick={() => setNotifEnabled(!notifEnabled)} className={toggleClass(notifEnabled)}>
                <span className={knobClass(notifEnabled)} />
              </button>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Alerts</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Send ticket updates to your email</p>
                </div>
              </div>
              <button onClick={() => setEmailAlerts(!emailAlerts)} className={toggleClass(emailAlerts)}>
                <span className={knobClass(emailAlerts)} />
              </button>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">SLA Alerts</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Warn when tickets approach SLA breach</p>
                </div>
              </div>
              <button onClick={() => setSlaAlerts(!slaAlerts)} className={toggleClass(slaAlerts)}>
                <span className={knobClass(slaAlerts)} />
              </button>
            </div>
          </div>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader title="System Information" subtitle="Training environment details" />
          <div className="space-y-3 p-5 text-sm">
            <div className="flex justify-between"><span className="text-gray-400 dark:text-gray-500">Environment</span><span className="font-medium text-gray-700 dark:text-gray-300">Training Simulator</span></div>
            <div className="flex justify-between"><span className="text-gray-400 dark:text-gray-500">Version</span><span className="font-medium text-gray-700 dark:text-gray-300">1.0.0</span></div>
            <div className="flex justify-between"><span className="text-gray-400 dark:text-gray-500">Notifications</span><span className="font-medium text-gray-700 dark:text-gray-300">{notifications.length} total</span></div>
            <div className="flex justify-between"><span className="text-gray-400 dark:text-gray-500">Unread</span><span className="font-medium text-gray-700 dark:text-gray-300">{notifications.filter((n) => !n.read).length}</span></div>
          </div>
        </Card>
      </div>

      {/* About */}
      <Card className="mt-6 p-5">
        <div className="flex items-start gap-3">
          <SettingsIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">About HelpDesk Pro</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              This is a training simulator designed for Level 1 IT Support technicians. It mimics enterprise PSA software
              used by MSPs. All data is sample data - no real tickets, contacts, or devices are tracked. Use this
              environment to practice ticket triage, navigation, and help desk workflows.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
