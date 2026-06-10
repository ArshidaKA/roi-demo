export const APP_CONFIG = {
  companyName: 'Burger Bros',
  currency: 'AED',
  currencySymbol: 'AED',
  defaultAccounts: { cash: 'Cash', bank: 'Emirates NBD', partner: 'Deliveroo' },
  branches: ['Main Branch'],
  sqft: 1200,
  initialInvestment: 550000
};

export const theme = {
  primary: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-600', border: 'border-indigo-600', light: 'bg-indigo-50' },
  success: { text: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  danger: { text: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200' },
  warning: { text: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
  info: { text: 'text-sky-600', bg: 'bg-sky-100', border: 'border-sky-200' },
  slate: { text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' }
};

export const STAFF_LIST = [
  { id: 'S001', name: 'Ahmed Ali', role: 'Head Chef', dailyRate: 266.67 }, // ~8000/mo
  { id: 'S002', name: 'Sarah Khan', role: 'Manager', dailyRate: 200.00 },   // ~6000/mo
  { id: 'S003', name: 'John Doe', role: 'Waiter', dailyRate: 116.67 },      // ~3500/mo
  { id: 'S004', name: 'Ravi P.', role: 'Kitchen Helper', dailyRate: 83.33 } // ~2500/mo
];

export const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#64748B'];
