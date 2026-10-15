import { useState, useMemo } from 'react';
import {
  Plus, LayoutList, LayoutGrid, Search, Users, Fuel, Settings2,
  Pencil, Trash2, CheckSquare, X, Eye, Gauge, Zap, Wind, ShieldCheck,
  Calendar, Wrench, CheckCircle2, AlertTriangle, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  SectionHeader, Card, Badge, Table, SearchBar, Button, Modal
} from '../../components/ui';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const UNITS = [
  {
    id: 1,
    brand: 'Aston',
    model: 'Martin',
    category: 'Convertible',
    status: 'available',
    seats: 2,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rate: 130,
    plate: 'TX-4234',
    color: '#3B82F6',
    topSpeed: '310 km/h',
    acceleration: '3.6s (0-100)',
    range: '620 km',
    horsepower: '503 hp',
    description: 'The Aston Martin offers high performance with refined interior ergonomics, ideal for premium executive trips.',
    totalTraveledYear: '14,250 Km',
    features: ['Adaptive Cruise Control', 'Bang & Olufsen Audio', 'Carbon Ceramic Brakes', 'Keyless Go', 'Surround View 360', 'Heated & Cooled Seats'],
    reminders: [
      { id: 1, title: 'Engine Oil & Filter Service', date: '2028-08-25', type: 'urgent' },
      { id: 2, title: 'Brake Pads Inspection', date: '2028-09-10', type: 'scheduled' }
    ]
  },
  {
    id: 2,
    brand: 'Hyundai',
    model: 'Sonata',
    category: 'Sedan',
    status: 'unavailable',
    seats: 5,
    transmission: 'Manual',
    fuel: 'Diesel',
    rate: 45,
    plate: 'TX-8832',
    color: '#6366F1',
    topSpeed: '210 km/h',
    acceleration: '8.4s (0-100)',
    range: '890 km',
    horsepower: '180 hp',
    description: 'Reliable business sedan with outstanding fuel efficiency, smooth highway handling and comfortable passenger space.',
    totalTraveledYear: '28,400 Km',
    features: ['Apple CarPlay & Android Auto', 'Lane Keeping Assist', 'Rearview Camera', 'Dual-Zone Climate Control'],
    reminders: [
      { id: 1, title: 'Scheduled Return from Contract', date: '2028-08-20', type: 'scheduled' }
    ]
  },
  {
    id: 3,
    brand: 'Nissan',
    model: 'Ariya',
    category: 'SUV',
    status: 'available',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Electric',
    rate: 55,
    plate: 'TX-1122',
    color: '#10B981',
    topSpeed: '200 km/h',
    acceleration: '5.1s (0-100)',
    range: '500 km',
    horsepower: '389 hp',
    description: 'Full electric crossover featuring e-4ORCE all-wheel drive, whisper-quiet cabin, and quick DC charging capability.',
    totalTraveledYear: '19,100 Km',
    features: ['ProPILOT Assist 2.0', 'Panoramic Sunroof', 'Wireless Charging', 'Zero Emission Badge', 'Blind Spot Intervention'],
    reminders: [
      { id: 1, title: 'Battery Health Telemetry Check', date: '2028-08-30', type: 'info' }
    ]
  },
  {
    id: 4,
    brand: 'Range Rover',
    model: 'Velar',
    category: 'SUV',
    status: 'maintenance',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Hybrid',
    rate: 60,
    plate: 'TX-4421',
    color: '#F59E0B',
    topSpeed: '240 km/h',
    acceleration: '5.4s (0-100)',
    range: '680 km',
    horsepower: '404 hp',
    description: 'Luxury plug-in hybrid SUV featuring flush door handles, air suspension, and refined off-road capabilities.',
    totalTraveledYear: '22,800 Km',
    features: ['Air Suspension', 'Meridian Sound System', 'Matrix LED Headlights', 'Terrain Response 2', 'Head-up Display'],
    reminders: [
      { id: 1, title: 'Tire Replacement & Wheel Alignment', date: '2028-08-18', type: 'urgent' },
      { id: 2, title: 'Coolant Flush', date: '2028-09-02', type: 'scheduled' }
    ]
  },
  {
    id: 5,
    brand: 'Audi',
    model: 'LX3 / Q7',
    category: 'SUV',
    status: 'available',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rate: 120,
    plate: 'TX-9901',
    color: '#EF4444',
    topSpeed: '250 km/h',
    acceleration: '5.9s (0-100)',
    range: '740 km',
    horsepower: '340 hp',
    description: 'Three-row spacious premium SUV with quattro permanent all-wheel drive, perfect for VIP family rentals and delegations.',
    totalTraveledYear: '31,500 Km',
    features: ['Quattro AWD', 'Virtual Cockpit Plus', 'Four-Zone Climate Control', 'Power Folding 3rd Row', 'Audi Pre Sense Front'],
    reminders: [
      { id: 1, title: 'Quarterly Technical Inspection', date: '2028-08-28', type: 'scheduled' }
    ]
  },
];

const ACTIVITY_DATA = [
  { month: 'Jan', km: 2400 },
  { month: 'Feb', km: 1800 },
  { month: 'Mar', km: 3100 },
  { month: 'Apr', km: 2900 },
  { month: 'May', km: 3400 },
  { month: 'Jun', km: 3800 },
  { month: 'Jul', km: 4200 },
  { month: 'Aug', km: 3900 },
];

const STATUS_VARIANT = {
  available:   'available',
  maintenance: 'maintenance',
  unavailable: 'unavailable',
};

const STATUS_LABEL = {
  available:   'Available',
  maintenance: 'Maintenance',
  unavailable: 'Unavailable',
};

// ─── Car Photo Placeholder ───────────────────────────────────────────────────

function CarPlaceholder({ brand, model, color, size = 'list' }) {
  const isGrid = size === 'grid';
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl font-bold select-none ${
        isGrid ? 'w-full h-32 text-lg' : 'w-20 h-14 text-base'
      }`}
      style={{ background: `${color}18`, border: `2px solid ${color}30` }}
    >
      <span style={{ color }} className={isGrid ? 'text-2xl' : 'text-lg'}>
        {brand[0]}
      </span>
      <span style={{ color, opacity: 0.75 }} className="text-xs font-medium mt-0.5">
        {model}
      </span>
    </div>
  );
}

// ─── Spec Pill ───────────────────────────────────────────────────────────────

function SpecPill({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">
      <Icon className="w-3 h-3 text-slate-400" />
      {label}
    </span>
  );
}

export default function Units() {
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Filter logic
  const filtered = useMemo(() => {
    return UNITS.filter((u) => {
      const matchSearch =
        u.brand.toLowerCase().includes(search.toLowerCase()) ||
        u.model.toLowerCase().includes(search.toLowerCase()) ||
        u.plate.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || u.category === typeFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, typeFilter, statusFilter]);

  // List columns
  const listColumns = [
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <CarPlaceholder brand={row.brand} model={row.model} color={row.color} size="list" />
          <div>
            <p className="font-bold text-slate-900 leading-tight">
              {row.brand} {row.model}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{row.plate}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Type',
      render: (v) => <Badge variant="default">{v}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (v) => <Badge variant={STATUS_VARIANT[v]}>{STATUS_LABEL[v]}</Badge>,
    },
    {
      key: 'seats',
      header: 'Seats',
      render: (v) => (
        <span className="flex items-center gap-1 text-sm text-slate-600">
          <Users className="w-3.5 h-3.5 text-slate-400" /> {v}
        </span>
      ),
    },
    {
      key: 'transmission',
      header: 'Transmission',
      render: (v) => (
        <span className="flex items-center gap-1 text-sm text-slate-600">
          <Settings2 className="w-3.5 h-3.5 text-slate-400" /> {v}
        </span>
      ),
    },
    {
      key: 'fuel',
      header: 'Fuel',
      render: (v) => (
        <span className="flex items-center gap-1 text-sm text-slate-600">
          <Fuel className="w-3.5 h-3.5 text-slate-400" /> {v}
        </span>
      ),
    },
    {
      key: 'rate',
      header: 'Daily Rate',
      render: (v) => (
        <span className="font-bold text-red-500 text-sm">${v}<span className="text-xs font-normal text-slate-400">/day</span></span>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedUnit(row)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Select
          </button>
          <button
            title="Edit"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            title="Delete"
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Units"
        subtitle="Manage fleet inventory, specifications, and availability"
        action={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            + Add Unit
          </Button>
        }
      />

      {/* Toolbar */}
      <Card padding={false} className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <SearchBar
              placeholder="Search by brand, model, plate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="all">All Types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Convertible">Convertible</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="unavailable">Unavailable</option>
          </select>

          {/* View Toggle */}
          <div className="ml-auto flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              onClick={() => setViewMode('list')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {viewMode === 'list' ? (
        <Card padding={false}>
          <Table
            columns={listColumns}
            data={filtered}
            emptyMessage="No vehicles match your filters."
          />
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
            <span>Showing {filtered.length} of {UNITS.length} units</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-500">← Prev</button>
              <button className="w-7 h-7 rounded-lg bg-red-500 text-white text-xs font-semibold">1</button>
              <button className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-500">Next →</button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700">No vehicles found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((unit) => (
                <Card key={unit.id} className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <CarPlaceholder brand={unit.brand} model={unit.model} color={unit.color} size="grid" />
                    <div className="flex items-start justify-between mt-3 mb-1">
                      <div>
                        <h4 className="font-bold text-slate-900">{unit.brand} {unit.model}</h4>
                        <p className="text-xs text-slate-400 font-mono">{unit.plate}</p>
                      </div>
                      <Badge variant={STATUS_VARIANT[unit.status]}>{STATUS_LABEL[unit.status]}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1.5 my-3">
                      <SpecPill icon={Users} label={`${unit.seats} Seats`} />
                      <SpecPill icon={Settings2} label={unit.transmission} />
                      <SpecPill icon={Fuel} label={unit.fuel} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Daily rate</span>
                      <p className="text-lg font-bold text-red-500">${unit.rate}<span className="text-xs font-normal text-slate-400">/day</span></p>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => setSelectedUnit(unit)}>
                      <Eye className="w-3.5 h-3.5" />
                      Select
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ─── Unit Details Modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={Boolean(selectedUnit)}
        onClose={() => setSelectedUnit(null)}
        title={selectedUnit ? `${selectedUnit.brand} ${selectedUnit.model} (${selectedUnit.plate})` : 'Unit Details'}
        size="xl"
      >
        {selectedUnit && (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Top row: Gallery hero + quick specs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5">
                <div
                  className="w-full h-48 rounded-2xl flex flex-col items-center justify-center font-bold shadow-inner"
                  style={{ background: `${selectedUnit.color}15`, border: `2px solid ${selectedUnit.color}35` }}
                >
                  <span className="text-4xl" style={{ color: selectedUnit.color }}>{selectedUnit.brand}</span>
                  <span className="text-sm font-medium mt-1 text-slate-600">{selectedUnit.model} • {selectedUnit.category}</span>
                  <span className="mt-3 px-3 py-1 bg-white rounded-full text-xs font-mono font-bold text-slate-700 shadow-sm">
                    {selectedUnit.plate}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedUnit.brand} {selectedUnit.model}</h3>
                    <p className="text-xs text-slate-400">Category: {selectedUnit.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-red-500">${selectedUnit.rate}<span className="text-xs font-normal text-slate-400">/day</span></p>
                    <Badge variant={STATUS_VARIANT[selectedUnit.status]}>{STATUS_LABEL[selectedUnit.status]}</Badge>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedUnit.description}
                </p>

                {/* 6 Specs badges */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Transmission</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedUnit.transmission}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Capacity</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedUnit.seats} Seats</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Fuel</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedUnit.fuel}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Top Speed</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedUnit.topSpeed}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">0-100 km/h</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedUnit.acceleration}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Range</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedUnit.range}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Chart: Total traveled this year */}
            <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Activity: Total Traveled This Year</h4>
                  <p className="text-xs text-slate-500">Cumulative mileage telemetry</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Distance</span>
                  <p className="text-sm font-black text-slate-900">{selectedUnit.totalTraveledYear}</p>
                </div>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ACTIVITY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mileageGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      formatter={(v) => [`${v} km`, 'Distance']}
                    />
                    <Area type="monotone" dataKey="km" stroke="#EF4444" strokeWidth={2} fill="url(#mileageGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Car Features & Reminders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Features */}
              <div className="p-4 bg-white border border-slate-100 rounded-xl">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Car Features & Equipment
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedUnit.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reminders */}
              <div className="p-4 bg-white border border-slate-100 rounded-xl">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  Specific Reminders & Service
                </h4>
                <div className="space-y-2">
                  {selectedUnit.reminders.map((rem) => (
                    <div
                      key={rem.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                        rem.type === 'urgent'
                          ? 'bg-red-50/50 border-red-200 text-red-700'
                          : 'bg-amber-50/50 border-amber-200 text-amber-800'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold">{rem.title}</p>
                        <p className="text-[11px] opacity-75 mt-0.5">Due: {rem.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedUnit(null)}>
                Close
              </Button>
              <Button variant="primary" size="sm">
                Reserve / Create Booking
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
