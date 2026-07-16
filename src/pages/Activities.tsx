import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity as ActivityIcon, Plus, ArrowRightCircle, RefreshCw, StickyNote, XCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageHeader, Card, EmptyState } from '../components/ui';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const activityIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  Created: { icon: Plus, color: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400' },
  Updated: { icon: RefreshCw, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
  Assigned: { icon: ArrowRightCircle, color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' },
  'Status Changed': { icon: RefreshCw, color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
  'Note Added': { icon: StickyNote, color: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-400' },
  Closed: { icon: XCircle, color: 'bg-gray-100 text-gray-500 dark:bg-gray-700/40 dark:text-gray-500' },
  Escalated: { icon: AlertTriangle, color: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' },
};

export default function Activities() {
  const { activities, tickets } = useApp();

  const sorted = useMemo(() => [...activities].sort((a, b) => b.date.localeCompare(a.date)), [activities]);

  return (
    <div>
      <PageHeader title="Activities" subtitle={`${activities.length} system activities across all tickets`} />

      <Card>
        {sorted.length === 0 ? (
          <EmptyState icon={ActivityIcon} title="No activities" subtitle="Activities will appear here as tickets are updated" />
        ) : (
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
            {sorted.map((a, i) => {
              const ticket = tickets.find((t) => t.id === a.ticketId);
              const config = activityIcons[a.type] ?? activityIcons['Updated'];
              const Icon = config.icon;
              return (
                <div key={a.id} className="flex gap-3 px-5 py-3.5">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {i < sorted.length - 1 && <div className="mt-1 w-px flex-1 bg-gray-200 dark:bg-gray-800" />}
                  </div>
                  <div className="min-w-0 flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">{a.type}</span>
                      {ticket && (
                        <Link to={`/tickets/${ticket.id}`} className="text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400">
                          #{ticket.ticketNumber}
                        </Link>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{a.description}</p>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-600">{a.user} - {formatDate(a.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
