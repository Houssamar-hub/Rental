import { cn } from '../../utils';

// ─── Button ────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', className, disabled, onClick, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 shadow-sm',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-500 shadow-sm',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 focus:ring-red-300',
    success: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 focus:ring-emerald-300',
  };
  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-red-50 text-red-600',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-700',
    dark: 'bg-slate-800 text-white',
    returned: 'bg-slate-900 text-white',
    ongoing: 'bg-blue-50 text-blue-700',
    cancelled: 'bg-red-50 text-red-600 border border-red-200',
    paid: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    overdue: 'bg-red-50 text-red-600',
    awaiting: 'bg-amber-50 text-amber-700',
    completed: 'bg-emerald-50 text-emerald-700',
    available: 'bg-emerald-50 text-emerald-700',
    maintenance: 'bg-amber-50 text-amber-700',
    unavailable: 'bg-red-50 text-red-600',
    onduty: 'bg-emerald-50 text-emerald-700',
    sickleave: 'bg-red-50 text-red-600',
    halfday: 'bg-amber-50 text-amber-700',
    ontrip: 'bg-blue-50 text-blue-700',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant] || variants.default, className)}>
      {children}
    </span>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────
export function Card({ children, className, padding = true }) {
  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-slate-100', padding && 'p-6', className)}>
      {children}
    </div>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────
export function Input({ label, error, className, icon: Icon, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input
          className={cn(
            'w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            Icon && 'pl-9',
            error && 'border-red-400',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Select ────────────────────────────────────────────────────────────────
export function Select({ label, error, className, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <select
        className={cn(
          'w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Avatar ────────────────────────────────────────────────────────────────
export function Avatar({ src, name, size = 'md', className }) {
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  const initials = name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const colors = ['bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600'];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  if (src) {
    return <img src={src} alt={name || ''} className={cn('rounded-full object-cover', sizes[size], className)} />;
  }
  return (
    <div className={cn('rounded-full flex items-center justify-center font-semibold flex-shrink-0', sizes[size], colors[colorIndex], className)}>
      {initials}
    </div>
  );
}

// ─── Spinner ───────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={cn('animate-spin rounded-full border-2 border-slate-200 border-t-red-500', sizes[size], className)} />
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Icon className="w-7 h-7 text-slate-400" /></div>}
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-400 mb-4">{description}</p>}
      {action}
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────
export function Pagination({ page, total, pageSize = 10, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between text-sm text-slate-500">
      <span>Results per page: {pageSize}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="px-2 py-1 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onPageChange(p)} className={cn('w-8 h-8 rounded-lg text-sm font-medium', p === page ? 'bg-red-500 text-white' : 'hover:bg-slate-100')}>{p}</button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="px-2 py-1 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
      </div>
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl shadow-xl w-full', sizes[size])}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── SearchBar ─────────────────────────────────────────────────────────────
export function SearchBar({ placeholder = 'Search...', value, onChange, className }) {
  return (
    <div className={cn('relative', className)}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
      />
    </div>
  );
}

// ─── KpiCard ───────────────────────────────────────────────────────────────
export function KpiCard({ title, value, change, icon: Icon, iconBg = 'bg-red-50', iconColor = 'text-red-500', prefix = '', suffix = '' }) {
  const isPositive = parseFloat(change) >= 0;
  return (
    <Card className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900 truncate">{prefix}{value}{suffix}</p>
        {change !== undefined && (
          <p className={cn('text-xs font-medium mt-1', isPositive ? 'text-emerald-600' : 'text-red-500')}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}% <span className="text-slate-400 font-normal">from last week</span>
          </p>
        )}
      </div>
      {Icon && (
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-4', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      )}
    </Card>
  );
}

// ─── SectionHeader ─────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Table ─────────────────────────────────────────────────────────────────
export function Table({ columns, data, className, emptyMessage = 'No data found', loading = false }) {
  if (loading) return (
    <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
  );
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {columns.map((col) => (
              <th key={col.key} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-10 text-slate-400">{emptyMessage}</td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
