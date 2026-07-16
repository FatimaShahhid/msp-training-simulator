import type {
  Company,
  Contact,
  Device,
  Ticket,
  TimeEntry,
  Activity,
  Notification,
  TicketStatus,
  TicketPriority,
  DeviceStatus,
  BoardType,
  Site,
} from '../types';

const technicians = [
  'Sarah Chen',
  'Marcus Johnson',
  'David Rodriguez',
  'Emily Thompson',
  'James Wilson',
  'Priya Patel',
];

const boards: BoardType[] = ['Service Requests', 'Incidents', 'Projects', 'Changes'];

const ticketSummaries = [
  'Outlook password prompt',
  'Printer offline',
  'VPN not connecting',
  'User account locked',
  'Teams login issue',
  'Mapped drive unavailable',
  'Slow workstation',
  'Email not syncing',
  'Blue screen on startup',
  'Cannot access shared folder',
  'New employee setup required',
  'Monitor not detected',
  'Keyboard not responding',
  'Antivirus alert popup',
  'Software installation request',
  'Password reset needed',
  'Network drive disconnected',
  'Office license expired',
  'Docking station not working',
  'Headset microphone not detected',
  'File server access denied',
  'VPN keeps disconnecting',
  'Duplicate emails in Outlook',
  'Calendar sync issue',
  'Scanner not recognized',
  'Desktop icons missing',
  'System running hot / fan noise',
  'Browser certificate warning',
  'WiFi keeps dropping',
  'Cannot print to network printer',
  'Outlook crashes on launch',
  'Shared mailbox not showing',
  'RDP connection timeout',
  'USB device not recognized',
  'Slack notifications not working',
  'Zoom audio cutting out',
  'Excel file corruption',
  'Desktop background changed unexpectedly',
  'Suspicious email reported',
  'Mobile email not receiving',
];

const descriptions = [
  'User reports being prompted for Outlook password repeatedly throughout the day. Has tried re-entering credentials but issue persists.',
  'Network printer showing as offline for entire department. Other printers on same floor are working normally.',
  'VPN client connects briefly then drops after 30 seconds. User is remote and unable to access internal resources.',
  'Active Directory account is locked out. User states they have not changed their password recently.',
  'Microsoft Teams will not sign in. Error message displays "There is a problem with your account."',
  'Mapped network drive Z: is showing a red X and cannot be accessed. User needs files for a client meeting.',
  'Workstation is extremely slow to boot and applications take several minutes to open. User has restarted twice.',
  'Email on mobile device stopped syncing this morning. No new messages since yesterday afternoon.',
  'PC blue screens on startup with error code PAGE_FAULT_IN_NONPAGED_AREA. Boots in safe mode only.',
  'User cannot access the shared department folder. Gets "Access Denied" error when trying to open it.',
  'New hire starting Monday needs workstation configured, accounts created, and software installed.',
  'Second monitor not detected when laptop is docked. Was working fine yesterday.',
  'Wireless keyboard stopped responding. Replaced batteries but still not working.',
  'Antivirus software is displaying repeated alert popups about a potentially unwanted application.',
  'User requesting installation of Adobe Acrobat Pro on their workstation for PDF editing.',
  'User forgot password and needs it reset. Has not set up self-service portal yet.',
  'Network drive H: disconnected after recent server maintenance. Other users in department are fine.',
  'Microsoft Office showing "Unlicensed Product" banner. User had license last week.',
  'Docking station is not charging laptop and external monitors are flickering.',
  'Headset microphone is not detected by Teams or Zoom. Audio playback works fine.',
  'File server returns "Access Denied" when user tries to open the Reports folder.',
  'VPN disconnects every 5-10 minutes requiring reconnection. Very disruptive to remote work.',
  'User is receiving duplicate copies of every email in their inbox. Started this morning.',
  'Outlook calendar is not syncing with mobile device. Appointments created on desktop do not appear on phone.',
  'Network scanner is not recognized by any workstation in the accounting department.',
  'All desktop icons disappeared after Windows update last night. Start menu also missing shortcuts.',
  'Desktop tower is running very hot and fan is loud. Concerned about potential hardware failure.',
  'Chrome is displaying a certificate warning when accessing internal web apps.',
  'Laptop WiFi keeps dropping every few minutes. Other devices on same network are stable.',
  'Cannot print to the network printer on the 2nd floor. Print jobs get stuck in queue.',
  'Outlook crashes immediately on launch with error "Cannot start Microsoft Outlook."',
  'Shared mailbox that was added last week is no longer showing in the user folder list.',
  'Remote Desktop connection to terminal server times out after entering credentials.',
  'USB flash drive is not recognized when plugged in. Tried multiple ports.',
  'Slack desktop app is not showing notification badges or playing sounds.',
  'Zoom audio cuts out every few minutes during meetings. Other participants cannot hear user.',
  'Excel workbook is corrupted and will not open. Contains important financial data.',
  'Desktop background changed to a black screen and wallpaper settings are disabled.',
  'User received a suspicious email asking for password reset. Has not clicked any links.',
  'Mobile phone stopped receiving new emails overnight. Still shows old messages fine.',
];

const resolutions = [
  'Connected remotely and cleared cached credentials in Credential Manager. Re-launched Outlook and confirmed email is syncing normally.',
  'Restarted the print spooler service on the print server. Removed and re-added the printer on affected workstations. Confirmed test page prints successfully.',
  'Reinstalled VPN client and updated to latest version. Cleared old connection profiles. User confirmed stable connection for 30 minutes.',
  'Unlocked account in Active Directory. Guided user through password reset. Confirmed login to workstation and email successful.',
  'Cleared Teams cache in AppData folder. Reinstalled Teams to latest version. User confirmed successful sign-in.',
  'Re-mapped network drive via Group Policy update. Ran gpupdate /force on workstation. Confirmed drive Z: is accessible.',
  'Ran disk cleanup and disabled unnecessary startup programs. Removed old temp files. Performance improved significantly after reboot.',
  'Removed and re-added email account on mobile device. Confirmed sync is working and new messages are arriving.',
  'Booted into safe mode and rolled back recent display driver update. System boots normally in regular mode.',
  'Verified user group membership in AD. Added to correct security group. Confirmed access to shared folder.',
  'Created AD account, configured email, installed standard software suite, and mapped network drives. Workstation ready for new employee.',
  'Updated docking station firmware. Replaced DisplayPort cable. Both monitors detected and working.',
  'Re-paired keyboard with USB receiver. Tested in different USB port. Keyboard responding normally.',
  'Ran full system scan with antivirus. Quarantined the flagged application. Scheduled follow-up scan for next week.',
  'Installed Adobe Acrobat Pro via software deployment. Activated license. User confirmed PDF editing is working.',
  'Reset password in Active Directory. Helped user enroll in self-service password reset portal.',
  'Re-mapped H: drive with correct server path. Confirmed persistent connection after reboot.',
  'Reassigned Office license in Microsoft 365 admin center. Confirmed activation on user workstation.',
  'Reseated docking station connections. Updated Thunderbolt firmware. Docking station charging and display working.',
  'Set headset as default recording device in Windows Sound settings. Updated audio drivers. Confirmed microphone works in Teams.',
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
];

const departments = [
  'Finance', 'Operations', 'IT', 'Human Resources', 'Sales',
  'Customer Service', 'Warehouse', 'Administration', 'Marketing', 'Engineering',
];

const contactTitles = [
  'Manager', 'Director', 'Analyst', 'Coordinator', 'Specialist',
  'Administrator', 'Supervisor', 'Controller', 'Clerk', 'Executive Assistant',
  'Accountant', 'Operations Lead',
];

const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
];

const managers = [
  'Karen Mitchell', 'Robert Hayes', 'Linda Park', 'David Foster',
  'Susan Walker', 'James Coleman', 'Nancy Reed', 'Thomas Wright',
];

const osOptions = [
  'Windows 11 Pro 23H2', 'Windows 10 Pro 22H2', 'Windows 11 Enterprise 23H2',
  'macOS Sonoma 14.4', 'macOS Ventura 13.6', 'Windows 10 Enterprise 22H2',
];

const manufacturers = ['Dell', 'HP', 'Lenovo', 'Apple'];
const models: Record<string, string[]> = {
  Dell: ['OptiPlex 7090', 'OptiPlex 7090 SFF', 'Latitude 5440', 'Precision 3660'],
  HP: ['EliteDesk 800 G6', 'ProDesk 600 G6', 'EliteBook 840 G8', 'ProDesk 400 G7'],
  Lenovo: ['ThinkCentre M90n', 'ThinkPad T14 Gen 3', 'ThinkCentre M70q', 'ThinkPad E14'],
  Apple: ['MacBook Pro 14"', 'iMac 24"', 'MacBook Air 13"', 'Mac mini'],
};

const statuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
const priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];
const deviceStatuses: DeviceStatus[] = ['Active', 'Offline', 'Retired', 'In Repair'];
const patchStatuses: Device['patchStatus'][] = ['Up to Date', 'Pending', 'Overdue'];
const avStatuses: Device['antivirus'][] = ['Protected', 'At Risk', 'Disabled'];

const companyData = [
  {
    name: 'ABC Manufacturing',
    address: '1450 Industrial Parkway',
    city: 'Cleveland',
    state: 'OH',
    zip: '44114',
    phone: '(216) 555-0142',
    website: 'www.abcmanufacturing.com',
    industry: 'Manufacturing',
    accountManager: 'Sarah Chen',
  },
  {
    name: 'Northwind Logistics',
    address: '8800 Freight Terminal Road',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46241',
    phone: '(317) 555-0188',
    website: 'www.northwindlogistics.com',
    industry: 'Logistics & Transportation',
    accountManager: 'Marcus Johnson',
  },
  {
    name: 'GreenLeaf Accounting',
    address: '325 Financial Center Blvd',
    city: 'Austin',
    state: 'TX',
    zip: '73301',
    phone: '(512) 555-0167',
    website: 'www.greenleafaccounting.com',
    industry: 'Accounting & Finance',
    accountManager: 'David Rodriguez',
  },
  {
    name: 'BrightCare Medical',
    address: '6700 Health Plaza Drive',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85054',
    phone: '(602) 555-0123',
    website: 'www.brightcaremedical.com',
    industry: 'Healthcare',
    accountManager: 'Emily Thompson',
  },
];

const siteNames = ['Headquarters', 'Branch Office', 'Warehouse', 'Data Center', 'Regional Hub'];

const companyDocs = [
  { name: 'Master Service Agreement.pdf', type: 'PDF' },
  { name: 'Network Diagram.pdf', type: 'PDF' },
  { name: 'SLA Document.pdf', type: 'PDF' },
  { name: 'Onsite Contact List.xlsx', type: 'Excel' },
  { name: 'Backup Configuration.pdf', type: 'PDF' },
  { name: 'Security Policy.pdf', type: 'PDF' },
  { name: 'Asset Inventory.xlsx', type: 'Excel' },
  { name: 'VPN Setup Guide.pdf', type: 'PDF' },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickIndex(len: number): number {
  return Math.floor(rand() * len);
}

function formatDate(daysAgo: number): string {
  const d = new Date(2025, 6, 15);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function formatFuture(daysAhead: number): string {
  const d = new Date(2025, 6, 15);
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
}

function generateCompanies(): Company[] {
  return companyData.map((c, i) => ({
    id: `co-${i + 1}`,
    ...c,
    notes:
      `Primary contact for service requests. Standard business hours 8am-5pm ${c.state}. ` +
      `Preferred communication method is email. ${c.industry} industry client since 2021.`,
    documents: companyDocs
      .slice(0, 4 + (i % 3))
      .map((d, j) => ({
        id: `doc-${i}-${j}`,
        ...d,
        uploaded: formatDate(30 + j * 10),
      })),
  }));
}

function generateSites(companies: Company[]): Site[] {
  const sites: Site[] = [];
  companies.forEach((company, ci) => {
    const siteCount = 1 + (ci % 3);
    for (let si = 0; si < siteCount; si++) {
      sites.push({
        id: `site-${ci}-${si}`,
        name: si === 0 ? 'Headquarters' : siteNames[si % siteNames.length],
        companyId: company.id,
        address: si === 0 ? company.address : `${100 + si * 50} ${siteNames[si % siteNames.length]} Ave`,
        city: si === 0 ? company.city : pick(['Columbus', 'Dallas', 'Tucson', 'Fort Wayne', 'Cincinnati']),
        state: si === 0 ? company.state : company.state,
        zip: si === 0 ? company.zip : String(10000 + Math.floor(rand() * 89999)),
        phone: `(${company.phone.slice(1, 4)}) 555-${String(2000 + si).slice(-4)}`,
        isMain: si === 0,
      });
    }
  });
  return sites;
}

function generateContacts(companies: Company[]): Contact[] {
  const contacts: Contact[] = [];
  for (let i = 0; i < 40; i++) {
    const company = companies[i % 4];
    const first = firstNames[i % firstNames.length];
    const last = lastNames[i % lastNames.length];
    const dept = pick(departments);
    contacts.push({
      id: `ct-${i + 1}`,
      firstName: first,
      lastName: last,
      companyId: company.id,
      department: dept,
      title: pick(contactTitles),
      phone: `(${company.phone.slice(1, 4)}) 555-${String(1000 + i).slice(-4)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${company.website.replace('www.', '')}`,
      extension: String(100 + (i % 900)),
      manager: pick(managers),
      notes:
        i % 3 === 0
          ? 'Primary technical contact for the company. Authorized to approve service requests.'
          : i % 5 === 0
            ? 'Prefers phone contact. Usually available mornings.'
            : 'Standard contact. Direct extension available.',
    });
  }
  return contacts;
}

function generateDevices(companies: Company[], contacts: Contact[]): Device[] {
  const devices: Device[] = [];
  for (let i = 0; i < 60; i++) {
    const company = companies[i % 4];
    const mfg = pick(manufacturers);
    const model = pick(models[mfg]);
    const os = pick(osOptions);
    const assignedContact = contacts.find((c) => c.companyId === company.id);
    const status = pick(deviceStatuses);
    const checkInDays = Math.floor(rand() * 30);
    devices.push({
      id: `dev-${i + 1}`,
      computerName: `${company.name.split(' ')[0].toUpperCase().slice(0, 4)}-WS-${String(i + 1).padStart(3, '0')}`,
      operatingSystem: os,
      assignedUserId: status === 'Active' ? assignedContact?.id ?? null : null,
      companyId: company.id,
      warranty: rand() > 0.4 ? 'Active' : 'Expired',
      warrantyExpiry: rand() > 0.4 ? formatFuture(Math.floor(rand() * 365)) : formatDate(Math.floor(rand() * 200) + 30),
      serialNumber: `${mfg.slice(0, 2).toUpperCase()}-${String(Math.floor(rand() * 9000000) + 1000000)}`,
      status,
      model,
      manufacturer: mfg,
      patchStatus: pick(patchStatuses),
      antivirus: pick(avStatuses),
      lastCheckIn: formatDate(checkInDays),
    });
  }
  return devices;
}

function generateTickets(
  companies: Company[],
  contacts: Contact[],
  devices: Device[],
): { tickets: Ticket[]; timeEntries: TimeEntry[]; activities: Activity[] } {
  const tickets: Ticket[] = [];
  const timeEntries: TimeEntry[] = [];
  const activities: Activity[] = [];
  let teCounter = 0;
  let actCounter = 0;

  for (let i = 0; i < 80; i++) {
    const company = companies[i % 4];
    const companyContacts = contacts.filter((c) => c.companyId === company.id);
    const contact = companyContacts[pickIndex(companyContacts.length)];
    const companyDevices = devices.filter((d) => d.companyId === company.id);
    const device = companyDevices.length > 0 ? companyDevices[pickIndex(companyDevices.length)] : null;
    const summary = ticketSummaries[i % ticketSummaries.length];
    const status = pick(statuses);
    const priority = pick(priorities);
    const board = pick(boards);
    const assigned = rand() > 0.2 ? pick(technicians) : null;
    const createdDaysAgo = Math.floor(rand() * 60) + 1;
    const updatedDaysAgo = Math.floor(rand() * createdDaysAgo);
    const slaHours = priority === 'Critical' ? 4 : priority === 'High' ? 8 : priority === 'Medium' ? 24 : 48;
    const dueIn = Math.floor(rand() * 14) - 3;
    const isOverdue = dueIn < 0 && status !== 'Closed' && status !== 'Resolved';

    const ticketId = `tk-${i + 1}`;
    const ticketNumber = String(100000 + i + 1);

    tickets.push({
      id: ticketId,
      ticketNumber,
      status,
      priority: isOverdue ? 'High' : priority,
      companyId: company.id,
      contactId: contact.id,
      deviceId: device?.id ?? null,
      summary,
      description: descriptions[i % descriptions.length],
      internalNotes:
        i % 3 === 0
          ? 'Customer called in reporting the issue. Seems to be affecting multiple users in the department.'
          : i % 4 === 0
            ? 'Remote session completed. Investigating possible network cause.'
            : 'Check if other users in the same department are experiencing the same issue.',
      resolution: status === 'Closed' || status === 'Resolved' ? resolutions[i % resolutions.length] : '',
      assignedResource: assigned,
      createdBy: 'Front Desk',
      createdAt: formatDate(createdDaysAgo),
      updatedAt: formatDate(updatedDaysAgo),
      dueDate: formatFuture(dueIn),
      closedAt: status === 'Closed' ? formatDate(updatedDaysAgo) : null,
      board,
      slaDueAt: formatFuture(0) === formatDate(createdDaysAgo) ? formatFuture(Math.floor(slaHours / 24) - createdDaysAgo) : formatDate(createdDaysAgo - Math.floor(slaHours / 24)),
    });

    activities.push({
      id: `act-${actCounter++}`,
      ticketId,
      type: 'Created',
      description: `Ticket created by Front Desk via phone call from ${contact.firstName} ${contact.lastName}`,
      user: 'Front Desk',
      date: formatDate(createdDaysAgo),
    });

    if (assigned) {
      activities.push({
        id: `act-${actCounter++}`,
        ticketId,
        type: 'Assigned',
        description: `Ticket assigned to ${assigned}`,
        user: 'Sarah Chen',
        date: formatDate(createdDaysAgo - 1),
      });
    }

    if (status === 'In Progress' || status === 'Resolved' || status === 'Closed') {
      activities.push({
        id: `act-${actCounter++}`,
        ticketId,
        type: 'Status Changed',
        description: `Status changed from Open to In Progress`,
        user: assigned ?? 'System',
        date: formatDate(Math.max(0, createdDaysAgo - 2)),
      });
    }

    if (status === 'Resolved' || status === 'Closed') {
      activities.push({
        id: `act-${actCounter++}`,
        ticketId,
        type: 'Status Changed',
        description: `Status changed from In Progress to Resolved`,
        user: assigned ?? 'System',
        date: formatDate(Math.max(0, updatedDaysAgo)),
      });
    }

    if (status === 'Closed') {
      activities.push({
        id: `act-${actCounter++}`,
        ticketId,
        type: 'Closed',
        description: `Ticket closed by ${assigned ?? 'System'}`,
        user: assigned ?? 'System',
        date: formatDate(Math.max(0, updatedDaysAgo)),
      });
    }

    if (assigned) {
      const entryCount = Math.floor(rand() * 3) + 1;
      for (let j = 0; j < entryCount; j++) {
        timeEntries.push({
          id: `te-${teCounter++}`,
          ticketId,
          technician: assigned,
          hours: Math.round(rand() * 2 * 10) / 10,
          description:
            j === 0
              ? 'Initial triage and remote session with user to diagnose the issue.'
              : 'Follow-up work on ticket. Applied fix and verified with user.',
          date: formatDate(Math.max(0, createdDaysAgo - j)),
          billable: true,
        });
      }
    }
  }

  return { tickets, timeEntries, activities };
}

function generateNotifications(tickets: Ticket[]): Notification[] {
  const notifs: Notification[] = [];
  const recent = [...tickets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  recent.forEach((t, i) => {
    notifs.push({
      id: `notif-${i + 1}`,
      title: `Ticket #${t.ticketNumber} updated`,
      description: t.summary,
      date: t.updatedAt,
      read: i > 2,
      type: 'ticket',
    });
  });
  notifs.push({
    id: 'notif-sys-1',
    title: 'System maintenance scheduled',
    description: 'Email services will undergo maintenance Sunday 2am-4am EST.',
    date: formatDate(1),
    read: false,
    type: 'system',
  });
  notifs.push({
    id: 'notif-alert-1',
    title: 'SLA at risk',
    description: '3 tickets are approaching SLA breach. Review immediately.',
    date: formatDate(0),
    read: false,
    type: 'alert',
  });
  return notifs;
}

const companies = generateCompanies();
const sites = generateSites(companies);
const contacts = generateContacts(companies);
const devices = generateDevices(companies, contacts);
const { tickets, timeEntries, activities } = generateTickets(companies, contacts, devices);
const notifications = generateNotifications(tickets);

export const sampleData = {
  companies,
  sites,
  contacts,
  devices,
  tickets,
  timeEntries,
  activities,
  notifications,
  technicians,
  boards,
};

export const currentUser = {
  name: 'Sarah Chen',
  role: 'Senior Help Desk Technician',
  email: 'sarah.chen@msptraining.com',
  avatar: 'SC',
};
