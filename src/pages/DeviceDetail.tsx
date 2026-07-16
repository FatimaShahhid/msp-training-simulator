import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ServerCog, ShieldCheck, Cpu, Hash, Building2,
  Monitor, MonitorPlay, Cable, FileSearch, Wrench,
  Clock, ShieldAlert, ShieldX, CheckCircle2,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Card, CardHeader } from '../components/ui';
import { DeviceStatusBadge, StatusBadge, PriorityBadge } from '../components/Badges';
import type { ComponentType } from 'react';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function PatchBadge({ status }: { status: string }) {
  const cls = status === 'Up to Date' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>{status}</span>;
}

function AVBadge({ status }: { status: string }) {
  const cls = status === 'Protected' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : status === 'At Risk' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  const Icon = status === 'Protected' ? CheckCircle2 : status === 'At Risk' ? ShieldAlert : ShieldX;
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}><Icon className="h-3 w-3" /> {status}</span>;
}

export default function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { devices, companies, contacts, tickets } = useApp();

  const device = devices.find((d) => d.id === id);
  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ServerCog className="mb-3 h-10 w-10 text-gray-400" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Device not found</p>
        <Link to="/configurations" className="mt-3 text-sm text-sky-600 hover:underline dark:text-sky-400">Back to Configurations</Link>
      </div>
    );
  }

  const company = companies.find((c) => c.id === device.companyId);
  const user = contacts.find((c) => c.id === device.assignedUserId);
  const linkedTickets = tickets.filter((t) => t.deviceId === device.id);

  const infoRow = (Icon: ComponentType<{ className?: string }>, label: string, value: string) => (
    <div className="flex items-center gap-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</span>
      <span className="ml-auto text-sm text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );

  const actionBtn = (Icon: ComponentType<{ className?: string }>, label: string, color: string) => (
    <button className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${color}`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );

  return (
    <div>
      <button onClick={() => navigate('/configurations')} className="mb-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <ArrowLeft className="h-4 w-4" /> Back to Configurations
      </button>

      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
          <ServerCog className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{device.computerName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{device.manufacturer} {device.model}</p>
          <Link to={`/companies/${device.companyId}`} className="mt-1 inline-flex items-center gap-1 text-xs text-sky-600 hover:underline dark:text-sky-400">
            <Building2 className="h-3.5 w-3.5" /> {company?.name}
          </Link>
        </div>
        <div className="flex flex-col items-end gap-2">
          <DeviceStatusBadge status={device.status} />
          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"><Clock className="h-3 w-3" /> {timeAgo(device.lastCheckIn)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {actionBtn(MonitorPlay, 'Remote Control', 'bg-sky-600 text-white hover:bg-sky-700')}
        {actionBtn(Cable, 'Live Connect', 'bg-blue-600 text-white hover:bg-blue-700')}
        {actionBtn(FileSearch, 'Audit', 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700')}
        {actionBtn(Wrench, 'Procedures', 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700')}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Device Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Device Information" />
            <div className="divide-y divide-gray-100 px-5 dark:divide-gray-800">
              {infoRow(Cpu, 'Manufacturer', device.manufacturer)}
              {infoRow(ServerCog, 'Model', device.model)}
              {infoRow(Monitor, 'Operating System', device.operatingSystem)}
              {infoRow(Hash, 'Serial Number', device.serialNumber)}
              {infoRow(ShieldCheck, 'Warranty', device.warranty)}
              {infoRow(ShieldCheck, 'Warranty Expiry', formatDate(device.warrantyExpiry))}
              {infoRow(Building2, 'Company', company?.name ?? '—')}
            </div>
          </Card>

          <Card>
            <CardHeader title="Security Status" />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Patch Status</span>
                <PatchBadge status={device.patchStatus} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Antivirus</span>
                <AVBadge status={device.antivirus} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Last Check-in</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{timeAgo(device.lastCheckIn)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Assigned User" />
            <div className="p-5">
              {user ? (
                <Link to={`/contacts/${user.id}`} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-bold text-white">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-400">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{user.department} - Ext {user.extension}</p>
                  </div>
                </Link>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">No user assigned</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Linked Tickets */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Linked Tickets" subtitle={`${linkedTickets.length} ticket(s)`} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-4 py-2.5 font-medium">Ticket #</th>
                  <th className="px-2 py-2.5 font-medium">Status</th>
                  <th className="px-2 py-2.5 font-medium">Priority</th>
                  <th className="hidden px-2 py-2.5 font-medium md:table-cell">Board</th>
                  <th className="px-2 py-2.5 font-medium">Summary</th>
                  <th className="hidden px-2 py-2.5 font-medium lg:table-cell">Updated</th>
                </tr></thead>
                <tbody>
                  {linkedTickets.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No tickets linked to this device</td></tr>
                  ) : (
                    linkedTickets.map((t) => (
                      <tr key={t.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-2.5"><Link to={`/tickets/${t.id}`} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">#{t.ticketNumber}</Link></td>
                        <td className="px-2 py-2.5"><StatusBadge status={t.status} /></td>
                        <td className="px-2 py-2.5"><PriorityBadge priority={t.priority} /></td>
                        <td className="hidden px-2 py-2.5 text-xs text-gray-500 dark:text-gray-400 md:table-cell">{t.board}</td>
                        <td className="px-2 py-2.5 text-xs text-gray-700 dark:text-gray-300">{t.summary}</td>
                        <td className="hidden px-2 py-2.5 text-xs text-gray-400 dark:text-gray-500 lg:table-cell">{formatDate(t.updatedAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
