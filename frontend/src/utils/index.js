import { clsx } from 'clsx';

// Simple className merger (replaces clsx if not installed)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str, length = 30) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function calcChange(current, previous) {
  if (!previous || previous === 0) return 0;
  return (((current - previous) / previous) * 100).toFixed(1);
}
