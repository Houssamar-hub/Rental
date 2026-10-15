import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import {
  Plus, Search, ChevronDown, User, Minus, ArrowUpRight, ArrowDownRight,
  CalendarDays, Clock, XCircle, CheckCircle,
} from 'lucide-react';
import {
  SectionHeader, Card, Badge, Table, SearchBar, Button, Select,
} from '../../components/ui';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const sparkData = {
  upcoming: [{ v: 120 }, { v: 130 }, { v: 125 }, { v: 138 }, { v: 133 }, { v: 140 }, { v: 145 }],
  pending:  [{ v: 98  }, { v: 102 }, { v: 99  }, { v: 104 }, { v: 101 }, { v: 103 }, { v: 106 }],
  canceled: [{ v: 92  }, { v: 90  }, { v: 95  }, { v: 89  }, { v: 91  }, { v: 88  }, { v: 86  }],
  completed:[{ v: 270 }, { v: 278 }, { v: 272 }, { v: 285 }, { v: 281 }, { v: 292 }, { v: 298 }],
};

const overviewData = [
  { month: 'Jan', done: 38, canceled: 12 },
  { month: 'Feb', done: 52, canceled: 9  },
  { month: 'Mar', done: 45, canceled: 15 },
  { month: 'Apr', done: 60, canceled: 8  },
  { month: 'May', done: 55, canceled: 11 },
  { month: 'Jun', done: 70, canceled: 7  },
  { month: 'Jul', done: 63, canceled: 13 },
  { month: 'Aug', done: 80, canceled: 5  },
];

const BOOKINGS = [
  { id: 'BK-WZ1001', date: 'Aug 1, 2028', client: 'Alice Johnson',   car: 'Toyota Corolla',    plate: 'TAX234', type: 'Sedan',     plan: '2 Days',  from: 'Aug 1, 2028',  to: 'Aug 2, 2028',  hasDriver: false, amount: '$50',   payStatus: 'paid',    status: 'returned'  },
  { id: 'BK-WZ1002', date: 'Aug 1, 2028', client: 'Bob Smith',       car: 'Honda Civic',       plate: '+6578',  type: 'Sedan',     plan: '7 Days',  from: 'Aug 1, 2028',  to: 'Aug 8, 2028',  hasDriver: true,  amount: '$350',  payStatus: 'pending', status: 'ongoing'   },
  { id: 'BK-WZ1003', date: 'Aug 2, 2028', client: 'Charlie Davis',   car: 'Ford Focus',        plate: 'FX800',  type: 'Hatchback', plan: '31 Days', from: 'Aug 2, 2028',  to: 'Sep 2, 2028',  hasDriver: false, amount: '$1000', payStatus: 'paid',    status: 'ongoing'   },
  { id: 'BK-WZ1004', date: 'Aug 2, 2028', client: 'Diana White',     car: 'Chevrolet Malibu',  plate: 'CX345',  type: 'Sedan',     plan: '1 Day',   from: 'Aug 2, 2028',  to: 'Aug 3, 2028',  hasDriver: true,  amount: '$50',   payStatus: 'paid',    status: 'returned'  },
  { id: 'BK-WZ1005', date: 'Aug 3, 2028', client: 'Edward Green',    car: 'Nissan Altima',     plate: 'NX6785', type: 'Sedan',     plan: '8 Days',  from: 'Aug 3, 2028',  to: 'Aug 10, 2028', hasDriver: false, amount: '$350',  payStatus: 'pending', status: 'cancelled' },
  { id: 'BK-WZ1006', date: 'Aug 3, 2028', client: 'Fiona Brown',     car: 'BMW X5',            plate: 'BX5678', type: 'SUV',       plan: '32 Days', from: 'Aug 3, 2028',  to: 'Sep 3, 2028',  hasDriver: true,  amount: '$1500', payStatus: 'paid',    status: 'ongoing'   },
  { id: 'BK-WZ1007', date: 'Aug 4, 2028', client: 'George Clark',    car: 'Audi Q7',           plate: 'AQ789',  type: 'SUV',       plan: '2 Days',  from: 'Aug 4, 2028',  to: 'Aug 5, 2028',  hasDriver: false, amount: '$70',   payStatus: 'paid',    status: 'returned'  },
  { id: 'BK-WZ1008', date: 'Aug 4, 2028', client: 'Helen Martinez',  car: 'Mazda CX-5',        plate: 'MX234',  type: 'SUV',       plan: '7 Days',  from: 'Aug 4, 2028',  to: 'Aug 11, 2028', hasDriver: true,  amount: '$450',  payStatus: 'pending', status: 'cancelled' },
  { id: 'BK-WZ1009', date: 'Aug 5, 2028', client: 'Ivan Rodriguez',  car: 'Hyundai Elantra',   plate: 'HE901',  type: 'Sedan',     plan: '31 Days', from: 'Aug 5, 2028',  to: 'Sep 5, 2028',  hasDriver: false, amount: '$1200', payStatus: 'paid',    status: 'ongoing'   },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function SparkLine({ data, color = '#EF4444' }) {
  return (
    <LineChart width={80} height={32} data={data}>
      <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
    </LineChart>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name === 'done' ? 'Done' : 'Canceled'}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── KPI Card with Sparkline ─────────────────────────────────────────────────

function KpiSparkCard({ title, value, change, sparkKey, icon: Icon, iconBg, iconColor, sparkColor }) {
  const isPos = parseFloat(change) >= 0;
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${isPos ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
            <span className="text-slate-400 font-normal ml-1">from last month</span>
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <div className="flex justify-end">
        <SparkLine data={sparkData[sparkKey]} color={sparkColor} />
      </div>
    </Card>
  );
}

// ─── Table Columns ───────────────────────────────────────────────────────────

const STATUS_LABELS = { returned: 'Returned', ongoing: 'Ongoing', cancelled: 'Cancelled' };

const columns = [
  {
    key: 'id',
    header: 'Booking ID',
    render: (v) => <span className="font-mono text-xs font-semibold text-slate-700">{v}</span>,
  },
  {
    key: 'date',
    header: 'Booking Date',
    render: (v) => <span className="text-slate-500 text-xs">{v}</span>,
  },
  {
    key: 'client',
    header: 'Client Name',
    render: (v) => <span className="font-medium text-slate-800">{v}</span>,
  },
  {
    key: 'car',
    header: 'Car Model',
    render: (v, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800 text-xs">{v}</span>
        <div className="flex items-center gap-1.5">
          <Badge variant="default" className="text-[10px] px-1.5 py-0">{row.type}</Badge>
          <span className="text-[10px] text-slate-400 font-mono">{row.plate}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'plan',
    header: 'Plan',
    render: (v) => <span className="text-slate-600 text-xs">{v}</span>,
  },
  {
    key: 'from',
    header: 'Date',
    render: (v, row) => (
      <div className="flex flex-col gap-0.5 text-xs text-slate-500">
        <span>{v}</span>
        <span className="text-slate-400">→ {row.to}</span>
      </div>
    ),
  },
  {
    key: 'hasDriver',
    header: 'Driver',
    render: (v) =>
      v ? (
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-blue-600" />
        </div>
      ) : (
        <Minus className="w-4 h-4 text-slate-300" />
      ),
  },
  {
    key: 'amount',
    header: 'Payment',
    render: (v, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800 text-xs">{v}</span>
        <Badge variant={row.payStatus}>{row.payStatus === 'paid' ? 'Paid' : 'Pending'}</Badge>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (v) => {
      const dots = { ongoing: 'bg-blue-500', returned: 'bg-slate-400', cancelled: 'bg-red-400' };
      return (
        <Badge variant={v} className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${dots[v]}`} />
          {STATUS_LABELS[v]}
        </Badge>
      );
    },
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BookingsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return BOOKINGS.filter((b) => {
      const matchSearch =
        !search ||
        b.client.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.car.toLowerCase().includes(search.toLowerCase());
      const matchType   = typeFilter === 'all'   || b.type === typeFilter;
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, typeFilter, statusFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <SectionHeader
        title="Bookings"
        subtitle="Manage and track all vehicle reservations"
        action={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Add Booking
          </Button>
        }
      />

      {/* Row 1 – KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiSparkCard
          title="Upcoming Bookings"
          value="145"
          change={2.97}
          sparkKey="upcoming"
          icon={CalendarDays}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          sparkColor="#3B82F6"
        />
        <KpiSparkCard
          title="Pending Bookings"
          value="106"
          change={1.72}
          sparkKey="pending"
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          sparkColor="#F59E0B"
        />
        <KpiSparkCard
          title="Canceled Bookings"
          value="86"
          change={-4.02}
          sparkKey="canceled"
          icon={XCircle}
          iconBg="bg-red-50"
          iconColor="text-red-500"
          sparkColor="#EF4444"
        />
        <KpiSparkCard
          title="Completed Bookings"
          value="298"
          change={3.15}
          sparkKey="completed"
          icon={CheckCircle}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          sparkColor="#10B981"
        />
      </div>

      {/* Row 2 – Bookings Overview Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Bookings Overview</h2>
            <p className="text-xs text-slate-400 mt-0.5">Monthly done vs canceled bookings</p>
          </div>
          <button className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Last 8 Months <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Done
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-3 h-3 rounded-sm bg-slate-800 inline-block" /> Canceled
          </span>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={overviewData} barCategoryGap="30%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Bar dataKey="done"     name="done"     fill="#EF4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="canceled" name="canceled" fill="#1E293B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Row 3 – Car Bookings Table */}
      <Card padding={false}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          <SearchBar
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="all">All Types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="all">All Statuses</option>
            <option value="ongoing">Ongoing</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="ml-auto">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Add Booking
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} data={filtered} emptyMessage="No bookings match your filters." />

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          <span>Showing {filtered.length} of {BOOKINGS.length} bookings</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-500">← Prev</button>
            <button className="w-7 h-7 rounded-lg bg-red-500 text-white text-xs font-semibold">1</button>
            <button className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-500">Next →</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
