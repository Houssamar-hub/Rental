import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Car, Calendar, Users, UserCheck,
  Wallet, Navigation, MessageCircle, LogOut, ChevronDown
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import { cn } from '../../utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bookings', icon: CalendarDays, label: 'Bookings' },
  { to: '/units', icon: Car, label: 'Units' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/drivers', icon: UserCheck, label: 'Drivers' },
  {
    label: 'Financials',
    icon: Wallet,
    children: [
      { to: '/financials/payments', label: 'Payments' },
      { to: '/financials/expenses', label: 'Expenses' },
    ],
  },
  { to: '/tracking', icon: Navigation, label: 'Tracking' },
  { to: '/messages', icon: MessageCircle, label: 'Messages', badge: true },
];

function NavItem({ item }) {
  const unread = useUIStore((s) => s.unreadMessages);

  if (item.children) {
    return <FinancialsMenu item={item} />;
  }

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group',
          isActive
            ? 'bg-red-50 text-red-500 font-semibold'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-red-500' : 'text-slate-400 group-hover:text-slate-600')} />
          <span className="flex-1">{item.label}</span>
          {item.badge && unread > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function FinancialsMenu({ item }) {
  const isActive = window.location.pathname.startsWith('/financials');
  return (
    <div>
      <div className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium', isActive ? 'text-slate-800' : 'text-slate-500')}>
        <item.icon className="w-4 h-4 flex-shrink-0 text-slate-400" />
        <span className="flex-1">{item.label}</span>
        <ChevronDown className="w-3 h-3" />
      </div>
      <div className="ml-8 flex flex-col gap-0.5">
        {item.children.map((child) => (
          <NavLink
            key={child.to}
            to={child.to}
            className={({ isActive }) =>
              cn('px-3 py-2 rounded-lg text-sm transition-all', isActive ? 'text-red-500 font-semibold' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50')
            }
          >
            {child.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-slate-100 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
          <Car className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-slate-900 leading-tight">NexoManager</p>
          <p className="text-[10px] text-slate-400 leading-tight">NexoManager.app</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavItem key={item.to || item.label} item={item} />
        ))}
      </nav>

      {/* Promo Card */}
      <div className="mx-3 mb-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white">
        <p className="text-xs font-semibold mb-1">Optimize your operations</p>
        <p className="text-[11px] text-slate-400 mb-3">Enhance customer satisfaction with NexoManager</p>
        <button className="w-full py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors">Update Now</button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50/50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </aside>
  );
}
