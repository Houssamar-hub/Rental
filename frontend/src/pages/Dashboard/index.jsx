import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  DollarSign, CalendarCheck, Car, CheckCircle, Bell,
  ChevronRight, Search, TrendingUp, TrendingDown,
  Clock, AlertCircle, RotateCcw,
} from 'lucide-react';
import {
  Card, Badge, Button, KpiCard, SectionHeader, Table, Select, Avatar,
} from '../../components/ui';

// ─── Mock Data ─────────────────────────────────────────────────────────────

const earningsData = [
  { month: 'Jan', revenue: 5000 },
  { month: 'Feb', revenue: 8000 },
  { month: 'Mar', revenue: 6000 },
  { month: 'Apr', revenue: 9000 },
  { month: 'May', revenue: 12000 },
  { month: 'Jun', revenue: 18450 },
  { month: 'Jul', revenue: 14000 },
  { month: 'Aug', revenue: 16000 },
];

const rentStatusData = [
  { name: 'Hired',     value: 58, color: '#EF4444' },
  { name: 'Pending',   value: 24, color: '#F87171' },
  { name: 'Cancelled', value: 18, color: '#1E293B' },
];

const bookingsOverviewData = [
  { month: 'Jan', done: 40,  cancelled: 10 },
  { month: 'Feb', done: 65,  cancelled: 15 },
  { month: 'Mar', done: 50,  cancelled: 8  },
  { month: 'Apr', done: 80,  cancelled: 20 },
  { month: 'May', done: 95,  cancelled: 12 },
  { month: 'Jun', done: 120, cancelled: 25 },
  { month: 'Jul', done: 100, cancelled: 18 },
  { month: 'Aug', done: 110, cancelled: 22 },
];

const carTypes = [
  { label: 'Sedan',       pct: 30, color: '#EF4444' },
  { label: 'SUV',         pct: 25, color: '#F97316' },
  { label: 'Hatchback',   pct: 20, color: '#EAB308' },
  { label: 'Convertible', pct: 10, color: '#8B5CF6' },
  { label: 'Truck',       pct: 10, color: '#3B82F6' },
  { label: 'Minivan',     pct:  5, color: '#10B981' },
];

const reminders = [
  { id: 1, icon: AlertCircle, color: 'text-red-500',   bg: 'bg-red-50',   text: 'Oil change due — Toyota Corolla',  sub: 'Overdue by 2 days' },
  { id: 2, icon: Clock,       color: 'text-amber-500', bg: 'bg-amber-50', text: 'Insurance renewal — BMW X5',         sub: 'In 3 days' },
  { id: 3, icon: RotateCcw,   color: 'text-blue-500',  bg: 'bg-blue-50',  text: 'Scheduled service — Ford Focus',    sub: 'Aug 10, 2028' },
];

const recentActivity = [
  { time: 'Today',     events: [
    { text: 'Alice Johnson picked up Toyota Corolla', ts: '08:32 AM' },
    { text: 'New booking #BK-NX1009 created',         ts: '10:15 AM' },
    { text: 'Payment received — $350',                ts: '11:44 AM' },
  ]},
  { time: 'Yesterday', events: [
    { text: 'Edward Green cancelled booking',         ts: '02:10 PM' },
    { text: 'Honda Civic returned in good condition', ts: '05:30 PM' },
  ]},
];

const bookings = [
  { id: 'BK-NX1001', date: 'Aug 1, 2028', client: 'Alice Johnson',   car: 'Toyota Corolla',   type: 'Sedan',    plan: '2 Days',  from: 'Aug 1', to: 'Aug 2',  payment: '$350',   payStatus: 'Paid',    status: 'Returned'  },
  { id: 'BK-NX1002', date: 'Aug 1, 2028', client: 'Bob Smith',        car: 'Honda Civic',      type: 'Sedan',    plan: '7 Days',  from: 'Aug 1', to: 'Aug 8',  payment: '$350',   payStatus: 'Pending', status: 'Ongoing'   },
  { id: 'BK-NX1003', date: 'Aug 2, 2028', client: 'Charlie Davis',    car: 'Ford Focus',       type: 'Hatchback',plan: '31 Days', from: 'Aug 2', to: 'Sep 2',  payment: '$1,000', payStatus: 'Paid',    status: 'Ongoing'   },
  { id: 'BK-NX1004', date: 'Aug 2, 2028', client: 'Diana White',      car: 'Chevrolet Malibu', type: 'Sedan',    plan: '1 Day',   from: 'Aug 2', to: 'Aug 3',  payment: '$50',    payStatus: 'Paid',    status: 'Returned'  },
  { id: 'BK-NX1005', date: 'Aug 3, 2028', client: 'Edward Green',     car: 'Nissan Altima',    type: 'Sedan',    plan: '8 Days',  from: 'Aug 3', to: 'Aug 10', payment: '$350',   payStatus: 'Pending', status: 'Cancelled' },
];

const tableColumns = [
  { key: 'id',         header: 'Booking ID',   render: (v) => <span className="font-mono text-xs text-slate-500">{v}</span> },
  { key: 'date',       header: 'Date' },
  { key: 'client',     header: 'Client',       render: (v) => (
    <div className="flex items-center gap-2">
      <Avatar name={v} size="sm" />
      <span className="font-medium text-slate-800">{v}</span>
    </div>
  )},
  { key: 'car',        header: 'Car' },
  { key: 'type',       header: 'Type',         render: (v) => <Badge variant="default">{v}</Badge> },
  { key: 'plan',       header: 'Plan' },
  { key: 'from',       header: 'From' },
  { key: 'to',         header: 'To' },
  { key: 'payment',    header: 'Amount',       render: (v) => <span className="font-semibold text-slate-900">{v}</span> },
  { key: 'payStatus',  header: 'Payment',      render: (v) => <Badge variant={v.toLowerCase()}>{v}</Badge> },
  { key: 'status',     header: 'Status',       render: (v) => <Badge variant={v.toLowerCase()}>{v}</Badge> },
];

// ─── Custom Tooltip ────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' && p.dataKey === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function EarningsSummary() {
  return (
    <Card className="col-span-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Earnings Summary</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">$18,450 <span className="text-sm font-normal text-emerald-500">↑ 14.2%</span></p>
        </div>
        <span className="text-xs text-slate-400">Jan – Aug 2028</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={earningsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#EF4444" strokeWidth={2.5} fill="url(#earningsGradient)" dot={false} activeDot={{ r: 4, fill: '#EF4444' }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

function RentStatusDonut() {
  return (
    <Card className="col-span-3 flex flex-col gap-3">
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Rent Status</p>
        <p className="text-sm text-slate-500 mt-0.5">Current fleet distribution</p>
      </div>
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={rentStatusData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {rentStatusData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold text-slate-900">58%</p>
          <p className="text-xs text-slate-400">Hired</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {rentStatusData.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-slate-600">{d.name}</span>
            </div>
            <span className="font-semibold text-slate-800">{d.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CarAvailabilityChecker() {
  const [carType, setCarType] = useState('');
  const [date, setDate]       = useState('');
  const [time, setTime]       = useState('');
  const [result, setResult]   = useState(null);

  const handleCheck = () => {
    // Mock result
    const available = Math.floor(Math.random() * 12) + 1;
    setResult({ available, type: carType || 'All Types' });
  };

  return (
    <Card className="col-span-4 flex flex-col gap-4">
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Car Availability</p>
        <p className="text-sm text-slate-500 mt-0.5">Check fleet availability by date &amp; type</p>
      </div>

      <div className="space-y-3">
        <Select label="Car Type" value={carType} onChange={(e) => setCarType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Convertible">Convertible</option>
          <option value="Truck">Truck</option>
          <option value="Minivan">Minivan</option>
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>
        </div>

        <Button variant="primary" className="w-full" onClick={handleCheck}>
          <Search className="w-4 h-4" />
          Check Availability
        </Button>
      </div>

      {result && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">{result.available} vehicles available</p>
            <p className="text-xs text-emerald-600">{result.type} · {date || 'Any date'} {time || ''}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

function BookingsOverview() {
  return (
    <Card className="col-span-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Bookings Overview</p>
          <p className="text-slate-900 font-bold text-lg mt-0.5">Monthly Breakdown</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Done</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-800 inline-block" /> Cancelled</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={bookingsOverviewData} barSize={10} barGap={3} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="done"      name="Done"      fill="#EF4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cancelled" name="Cancelled" fill="#1E293B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function CarTypesBar() {
  return (
    <Card className="col-span-3 flex flex-col gap-4">
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Car Types</p>
        <p className="text-slate-900 font-bold text-lg mt-0.5">Fleet Breakdown</p>
      </div>
      <div className="space-y-3 flex-1">
        {carTypes.map((ct) => (
          <div key={ct.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-700 font-medium">{ct.label}</span>
              <span className="text-slate-500 text-xs font-semibold">{ct.pct}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${ct.pct}%`, backgroundColor: ct.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Reminders() {
  return (
    <Card className="col-span-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Reminders</p>
        <Bell className="w-4 h-4 text-slate-400" />
      </div>
      <div className="space-y-3 flex-1">
        {reminders.map((r) => (
          <div key={r.id} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${r.bg}`}>
              <r.icon className={`w-4 h-4 ${r.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{r.text}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-600 transition-colors mt-auto">
        View all <ChevronRight className="w-3 h-3" />
      </button>
    </Card>
  );
}

function RecentActivity() {
  return (
    <Card className="col-span-2 flex flex-col gap-4">
      <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Recent Activity</p>
      <div className="space-y-4 flex-1 overflow-y-auto">
        {recentActivity.map((group) => (
          <div key={group.time}>
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">{group.time}</p>
            <div className="space-y-2 pl-3 border-l-2 border-slate-100">
              {group.events.map((ev, i) => (
                <div key={i}>
                  <p className="text-xs text-slate-700 leading-snug">{ev.text}</p>
                  <p className="text-xs text-slate-400">{ev.ts}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Main Dashboard Page ────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your fleet."
        action={
          <Button variant="primary" size="sm">
            <TrendingUp className="w-4 h-4" />
            Export Report
          </Button>
        }
      />

      {/* ── Row 1: KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value="8,450"
          prefix="$"
          change={2.68}
          icon={DollarSign}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
        <KpiCard
          title="New Bookings"
          value={386}
          change={1.13}
          icon={CalendarCheck}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <KpiCard
          title="Rented Cars"
          value="214"
          suffix=" Unit"
          change={-1.98}
          icon={Car}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />
        <KpiCard
          title="Available Cars"
          value="89"
          suffix=" Unit"
          change={2.46}
          icon={CheckCircle}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
        />
      </div>

      {/* ── Row 2: Earnings + Donut + Availability ────────────────────── */}
      <div className="grid grid-cols-12 gap-4">
        <EarningsSummary />
        <RentStatusDonut />
        <CarAvailabilityChecker />
      </div>

      {/* ── Row 3: Bookings Overview + Car Types + Reminders + Activity ─ */}
      <div className="grid grid-cols-12 gap-4">
        <BookingsOverview />
        <CarTypesBar />
        <Reminders />
        <RecentActivity />
      </div>

      {/* ── Row 4: Recent Bookings Table ──────────────────────────────── */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="font-bold text-slate-900">Recent Bookings</p>
            <p className="text-xs text-slate-400 mt-0.5">Latest 5 reservations</p>
          </div>
          <Button variant="outline" size="sm">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Table columns={tableColumns} data={bookings} />
      </Card>
    </div>
  );
}
