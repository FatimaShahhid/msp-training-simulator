import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, MapPin, Phone, Globe, Users, ServerCog,
  ClipboardList, FileText, StickyNote, LayoutDashboard,
  Briefcase, MapPinned, Activity as ActivityIcon,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Card, CardHeader } from '../components/ui';
import { StatusBadge, PriorityBadge, DeviceStatusBadge } from '../components/Badges';
import type { ComponentType } from 'react';

type Tab = 'general' | 'contacts' | 'configurations' | 'tickets' | 'documents' | 'sites' | 'activities' | 'notes';

const tabs: { id: Tab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'general', label: 'General', icon: LayoutDashboard },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'configurations', label: 'Configurations', icon: ServerCog },
  { id: 'tickets', label: 'Tickets', icon: ClipboardList },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'sites', label: 'Sites', icon: MapPinned },
  { id: 'activities', label: 'Activities', icon: ActivityIcon },
  { id: 'notes', label: 'Notes', icon: StickyNote },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const activityColors: Record<string, string> = {
  Created: 'bg-sky-500', Assigned: 'bg-amber-500', Closed: 'bg-gray-400',
  Escalated: 'bg-red-500', 'Status Changed': 'bg-blue-500', 'Note Added': 'bg-gray-400', Updated: 'bg-emerald-500',
};

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companies, sites, contacts, devices, tickets, activities } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const company = companies.find((c) => c.id === id);
  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Building2 className="mb-3 h-10 w-10 text-gray-400" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Company not found</p>
        <Link to="/companies" className="mt-3 text-sm text-sky-600 hover:underline dark:text-sky-400">Back to Companies</Link>
      </div>
    );
  }

  const companySites = sites.filter((s) => s.companyId === company.id);
  const companyContacts = contacts.filter((c) => c.companyId === company.id);
  const companyDevices = devices.filter((d) => d.companyId === company.id);
  const companyTickets = tickets.filter((t) => t.companyId === company.id);
  const openTickets = companyTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');
  const companyTicketIds = new Set(companyTickets.map((t) => t.id));
  const companyActivities = activities.filter((a) => companyTicketIds.has(a.ticketId)).sort((a, b) => b.date.localeCompare(a.date));

  const infoRow = (Icon: ComponentType<{ className?: string }>, label: string, value: string) => (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</span>
      <span className="ml-auto text-sm text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );

  return (
    <div>
      <button onClick={() => navigate('/companies')} className="mb-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <ArrowLeft className="h-4 w-4" /> Back to Companies
      </button>

      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{company.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{company.industry}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {company.city}, {company.state}</span>
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {company.phone}</span>
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {company.website}</span>
          </div>
        </div>
        <div className="hidden gap-3 sm:flex">
          <div className="rounded-lg border border-gray-200 px-3 py-1.5 text-center dark:border-gray-800">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{openTickets.length}</p>
            <p className="text-[10px] text-gray-400">Open</p>
          </div>
          <div className="rounded-lg border border-gray-200 px-3 py-1.5 text-center dark:border-gray-800">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{companyContacts.length}</p>
            <p className="text-[10px] text-gray-400">Contacts</p>
          </div>
          <div className="rounded-lg border border-gray-200 px-3 py-1.5 text-center dark:border-gray-800">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{companyDevices.length}</p>
            <p className="text-[10px] text-gray-400">Devices</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}>
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Company Information" />
            <div className="divide-y divide-gray-100 px-5 dark:divide-gray-800">
              {infoRow(Briefcase, 'Industry', company.industry)}
              {infoRow(MapPin, 'Address', `${company.address}, ${company.city}, ${company.state} ${company.zip}`)}
              {infoRow(Phone, 'Phone', company.phone)}
              {infoRow(Globe, 'Website', company.website)}
              {infoRow(Briefcase, 'Account Manager', company.accountManager)}
              {infoRow(MapPinned, 'Sites', String(companySites.length))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Quick Stats" />
            <div className="grid grid-cols-2 gap-3 p-4">
              <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-500/10"><p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{companyTickets.length}</p><p className="text-xs text-gray-400">Total Tickets</p></div>
              <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-500/10"><p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{openTickets.length}</p><p className="text-xs text-gray-400">Open Tickets</p></div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10"><p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{companyDevices.length}</p><p className="text-xs text-gray-400">Devices</p></div>
              <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10"><p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{companyContacts.length}</p><p className="text-xs text-gray-400">Contacts</p></div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'contacts' && (
        <Card>
          <CardHeader title="Contacts" subtitle={`${companyContacts.length} contacts`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-2 py-2.5 font-medium">Department</th>
                <th className="hidden px-2 py-2.5 font-medium sm:table-cell">Title</th>
                <th className="hidden px-2 py-2.5 font-medium md:table-cell">Phone</th>
                <th className="hidden px-2 py-2.5 font-medium lg:table-cell">Email</th>
                <th className="hidden px-2 py-2.5 font-medium lg:table-cell">Ext</th>
              </tr></thead>
              <tbody>
                {companyContacts.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="px-4 py-2.5"><Link to={`/contacts/${c.id}`} className="font-medium text-sky-600 hover:underline dark:text-sky-400">{c.firstName} {c.lastName}</Link></td>
                    <td className="px-2 py-2.5 text-xs text-gray-600 dark:text-gray-400">{c.department}</td>
                    <td className="hidden px-2 py-2.5 text-xs text-gray-600 dark:text-gray-400 sm:table-cell">{c.title}</td>
                    <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 md:table-cell">{c.phone}</td>
                    <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 lg:table-cell">{c.email}</td>
                    <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 lg:table-cell">{c.extension}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'configurations' && (
        <Card>
          <CardHeader title="Configurations" subtitle={`${companyDevices.length} devices`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                <th className="px-4 py-2.5 font-medium">Computer Name</th>
                <th className="hidden px-2 py-2.5 font-medium md:table-cell">OS</th>
                <th className="hidden px-2 py-2.5 font-medium lg:table-cell">Serial</th>
                <th className="px-2 py-2.5 font-medium">Status</th>
                <th className="hidden px-2 py-2.5 font-medium xl:table-cell">Patch</th>
              </tr></thead>
              <tbody>
                {companyDevices.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="px-4 py-2.5"><Link to={`/configurations/${d.id}`} className="font-medium text-sky-600 hover:underline dark:text-sky-400">{d.computerName}</Link></td>
                    <td className="hidden px-2 py-2.5 text-xs text-gray-600 dark:text-gray-400 md:table-cell">{d.operatingSystem}</td>
                    <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 lg:table-cell">{d.serialNumber}</td>
                    <td className="px-2 py-2.5"><DeviceStatusBadge status={d.status} /></td>
                    <td className="hidden px-2 py-2.5 xl:table-cell">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${d.patchStatus === 'Up to Date' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : d.patchStatus === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>{d.patchStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'tickets' && (
        <Card>
          <CardHeader title="Tickets" subtitle={`${companyTickets.length} total - ${openTickets.length} open`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                <th className="px-4 py-2.5 font-medium">Ticket #</th>
                <th className="px-2 py-2.5 font-medium">Status</th>
                <th className="px-2 py-2.5 font-medium">Priority</th>
                <th className="hidden px-2 py-2.5 font-medium md:table-cell">Board</th>
                <th className="px-2 py-2.5 font-medium">Summary</th>
                <th className="hidden px-2 py-2.5 font-medium lg:table-cell">Assigned</th>
                <th className="hidden px-2 py-2.5 font-medium xl:table-cell">Updated</th>
              </tr></thead>
              <tbody>
                {companyTickets.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="px-4 py-2.5"><Link to={`/tickets/${t.id}`} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">#{t.ticketNumber}</Link></td>
                    <td className="px-2 py-2.5"><StatusBadge status={t.status} /></td>
                    <td className="px-2 py-2.5"><PriorityBadge priority={t.priority} /></td>
                    <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 md:table-cell">{t.board}</td>
                    <td className="px-2 py-2.5 text-xs text-gray-700 dark:text-gray-300">{t.summary}</td>
                    <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 lg:table-cell">{t.assignedResource ?? 'Unassigned'}</td>
                    <td className="hidden px-2 py-2.5 text-xs text-gray-400 dark:text-gray-500 xl:table-cell">{formatDate(t.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {company.documents.map((doc) => (
            <Card key={doc.id} className="flex items-center gap-3 p-4 transition-colors hover:border-sky-300 dark:hover:border-sky-700">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${doc.type === 'PDF' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{doc.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{doc.type} - {formatDate(doc.uploaded)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'sites' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companySites.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-sky-500" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.name}</p>
                {s.isMain && <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">Main</span>}
              </div>
              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {s.address}, {s.city}, {s.state} {s.zip}</p>
                <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {s.phone}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'activities' && (
        <Card>
          <CardHeader title="Activities" subtitle={`${companyActivities.length} activities`} />
          <div className="max-h-96 overflow-y-auto">
            {companyActivities.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No activities</p>
            ) : (
              <div className="px-5 py-3">
                {companyActivities.slice(0, 30).map((a, i) => (
                  <div key={a.id} className="relative flex gap-3 pb-3 last:pb-0">
                    {i < Math.min(companyActivities.length, 30) - 1 && <div className="absolute left-[7px] top-5 h-full w-px bg-gray-200 dark:bg-gray-700" />}
                    <div className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white dark:ring-gray-900 ${activityColors[a.type] ?? 'bg-gray-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{a.description}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600">{a.user} - {formatDateTime(a.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'notes' && (
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <StickyNote className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company Notes</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{company.notes}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
