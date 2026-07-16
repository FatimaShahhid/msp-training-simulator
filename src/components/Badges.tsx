import type { TicketStatus, TicketPriority, DeviceStatus } from '../types';

const statusStyles: Record<TicketStatus, string> = {
  Open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ring-blue-600/20',
  'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 ring-amber-600/20',
  Resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-emerald-600/20',
  Closed: 'bg-gray-200 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400 ring-gray-500/20',
};

const priorityStyles: Record<TicketPriority, string> = {
  Low: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-400 ring-gray-500/20',
  Medium: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 ring-sky-600/20',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 ring-orange-600/20',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ring-red-600/20',
};

const deviceStatusStyles: Record<DeviceStatus, string> = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-emerald-600/20',
  Offline: 'bg-gray-200 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400 ring-gray-500/20',
  Retired: 'bg-gray-200 text-gray-500 dark:bg-gray-800/50 dark:text-gray-500 ring-gray-500/20',
  'In Repair': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 ring-amber-600/20',
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
}

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${deviceStatusStyles[status]}`}>
      {status}
    </span>
  );
}
