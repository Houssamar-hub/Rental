import { useState } from 'react';
import { Search, MapPin, Clock, Navigation, Car } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockVehicles = [
  { id: 1, client: 'Helen Martinez', car: 'Chevrolet Bolt', plate: 'CB-4521', driver: 'Daniel Jackson', status: 'returned', startDate: 'Aug 2, 2028', endDate: 'Aug 8, 2028', duration: '2 hours 30 min', distance: '160 miles', lat: 34.05, lng: -118.24 },
  { id: 2, client: 'Bob Smith', car: 'Honda Civic', plate: 'HC-8832', driver: 'John Adams', status: 'ontrip', startDate: 'Aug 3, 2028', endDate: 'Aug 10, 2028', duration: '5 hours 15 min', distance: '280 miles', lat: 34.07, lng: -118.20 },
  { id: 3, client: 'Diana White', car: 'Chevrolet Bolt', plate: 'CB-1221', driver: 'None', status: 'ontrip', startDate: 'Aug 3, 2028', endDate: 'Aug 6, 2028', duration: '1 hour 45 min', distance: '95 miles', lat: 34.03, lng: -118.26 },
  { id: 4, client: 'Edward Green', car: 'Nissan Leaf', plate: 'NL-5543', driver: 'Emily Brown', status: 'returned', startDate: 'Aug 1, 2028', endDate: 'Aug 5, 2028', duration: '3 hours 20 min', distance: '210 miles', lat: 34.06, lng: -118.22 },
  { id: 5, client: 'Fiona Brown', car: 'BMW X5', plate: 'BX-9901', driver: 'Michael Clark', status: 'ontrip', startDate: 'Aug 4, 2028', endDate: 'Aug 11, 2028', duration: '6 hours 50 min', distance: '380 miles', lat: 34.08, lng: -118.18 },
  { id: 6, client: 'George Clark', car: 'Audi Q7', plate: 'AQ-3344', driver: 'Sarah Davis', status: 'ontrip', startDate: 'Aug 5, 2028', endDate: 'Aug 12, 2028', duration: '4 hours 10 min', distance: '245 miles', lat: 34.04, lng: -118.25 },
  { id: 7, client: 'Helen Martinez', car: 'Mazda CX-5', plate: 'MX-7789', driver: 'James Evans', status: 'returned', startDate: 'Aug 2, 2028', endDate: 'Aug 9, 2028', duration: '2 hours 55 min', distance: '175 miles', lat: 34.05, lng: -118.21 },
  { id: 8, client: 'Laura King', car: 'Tesla Model 3', plate: 'TM-2211', driver: 'None', status: 'ontrip', startDate: 'Aug 6, 2028', endDate: 'Aug 13, 2028', duration: '7 hours 30 min', distance: '420 miles', lat: 34.09, lng: -118.17 },
  { id: 9, client: 'Ivan Rodriguez', car: 'Hyundai Elantra', plate: 'HE-6654', driver: 'Laura Fisher', status: 'returned', startDate: 'Aug 1, 2028', endDate: 'Aug 4, 2028', duration: '1 hour 20 min', distance: '85 miles', lat: 34.02, lng: -118.27 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-orange-500', 'bg-teal-500',
];

function avatarColor(id) {
  return avatarColors[(id - 1) % avatarColors.length];
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isOnTrip = status === 'ontrip';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        isOnTrip
          ? 'bg-blue-100 text-blue-700'
          : 'bg-slate-100 text-slate-600'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOnTrip ? 'bg-blue-500' : 'bg-slate-400'
        }`}
      />
      {isOnTrip ? 'On Trip' : 'Returned'}
    </span>
  );
}

// ─── Vehicle List Item ────────────────────────────────────────────────────────
function VehicleItem({ vehicle, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
        selected
          ? 'bg-red-50 border border-red-100'
          : 'hover:bg-slate-50 border border-transparent'
      }`}
    >
      {/* Car silhouette placeholder */}
      <div
        className={`w-12 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          vehicle.status === 'ontrip' ? 'bg-blue-100' : 'bg-slate-100'
        }`}
      >
        <Car
          size={22}
          className={vehicle.status === 'ontrip' ? 'text-blue-500' : 'text-slate-400'}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">{vehicle.client}</p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{vehicle.car} · {vehicle.plate}</p>
      </div>

      <StatusBadge status={vehicle.status} />
    </button>
  );
}

// ─── Mock Map ─────────────────────────────────────────────────────────────────
function MockMap({ vehicle }) {
  return (
    <div className="relative w-full h-full bg-slate-200 overflow-hidden rounded-xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-300 opacity-60" />

      {/* Grid lines to simulate map */}
      <svg className="absolute inset-0 w-full h-full opacity-30" style={{ zIndex: 1 }}>
        {/* Horizontal lines */}
        {[...Array(11)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#94A3B8" strokeWidth="1" />
        ))}
        {/* Vertical lines */}
        {[...Array(11)].map((_, i) => (
          <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#94A3B8" strokeWidth="1" />
        ))}
      </svg>

      {/* Road / path overlay */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
        {/* Road blocks (gray thick lines) */}
        <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#CBD5E1" strokeWidth="12" />
        <line x1="35%" y1="0" x2="35%" y2="100%" stroke="#CBD5E1" strokeWidth="12" />
        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#CBD5E1" strokeWidth="8" />
        <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#CBD5E1" strokeWidth="8" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#CBD5E1" strokeWidth="6" />

        {/* Road center dashes */}
        <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="20,15" />
        <line x1="35%" y1="0" x2="35%" y2="100%" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="20,15" />

        {/* Trip path */}
        <polyline
          points="100,300 200,250 300,200 400,280 500,180 600,220 700,150"
          fill="none"
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Start point */}
        <circle cx="100" cy="300" r="5" fill="#64748B" />

        {/* Current position dot */}
        <circle cx="700" cy="150" r="8" fill="#EF4444" />
        <circle cx="700" cy="150" r="14" fill="#EF4444" fillOpacity="0.3" />
      </svg>

      {/* Map controls (decorative) */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
        <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-slate-600 font-bold text-lg leading-none hover:bg-slate-50">+</button>
        <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-slate-600 font-bold text-lg leading-none hover:bg-slate-50">−</button>
      </div>

      {/* Compass (decorative) */}
      <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center z-10">
        <Navigation size={14} className="text-red-500" />
      </div>

      {/* Vehicle label on map */}
      {vehicle && (
        <div
          className="absolute z-10 bg-white rounded-lg shadow-lg px-2 py-1 text-xs font-semibold text-slate-700 border border-slate-100 flex items-center gap-1"
          style={{ top: '120px', left: '670px', transform: 'translate(-50%, -140%)' }}
        >
          <MapPin size={10} className="text-red-500" />
          {vehicle.plate}
        </div>
      )}

      {/* Bottom trip info overlay */}
      {vehicle && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4">
            {/* Client avatar */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${avatarColor(vehicle.id)}`}
            >
              {initials(vehicle.client)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm">{vehicle.client}</p>
              <p className="text-xs text-slate-400 truncate">
                {vehicle.car} · {vehicle.plate} · Driver: {vehicle.driver}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 border-l border-slate-100 pl-4">
              <div className="flex flex-col items-center">
                <span className="font-semibold text-slate-700">{vehicle.duration}</span>
                <span>Trip Time</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-slate-700">{vehicle.distance}</span>
                <span>Distance</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Right Panel: Rent Info Card ──────────────────────────────────────────────
function RentInfoCard({ vehicle }) {
  if (!vehicle) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center h-full text-slate-400 gap-2">
        <MapPin size={32} />
        <p className="text-sm font-medium">Select a vehicle</p>
        <p className="text-xs text-center">Click on a vehicle in the list to view its details</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-5 h-full overflow-y-auto">
      {/* Client */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${avatarColor(vehicle.id)}`}
        >
          {initials(vehicle.client)}
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-800">{vehicle.client}</p>
          <p className="text-xs text-slate-400 mt-0.5">Client</p>
        </div>
      </div>

      {/* Car photo placeholder */}
      <div className="bg-slate-100 rounded-xl h-32 flex flex-col items-center justify-center gap-2">
        <Car size={36} className="text-slate-400" />
        <p className="text-sm font-semibold text-slate-600">{vehicle.car}</p>
        <p className="text-xs text-slate-400">{vehicle.plate}</p>
      </div>

      {/* Trip details */}
      <div className="flex flex-col gap-3">
        <InfoRow label="Driver" value={vehicle.driver === 'None' ? '—' : vehicle.driver} />
        <InfoRow label="Start Date" value={vehicle.startDate} />
        <InfoRow label="End Date" value={vehicle.endDate} />
        <InfoRow
          label="Status"
          value={
            <StatusBadge status={vehicle.status} />
          }
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Clock size={14} className="text-blue-500" />} label="Total Time" value={vehicle.duration} bg="bg-blue-50" />
        <StatCard icon={<Navigation size={14} className="text-red-500" />} label="Distance" value={vehicle.distance} bg="bg-red-50" />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400">{label}</span>
      {typeof value === 'string' ? (
        <span className="text-xs font-semibold text-slate-700">{value}</span>
      ) : (
        value
      )}
    </div>
  );
}

function StatCard({ icon, label, value, bg }) {
  return (
    <div className={`${bg} rounded-xl p-3 flex flex-col gap-1`}>
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Tracking() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(mockVehicles[0]);

  const filtered = mockVehicles.filter(
    (v) =>
      v.client.toLowerCase().includes(search.toLowerCase()) ||
      v.car.toLowerCase().includes(search.toLowerCase()) ||
      v.plate.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-72px)] gap-4 p-4 bg-slate-100 overflow-hidden">
      {/* ── Column 1: Vehicle List ─────────────────────────────────────────── */}
      <div className="w-64 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-base mb-3">Fleet Tracking</h2>
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicle…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 && (
            <p className="text-xs text-slate-400 text-center mt-6">No vehicles found.</p>
          )}
          {filtered.map((v) => (
            <VehicleItem
              key={v.id}
              vehicle={v}
              selected={selected?.id === v.id}
              onClick={() => setSelected(v)}
            />
          ))}
        </div>

        {/* Footer count */}
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          {mockVehicles.filter((v) => v.status === 'ontrip').length} on trip ·{' '}
          {mockVehicles.filter((v) => v.status === 'returned').length} returned
        </div>
      </div>

      {/* ── Column 2: Map ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 overflow-hidden rounded-2xl shadow-sm">
        <MockMap vehicle={selected} />
      </div>

      {/* ── Column 3: Rent Info ───────────────────────────────────────────── */}
      <div className="w-60 flex-shrink-0">
        <RentInfoCard vehicle={selected} />
      </div>
    </div>
  );
}
