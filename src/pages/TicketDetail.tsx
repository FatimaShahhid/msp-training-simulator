import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, UserPlus, XCircle, ArrowUpCircle, Clock,
  ServerCog, CheckCircle2, AlertCircle, Building2,
  User, Timer, Tag,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Card, CardHeader } from '../components/ui';
import { StatusBadge, PriorityBadge, DeviceStatusBadge } from '../components/Badges';
import type { TicketStatus, TicketPriority, BoardType } from '../types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDuration(ms: number): string {
  const abs = Math.abs(ms);
  const hours = Math.floor(abs / 3600000);
  const mins = Math.floor((abs % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function slaInfo(slaDueAt: string, status: string) {
  if (status === 'Closed' || status === 'Resolved') {
    return { label: 'SLA Met', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', ring: 'ring-emerald-500/20', icon: CheckCircle2 };
  }
  const diff = new Date(slaDueAt).getTime() - Date.now();
  if (diff < 0) return { label: `Breached ${formatDuration(diff)} ago`, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', ring: 'ring-red-500/20', icon: AlertCircle };
  if (diff < 3600000 * 4) return { label: `${formatDuration(diff)} remaining`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', ring: 'ring-amber-500/20', icon: Timer };
  return { label: `${formatDuration(diff)} remaining`, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-500/10', ring: 'ring-sky-500/20', icon: Timer };
}

const activityColors: Record<string, string> = {
  Created: 'bg-sky-500', Assigned: 'bg-amber-500', Closed: 'bg-gray-400',
  Escalated: 'bg-red-500', 'Status Changed': 'bg-blue-500', 'Note Added': 'bg-gray-400', Updated: 'bg-emerald-500',
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, companies, contacts, devices, timeEntries, activities, updateTicket, currentUser, technicians, boards } = useApp();

  const ticket = tickets.find((t) => t.id === id);
  const [summary, setSummary] = useState(ticket?.summary ?? '');
  const [description, setDescription] = useState(ticket?.description ?? '');
  const [internalNotes, setInternalNotes] = useState(ticket?.internalNotes ?? '');
  const [resolution, setResolution] = useState(ticket?.resolution ?? '');
  const [status, setStatus] = useState<TicketStatus>(ticket?.status ?? 'Open');
  const [priority, setPriority] = useState<TicketPriority>(ticket?.priority ?? 'Medium');
  const [assigned, setAssigned] = useState<string | null>(ticket?.assignedResource ?? null);
  const [board, setBoard] = useState<BoardType>(ticket?.board ?? 'Service Requests');
  const [saved, setSaved] = useState(false);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="mb-3 h-10 w-10 text-gray-400" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ticket not found</p>
        <Link to="/" className="mt-3 text-sm text-sky-600 hover:underline dark:text-sky-400">Back to Service Board</Link>
      </div>
    );
  }

  const company = companies.find((c) => c.id === ticket.companyId);
  const contact = contacts.find((c) => c.id === ticket.contactId);
  const device = devices.find((d) => d.id === ticket.deviceId);
  const ticketTimeEntries = timeEntries.filter((te) => te.ticketId === ticket.id);
  const ticketActivities = activities.filter((a) => a.ticketId === ticket.id).sort((a, b) => b.date.localeCompare(a.date));
  const totalTime = ticketTimeEntries.reduce((sum, te) => sum + te.hours, 0);
  const sla = slaInfo(ticket.slaDueAt, status);
  const SlaIcon = sla.icon;

  const handleSave = () => {
    updateTicket(ticket.id, { summary, description, internalNotes, resolution, status, priority, assignedResource: assigned, board, updatedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAssign = () => {
    setAssigned(currentUser.name);
    setStatus('In Progress');
    updateTicket(ticket.id, { assignedResource: currentUser.name, status: 'In Progress', updatedAt: new Date().toISOString() });
  };

  const handleClose = () => {
    setStatus('Closed');
    updateTicket(ticket.id, { status: 'Closed', closedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  };

  const handleEscalate = () => {
    setPriority('Critical');
    updateTicket(ticket.id, { priority: 'Critical', updatedAt: new Date().toISOString() });
  };

  const inputClass = 'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white';
  const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500';

  const linkedCard = (icon: React.ReactNode, label: string, name: string, sub: string, to: string) => (
    <Link to={to} className="group flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-sky-300 hover:bg-sky-50/50 dark:border-gray-800 dark:hover:border-sky-700 dark:hover:bg-sky-500/5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-sky-100 group-hover:text-sky-600 dark:group-hover:bg-sky-500/20 dark:group-hover:text-sky-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</p>
        <p className="truncate text-sm font-medium text-gray-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">{name}</p>
        <p className="truncate text-xs text-gray-400 dark:text-gray-500">{sub}</p>
      </div>
    </Link>
  );

  return (
    <div>
      <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <ArrowLeft className="h-4 w-4" /> Back to Service Board
      </button>

      {/* Header bar */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">#{ticket.ticketNumber}</h1>
            <StatusBadge status={status} />
            <PriorityBadge priority={priority} />
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"><Tag className="h-3 w-3" /> {board}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{ticket.summary}</p>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 dark:text-gray-500">
            <span>Created: {formatDate(ticket.createdAt)}</span>
            <span>Updated: {formatDate(ticket.updatedAt)}</span>
            <span>Due: {formatDate(ticket.dueDate)}</span>
          </div>
        </div>

        {/* SLA Timer */}
        <div className={`flex items-center gap-2 rounded-lg px-4 py-2 ring-1 ring-inset ${sla.bg} ${sla.ring}`}>
          <SlaIcon className={`h-5 w-5 ${sla.color}`} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">SLA Timer</p>
            <p className={`text-sm font-semibold ${sla.color}`}>{sla.label}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {saved && <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Saved</span>}
        <button onClick={handleSave} className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"><Save className="h-4 w-4" /> Save</button>
        <button onClick={handleAssign} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"><UserPlus className="h-4 w-4" /> Assign</button>
        <button onClick={handleEscalate} className="flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"><ArrowUpCircle className="h-4 w-4" /> Escalate</button>
        <button onClick={handleClose} className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"><XCircle className="h-4 w-4" /> Close Ticket</button>
      </div>

      {/* Linked objects row */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {linkedCard(<Building2 className="h-4 w-4" />, 'Company', company?.name ?? '—', company?.industry ?? '', `/companies/${ticket.companyId}`)}
        {linkedCard(<User className="h-4 w-4" />, 'Contact', contact ? `${contact.firstName} ${contact.lastName}` : '—', contact ? `${contact.department} - Ext ${contact.extension}` : '', `/contacts/${ticket.contactId}`)}
        {device ? linkedCard(<ServerCog className="h-4 w-4" />, 'Configuration', device.computerName, `${device.manufacturer} ${device.model}`, `/configurations/${device.id}`) : (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-200 p-3 dark:border-gray-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-800"><ServerCog className="h-4 w-4" /></div>
            <div><p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Configuration</p><p className="text-sm text-gray-400">No device linked</p></div>
          </div>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: editable sections */}
        <div className="space-y-4 lg:col-span-2">
          {/* Controls */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className={labelClass}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)} className={inputClass}>
                  <option value="Open">Open</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option><option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} className={inputClass}>
                  <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Board</label>
                <select value={board} onChange={(e) => setBoard(e.target.value as BoardType)} className={inputClass}>
                  {boards.map((b) => (<option key={b} value={b}>{b}</option>))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Assigned Engineer</label>
                <select value={assigned ?? ''} onChange={(e) => setAssigned(e.target.value || null)} className={inputClass}>
                  <option value="">Unassigned</option>
                  {technicians.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader title="Summary" />
            <div className="p-4"><input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} className={inputClass} /></div>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader title="Description" />
            <div className="p-4"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-y`} /></div>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader title="Internal Notes" subtitle="Visible to technicians only" />
            <div className="p-4"><textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} rows={3} className={`${inputClass} resize-y`} /></div>
          </Card>

          {/* Resolution */}
          <Card>
            <CardHeader title="Resolution" />
            <div className="p-4"><textarea value={resolution} onChange={(e) => setResolution(e.target.value)} rows={3} className={`${inputClass} resize-y`} placeholder="Document the steps taken to resolve this ticket..." /></div>
          </Card>

          {/* Time Entries */}
          <Card>
            <CardHeader title="Time Entries" subtitle={`${ticketTimeEntries.length} entries - ${totalTime.toFixed(1)} total hours`} />
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {ticketTimeEntries.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No time entries logged</p>
              ) : (
                ticketTimeEntries.map((te) => (
                  <div key={te.id} className="flex items-start gap-3 px-5 py-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{te.technician}</span>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{te.hours}h {te.billable && <span className="text-emerald-600 dark:text-emerald-400">billable</span>}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{te.description}</p>
                      <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-600">{formatDate(te.date)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right: sidebar info */}
        <div className="space-y-4">
          {/* Linked Configuration detail */}
          {device && (
            <Card>
              <CardHeader title="Linked Configuration" />
              <div className="p-4">
                <Link to={`/configurations/${device.id}`} className="mb-3 flex items-center gap-2">
                  <ServerCog className="h-4 w-4 text-sky-500" />
                  <span className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-400">{device.computerName}</span>
                </Link>
                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <p><span className="font-medium text-gray-600 dark:text-gray-300">Mfr:</span> {device.manufacturer}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-300">Model:</span> {device.model}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-300">OS:</span> {device.operatingSystem}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-300">Serial:</span> {device.serialNumber}</p>
                  <p className="flex items-center gap-1"><span className="font-medium text-gray-600 dark:text-gray-300">Status:</span> <DeviceStatusBadge status={device.status} /></p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-300">Patch:</span> {device.patchStatus}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-300">AV:</span> {device.antivirus}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card>
            <CardHeader title="Activity Timeline" />
            <div className="max-h-96 overflow-y-auto">
              <div className="px-5 py-3">
                {ticketActivities.map((a, i) => (
                  <div key={a.id} className="relative flex gap-3 pb-3 last:pb-0">
                    {i < ticketActivities.length - 1 && <div className="absolute left-[7px] top-5 h-full w-px bg-gray-200 dark:bg-gray-700" />}
                    <div className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white dark:ring-gray-900 ${activityColors[a.type] ?? 'bg-gray-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{a.description}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600">{a.user} - {formatDate(a.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
