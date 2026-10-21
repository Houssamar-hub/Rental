import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => set({ token, user, isAuthenticated: true }),

      logout: () => set({ token: null, user: null, isAuthenticated: false }),

      isOwner: () => get().user?.role === 'ROLE_OWNER',
      isStaff: () => get().user?.role === 'ROLE_STAFF',
    }),
    {
      name: 'nexo-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  notifications: [],
  addNotification: (notif) => set((s) => ({ notifications: [notif, ...s.notifications].slice(0, 20) })),
  clearNotifications: () => set({ notifications: [] }),
}));
