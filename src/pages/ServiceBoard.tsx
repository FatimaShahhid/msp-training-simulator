import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Inbox, Search, Filter, X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageHeader, Card, EmptyState } from '../components/ui';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import type { BoardType } from '../types';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function slaStatus(slaDueAt: string, status: string): { label: string; color: string } {
  if (status === 'Closed' || status === 'Resolved') return { label: 'Met', color: 'text-emerald-600 dark:text-emerald-400' };
  const diff = new Date(slaDueAt).getTime() - Date.now();
  if (diff < 0) return { label: 'Breached', color: 'text-red-600 dark:text-red-400' };
  if (diff < 3600000 * 4) return { label: 'At Risk', color: 'text-amber-600 dark:text-amber-400' };
  return { label: 'On Track', color: 'text-sky-600 dark:text-sky-400' };
}

export default function ServiceBoard() {
  const { tickets, companies, contacts, currentUser, technicians, boards } = useApp();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [engineerFilter, setEngineerFilter] = useState<string>('all');
  const [boardFilter, setBoardFilter] = useState<string>('all');

  const activeFilters = [
    { label: 'Status', value: statusFilter, set: setStatusFilter },
    { label: 'Priority', value: priorityFilter, set: setPriorityFilter },
    { label: 'Company', value: companyFilter, set: setCompanyFilter },
    { label: 'Engineer', value: engineerFilter, set: setEngineerFilter },
    { label: 'Board', value: boardFilter, set: setBoardFilter },
  ].filter((f) => f.value !== 'all');

  const filtered = useMemo(() => {
    let result = [...tickets];

    if (initialFilter === 'mine') {
      result = result.filter((t) => t.assignedResource === currentUser.name);
    } else if (initialFilter === 'unassigned') {
      result = result.filter((t) => !t.assignedResource);
    } else if (initialFilter === 'overdue') {
      result = result.filter((t) => new Date(t.dueDate).getTime() < Date.now() && t.status !== 'Closed' && t.status !== 'Resolved');
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.summary.toLowerCase().includes(q) || t.ticketNumber.includes(q));
    }
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter((t) => t.priority === priorityFilter);
    if (companyFilter !== 'all') result = result.filter((t) => t.companyId === companyFilter);
    if (engineerFilter !== 'all') {
      if (engineerFilter === 'unassigned') result = result.filter((t) => !t.assignedResource);
      else result = result.filter((t) => t.assignedResource === engineerFilter);
    }
    if (boardFilter !== 'all') result = result.filter((t) => t.board === boardFilter);

    return result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [tickets, search, statusFilter, priorityFilter, companyFilter, engineerFilter, boardFilter, initialFilter, currentUser.name]);

  const selectClass =
    'rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';

  const clearAll = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setCompanyFilter('all');
    setEngineerFilter('all');
    setBoardFilter('all');
    setSearch('');
  };

  return (
    <div>
      <PageHeader title="Service Board" subtitle={`${filtered.length} tickets ${initialFilter ? `(${initialFilter} filter)` : ''}`} />

      {/* Filter bar */}
      <Card className="mb-3">
        <div className="flex flex-col gap-2 p-3 lg:flex-row lg:items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket # or summary..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={selectClass}>
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className={selectClass}>
              <option value="all">All Companies</option>
              {companies.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
            <select value={engineerFilter} onChange={(e) => setEngineerFilter(e.target.value)} className={selectClass}>
              <option value="all">All Engineers</option>
              <option value="unassigned">Unassigned</option>
              {technicians.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
            <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)} className={selectClass}>
              <option value="all">All Boards</option>
              {boards.map((b: BoardType) => (<option key={b} value={b}>{b}</option>))}
            </select>
            {activeFilters.length > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                <X className="h-3 w-3" /> Clear ({activeFilters.length})
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Dense ticket table */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="No tickets found" subtitle="Try adjusting your filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-4 py-2.5 font-medium">Ticket #</th>
                  <th className="px-2 py-2.5 font-medium">Status</th>
                  <th className="px-2 py-2.5 font-medium">Pri</th>
                  <th className="px-2 py-2.5 font-medium">Board</th>
                  <th className="px-2 py-2.5 font-medium">Company</th>
                  <th className="hidden px-2 py-2.5 font-medium md:table-cell">Contact</th>
                  <th className="px-2 py-2.5 font-medium">Summary</th>
                  <th className="hidden px-2 py-2.5 font-medium lg:table-cell">Assigned</th>
                  <th className="hidden px-2 py-2.5 font-medium xl:table-cell">SLA</th>
                  <th className="hidden px-2 py-2.5 font-medium xl:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const company = companies.find((c) => c.id === t.companyId);
                  const contact = contacts.find((c) => c.id === t.contactId);
                  const sla = slaStatus(t.slaDueAt, t.status);
                  return (
                    <tr key={t.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-2.5">
                        <Link to={`/tickets/${t.id}`} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
                          #{t.ticketNumber}
                        </Link>
                      </td>
                      <td className="px-2 py-2.5"><StatusBadge status={t.status} /></td>
                      <td className="px-2 py-2.5"><PriorityBadge priority={t.priority} /></td>
                      <td className="px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400">{t.board}</td>
                      <td className="px-2 py-2.5">
                        <Link to={`/companies/${t.companyId}`} className="text-xs text-gray-700 hover:text-sky-600 hover:underline dark:text-gray-300 dark:hover:text-sky-400">
                          {company?.name}
                        </Link>
                      </td>
                      <td className="hidden px-2 py-2.5 text-xs text-gray-600 dark:text-gray-400 md:table-cell">
                        {contact ? `${contact.firstName} ${contact.lastName}` : '—'}
                      </td>
                      <td className="px-2 py-2.5">
                        <Link to={`/tickets/${t.id}`} className="block max-w-[200px] truncate text-xs text-gray-700 hover:text-sky-600 hover:underline dark:text-gray-300 dark:hover:text-sky-400">
                          {t.summary}
                        </Link>
                      </td>
                      <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 lg:table-cell">
                        {t.assignedResource ?? <span className="italic text-amber-600 dark:text-amber-400">Unassigned</span>}
                      </td>
                      <td className="hidden px-2 py-2.5 xl:table-cell">
                        <span className={`text-xs font-medium ${sla.color}`}>{sla.label}</span>
                      </td>
                      <td className="hidden px-2 py-2.5 text-xs text-gray-400 dark:text-gray-500 xl:table-cell">{timeAgo(t.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
