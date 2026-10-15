import { useState, useMemo } from 'react';
import {
  Search, Plus, Star, Phone, Mail, MapPin, Clock,
  ChevronLeft, ChevronRight, Edit2, Eye, Car,
} from 'lucide-react';
import {
  Avatar, Badge, Button, Card, SectionHeader, SearchBar, Select,
} from '../../components/ui';

// ─── Mock Data ──────────────────────────────────────────────────────────────
const DRIVERS = [
  { id: 1,  name: 'John Adams',      email: 'john@example.com',    phone: '111-222-3333', status: 'onduty',    trips: 45, hours: 248, rating: 4.5, workedDays: [1,3,4,7,8,10,11,14,15,17,18,21,22,24,25] },
  { id: 2,  name: 'Emily Brown',     email: 'emily@example.com',   phone: '222-333-4444', status: 'sickleave', trips: 32, hours: 180, rating: 4.2, workedDays: [2,4,5,8,9,11,12,15,16] },
  { id: 3,  name: 'Michael Clark',   email: 'michael@example.com', phone: '333-444-5555', status: 'onduty',    trips: 67, hours: 320, rating: 4.8, workedDays: [1,2,3,5,6,8,9,10,12,13,15,16,17,19,20,22,23,24,26,27,29,30,31] },
  { id: 4,  name: 'Sarah Davis',     email: 'sarah@example.com',   phone: '444-555-6666', status: 'halfday',   trips: 28, hours: 145, rating: 3.9, workedDays: [1,2,5,6,8,9,12,13,16,17,19,20,22] },
  { id: 5,  name: 'James Evans',     email: 'james@example.com',   phone: '555-666-7777', status: 'onduty',    trips: 51, hours: 267, rating: 4.4, workedDays: [1,4,5,7,8,11,12,14,15,18,19,21,22,25,26,28,29] },
  { id: 6,  name: 'Laura Fisher',    email: 'laura@example.com',   phone: '666-777-8888', status: 'onduty',    trips: 39, hours: 210, rating: 4.1, workedDays: [2,3,6,7,9,10,13,14,16,17,20,21,23,24,27,28] },
  { id: 7,  name: 'Robert Gray',     email: 'robert@example.com',  phone: '777-888-9999', status: 'sickleave', trips: 22, hours: 98,  rating: 3.7, workedDays: [1,2,3,4,5] },
  { id: 8,  name: 'Jessica Harris',  email: 'jessica@example.com', phone: '888-999-0000', status: 'onduty',    trips: 58, hours: 298, rating: 4.6, workedDays: [1,2,3,5,6,7,8,9,10,12,13,14,15,16,17,19,20,21,22,23,24,26,27,28,29,30] },
  { id: 9,  name: 'Daniel Jackson',  email: 'daniel@example.com',  phone: '999-000-1111', status: 'onduty',    trips: 74, hours: 380, rating: 4.9, workedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31] },
  { id: 10, name: 'Olivia King',     email: 'olivia@example.com',  phone: '000-111-2222', status: 'halfday',   trips: 35, hours: 178, rating: 4.0, workedDays: [1,3,4,7,8,10,11,14,15,17,18,21,22] },
];

const SCHEDULE_MOCK = [
  { date: 'Aug 26, 2028', client: 'Alice Johnson',   time: '08:00 – 11:00', dest: 'JFK Airport' },
  { date: 'Aug 27, 2028', client: 'Bob Smith',       time: '13:30 – 16:00', dest: 'Manhattan Downtown' },
  { date: 'Aug 29, 2028', client: 'Charlie Davis',   time: '09:00 – 14:00', dest: 'Brooklyn Bridge' },
  { date: 'Aug 31, 2028', client: 'Diana White',     time: '10:00 – 12:30', dest: 'LaGuardia Airport' },
];

const STATUS_LABELS = {
  onduty:    'On Duty',
  sickleave: 'Sick Leave',
  halfday:   'Half-Day Leave',
};

// August 2028 starts on Tuesday (weekday index 2)
const AUG_2028_FIRST_WEEKDAY = 2; // 0=Sun … 6=Sat
const AUG_DAYS = 31;
const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ratingLabel(r) {
  if (r >= 4.8) return 'Outstanding';
  if (r >= 4.5) return 'Excellent';
  if (r >= 4.0) return 'Good';
  if (r >= 3.5) return 'Average';
  return 'Below Average';
}

// ─── Mini Calendar ──────────────────────────────────────────────────────────
function MiniCalendar({ workedDays }) {
  const worked = new Set(workedDays);
  // Build grid cells: leading blanks + day numbers
  const cells = [];
  for (let b = 0; b < AUG_2028_FIRST_WEEKDAY; b++) cells.push(null);
  for (let d = 1; d <= AUG_DAYS; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-800">August 2028</span>
        <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_LABELS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-0.5">{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`blank-${idx}`} />;
          const isWorked = worked.has(day);
          return (
            <div
              key={day}
              className={`
                text-center text-xs py-1 rounded-lg mx-0.5 font-medium
                ${isWorked
                  ? 'bg-red-500 text-white'
                  : 'text-slate-500 hover:bg-slate-100 cursor-default'
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Worked
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-3 h-3 rounded-sm bg-slate-100 inline-block border border-slate-200" /> Off
        </span>
      </div>
    </div>
  );
}

// ─── Driver Profile Panel ────────────────────────────────────────────────────
function DriverProfile({ driver }) {
  if (!driver) {
    return (
      <Card className="flex items-center justify-center h-full text-slate-400 text-sm">
        Select a driver to view profile
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-5 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar name={driver.name} size="xl" />
        <div>
          <h2 className="text-lg font-bold text-slate-900">{driver.name}</h2>
          <Badge variant={driver.status}>{STATUS_LABELS[driver.status]}</Badge>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-slate-900">{driver.trips}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Trips</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-slate-900">{driver.hours}</p>
          <p className="text-xs text-slate-500 mt-0.5">Work Hours</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <p className="text-xl font-bold text-slate-900">{driver.rating}</p>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{ratingLabel(driver.rating)}</p>
        </div>
      </div>

      {/* Contact info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="truncate">{driver.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>{driver.phone}</span>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Mini Calendar */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Attendance Calendar</h3>
        <MiniCalendar workedDays={driver.workedDays} />
      </div>

      <hr className="border-slate-100" />

      {/* Schedule */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Upcoming Schedule</h3>
        <div className="flex flex-col gap-3">
          {SCHEDULE_MOCK.map((trip, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <Car className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800 truncate">{trip.client}</p>
                  <span className="text-xs text-slate-400 flex-shrink-0">{trip.date}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" /> {trip.time}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" /> {trip.dest}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit button */}
      <Button variant="primary" className="w-full mt-auto">
        <Edit2 className="w-4 h-4" /> Edit Driver Profile
      </Button>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Drivers() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId]   = useState(DRIVERS[0].id);

  const filtered = useMemo(() => {
    return DRIVERS.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase()) ||
        d.phone.includes(search);
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const selectedDriver = DRIVERS.find((d) => d.id === selectedId) || null;

  return (
    <div className="p-6 min-h-full bg-slate-100">
      <SectionHeader
        title="Drivers"
        subtitle="Manage your fleet drivers and schedules"
        action={
          <Button variant="primary">
            <Plus className="w-4 h-4" /> Add Driver
          </Button>
        }
      />

      <div className="flex gap-6 h-[calc(100vh-180px)] min-h-0">
        {/* ── Left Panel: Driver List ─────────────────────────────────── */}
        <div className="flex flex-col gap-4" style={{ width: '60%' }}>
          {/* Toolbar */}
          <Card className="py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search drivers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="onduty">On Duty</option>
                <option value="sickleave">Sick Leave</option>
                <option value="halfday">Half-Day Leave</option>
              </select>
            </div>
          </Card>

          {/* Table */}
          <Card padding={false} className="flex-1 overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-5">Driver</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">Email</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">Phone No.</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400">No drivers found</td>
                    </tr>
                  ) : (
                    filtered.map((driver) => (
                      <tr
                        key={driver.id}
                        className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors cursor-pointer ${selectedId === driver.id ? 'bg-red-50/40' : ''}`}
                        onClick={() => setSelectedId(driver.id)}
                      >
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <Avatar name={driver.name} size="sm" />
                            <span className="font-medium text-slate-800">{driver.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{driver.email}</td>
                        <td className="py-3 px-4 text-slate-600">{driver.phone}</td>
                        <td className="py-3 px-4">
                          <Badge variant={driver.status}>{STATUS_LABELS[driver.status]}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedId(driver.id); }}
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-500 border border-slate-200 hover:border-red-300 rounded-lg px-2.5 py-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Footer */}
            <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Showing {filtered.length} of {DRIVERS.length} drivers</span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <button className="px-2 py-1 rounded-lg hover:bg-slate-100 disabled:opacity-40" disabled>← Prev</button>
                <button className="w-7 h-7 rounded-lg bg-red-500 text-white font-medium text-xs flex items-center justify-center">1</button>
                <button className="px-2 py-1 rounded-lg hover:bg-slate-100">Next →</button>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Right Panel: Driver Profile ─────────────────────────────── */}
        <div style={{ width: '40%' }} className="overflow-y-auto">
          <DriverProfile driver={selectedDriver} />
        </div>
      </div>
    </div>
  );
}
