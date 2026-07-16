import { useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageHeader, Card, CardHeader } from '../components/ui';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import type { TicketStatus, TicketPriority } from '../types';

export default function Reports() {
  const { tickets, companies, timeEntries, contacts, devices } = useApp();

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');
    const closed = tickets.filter((t) => t.status === 'Closed');
    const resolved = tickets.filter((t) => t.status === 'Resolved');
    const overdue = tickets.filter((t) => new Date(t.dueDate).getTime() < Date.now() && t.status !== 'Closed' && t.status !== 'Resolved');
    const totalHours = timeEntries.reduce((sum, te) => sum + te.hours, 0);

    const byStatus: Record<TicketStatus, number> = { Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0 };
    tickets.forEach((t) => { byStatus[t.status]++; });

    const byPriority: Record<TicketPriority, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    tickets.forEach((t) => { byPriority[t.priority]++; });

    const byCompany = companies.map((c) => ({
      name: c.name,
      total: tickets.filter((t) => t.companyId === c.id).length,
      open: tickets.filter((t) => t.companyId === c.id && (t.status === 'Open' || t.status === 'In Progress')).length,
    }));

    return { open: open.length, closed: closed.length, resolved: resolved.length, overdue: overdue.length, totalHours, byStatus, byPriority, byCompany };
  }, [tickets, companies, timeEntries]);

  const maxStatus = Math.max(...Object.values(stats.byStatus), 1);
  const maxPriority = Math.max(...Object.values(stats.byPriority), 1);
  const maxCompany = Math.max(...stats.byCompany.map((c) => c.total), 1);

  const statCards = [
    { label: 'Total Tickets', value: tickets.length, icon: BarChart3, color: 'bg-sky-500' },
    { label: 'Open / In Progress', value: stats.open, icon: Clock, color: 'bg-amber-500' },
    { label: 'Resolved + Closed', value: stats.resolved + stats.closed, icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Total Billable Hours', value: stats.totalHours.toFixed(1), icon: TrendingUp, color: 'bg-blue-600' },
    { label: 'Contacts', value: contacts.length, icon: Users, color: 'bg-indigo-500' },
  ];

  return (
    <div>
      <PageHeader title="Reports" subtitle="Service board analytics and performance metrics" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((s) => (
          <Card key={s.label} className="p-4">
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* By Status */}
        <Card>
          <CardHeader title="Tickets by Status" />
          <div className="space-y-3 p-5">
            {(Object.keys(stats.byStatus) as TicketStatus[]).map((s) => (
              <div key={s}>
                <div className="mb-1.5 flex items-center justify-between">
                  <StatusBadge status={s} />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stats.byStatus[s]}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${(stats.byStatus[s] / maxStatus) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* By Priority */}
        <Card>
          <CardHeader title="Tickets by Priority" />
          <div className="space-y-3 p-5">
            {(Object.keys(stats.byPriority) as TicketPriority[]).map((p) => (
              <div key={p}>
                <div className="mb-1.5 flex items-center justify-between">
                  <PriorityBadge priority={p} />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stats.byPriority[p]}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className={`h-full rounded-full transition-all ${p === 'Critical' ? 'bg-red-500' : p === 'High' ? 'bg-orange-500' : p === 'Medium' ? 'bg-sky-500' : 'bg-gray-400'}`} style={{ width: `${(stats.byPriority[p] / maxPriority) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* By Company */}
      <Card className="mt-6">
        <CardHeader title="Tickets by Company" subtitle="Distribution across client accounts" />
        <div className="space-y-4 p-5">
          {stats.byCompany.map((c) => (
            <div key={c.name}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.name}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-amber-500">{c.open} open</span>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">{c.total} total</span>
                </div>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all" style={{ width: `${(c.total / maxCompany) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary footer */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{devices.length}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Total Devices</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{companies.length}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Companies</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{contacts.length}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Contacts</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{(stats.totalHours / Math.max(stats.closed + stats.resolved, 1)).toFixed(1)}h</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Avg Hours / Resolved</p>
        </Card>
      </div>
    </div>
  );
}
