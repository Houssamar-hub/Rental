import { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Wallet, Download,
  Search, Edit2, Trash2, ChevronDown,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Badge, Button, Card, SectionHeader } from '../../components/ui';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const CASHFLOW = [
  { month: 'Jan', income: 10000, expense: 7000  },
  { month: 'Feb', income: 12000, expense: 8500  },
  { month: 'Mar', income: 9500,  expense: 6000  },
  { month: 'Apr', income: 14000, expense: 9000  },
  { month: 'May', income: 18450, expense: 14200 },
  { month: 'Jun', income: 16000, expense: 11000 },
  { month: 'Jul', income: 20000, expense: 13000 },
  { month: 'Aug', income: 22000, expense: 14575 },
  { month: 'Sep', income: 19000, expense: 12000 },
  { month: 'Oct', income: 21000, expense: 13500 },
  { month: 'Nov', income: 23000, expense: 15000 },
  { month: 'Dec', income: 25700, expense: 14000 },
];

const EXPENSE_BREAKDOWN = [
  { name: 'Vehicle Maintenance', value: 3000, pct: 30, color: '#EF4444' },
  { name: 'Staff Salaries',      value: 2500, pct: 25, color: '#1E293B' },
  { name: 'Fuel',                value: 2000, pct: 20, color: '#FB7185' },
  { name: 'Insurance',           value: 1500, pct: 15, color: '#3B82F6' },
  { name: 'Office Supplies',     value: 500,  pct:  5, color: '#F59E0B' },
  { name: 'Marketing',           value: 500,  pct:  5, color: '#10B981' },
];

const TRANSACTIONS = [
  { id: 1, name: 'Oil Change',               category: 'Vehicle Maintenance', color: '#EF4444', qty: 1,  amount: 100,  date: '2024-08-01', status: 'completed' },
  { id: 2, name: 'Fuel Purchase',            category: 'Fuel',                color: '#FB7185', qty: 50, amount: 2000, date: '2024-08-03', status: 'pending'   },
  { id: 3, name: 'Insurance Payment',        category: 'Insurance',           color: '#3B82F6', qty: 1,  amount: 1500, date: '2024-08-05', status: 'completed' },
  { id: 4, name: 'Office Supplies Purchase', category: 'Office Supplies',     color: '#F59E0B', qty: 20, amount: 200,  date: '2024-08-06', status: 'completed' },
  { id: 5, name: 'Marketing Campaign',       category: 'Marketing',           color: '#10B981', qty: 1,  amount: 500,  date: '2024-08-07', status: 'pending'   },
  { id: 6, name: 'Staff Salaries',           category: 'Staff Salaries',      color: '#1E293B', qty: 5,  amount: 2500, date: '2024-08-10', status: 'completed' },
];

// ─── Custom Tooltip for Cashflow ─────────────────────────────────────────────
function CashflowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-slate-800 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500 capitalize">{p.dataKey}:</span>
          <span className="font-semibold text-slate-800">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Custom Pie Tooltip ───────────────────────────────────────────────────────
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-slate-800">{d.name}</p>
      <p className="text-slate-500">${d.value.toLocaleString()} ({d.pct}%)</p>
    </div>
  );
}

// ─── Donut Centre Label ───────────────────────────────────────────────────────
function DonutLabel({ cx, cy }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-0.5em" className="text-base font-bold fill-slate-900" fontSize="16" fontWeight="700" fill="#0F172A">$10,000</tspan>
      <tspan x={cx} dy="1.4em" fontSize="11" fill="#94A3B8">Total</tspan>
    </text>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Expenses() {
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [selected, setSelected]   = useState({});

  const filteredTx = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const toggleSelect = (id) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  const allSelected  = filteredTx.length > 0 && filteredTx.every((t) => selected[t.id]);
  const toggleAll    = () => {
    if (allSelected) setSelected({});
    else setSelected(Object.fromEntries(filteredTx.map((t) => [t.id, true])));
  };

  return (
    <div className="p-6 min-h-full bg-slate-100">
      <SectionHeader
        title="Expenses"
        subtitle="Monitor cashflow, spending categories and transactions"
      />

      {/* ── Row 1: KPI Cards + Donut ──────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {/* Balance */}
        <Card className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Balance</p>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">$155,820</p>
          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.62% <span className="text-slate-400 font-normal">from last month</span>
          </p>
        </Card>

        {/* Income */}
        <Card className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Income</p>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">$25,700</p>
          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2.73% <span className="text-slate-400 font-normal">from last month</span>
          </p>
        </Card>

        {/* Expenses */}
        <Card className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Expenses</p>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">$14,575</p>
          <p className="text-xs font-medium text-red-500 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -5.70% <span className="text-slate-400 font-normal">from last month</span>
          </p>
        </Card>

        {/* Expense Breakdown donut */}
        <Card className="col-span-1 flex flex-col">
          <p className="text-sm font-semibold text-slate-800 mb-2">Expense Breakdown</p>
          <div className="flex-1 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={EXPENSE_BREAKDOWN}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  dataKey="value"
                  labelLine={false}
                  label={DonutLabel}
                >
                  {EXPENSE_BREAKDOWN.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full mt-1">
              {EXPENSE_BREAKDOWN.map((e) => (
                <div key={e.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
                  <span className="text-xs text-slate-500 truncate">{e.name}</span>
                  <span className="text-xs font-semibold text-slate-700 ml-auto">{e.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Row 2: Cashflow Chart ─────────────────────────────────────────── */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Cashflow Overview</h2>
            <p className="text-xs text-slate-500 mt-0.5">Income vs Expenses — Jan to Dec</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
            This Year <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mb-4">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-5 h-0.5 bg-slate-900 inline-block rounded" />Income
          </span>
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-5 h-0.5 bg-red-500 inline-block rounded" />Expense
          </span>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={CASHFLOW} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CashflowTooltip />} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#1E293B"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#1E293B' }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#EF4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Row 3: Recent Transactions Table ──────────────────────────────── */}
      <Card padding={false}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-5 border-b border-slate-100">
          <p className="text-base font-bold text-slate-900 mr-auto">Recent Transactions</p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white w-52"
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
            <option value="pending">Pending</option>
          </select>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              defaultValue="2024-08-01"
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
            <span className="text-slate-400 text-sm">—</span>
            <input
              type="date"
              defaultValue="2024-08-31"
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>

          {/* Download */}
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 px-5 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-red-500 focus:ring-red-400"
                  />
                </th>
                {['Expense Name', 'Category', 'Quantity', 'Amount', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">No transactions found</td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-5">
                      <input
                        type="checkbox"
                        checked={!!selected[tx.id]}
                        onChange={() => toggleSelect(tx.id)}
                        className="rounded border-slate-300 text-red-500 focus:ring-red-400"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{tx.name}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tx.color }} />
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{tx.qty}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">${tx.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={tx.status}>
                        {tx.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing {filteredTx.length} of {TRANSACTIONS.length} transactions</span>
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
