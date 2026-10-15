import { useState } from 'react';
import { Search, Settings, Bell, ChevronDown } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import { Avatar } from '../ui';
import { cn } from '../../utils';

export default function Topbar() {
  const user = useAuthStore((s) => s.user);
  const notifications = useUIStore((s) => s.notifications);
  const [search, setSearch] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-20">
      {/* Global Search */}
      <div className="relative max-w-xs w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Settings */}
        <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700">
          <Settings className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <span className="text-xs text-slate-400">{notifications.length} new</span>
              </div>
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No notifications</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-800">{n.message}</p>
                        <p className="text-xs text-slate-400">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-100 cursor-pointer group">
          <Avatar name={user?.name || user?.username || 'Admin'} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name || user?.username || 'Admin'}</p>
            <p className="text-xs text-slate-400 leading-tight capitalize">{user?.role === 'ROLE_OWNER' ? 'Owner' : 'Staff'}</p>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
