export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type DeviceStatus = 'Active' | 'Offline' | 'Retired' | 'In Repair';
export type BoardType = 'Service Requests' | 'Incidents' | 'Projects' | 'Changes';

export interface Site {
  id: string;
  name: string;
  companyId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isMain: boolean;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  industry: string;
  accountManager: string;
  notes: string;
  documents: { id: string; name: string; type: string; uploaded: string }[];
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  companyId: string;
  department: string;
  title: string;
  phone: string;
  email: string;
  extension: string;
  manager: string;
  notes: string;
}

export interface Device {
  id: string;
  computerName: string;
  operatingSystem: string;
  assignedUserId: string | null;
  companyId: string;
  warranty: string;
  warrantyExpiry: string;
  serialNumber: string;
  status: DeviceStatus;
  model: string;
  manufacturer: string;
  patchStatus: 'Up to Date' | 'Pending' | 'Overdue';
  antivirus: 'Protected' | 'At Risk' | 'Disabled';
  lastCheckIn: string;
}

export interface TimeEntry {
  id: string;
  ticketId: string;
  technician: string;
  hours: number;
  description: string;
  date: string;
  billable: boolean;
}

export interface Activity {
  id: string;
  ticketId: string;
  type: 'Created' | 'Updated' | 'Assigned' | 'Status Changed' | 'Note Added' | 'Closed' | 'Escalated';
  description: string;
  user: string;
  date: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  status: TicketStatus;
  priority: TicketPriority;
  companyId: string;
  contactId: string;
  deviceId: string | null;
  summary: string;
  description: string;
  internalNotes: string;
  resolution: string;
  assignedResource: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  closedAt: string | null;
  board: BoardType;
  slaDueAt: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: 'ticket' | 'system' | 'alert';
}
