import axios from 'axios';
import { useAuthStore } from '../store';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ───────────────────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/connexion', {
    email: credentials.email,
    motDePasse: credentials.password || credentials.motDePasse
  }),
  createStaff: (data) => api.post('/auth/collaborateurs', data),
  getProfile: () => api.get('/auth/profil'),
};

// ─── Dashboard ──────────────────────────────────────────────────────────
export const dashboardAPI = {
  getSummary: () => api.get('/tableau-de-bord/resume'),
};

// ─── Bookings ────────────────────────────────────────────────────────────
export const bookingsAPI = {
  getAll: () => api.get('/reservations'),
  create: (data) => api.post('/reservations', data),
  updateStatus: (id, statut) => api.patch(`/reservations/${id}/statut?statut=${statut}`),
  getCalendarEvents: () => api.get('/calendrier/evenements'),
};

// ─── Units (Vehicles) ────────────────────────────────────────────────────
export const unitsAPI = {
  getAll: () => api.get('/vehicules'),
  getById: (id) => api.get(`/vehicules/${id}`),
  create: (data) => api.post('/vehicules', data),
  update: (id, data) => api.put(`/vehicules/${id}`, data),
  delete: (id) => api.delete(`/vehicules/${id}`),
};

// ─── Clients ─────────────────────────────────────────────────────────────
export const clientsAPI = {
  getAll: (recherche) => api.get('/clients', { params: recherche ? { recherche } : {} }),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// ─── Drivers ─────────────────────────────────────────────────────────────
export const driversAPI = {
  getAll: () => api.get('/chauffeurs'),
  getById: (id) => api.get(`/chauffeurs/${id}`),
  create: (data) => api.post('/chauffeurs', data),
  update: (id, data) => api.put(`/chauffeurs/${id}`, data),
};

// ─── Finance ─────────────────────────────────────────────────────────────
export const financeAPI = {
  getPayments: () => api.get('/finances/paiements'),
  createInvoice: (data) => api.post('/finances/factures', data),
  getExpenses: () => api.get('/finances/depenses'),
  createExpense: (data) => api.post('/finances/depenses', data),
};
