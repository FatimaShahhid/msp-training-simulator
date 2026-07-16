import { Link } from 'react-router-dom';
import { Inbox, UserCheck, UserX, AlertTriangle, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageHeader, Card, CardHeader, StatCard } from '../components/ui';
import { StatusBadge, PriorityBadge } from '../components/Badges';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function Dashboard() {
  const { tickets, currentUser, companies } = useApp();

  const open = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');
  const myTickets = tickets.filter((t) => t.assignedResource === currentUser.name && (t.status === 'Open' || t.status === 'In Progress'));
  const unassigned = tickets.filter((t) => !t.assignedResource && (t.status === 'Open' || t.status === 'In Progress'));
  const overdue = tickets.filter((t) => {
    const due = new Date(t.dueDate).getTime();
    return due < Date.now() && t.status !== 'Closed' && t.status !== 'Resolved';
  });
  const recent = [...tickets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 8);

  // Priority breakdown
  const priorityBreakdown = ['Critical', 'High', 'Medium', 'Low'].map((p) => ({
    priority: p as 'Critical' | 'High' | 'Medium' | 'Low',
    count: open.filter((t) => t.priority === p).length,
  }));
  const maxPriority = Math.max(...priorityBreakdown.map((p) => p.count), 1);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${currentUser.name.split(' ')[0]}. Here is your service board overview.`} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Open Tickets" value={open.length} icon={Inbox} color="bg-sky-500" to="/" />
        <StatCard label="My Tickets" value={myTickets.length} icon={UserCheck} color="bg-blue-600" to="/?filter=mine" />
        <StatCard label="Unassigned" value={unassigned.length} icon={UserX} color="bg-amber-500" to="/?filter=unassigned" />
        <StatCard label="Overdue" value={overdue.length} icon={AlertTriangle} color="bg-red-500" to="/?filter=overdue" />
        <StatCard label="Recently Updated" value={recent.length} icon={Clock} color="bg-emerald-500" to="/" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Tickets */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recently Updated Tickets"
            subtitle="Latest activity across the service board"
            actions={
              <Link to="/" className="flex items-center gap-1 text-xs font-medium text-sky-600 hover:underline dark:text-sky-400">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-5 py-2.5 font-medium">Ticket</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Priority</th>
                  <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Company</th>
                  <th className="hidden px-3 py-2.5 font-medium lg:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((t) => {
                  const company = companies.find((c) => c.id === t.companyId);
                  return (
                    <tr key={t.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                      <td className="px-5 py-3">
                        <Link to={`/tickets/${t.id}`} className="font-medium text-sky-600 hover:underline dark:text-sky-400">
                          #{t.ticketNumber}
                        </Link>
                        <p className="max-w-[200px] truncate text-xs text-gray-500 dark:text-gray-400">{t.summary}</p>
                      </td>
                      <td className="px-3 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-3 py-3"><PriorityBadge priority={t.priority} /></td>
                      <td className="hidden px-3 py-3 text-xs text-gray-600 dark:text-gray-400 sm:table-cell">{company?.name}</td>
                      <td className="hidden px-3 py-3 text-xs text-gray-400 dark:text-gray-500 lg:table-cell">{timeAgo(t.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader title="Priority Breakdown" subtitle="Open tickets by priority" />
          <div className="space-y-4 p-5">
            {priorityBreakdown.map((p) => (
              <div key={p.priority}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <PriorityBadge priority={p.priority} />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{p.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      p.priority === 'Critical' ? 'bg-red-500' : p.priority === 'High' ? 'bg-orange-500' : p.priority === 'Medium' ? 'bg-sky-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${(p.count / maxPriority) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 px-5 py-3 dark:border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <TrendingUp className="h-4 w-4" />
              <span>{open.length} active tickets across {companies.length} companies</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
