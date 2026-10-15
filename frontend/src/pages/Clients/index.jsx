import { useState, useMemo } from 'react';
import { Plus, CreditCard, FileText, Pencil, Trash2, Search } from 'lucide-react';
import { Button, Badge, Avatar, SectionHeader, Card } from '../../components/ui';

// ─── Mock Data ──────────────────────────────────────────────────────────────
const ALL_CLIENTS = [
  { id: 1,  name: 'Alice Johnson',   email: 'alice@example.com',   phone: '123-456-7890', address: '123 Abram Residence Card, Abram License', points: 100 },
  { id: 2,  name: 'Bob Smith',       email: 'bob@example.com',     phone: '234-567-8901', address: '456 Oak Avenue',                          points: 250 },
  { id: 3,  name: 'Charlie Davis',   email: 'charlie@example.com', phone: '345-678-9012', address: '789 Pine Road',                           points: 80  },
  { id: 4,  name: 'Diana White',     email: 'diana@example.com',   phone: '456-789-0123', address: '321 Maple Street',                        points: 320 },
  { id: 5,  name: 'Edward Green',    email: 'edward@example.com',  phone: '567-890-1234', address: '654 Elm Drive',                           points: 45  },
  { id: 6,  name: 'Fiona Brown',     email: 'fiona@example.com',   phone: '678-901-2345', address: '987 Cedar Lane',                          points: 180 },
  { id: 7,  name: 'George Clark',    email: 'george@example.com',  phone: '789-012-3456', address: '147 Birch Way',                           points: 290 },
  { id: 8,  name: 'Helen Martinez',  email: 'helen@example.com',   phone: '890-123-4567', address: '258 Willow Court',                        points: 55  },
  { id: 9,  name: 'Ivan Rodriguez',  email: 'ivan@example.com',    phone: '901-234-5678', address: '369 Spruce Ave',                          points: 410 },
  { id: 10, name: 'Jane Wilson',     email: 'jane@example.com',    phone: '012-345-6789', address: '741 Aspen Blvd',                          points: 120 },
  { id: 11, name: 'Kyle Thompson',   email: 'kyle@example.com',    phone: '123-456-0987', address: '852 Oak Lane',                            points: 200 },
  { id: 12, name: 'Laura King',      email: 'laura@example.com',   phone: '234-567-1098', address: '963 Maple Drive',                         points: 75  },
];

const PAGE_SIZE_OPTIONS = [8, 12, 16];

// ─── Points Badge ───────────────────────────────────────────────────────────
function PointsBadge({ points }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
      ★ {points}
    </span>
  );
}

// ─── Clients Page ────────────────────────────────────────────────────────────
export default function ClientsPage() {
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(8);
  const [clients, setClients]     = useState(ALL_CLIENTS);
  const [selected, setSelected]   = useState([]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [search, clients]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ── Select all on current page ─────────────────────────────────────────────
  const pageIds      = paginated.map((c) => c.id);
  const allChecked   = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someChecked  = pageIds.some((id) => selected.includes(id)) && !allChecked;

  function toggleAll() {
    if (allChecked) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageIds])]);
    }
  }

  function toggleOne(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleDelete(client) {
    if (window.confirm(`Delete client "${client.name}"? This action cannot be undone.`)) {
      setClients((prev) => prev.filter((c) => c.id !== client.id));
      setSelected((prev) => prev.filter((id) => id !== client.id));
      // Reset to page 1 if current page is now empty
      const newFiltered = clients.filter((c) => c.id !== client.id).filter((c) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      });
      const newTotal = Math.max(1, Math.ceil(newFiltered.length / pageSize));
      if (page > newTotal) setPage(newTotal);
    }
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Section Header ─────────────────────────────────────────────────── */}
      <SectionHeader
        title="Clients"
        subtitle={`${filtered.length} client${filtered.length !== 1 ? 's' : ''} total`}
        action={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        }
      />

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={handleSearchChange}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm"
        />
      </div>

      {/* ── Table Card ─────────────────────────────────────────────────────── */}
      <Card padding={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {/* Checkbox */}
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 accent-red-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Client
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Phone
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Address
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Documents
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Points
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400 text-sm">
                    No clients match your search.
                  </td>
                </tr>
              ) : (
                paginated.map((client) => (
                  <tr
                    key={client.id}
                    className={`border-b border-slate-50 transition-colors ${
                      selected.includes(client.id)
                        ? 'bg-red-50/40'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(client.id)}
                        onChange={() => toggleOne(client.id)}
                        className="w-4 h-4 rounded border-slate-300 accent-red-500 cursor-pointer"
                      />
                    </td>

                    {/* Client */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={client.name} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{client.name}</p>
                          <p className="text-xs text-slate-400 truncate">{client.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {client.phone}
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4 text-slate-600 max-w-[200px]">
                      <p className="truncate">{client.address}</p>
                    </td>

                    {/* Documents */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          title="ID Card"
                          className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-colors group"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-900" />
                        </button>
                        <button
                          title="Driving License"
                          className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-colors group"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-900" />
                        </button>
                      </div>
                    </td>

                    {/* Points */}
                    <td className="py-3 px-4">
                      <PointsBadge points={client.points} />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          title="Edit"
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center transition-colors group"
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(client)}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-colors group"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ───────────────────────────────────────────── */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/40 gap-3 flex-wrap">
            {/* Page size + count */}
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}
                </span>{' '}
                of <span className="font-semibold text-slate-700">{filtered.length}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="border border-slate-200 rounded-lg px-1.5 py-0.5 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-400"
                >
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Page buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                })
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) {
                    acc.push('...');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`w-8 h-7 rounded-lg text-xs font-semibold transition-all ${
                        item === page
                          ? 'bg-red-500 text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
