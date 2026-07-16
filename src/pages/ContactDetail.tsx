import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, Building2, Briefcase,
  StickyNote, Hash, UserCircle,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Card, CardHeader } from '../components/ui';
import { StatusBadge, PriorityBadge, DeviceStatusBadge } from '../components/Badges';
import type { ComponentType } from 'react';

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const activityColors: Record<string, string> = {
  Created: 'bg-sky-500', Assigned: 'bg-amber-500', Closed: 'bg-gray-400',
  Escalated: 'bg-red-500', 'Status Changed': 'bg-blue-500', 'Note Added': 'bg-gray-400', Updated: 'bg-emerald-500',
};

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, companies, tickets, devices, activities } = useApp();

  const contact = contacts.find((c) => c.id === id);
  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <User className="mb-3 h-10 w-10 text-gray-400" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact not found</p>
        <Link to="/contacts" className="mt-3 text-sm text-sky-600 hover:underline dark:text-sky-400">Back to Contacts</Link>
      </div>
    );
  }

  const company = companies.find((c) => c.id === contact.companyId);
  const contactTickets = tickets.filter((t) => t.contactId === contact.id);
  const openTickets = contactTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');
  const contactDevices = devices.filter((d) => d.assignedUserId === contact.id);
  const contactTicketIds = new Set(contactTickets.map((t) => t.id));
  const contactActivities = activities.filter((a) => contactTicketIds.has(a.ticketId)).sort((a, b) => b.date.localeCompare(a.date));

  const infoRow = (Icon: ComponentType<{ className?: string }>, label: string, value: string) => (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</span>
      <span className="ml-auto text-sm text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );

  return (
    <div>
      <button onClick={() => navigate('/contacts')} className="mb-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <ArrowLeft className="h-4 w-4" /> Back to Contacts
      </button>

      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-lg font-bold text-white shadow-lg shadow-sky-500/20">
          {contact.firstName[0]}{contact.lastName[0]}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{contact.firstName} {contact.lastName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{contact.title} - {contact.department}</p>
          <Link to={`/companies/${contact.companyId}`} className="mt-1 inline-flex items-center gap-1 text-xs text-sky-600 hover:underline dark:text-sky-400">
            <Building2 className="h-3.5 w-3.5" /> {company?.name}
          </Link>
        </div>
        <div className="hidden gap-3 sm:flex">
          <div className="rounded-lg border border-gray-200 px-3 py-1.5 text-center dark:border-gray-800">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{openTickets.length}</p>
            <p className="text-[10px] text-gray-400">Open Tickets</p>
          </div>
          <div className="rounded-lg border border-gray-200 px-3 py-1.5 text-center dark:border-gray-800">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{contactDevices.length}</p>
            <p className="text-[10px] text-gray-400">Devices</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Info + Notes */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Contact Information" />
            <div className="divide-y divide-gray-100 px-5 dark:divide-gray-800">
              {infoRow(Briefcase, 'Department', contact.department)}
              {infoRow(UserCircle, 'Manager', contact.manager)}
              {infoRow(Phone, 'Phone', contact.phone)}
              {infoRow(Hash, 'Extension', contact.extension)}
              {infoRow(Mail, 'Email', contact.email)}
              {infoRow(Building2, 'Company', company?.name ?? '—')}
            </div>
          </Card>

          <Card>
            <CardHeader title="Notes" />
            <div className="p-5">
              <div className="flex items-start gap-3">
                <StickyNote className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{contact.notes}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Tickets + Devices + Timeline */}
        <div className="space-y-4 lg:col-span-2">
          {/* Tickets */}
          <Card>
            <CardHeader title="Previous Tickets" subtitle={`${contactTickets.length} total - ${openTickets.length} open`} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-4 py-2.5 font-medium">Ticket #</th>
                  <th className="px-2 py-2.5 font-medium">Status</th>
                  <th className="px-2 py-2.5 font-medium">Priority</th>
                  <th className="hidden px-2 py-2.5 font-medium md:table-cell">Board</th>
                  <th className="px-2 py-2.5 font-medium">Summary</th>
                </tr></thead>
                <tbody>
                  {contactTickets.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No tickets for this contact</td></tr>
                  ) : (
                    contactTickets.map((t) => (
                      <tr key={t.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-2.5"><Link to={`/tickets/${t.id}`} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">#{t.ticketNumber}</Link></td>
                        <td className="px-2 py-2.5"><StatusBadge status={t.status} /></td>
                        <td className="px-2 py-2.5"><PriorityBadge priority={t.priority} /></td>
                        <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 md:table-cell">{t.board}</td>
                        <td className="px-2 py-2.5 text-xs text-gray-700 dark:text-gray-300">{t.summary}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Devices */}
          <Card>
            <CardHeader title="Assigned Devices" subtitle={`${contactDevices.length} device(s)`} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-4 py-2.5 font-medium">Computer Name</th>
                  <th className="hidden px-2 py-2.5 font-medium md:table-cell">OS</th>
                  <th className="hidden px-2 py-2.5 font-medium lg:table-cell">Serial</th>
                  <th className="px-2 py-2.5 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {contactDevices.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No devices assigned</td></tr>
                  ) : (
                    contactDevices.map((d) => (
                      <tr key={d.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-2.5"><Link to={`/configurations/${d.id}`} className="font-medium text-sky-600 hover:underline dark:text-sky-400">{d.computerName}</Link></td>
                        <td className="hidden px-2 py-2.5 text-xs text-gray-600 dark:text-gray-400 md:table-cell">{d.operatingSystem}</td>
                        <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 lg:table-cell">{d.serialNumber}</td>
                        <td className="px-2 py-2.5"><DeviceStatusBadge status={d.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader title="Timeline" subtitle="Activity history for this contact's tickets" />
            <div className="max-h-80 overflow-y-auto">
              {contactActivities.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No activity</p>
              ) : (
                <div className="px-5 py-3">
                  {contactActivities.slice(0, 25).map((a, i) => (
                    <div key={a.id} className="relative flex gap-3 pb-3 last:pb-0">
                      {i < Math.min(contactActivities.length, 25) - 1 && <div className="absolute left-[7px] top-5 h-full w-px bg-gray-200 dark:bg-gray-700" />}
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
        </div>
      </div>
    </div>
  );
}
