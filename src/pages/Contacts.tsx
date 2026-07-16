import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageHeader, Card, EmptyState } from '../components/ui';

export default function Contacts() {
  const { contacts, companies, tickets, devices } = useApp();
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = [...contacts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.department.toLowerCase().includes(q));
    }
    if (companyFilter !== 'all') result = result.filter((c) => c.companyId === companyFilter);
    return result;
  }, [contacts, search, companyFilter]);

  return (
    <div>
      <PageHeader title="Contacts" subtitle={`${contacts.length} contacts across ${companies.length} companies`} />

      <Card className="mb-4">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or department..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="all">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No contacts found" subtitle="Try adjusting your search" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Company</th>
                  <th className="hidden px-3 py-3 font-medium md:table-cell">Department</th>
                  <th className="hidden px-3 py-3 font-medium lg:table-cell">Phone</th>
                  <th className="hidden px-3 py-3 font-medium lg:table-cell">Email</th>
                  <th className="px-3 py-3 font-medium">Open Tickets</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const company = companies.find((co) => co.id === c.companyId);
                  const openTickets = tickets.filter((t) => t.contactId === c.id && (t.status === 'Open' || t.status === 'In Progress')).length;
                  const assignedDevices = devices.filter((d) => d.assignedUserId === c.id).length;
                  return (
                    <tr key={c.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                      <td className="px-5 py-3">
                        <Link to={`/contacts/${c.id}`} className="font-medium text-sky-600 hover:underline dark:text-sky-400">
                          {c.firstName} {c.lastName}
                        </Link>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{c.title} - {assignedDevices} device(s)</p>
                      </td>
                      <td className="px-3 py-3">
                        <Link to={`/companies/${c.companyId}`} className="text-gray-700 hover:text-sky-600 hover:underline dark:text-gray-300 dark:hover:text-sky-400">
                          {company?.name}
                        </Link>
                      </td>
                      <td className="hidden px-3 py-3 text-gray-600 dark:text-gray-400 md:table-cell">{c.department}</td>
                      <td className="hidden px-3 py-3 text-xs text-gray-500 dark:text-gray-400 lg:table-cell">{c.phone}</td>
                      <td className="hidden px-3 py-3 text-xs text-gray-500 dark:text-gray-400 lg:table-cell">{c.email}</td>
                      <td className="px-3 py-3">
                        {openTickets > 0 ? (
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">{openTickets}</span>
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
