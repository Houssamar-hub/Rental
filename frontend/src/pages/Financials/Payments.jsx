import { useState, useMemo } from 'react';
import {
  Plus, Search, Edit2, Trash2, Eye, CheckCircle2,
  Clock, AlertCircle, DollarSign, FileText, Download,
} from 'lucide-react';
import {
  Badge, Button, Card, KpiCard, SectionHeader, Table,
} from '../../components/ui';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const INVOICES = [
  { id: 'INV-NX1001', client: 'Alice Johnson',   car: 'Toyota Corolla',    rate: 25,  period: '2 Days', amount: 50,  dueDate: '2028-09-05', status: 'completed' },
  { id: 'INV-NX1002', client: 'Bob Smith',        car: 'Honda Civic',       rate: 50,  period: '7 Days', amount: 350, dueDate: '2028-08-20', status: 'awaiting'  },
  { id: 'INV-NX1003', client: 'Charlie Davis',    car: 'Ford Focus',        rate: 30,  period: '3 Days', amount: 90,  dueDate: '2028-09-08', status: 'overdue'   },
  { id: 'INV-NX1004', client: 'Diana White',      car: 'Chevrolet Malibu',  rate: 45,  period: '1 Day',  amount: 45,  dueDate: '2028-08-09', status: 'completed' },
  { id: 'INV-NX1005', client: 'Edward Green',     car: 'Nissan Altima',     rate: 40,  period: '8 Days', amount: 320, dueDate: '2028-08-30', status: 'awaiting'  },
  { id: 'INV-NX1006', client: 'Fiona Brown',      car: 'BMW X5',            rate: 90,  period: '5 Days', amount: 450, dueDate: '2028-09-01', status: 'completed' },
  { id: 'INV-NX1007', client: 'George Clark',     car: 'Audi Q7',           rate: 70,  period: '2 Days', amount: 140, dueDate: '2028-08-15', status: 'overdue'   },
  { id: 'INV-NX1008', client: 'Helen Martinez',   car: 'Mazda CX-5',        rate: 55,  period: '3 Days', amount: 165, dueDate: '2028-08-25', status: 'awaiting'  },
];

const STATUS_MAP = {
  completed: { label: 'Completed', icon: CheckCircle2, badge: 'completed' },
  awaiting:  { label: 'Awaiting',  icon: Clock,         badge: 'awaiting'  },
  overdue:   { label: 'Overdue',   icon: AlertCircle,   badge: 'overdue'   },
};

// ─── Action Buttons ──────────────────────────────────────────────────────────
function ActionButtons() {
  return (
    <div className="flex items-center gap-1">
      <button className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors" title="Edit">
        <Edit2 className="w-3.5 h-3.5" />
      </button>
      <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors" title="Delete">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      <button className="w-7 h-7 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors" title="View">
        <Eye className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Payments() {
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [dateFrom, setDateFrom]     = useState('2028-08-01');
  const [dateTo, setDateTo]         = useState('2028-08-23');

  const filtered = useMemo(() => {
    return INVOICES.filter((inv) => {
      const matchSearch =
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.client.toLowerCase().includes(search.toLowerCase()) ||
        inv.car.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const columns = [
    {
      key: 'id',
      header: 'Invoice ID',
      render: (val) => (
        <span className="font-mono font-semibold text-slate-800 text-xs">{val}</span>
      ),
    },
    {
      key: 'client',
      header: 'Client Name',
      render: (val) => <span className="font-medium text-slate-800">{val}</span>,
    },
    { key: 'car', header: 'Car Model' },
    {
      key: 'rate',
      header: 'Rate/Day',
      render: (val) => <span className="text-slate-700">${val}/day</span>,
    },
    { key: 'period', header: 'Rental Period' },
    {
      key: 'amount',
      header: 'Amount',
      render: (val) => <span className="font-semibold text-slate-900">${val.toLocaleString()}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (val) => (
        <span className="text-slate-600 text-xs">
          {new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => {
        const s = STATUS_MAP[val];
        return (
          <Badge variant={s.badge}>
            <s.icon className="w-3 h-3" /> {s.label}
          </Badge>
        );
      },
    },
    {
      key: 'id',
      header: 'Actions',
      render: () => <ActionButtons />,
    },
  ];

  return (
    <div className="p-6 min-h-full bg-slate-100">
      <SectionHeader
        title="Payments"
        subtitle="Track invoices, billing and payment statuses"
        action={
          <Button variant="primary">
            <Plus className="w-4 h-4" /> Create Invoice
          </Button>
        }
      />

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <KpiCard
          title="Completed Payments"
          value="$22,450"
          change={12.67}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
        />
        <KpiCard
          title="Awaiting Payments"
          value="$15,300"
          change={-1.08}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />
        <KpiCard
          title="Overdue"
          value="$12,730"
          change={1.80}
          icon={AlertCircle}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      {/* Sub-stats row */}
      <div className="grid grid-cols-3 gap-5 mb-6 -mt-2">
        {[
          { label: '390 invoices', color: 'text-emerald-600' },
          { label: '36 invoices',  color: 'text-amber-600'   },
          { label: '86 invoices',  color: 'text-red-600'     },
        ].map(({ label, color }, i) => (
          <div key={i} className={`text-xs font-semibold px-6 ${color}`}>
            <FileText className="w-3 h-3 inline mr-1" />{label}
          </div>
        ))}
      </div>

      {/* ── Invoices Table ────────────────────────────────────────────────── */}
      <Card padding={false}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-5 border-b border-slate-100">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
            />
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
            <span className="text-slate-400 text-sm">—</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="awaiting">Awaiting</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Download */}
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        {/* Table */}
        <Table columns={columns} data={filtered} emptyMessage="No invoices found" />

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing {filtered.length} of {INVOICES.length} invoices</span>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <button className="px-2 py-1 rounded-lg hover:bg-slate-100 disabled:opacity-40" disabled>← Prev</button>
            <button className="w-7 h-7 rounded-lg bg-red-500 text-white font-medium text-xs flex items-center justify-center">1</button>
            <button className="px-2 py-1 rounded-lg hover:bg-slate-100 disabled:opacity-40" disabled>Next →</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
