import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, MapPin, Phone, Globe, Users, ServerCog, ClipboardList } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageHeader, Card, EmptyState } from '../components/ui';

export default function Companies() {
  const { companies, contacts, devices, tickets } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return companies;
    const q = search.toLowerCase();
    return companies.filter(
      (c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.city.toLowerCase().includes(q),
    );
  }, [companies, search]);

  return (
    <div>
      <PageHeader title="Companies" subtitle={`${companies.length} companies in your MSP portfolio`} />

      <Card className="mb-4">
        <div className="relative p-4">
          <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies by name, industry, or city..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={Building2} title="No companies found" subtitle="Try a different search" /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const companyContacts = contacts.filter((ct) => ct.companyId === c.id);
            const companyDevices = devices.filter((d) => d.companyId === c.id);
            const companyTickets = tickets.filter((t) => t.companyId === c.id);
            const openTickets = companyTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');

            return (
              <Link key={c.id} to={`/companies/${c.id}`}>
                <Card className="group h-full p-5 transition-all hover:border-sky-300 hover:shadow-md dark:hover:border-sky-700">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">{c.name}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{c.industry}</p>
                    </div>
                    {openTickets.length > 0 && (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                        {openTickets.length} open
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" /> {c.city}, {c.state}</p>
                    <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /> {c.phone}</p>
                    <p className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 shrink-0" /> {c.website}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><Users className="h-3.5 w-3.5" /> {companyContacts.length}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><ServerCog className="h-3.5 w-3.5" /> {companyDevices.length}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><ClipboardList className="h-3.5 w-3.5" /> {companyTickets.length}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
