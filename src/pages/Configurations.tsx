import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ServerCog, Search } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageHeader, Card, EmptyState } from '../components/ui';
import { DeviceStatusBadge } from '../components/Badges';

export default function Configurations() {
  const { devices, companies, contacts, tickets } = useApp();
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patchFilter, setPatchFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = [...devices];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.computerName.toLowerCase().includes(q) || d.serialNumber.toLowerCase().includes(q));
    }
    if (companyFilter !== 'all') result = result.filter((d) => d.companyId === companyFilter);
    if (statusFilter !== 'all') result = result.filter((d) => d.status === statusFilter);
    if (patchFilter !== 'all') result = result.filter((d) => d.patchStatus === patchFilter);
    return result;
  }, [devices, search, companyFilter, statusFilter, patchFilter]);

  const selectClass = 'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';

  return (
    <div>
      <PageHeader title="Configurations" subtitle={`${devices.length} devices under management`} />

      <Card className="mb-4">
        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by computer name or serial number..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className={selectClass}>
            <option value="all">All Companies</option>
            {companies.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Offline">Offline</option>
            <option value="In Repair">In Repair</option>
            <option value="Retired">Retired</option>
          </select>
          <select value={patchFilter} onChange={(e) => setPatchFilter(e.target.value)} className={selectClass}>
            <option value="all">All Patches</option>
            <option value="Up to Date">Up to Date</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={ServerCog} title="No devices found" subtitle="Try adjusting your filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-5 py-3 font-medium">Computer Name</th>
                  <th className="hidden px-3 py-3 font-medium md:table-cell">OS</th>
                  <th className="px-3 py-3 font-medium">Assigned User</th>
                  <th className="hidden px-3 py-3 font-medium lg:table-cell">Serial Number</th>
                  <th className="hidden px-3 py-3 font-medium xl:table-cell">Warranty</th>
                  <th className="hidden px-3 py-3 font-medium xl:table-cell">Patch</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const company = companies.find((c) => c.id === d.companyId);
                  const user = contacts.find((c) => c.id === d.assignedUserId);
                  const linkedTickets = tickets.filter((t) => t.deviceId === d.id).length;
                  return (
                    <tr key={d.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                      <td className="px-5 py-3">
                        <Link to={`/configurations/${d.id}`} className="font-medium text-sky-600 hover:underline dark:text-sky-400">{d.computerName}</Link>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{company?.name}</p>
                      </td>
                      <td className="hidden px-3 py-3 text-xs text-gray-600 dark:text-gray-400 md:table-cell">{d.operatingSystem}</td>
                      <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">{user ? `${user.firstName} ${user.lastName}` : '—'}</td>
                      <td className="hidden px-3 py-3 text-xs text-gray-500 dark:text-gray-400 lg:table-cell">{d.serialNumber}</td>
                      <td className="hidden px-3 py-3 xl:table-cell">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${d.warranty === 'Active' ? 'bg-emerald-100 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-700/40 dark:text-gray-400'}`}>
                          {d.warranty}
                        </span>
                      </td>
                      <td className="hidden px-3 py-3 xl:table-cell">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${d.patchStatus === 'Up to Date' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : d.patchStatus === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>{d.patchStatus}</span>
                      </td>
                      <td className="px-3 py-3"><DeviceStatusBadge status={d.status} /></td>
                      <td className="px-3 py-3">
                        {linkedTickets > 0 ? (
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">{linkedTickets}</span>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-600">0</span>
                        )}
                      </td>
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
