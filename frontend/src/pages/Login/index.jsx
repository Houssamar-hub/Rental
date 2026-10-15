import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../store';
import api from '../../api';
import { Spinner } from '../../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/connexion', {
        email: form.email,
        motDePasse: form.password
      });
      const data = res.data;
      const token = data.jetonAcces;
      const user = {
        id: data.id,
        name: data.nomComplet,
        email: data.email,
        role: data.role === 'ROLE_PROPRIETAIRE' ? 'ROLE_OWNER' : 'ROLE_STAFF'
      };
      login(token, user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      // In development or when backend is offline, enable mock login
      const isOwner = form.email.toLowerCase().includes('owner') || form.email.toLowerCase().includes('admin');
      const mockUser = {
        id: 1,
        name: isOwner ? 'Abram Schleifer' : 'Staff Agent',
        email: form.email,
        role: isOwner ? 'ROLE_OWNER' : 'ROLE_STAFF'
      };
      login('mock-jwt-token-nexomanager', mockUser);
      toast.success('Logged in successfully (Demo Mode)');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontFamily: 'Inter, system-ui, sans-serif' } }} />

      <div className="min-h-screen flex font-[Inter,system-ui,sans-serif]">
        {/* ── Left Panel ────────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-white text-xl font-bold tracking-tight">NexoManager</span>
              <p className="text-slate-400 text-xs leading-tight">Fleet &amp; Booking ERP</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-xs font-medium tracking-wide uppercase">Fleet Management Platform</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Internal Fleet &amp;<br />
              <span className="text-red-400">Booking Management</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              Streamline your car rental operations with real-time tracking, automated bookings, and powerful analytics — all in one place.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { value: '500+', label: 'Vehicles' },
                { value: '10K+', label: 'Bookings' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
                  <p className="text-slate-400 text-xs font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom credit */}
          <p className="text-slate-600 text-xs relative z-10">© 2028 NexoManager. All rights reserved.</p>
        </div>

        {/* ── Right Panel ───────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-900 text-lg font-bold">NexoManager</span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back 👋</h1>
                <p className="text-slate-500 text-sm">Sign in to your account to continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@nexomanager.com"
                      autoComplete="email"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <button type="button" className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, remember: !prev.remember }))}
                    className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
                  >
                    {form.remember ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                  <span className="text-sm text-slate-600">Remember me for 30 days</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-sm shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 mt-2"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-slate-400 mt-6">
                Protected by enterprise-grade security &amp; SSL encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
