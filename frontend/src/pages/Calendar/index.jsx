import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Car,
  User,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';

// ─── Mock Data ──────────────────────────────────────────────────────────────
const WEEK_START = { day: 14, month: 'August', year: 2028 };
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_DATES = [14, 15, 16, 17, 18, 19, 20];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const events = [
  {
    id: 'E1',
    type: 'pickup',
    day: 1,
    hour: 9,
    client: 'Kyle Thompson',
    car: 'Audi Q7',
    bookingId: 'BK-WZ1007',
    driver: 'None',
    date: 'Thu, 17 August 2028',
    startDate: 'Mon, 14 August 2028',
    endDate: 'Thu, 17 August 2028',
    note: 'Client requested a child safety seat.',
    carType: 'SUV',
    transmission: 'Automatic',
  },
  {
    id: 'E2',
    type: 'return',
    day: 1,
    hour: 10,
    client: 'Alice Johnson',
    car: 'Toyota Corolla',
    bookingId: 'BK-WZ1001',
    driver: 'Bob Smith',
    date: 'Mon, 14 August 2028',
    startDate: 'Mon, 7 August 2028',
    endDate: 'Mon, 14 August 2028',
    note: 'Vehicle to be inspected upon return.',
    carType: 'Sedan',
    transmission: 'Automatic',
  },
  {
    id: 'E3',
    type: 'pickup',
    day: 2,
    hour: 9,
    client: 'Charlie Davis',
    car: 'Ford Focus',
    bookingId: 'BK-WZ1003',
    driver: 'None',
    date: 'Tue, 15 August 2028',
    startDate: 'Tue, 15 August 2028',
    endDate: 'Fri, 18 August 2028',
    note: 'Client will pick up from airport terminal B.',
    carType: 'Hatchback',
    transmission: 'Manual',
  },
  {
    id: 'E4',
    type: 'return',
    day: 3,
    hour: 11,
    client: 'Diana White',
    car: 'Chevrolet Malibu',
    bookingId: 'BK-WZ1004',
    driver: 'James Carter',
    date: 'Wed, 16 August 2028',
    startDate: 'Wed, 9 August 2028',
    endDate: 'Wed, 16 August 2028',
    note: 'Full tank of fuel required on return.',
    carType: 'Sedan',
    transmission: 'Automatic',
  },
  {
    id: 'E5',
    type: 'pickup',
    day: 4,
    hour: 12,
    client: 'Fiona Brown',
    car: 'BMW X5',
    bookingId: 'BK-WZ1006',
    driver: 'George Davis',
    date: 'Thu, 17 August 2028',
    startDate: 'Thu, 17 August 2028',
    endDate: 'Mon, 21 August 2028',
    note: 'Premium package requested including GPS and insurance.',
    carType: 'SUV',
    transmission: 'Automatic',
  },
  {
    id: 'E6',
    type: 'return',
    day: 5,
    hour: 14,
    client: 'Edward Green',
    car: 'Nissan Altima',
    bookingId: 'BK-WZ1005',
    driver: 'None',
    date: 'Fri, 18 August 2028',
    startDate: 'Fri, 11 August 2028',
    endDate: 'Fri, 18 August 2028',
    note: 'Client to return keys to front desk.',
    carType: 'Sedan',
    transmission: 'CVT',
  },
  {
    id: 'E7',
    type: 'pickup',
    day: 6,
    hour: 9,
    client: 'Helen Martinez',
    car: 'Mazda CX-5',
    bookingId: 'BK-WZ1008',
    driver: 'Kyle Thompson',
    date: 'Sat, 19 August 2028',
    startDate: 'Sat, 19 August 2028',
    endDate: 'Tue, 22 August 2028',
    note: 'Roof rack attachment requested.',
    carType: 'Crossover',
    transmission: 'Automatic',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatHour(h) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h;
  return `${display}:00 ${suffix}`;
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  'bg-red-100 text-red-600',
  'bg-blue-100 text-blue-600',
  'bg-emerald-100 text-emerald-600',
  'bg-purple-100 text-purple-600',
  'bg-amber-100 text-amber-600',
];
function avatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

// ─── Event Block ────────────────────────────────────────────────────────────
function EventBlock({ event, isSelected, onClick }) {
  const isPickup = event.type === 'pickup';
  return (
    <div
      onClick={() => onClick(event)}
      className={`
        cursor-pointer rounded-lg px-2 py-1.5 mb-0.5 text-xs border-l-2 transition-all
        ${isPickup
          ? 'bg-red-50 border-red-500 hover:bg-red-100'
          : 'bg-blue-50 border-blue-500 hover:bg-blue-100'}
        ${isSelected ? 'ring-2 ring-offset-1 ring-slate-400' : ''}
      `}
    >
      <p className={`font-semibold truncate ${isPickup ? 'text-red-700' : 'text-blue-700'}`}>
        {event.bookingId}
      </p>
      <p className="text-slate-600 truncate">{event.client}</p>
      <p className="text-slate-400 truncate">{event.car}</p>
    </div>
  );
}

// ─── Detail Panel ───────────────────────────────────────────────────────────
function DetailPanel({ event }) {
  if (!event) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Select an event to view details</p>
      </div>
    );
  }

  const isPickup = event.type === 'pickup';
  const timeLabel = `${event.hour > 12 ? event.hour - 12 : event.hour}:30 ${event.hour >= 12 ? 'PM' : 'AM'}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-5 overflow-y-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isPickup
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-blue-50 text-blue-600 border border-blue-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isPickup ? 'bg-red-500' : 'bg-blue-500'}`} />
            {isPickup ? 'Pickup' : 'Return'}
          </span>
          <span className="text-xs text-slate-400">{event.bookingId}</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Car {isPickup ? 'Pickup' : 'Return'} at {timeLabel}
        </h2>
      </div>

      {/* Client Card */}
      <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 ${avatarColor(event.client)}`}
        >
          {getInitials(event.client)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-900 text-sm">{event.client}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              On Duty
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Client</p>
        </div>
        <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </div>

      {/* Info Rows */}
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Driver</p>
            <p className="font-medium text-slate-800">
              {event.driver === 'None' ? (
                <span className="text-slate-400 italic">No driver assigned</span>
              ) : (
                event.driver
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Start Date</p>
            <p className="font-medium text-slate-800">{event.startDate}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">End Date</p>
            <p className="font-medium text-slate-800">{event.endDate}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Note</p>
            <p className="font-medium text-slate-700">{event.note}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* Car Card */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Vehicle</p>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 flex items-center gap-4">
          {/* Car silhouette placeholder */}
          <div className="w-16 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Car className="w-8 h-8 text-white/80" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">{event.car}</p>
            <p className="text-slate-300 text-xs mt-0.5">{event.carType} · {event.transmission}</p>
          </div>
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
      </div>

      {/* Update Button */}
      <Button variant="primary" className="w-full mt-auto">
        Update Now
      </Button>
    </div>
  );
}

// ─── Calendar Page ───────────────────────────────────────────────────────────
export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Pickup', 'Return'];

  const filteredEvents = events.filter((e) => {
    if (activeFilter === 'All') return true;
    return e.type === activeFilter.toLowerCase();
  });

  // Build lookup: day -> hour -> events[]
  const eventMap = {};
  filteredEvents.forEach((e) => {
    const key = `${e.day}-${e.hour}`;
    if (!eventMap[key]) eventMap[key] = [];
    eventMap[key].push(e);
  });

  return (
    <div className="flex gap-5 h-full min-h-0">
      {/* ── Left: Calendar Grid ──────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Today</Button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
              <h2 className="font-bold text-slate-900 text-base ml-1">
                14 – 20 {WEEK_START.month} {WEEK_START.year}
              </h2>
            </div>

            {/* Right: Filter tabs + Week dropdown */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeFilter === f
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Week
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-auto flex-1">
          <table className="w-full text-xs border-collapse min-w-[640px]">
            <thead>
              <tr>
                {/* Time label column */}
                <th className="w-16 py-3 px-2 text-right text-slate-400 font-medium border-b border-slate-100 sticky left-0 bg-white z-10" />
                {DAYS.map((day, i) => (
                  <th
                    key={day}
                    className="py-3 px-2 text-center font-semibold text-slate-600 border-b border-slate-100 border-l border-slate-50"
                  >
                    <span className="text-slate-400 font-normal block">{day}</span>
                    <span
                      className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center mx-auto font-bold text-sm ${
                        DAY_DATES[i] === 14
                          ? 'bg-red-500 text-white'
                          : 'text-slate-900'
                      }`}
                    >
                      {DAY_DATES[i]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour} className="border-b border-slate-50">
                  {/* Time */}
                  <td className="py-2 px-2 text-right text-slate-400 font-medium align-top sticky left-0 bg-white z-10 whitespace-nowrap">
                    {formatHour(hour)}
                  </td>
                  {/* Day columns */}
                  {DAYS.map((_, dayIdx) => {
                    const key = `${dayIdx + 1}-${hour}`;
                    const cellEvents = eventMap[key] || [];
                    return (
                      <td
                        key={dayIdx}
                        className="py-1.5 px-1.5 align-top border-l border-slate-50 min-w-[110px]"
                        style={{ verticalAlign: 'top' }}
                      >
                        {cellEvents.map((ev) => (
                          <EventBlock
                            key={ev.id}
                            event={ev}
                            isSelected={selectedEvent?.id === ev.id}
                            onClick={setSelectedEvent}
                          />
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-xs text-slate-500 font-medium">Pickup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-xs text-slate-500 font-medium">Return</span>
          </div>
        </div>
      </div>

      {/* ── Right: Detail Panel ──────────────────────────────────────────── */}
      <div className="w-72 xl:w-80 flex-shrink-0 flex flex-col">
        <DetailPanel event={selectedEvent} />
      </div>
    </div>
  );
}
