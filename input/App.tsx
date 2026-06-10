import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  Receipt, 
  Users, 
  Package, 
  BarChart3, 
  Plus, 
  Trash2, 
  Download,
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  Wallet,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  MoreVertical,
  Landmark,
  Calculator,
  Boxes,
  Percent,
  Settings,
  Info,
  X
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const APP_CONFIG = {
  companyName: 'Burger Bros',
  currency: 'AED',
  currencySymbol: 'AED',
  defaultAccounts: { cash: 'Cash', bank: 'Emirates NBD', partner: 'Deliveroo' },
  branches: ['Main Branch'],
  sqft: 1200,
  initialInvestment: 550000
};

// Fixed standard utility classes to avoid dynamic tailwind construction issues
const theme = {
  primary: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-600', border: 'border-indigo-600', light: 'bg-indigo-50' },
  success: { text: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  danger: { text: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200' },
  warning: { text: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
  info: { text: 'text-sky-600', bg: 'bg-sky-100', border: 'border-sky-200' },
  slate: { text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' }
};

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const Input = ({ label, type = 'text', placeholder, value, onChange, className = '', prefix, suffix, error, readOnly }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1.5 text-sm font-medium text-slate-700">{label}</label>}
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-slate-400 text-sm font-medium">{prefix}</span>}
      <input
        type={type}
        className={`w-full px-3 py-2 bg-slate-50 border ${error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg focus:ring-2 focus:bg-white outline-none transition-all text-sm
          ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-8' : ''} ${readOnly ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
      {suffix && <span className="absolute right-3 text-slate-400 text-sm">{suffix}</span>}
    </div>
    {error && <span className="text-xs text-rose-500 mt-1">{error}</span>}
  </div>
);

const Select = ({ label, options, value, onChange, className = '' }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1.5 text-sm font-medium text-slate-700">{label}</label>}
    <select
      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm appearance-none"
      value={value}
      onChange={onChange}
    >
      {options.map((opt, i) => (
        <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
      ))}
    </select>
  </div>
);

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon, disabled }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: `${theme.primary.bg} hover:bg-indigo-700 text-white shadow-sm`,
    secondary: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm",
    ghost: "hover:bg-slate-100 text-slate-600",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={16} className={`mr-2 ${children ? '' : 'mr-0'}`} />}
      {children}
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    'Paid': { icon: CheckCircle2, cls: theme.success },
    'Settled': { icon: CheckCircle2, cls: theme.success },
    'Completed': { icon: CheckCircle2, cls: theme.success },
    'Pending': { icon: Clock, cls: theme.warning },
    'Overdue': { icon: AlertCircle, cls: theme.danger },
    'Partial': { icon: Percent, cls: theme.info }
  };
  const { icon: Icon, cls } = config[status] || config['Pending'];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls.bg} ${cls.text} ${cls.border} border`}>
      <Icon size={12} className="mr-1" /> {status}
    </span>
  );
};

const SectionHeader = ({ title, icon: Icon, colorClass, subtitle }) => (
  <div className="flex items-start pb-3 mb-4 border-b border-slate-100">
    <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('600', '100')} bg-opacity-50 mr-3 shrink-0`}>
      <Icon size={20} className={colorClass} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('This Month');

  const revenueTrend = [
    { name: 'W1', rev: 12000, exp: 8000, profit: 4000 },
    { name: 'W2', rev: 15000, exp: 9000, profit: 6000 },
    { name: 'W3', rev: 14000, exp: 11000, profit: 3000 },
    { name: 'W4', rev: 18000, exp: 10000, profit: 8000 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Dashboard</h2>
          <p className="text-sm text-slate-500">Real-time financial performance & ROI tracking</p>
        </div>
        <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 p-1 flex-wrap">
          {['Today', 'Week', 'This Month', 'Last Month', 'Year', 'Custom'].map(f => (
             <button 
               key={f}
               onClick={() => setTimeFilter(f)}
               className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${timeFilter === f ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {f}
             </button>
          ))}
        </div>
      </div>

      {/* Credit Alert Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center text-rose-800">
          <AlertCircle className="mr-3" size={20} />
          <div>
            <span className="font-semibold block sm:inline">Attention: Outstanding Vendor Payments </span>
            <span className="text-sm block sm:inline sm:ml-2">You have {APP_CONFIG.currencySymbol} 12,450.00 overdue this week.</span>
          </div>
        </div>
        <Button variant="danger" className="shrink-0 ml-4">View Ledgers</Button>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none p-5 lg:col-span-2">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-indigo-100 font-medium">ROI & Valuation</h3>
            <Calculator size={20} className="text-indigo-200" />
          </div>
          <div className="flex items-end gap-3 mb-1">
            <div className="text-3xl font-bold">40.0%</div>
            <div className="text-sm text-emerald-300 font-medium pb-1 flex items-center"><TrendingUp size={14} className="mr-1"/> +2.1%</div>
          </div>
          <div className="text-sm text-indigo-200 mb-4">On {APP_CONFIG.currencySymbol} {APP_CONFIG.initialInvestment.toLocaleString()} Init. Inv.</div>
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-indigo-500/30">
            <div>
              <div className="text-xs text-indigo-200">Payback</div>
              <div className="font-semibold">14.5 mo</div>
            </div>
            <div>
               <div className="text-xs text-indigo-200">EBITDA (Run Rate)</div>
               <div className="font-semibold">{APP_CONFIG.currencySymbol} 18.5k</div>
            </div>
          </div>
        </Card>

        {[
          { title: 'Revenue (Net)', val: `${APP_CONFIG.currencySymbol} 42.5k`, trend: '+12%', up: true, subtitle: `~${APP_CONFIG.currencySymbol} ${(42500/APP_CONFIG.sqft).toFixed(1)}/sqft` },
          { title: 'Net Profit', val: `${APP_CONFIG.currencySymbol} 12.4k`, trend: '+5%', up: true, subtitle: `29.1% Margin` },
          { title: 'Cash Outflow', val: `${APP_CONFIG.currencySymbol} 28.1k`, trend: '-2%', up: false, subtitle: 'Purchases & OpEx' }
        ].map((m, i) => (
          <Card key={i} className="p-5 flex flex-col justify-between">
            <h3 className="text-sm text-slate-500 mb-2 font-medium">{m.title}</h3>
            <div>
              <div className="flex items-end justify-between mb-1">
                <span className="text-2xl font-bold text-slate-900">{m.val}</span>
                <span className={`text-xs font-medium flex items-center px-1.5 py-0.5 rounded ${m.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {m.up ? <ArrowUpRight size={12} className="mr-0.5"/> : <ArrowDownRight size={12} className="mr-0.5"/>}
                  {m.trend}
                </span>
              </div>
              <div className="text-xs text-slate-400">{m.subtitle}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Account Balances & Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Live Accounts</h3>
            <span className="text-xs text-slate-400">Total: {APP_CONFIG.currencySymbol} 32,900.00</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center"><Wallet className="text-emerald-500 mr-3" size={18}/> <span className="text-sm font-medium">Cash in Hand</span></div>
              <span className="font-semibold text-slate-900">{APP_CONFIG.currencySymbol} 4,500.00</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center"><Landmark className="text-blue-500 mr-3" size={18}/> <span className="text-sm font-medium">Emirates NBD</span></div>
              <span className="font-semibold text-slate-900">{APP_CONFIG.currencySymbol} 26,400.00</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center"><Package className="text-amber-500 mr-3" size={18}/> <span className="text-sm font-medium">Deliveroo (Partner)</span></div>
              <span className="font-semibold text-slate-900">{APP_CONFIG.currencySymbol} 2,000.00</span>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-center items-center text-center p-6 bg-slate-50 border-slate-200">
          <Users className="text-indigo-400 mb-2" size={24}/>
          <h3 className="text-sm font-medium text-slate-500 mb-1">Staff Payroll</h3>
          <div className="text-xl font-bold text-slate-900 mb-1">{APP_CONFIG.currencySymbol} 14.5k</div>
          <div className="text-xs text-amber-600 font-medium">Due: {APP_CONFIG.currencySymbol} 4.2k</div>
        </Card>

        <Card className="flex flex-col justify-center items-center text-center p-6 bg-slate-50 border-slate-200">
          <Boxes className="text-indigo-400 mb-2" size={24}/>
          <h3 className="text-sm font-medium text-slate-500 mb-1">Closing Stock Est.</h3>
          <div className="text-xl font-bold text-slate-900 mb-1">{APP_CONFIG.currencySymbol} 8.2k</div>
          <div className="text-xs text-emerald-600 font-medium">Healthy Levels</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col h-[350px]">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Revenue vs Expenses (Trend)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(val) => `${APP_CONFIG.currencySymbol} ${val}`}/>
                <Area type="monotone" dataKey="rev" name="Revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Line type="monotone" dataKey="exp" name="Expenses" stroke="#EF4444" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col h-[350px]">
          <h3 className="text-base font-semibold text-slate-800 mb-2">Cost Breakdown</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'COGS (Food/Bev)', value: 45 },
                    { name: 'Labor', value: 30 },
                    { name: 'Rent & Utilities', value: 15 },
                    { name: 'Marketing & Other', value: 10 },
                  ]}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

const DailyEntry = () => {
  const getToday = () => new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(getToday());
  const [errors, setErrors] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [totalSalesInput, setTotalSalesInput] = useState('');

  const [revenue, setRevenue] = useState([
    { id: 1, account: 'Cash', amount: '' },
    { id: 2, account: 'Emirates NBD Bank', amount: '' },
    { id: 3, account: 'Deliveroo (Partner)', amount: '' },
  ]);

  const [purchases, setPurchases] = useState([{ id: Date.now(), item: '', vendor: '', amount: '', account: 'Cash', isCredit: false, settledAmount: '' }]);
  const [royalty, setRoyalty] = useState([{ id: Date.now(), type: 'Management Fee', amount: '', account: 'Emirates NBD Bank' }]);
  const [opex, setOpex] = useState([{ id: Date.now(), category: 'Rent', amount: '', account: 'Emirates NBD Bank' }]);
  
  const [gas, setGas] = useState([
    { id: 1, type: 'Gas - Store', amount: '', account: 'Cash' },
    { id: 2, type: 'Gas - Staff (Transport)', amount: '', account: 'Cash' }
  ]);
  
  const [marketing, setMarketing] = useState([{ id: Date.now(), campaign: 'Meta Ads', amount: '', account: 'Emirates NBD Bank' }]);
  
  const [wastageRaw, setWastageRaw] = useState([]);
  const [wastageCooked, setWastageCooked] = useState([]);
  
  const [otherExp, setOtherExp] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [notes, setNotes] = useState('');

  // Handlers
  const addRow = (setter, defaultObj) => setter(prev => [...prev, { id: Date.now(), ...defaultObj }]);
  const removeRow = (setter, id) => setter(prev => prev.filter(row => row.id !== id));
  const updateRow = (setter, id, field, value) => setter(prev => 
    prev.map(row => row.id === id ? { ...row, [field]: value } : row)
  );

  // Calculations
  const parseAmt = (val) => parseFloat(val) || 0;
  
  const totalSalesExpected = parseAmt(totalSalesInput);
  const totalRevenue = revenue.reduce((sum, r) => sum + parseAmt(r.amount), 0);
  
  const totalPurchases = purchases.reduce((sum, p) => sum + parseAmt(p.amount), 0);
  const totalPurchaseCredit = purchases.reduce((sum, p) => sum + (p.isCredit ? (parseAmt(p.amount) - parseAmt(p.settledAmount)) : 0), 0);
  
  const sumList = (list) => list.reduce((sum, item) => sum + parseAmt(item.amount), 0);
  const totalOpex = sumList(opex) + sumList(royalty) + sumList(gas) + sumList(marketing) + sumList(otherExp);
  const totalSalaries = sumList(salaries);
  const totalExpenses = totalPurchases + totalOpex + totalSalaries;

  const totalOutflow = 
    purchases.reduce((sum, p) => sum + (p.isCredit ? parseAmt(p.settledAmount) : parseAmt(p.amount)), 0) +
    totalOpex + totalSalaries;

  const estNetProfit = totalRevenue - totalExpenses;

  // Validation & Save Payload
  const handleSave = () => {
    let newErrors = [];
    if (!date) newErrors.push("Date is required.");
    if (totalSalesExpected > 0 && Math.abs(totalSalesExpected - totalRevenue) > 0.01) {
      newErrors.push(`Total Sales (${totalSalesExpected}) does not match Revenue Account split (${totalRevenue}).`);
    }
    
    purchases.forEach((p, i) => {
      if (p.isCredit && !p.vendor) newErrors.push(`Purchase row ${i+1}: Vendor required for credit.`);
      if (p.isCredit && parseAmt(p.settledAmount) > parseAmt(p.amount)) newErrors.push(`Purchase row ${i+1}: Settled amount cannot exceed total amount.`);
    });

    const rawNames = wastageRaw.map(w => w.item).filter(n => n);
    if (new Set(rawNames).size !== rawNames.length) newErrors.push("Duplicate item names in Raw Food Wastage.");
    
    const cookedNames = wastageCooked.map(w => w.item).filter(n => n);
    if (new Set(cookedNames).size !== cookedNames.length) newErrors.push("Duplicate item names in Cooked Food Wastage.");

    setErrors(newErrors);

    if (newErrors.length === 0) {
      // Build ERPNext Mock Payload including Ledger and Payments
      const payload = {
        docType: 'Daily End of Day',
        date: date,
        salesInvoices: revenue.filter(r => parseAmt(r.amount) > 0).map(r => ({ account: r.account, amount: parseAmt(r.amount), is_pos: 1 })),
        purchaseInvoices: purchases.filter(p => parseAmt(p.amount) > 0).map(p => ({
          item: p.item, vendor: p.vendor, total: parseAmt(p.amount), 
          credit: p.isCredit, paidAmount: p.isCredit ? parseAmt(p.settledAmount) : parseAmt(p.amount), account: p.account
        })),
        journalEntries: [
          ...opex.map(o => ({ type: 'OpEx', category: o.category, amount: parseAmt(o.amount), account: o.account })),
          ...royalty.map(r => ({ type: 'Royalty', category: r.type, amount: parseAmt(r.amount), account: r.account })),
          ...gas.map(g => ({ type: 'Gas', category: g.type, amount: parseAmt(g.amount), account: g.account })),
          ...marketing.map(m => ({ type: 'Marketing', category: m.campaign, amount: parseAmt(m.amount), account: m.account })),
          ...otherExp.map(o => ({ type: 'Other', category: o.description, amount: parseAmt(o.amount), account: o.account }))
        ].filter(j => j.amount > 0),
        salarySlips: salaries.filter(s => parseAmt(s.amount) > 0).map(s => ({ employee: s.employee, amount: parseAmt(s.amount), account: s.account })),
        stockEntries: [
          ...wastageRaw.map(w => ({ type: 'Wastage (Raw)', item: w.item, qty: w.qty, value: parseAmt(w.value) })),
          ...wastageCooked.map(w => ({ type: 'Wastage (Cooked)', item: w.item, qty: w.qty, value: parseAmt(w.value) }))
        ].filter(s => s.qty || s.value),
        paymentEntries: [
          ...purchases.filter(p => !p.isCredit && parseAmt(p.amount) > 0).map(p => ({ party: p.vendor || 'Misc Vendor', account: p.account, amount: parseAmt(p.amount), mode: 'Cash/Bank', ref: 'Purchase' })),
          ...purchases.filter(p => p.isCredit && parseAmt(p.settledAmount) > 0).map(p => ({ party: p.vendor, account: p.account, amount: parseAmt(p.settledAmount), mode: 'Cash/Bank', ref: 'Credit Settlement' })),
          ...salaries.filter(s => parseAmt(s.amount) > 0).map(s => ({ party: s.employee || 'Staff', account: s.account, amount: parseAmt(s.amount), mode: 'Cash/Bank', ref: 'Salary Settlement' }))
        ],
        accountLedgerPreview: [
          ...revenue.filter(r => parseAmt(r.amount) > 0).flatMap(r => [
            { account: r.account, dr: parseAmt(r.amount), cr: 0, note: 'Sales Collection' },
            { account: 'Sales Revenue', dr: 0, cr: parseAmt(r.amount), note: 'Sales Entry' }
          ]),
          ...purchases.filter(p => parseAmt(p.amount) > 0).flatMap(p => [
            { account: 'COGS', dr: parseAmt(p.amount), cr: 0, note: 'Purchase' },
            { account: p.isCredit ? 'Accounts Payable' : p.account, dr: 0, cr: parseAmt(p.amount), note: 'Purchase Liability/Payment' }
          ]),
          ...salaries.filter(s => parseAmt(s.amount) > 0).flatMap(s => [
            { account: 'Salary Expense', dr: parseAmt(s.amount), cr: 0, note: 'Staff Payment' },
            { account: s.account, dr: 0, cr: parseAmt(s.amount), note: 'Outflow' }
          ])
        ],
        notes: notes
      };
      
      console.log("ERPNext Mapping Payload:", payload);
      setPreviewData(payload);
      setShowPreview(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const accountOptions = ['Cash', 'Emirates NBD Bank', 'Credit Card POS', 'Petty Cash'];

  return (
    <div className="max-w-4xl mx-auto pb-40 animate-in fade-in duration-300 relative">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">End of Day Entry</h2>
          <p className="text-slate-500 text-sm mt-1">Record today's operations. Direct ERPNext integration.</p>
        </div>
        <div className="w-48">
          <Input type="date" label="Business Date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white" />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
          <div className="font-semibold flex items-center mb-2"><AlertCircle size={16} className="mr-2"/> Please fix the following errors:</div>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* REVENUE */}
        <Card>
          <SectionHeader title="Revenue & Sales" icon={TrendingUp} colorClass="text-emerald-600" />
          <div className="mb-4">
             <Input label="Total Gross Sales (From POS)" type="number" prefix={APP_CONFIG.currencySymbol} placeholder="0.00" value={totalSalesInput} onChange={(e) => setTotalSalesInput(e.target.value)} className="max-w-xs" />
          </div>
          <div className="text-sm font-medium text-slate-700 mb-3 border-b border-slate-100 pb-2">Deposit Split (Where did the money go?)</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {revenue.map(row => (
              <Input key={row.id} label={row.account} type="number" prefix={APP_CONFIG.currencySymbol} placeholder="0.00" value={row.amount} onChange={(e) => updateRow(setRevenue, row.id, 'amount', e.target.value)} />
            ))}
          </div>
          <div className={`mt-4 p-3 rounded-lg flex justify-between items-center ${Math.abs(totalSalesExpected - totalRevenue) > 0.01 ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800'}`}>
             <span className="font-medium text-sm">Account Total:</span>
             <span className="text-lg font-bold">{APP_CONFIG.currencySymbol} {totalRevenue.toFixed(2)}</span>
          </div>
        </Card>

        {/* PURCHASES */}
        <Card>
          <SectionHeader title="Purchases (Inventory & COGS)" icon={Package} colorClass="text-blue-600" subtitle="Raw materials, packaging, etc." />
          <div className="space-y-3">
            {purchases.map((row, idx) => (
              <div key={row.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 relative">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-2">
                  <div className="md:col-span-4"><Input placeholder="Item / Category" value={row.item} onChange={(e) => updateRow(setPurchases, row.id, 'item', e.target.value)} /></div>
                  <div className="md:col-span-4"><Input placeholder="Vendor Name" value={row.vendor} onChange={(e) => updateRow(setPurchases, row.id, 'vendor', e.target.value)} /></div>
                  <div className="md:col-span-4"><Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Total Amt" value={row.amount} onChange={(e) => updateRow(setPurchases, row.id, 'amount', e.target.value)} /></div>
                </div>
                <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded border border-slate-100">
                  <label className="flex items-center cursor-pointer text-sm font-medium text-slate-700">
                    <input type="checkbox" className="w-4 h-4 mr-2 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={row.isCredit} onChange={(e) => updateRow(setPurchases, row.id, 'isCredit', e.target.checked)} />
                    On Vendor Credit
                  </label>
                  {row.isCredit ? (
                     <div className="flex items-center space-x-3">
                       <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Amt Settled Now" className="w-40" value={row.settledAmount} onChange={(e) => updateRow(setPurchases, row.id, 'settledAmount', e.target.value)} />
                       <Select options={accountOptions} className="w-40" value={row.account} onChange={(e) => updateRow(setPurchases, row.id, 'account', e.target.value)} />
                     </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                       <span className="text-sm text-slate-500">Paid from:</span>
                       <Select options={accountOptions} className="w-40" value={row.account} onChange={(e) => updateRow(setPurchases, row.id, 'account', e.target.value)} />
                    </div>
                  )}
                </div>
                {purchases.length > 1 && (
                  <button onClick={() => removeRow(setPurchases, row.id)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><Trash2 size={16} /></button>
                )}
              </div>
            ))}
          </div>
          <Button variant="ghost" onClick={() => addRow(setPurchases, { item: '', vendor: '', amount: '', account: 'Cash', isCredit: false, settledAmount: '' })} className="mt-3 text-blue-600">
             <Plus size={16} className="mr-1"/> Add Purchase Item
          </Button>
        </Card>

        {/* OPERATIONS EXPENSES */}
        <Card>
          <SectionHeader title="Operations & Admin" icon={Receipt} colorClass="text-amber-600" />
          
          <div className="space-y-6">
            {/* Standard OpEx */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Standard Expenses</h4>
              <div className="space-y-2">
                {opex.map((row) => (
                  <div key={row.id} className="flex flex-wrap md:flex-nowrap gap-2 items-center">
                    <Select options={['Rent', 'Electricity', 'Water', 'Internet', 'Maintenance', 'Cleaning', 'Pest Control']} className="w-full md:w-48" value={row.category} onChange={(e) => updateRow(setOpex, row.id, 'category', e.target.value)} />
                    <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Amount" className="w-full md:w-32" value={row.amount} onChange={(e) => updateRow(setOpex, row.id, 'amount', e.target.value)} />
                    <Select options={accountOptions} className="w-full md:w-48" value={row.account} onChange={(e) => updateRow(setOpex, row.id, 'account', e.target.value)} />
                    <button onClick={() => removeRow(setOpex, row.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" onClick={() => addRow(setOpex, { category: 'Maintenance', amount: '', account: 'Cash' })} className="mt-2 text-amber-600 h-8 text-xs"><Plus size={14} className="mr-1"/> Add OpEx</Button>
            </div>

            <div className="h-px bg-slate-100"></div>

            {/* Gas Split */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Gas Expenses</h4>
              <div className="space-y-2">
                {gas.map((row) => (
                  <div key={row.id} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-slate-50 p-2 rounded">
                    <div className="w-full md:w-48 font-medium text-sm text-slate-600">{row.type}</div>
                    <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Amount" className="w-full md:w-32" value={row.amount} onChange={(e) => updateRow(setGas, row.id, 'amount', e.target.value)} />
                    <Select options={accountOptions} className="w-full md:w-48" value={row.account} onChange={(e) => updateRow(setGas, row.id, 'account', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100"></div>

            {/* Royalty & Marketing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Fees & Royalties</h4>
                {royalty.map(row => (
                  <div key={row.id} className="flex gap-2 items-center mb-2">
                    <Select options={['Management Fee', 'Franchise Royalty', 'Software Sub']} className="w-1/2" value={row.type} onChange={(e) => updateRow(setRoyalty, row.id, 'type', e.target.value)} />
                    <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Amt" className="w-1/3" value={row.amount} onChange={(e) => updateRow(setRoyalty, row.id, 'amount', e.target.value)} />
                    <Select options={accountOptions} className="w-1/3" value={row.account} onChange={(e) => updateRow(setRoyalty, row.id, 'account', e.target.value)} />
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Marketing</h4>
                {marketing.map(row => (
                  <div key={row.id} className="flex gap-2 items-center mb-2">
                    <Input placeholder="Campaign" className="w-1/2" value={row.campaign} onChange={(e) => updateRow(setMarketing, row.id, 'campaign', e.target.value)} />
                    <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Amt" className="w-1/3" value={row.amount} onChange={(e) => updateRow(setMarketing, row.id, 'amount', e.target.value)} />
                    <Select options={accountOptions} className="w-1/3" value={row.account} onChange={(e) => updateRow(setMarketing, row.id, 'account', e.target.value)} />
                  </div>
                ))}
                <Button variant="ghost" onClick={() => addRow(setMarketing, { campaign: '', amount: '', account: 'Emirates NBD Bank' })} className="p-0 h-auto text-xs text-amber-600"><Plus size={14} className="mr-1"/> Add Campaign</Button>
              </div>
            </div>

            {/* Other */}
            <div className="h-px bg-slate-100"></div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Other / Misc Expenses</h4>
               <div className="space-y-2">
                {otherExp.map((row) => (
                  <div key={row.id} className="flex gap-2 items-center">
                    <Input placeholder="Description" className="flex-1" value={row.description} onChange={(e) => updateRow(setOtherExp, row.id, 'description', e.target.value)} />
                    <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Amount" className="w-32" value={row.amount} onChange={(e) => updateRow(setOtherExp, row.id, 'amount', e.target.value)} />
                    <Select options={accountOptions} className="w-48" value={row.account} onChange={(e) => updateRow(setOtherExp, row.id, 'account', e.target.value)} />
                    <button onClick={() => removeRow(setOtherExp, row.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" onClick={() => addRow(setOtherExp, { description: '', amount: '', account: 'Cash' })} className="mt-2 text-amber-600 h-8 text-xs"><Plus size={14} className="mr-1"/> Add Misc</Button>
            </div>
          </div>
        </Card>

        {/* STAFF & SALARY */}
        <Card>
          <SectionHeader title="Salary Settlements (Advances/Payments)" icon={Users} colorClass="text-indigo-600" />
          <div className="space-y-3">
            {salaries.map(row => (
               <div key={row.id} className="flex flex-wrap md:flex-nowrap gap-2">
                 <Input placeholder="Staff Name" className="flex-1" value={row.employee} onChange={(e) => updateRow(setSalaries, row.id, 'employee', e.target.value)} />
                 <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Amount" className="w-full md:w-32" value={row.amount} onChange={(e) => updateRow(setSalaries, row.id, 'amount', e.target.value)} />
                 <Select options={accountOptions} className="w-full md:w-48" value={row.account} onChange={(e) => updateRow(setSalaries, row.id, 'account', e.target.value)} />
                 <button onClick={() => removeRow(setSalaries, row.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={18} /></button>
               </div>
            ))}
            <Button variant="ghost" onClick={() => addRow(setSalaries, { employee: '', amount: '', account: 'Cash' })} className="text-indigo-600 h-8 px-2 text-sm bg-indigo-50">
               <Plus size={14} className="mr-1"/> Add Payment
            </Button>
          </div>
        </Card>

        {/* WASTAGE */}
        <Card>
          <SectionHeader title="Food Wastage" icon={AlertCircle} colorClass="text-slate-600" subtitle="Impacts closing stock valuation" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2 border-b border-slate-100 pb-1">Raw Food</h4>
              <div className="space-y-2">
                {wastageRaw.map(row => (
                  <div key={row.id} className="flex gap-2">
                    <Input placeholder="Item (e.g. Buns)" className="flex-1" value={row.item} onChange={(e) => updateRow(setWastageRaw, row.id, 'item', e.target.value)} />
                    <Input placeholder="Qty" className="w-20" value={row.qty} onChange={(e) => updateRow(setWastageRaw, row.id, 'qty', e.target.value)} />
                    <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Val" className="w-28" value={row.value} onChange={(e) => updateRow(setWastageRaw, row.id, 'value', e.target.value)} />
                     <button onClick={() => removeRow(setWastageRaw, row.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                  </div>
                ))}
                <Button variant="ghost" onClick={() => addRow(setWastageRaw, { item: '', qty: '', value: '' })} className="p-0 h-auto text-xs text-slate-500"><Plus size={14} className="mr-1"/> Add Raw</Button>
              </div>
            </div>
            <div>
               <h4 className="text-sm font-semibold text-slate-700 mb-2 border-b border-slate-100 pb-1">Cooked Food</h4>
               <div className="space-y-2">
                {wastageCooked.map(row => (
                  <div key={row.id} className="flex gap-2">
                    <Input placeholder="Item (e.g. Patties)" className="flex-1" value={row.item} onChange={(e) => updateRow(setWastageCooked, row.id, 'item', e.target.value)} />
                    <Input placeholder="Qty" className="w-20" value={row.qty} onChange={(e) => updateRow(setWastageCooked, row.id, 'qty', e.target.value)} />
                    <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Val" className="w-28" value={row.value} onChange={(e) => updateRow(setWastageCooked, row.id, 'value', e.target.value)} />
                    <button onClick={() => removeRow(setWastageCooked, row.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                  </div>
                ))}
                <Button variant="ghost" onClick={() => addRow(setWastageCooked, { item: '', qty: '', value: '' })} className="p-0 h-auto text-xs text-slate-500"><Plus size={14} className="mr-1"/> Add Cooked</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
           <Input label="Day Notes (Issues, Weather, Comments)" type="text" placeholder="e.g. Heavy rain affected evening deliveries..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Card>

        {/* ERPNext Mock Output Panel */}
        {showPreview && previewData && (
          <Card className="border-emerald-200 bg-emerald-50/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-emerald-800 flex items-center"><CheckCircle2 className="mr-2" size={20}/> Data Saved & Mapped to ERPNext</h3>
              <Button variant="ghost" onClick={() => setShowPreview(false)} className="h-8 px-2 text-xs">Close</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-mono bg-white p-4 rounded-lg border border-slate-200 overflow-x-auto">
               <div>
                 <div className="font-bold text-slate-700 mb-1">Sales/POS Invoices</div>
                 <div className="text-slate-600">{previewData.salesInvoices.length} docs</div>
               </div>
               <div>
                 <div className="font-bold text-slate-700 mb-1">Purchase Invoices</div>
                 <div className="text-slate-600">{previewData.purchaseInvoices.length} docs</div>
               </div>
               <div>
                 <div className="font-bold text-slate-700 mb-1">Journal Entries</div>
                 <div className="text-slate-600">{previewData.journalEntries.length} docs</div>
               </div>
               <div>
                 <div className="font-bold text-slate-700 mb-1">Stock Entries</div>
                 <div className="text-slate-600">{previewData.stockEntries.length} docs</div>
               </div>
               <div>
                 <div className="font-bold text-slate-700 mb-1">Payment Entries</div>
                 <div className="text-slate-600">{previewData.paymentEntries.length} docs</div>
               </div>
               <div>
                 <div className="font-bold text-slate-700 mb-1">Ledger Preview</div>
                 <div className="text-slate-600">{previewData.accountLedgerPreview.length} rows</div>
               </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-mono break-all">Console logged full payload details.</p>
          </Card>
        )}
      </div>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-20 transition-all">
        <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm flex-1 w-full md:w-auto">
            <div>
               <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Revenue</span>
               <span className="font-bold text-slate-800">{APP_CONFIG.currencySymbol} {totalRevenue.toFixed(0)}</span>
            </div>
            <div className="border-l border-slate-200 pl-4 sm:pl-6">
               <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Total Exp.</span>
               <span className="font-bold text-rose-600">{APP_CONFIG.currencySymbol} {totalExpenses.toFixed(0)}</span>
            </div>
            <div className="border-l border-slate-200 pl-4 sm:pl-6 hidden sm:block">
               <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Credit Accrued</span>
               <span className="font-bold text-amber-600">{APP_CONFIG.currencySymbol} {totalPurchaseCredit.toFixed(0)}</span>
            </div>
             <div className="border-l border-slate-200 pl-4 sm:pl-6">
               <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Est. Net Profit</span>
               <span className={`font-bold ${estNetProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{APP_CONFIG.currencySymbol} {estNetProfit.toFixed(0)}</span>
            </div>
          </div>
          <Button variant="primary" onClick={handleSave} className="w-full md:w-auto px-8 py-2.5 text-base shadow-md hover:shadow-lg whitespace-nowrap">
            Save Day
          </Button>
        </div>
      </div>
    </div>
  );
};

const Expenses = () => (
  <div className="animate-in fade-in duration-500 pb-10">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Payables & Ledgers</h2>
        <p className="text-slate-500 text-sm mt-1">Track outstanding vendor credits and expense history.</p>
      </div>
      <Button variant="primary" icon={Plus}>Manual Entry</Button>
    </div>

    {/* Aging Buckets Banner */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
       <Card className="bg-white border-slate-200">
         <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Current</div>
         <div className="text-xl font-bold text-slate-800">{APP_CONFIG.currencySymbol} 1,200</div>
       </Card>
       <Card className="bg-amber-50 border-amber-100">
         <div className="text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1">1-30 Days</div>
         <div className="text-xl font-bold text-amber-700">{APP_CONFIG.currencySymbol} 4,850</div>
       </Card>
       <Card className="bg-rose-50 border-rose-100">
         <div className="text-rose-600 text-xs font-semibold uppercase tracking-wider mb-1">31-60 Days</div>
         <div className="text-xl font-bold text-rose-700">{APP_CONFIG.currencySymbol} 3,200</div>
       </Card>
       <Card className="bg-rose-100 border-rose-200">
         <div className="text-rose-800 text-xs font-semibold uppercase tracking-wider mb-1">60+ Days</div>
         <div className="text-xl font-bold text-rose-900">{APP_CONFIG.currencySymbol} 3,200</div>
       </Card>
    </div>

    <Card noPadding>
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3">
          <Input placeholder="Search vendor..." className="w-64" />
          <Select options={['All Status', 'Pending', 'Partial', 'Overdue', 'Settled']} className="w-40" />
        </div>
        <Button variant="secondary" icon={Filter}>Filter</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="py-3 px-4">Ref / Doc</th>
              <th className="py-3 px-4">Vendor / Supplier</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Total Amt</th>
              <th className="py-3 px-4 text-right">Outstanding</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { ref: 'PINV-001', vendor: 'Fresh Produce Co.', date: 'Oct 12', amt: 2500, out: 2500, status: 'Overdue' },
              { ref: 'PINV-002', vendor: 'City Meats LLC', date: 'Oct 14', amt: 3400, out: 1400, status: 'Partial' },
              { ref: 'SAL-OCT', vendor: 'Staff (Ali)', date: 'Oct 31', amt: 4000, out: 4000, status: 'Pending' },
              { ref: 'EXP-089', vendor: 'Dubai Electricity', date: 'Oct 15', amt: 850, out: 0, status: 'Settled' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-slate-500 text-xs font-mono">{row.ref}</td>
                <td className="py-3 px-4 font-medium text-slate-900">{row.vendor}</td>
                <td className="py-3 px-4 text-slate-600">{row.date}</td>
                <td className="py-3 px-4 text-right text-slate-600">{APP_CONFIG.currencySymbol} {row.amt.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-semibold text-slate-900">{APP_CONFIG.currencySymbol} {row.out.toLocaleString()}</td>
                <td className="py-3 px-4 text-center"><StatusBadge status={row.status} /></td>
                <td className="py-3 px-4 text-right">
                  {row.status !== 'Settled' ? (
                    <Button variant="secondary" className="h-8 px-3 text-xs">Settle</Button>
                  ) : (
                    <Button variant="ghost" className="h-8 px-2 text-xs text-slate-400">View</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const StaffPayroll = () => {
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [settlementAmount, setSettlementAmount] = useState('');
  
  const staffList = [
    { name: 'Ahmed Ali', role: 'Head Chef', salary: 8000, paid: 2000, out: 6000 },
    { name: 'Sarah Khan', role: 'Manager', salary: 6000, paid: 6000, out: 0 },
    { name: 'John Doe', role: 'Waiter', salary: 3500, paid: 500, out: 3000 },
    { name: 'Ravi P.', role: 'Kitchen Helper', salary: 2500, paid: 0, out: 2500 },
  ];

  const handleSettleClick = (staff) => {
    setSelectedStaff(staff);
    setSettlementAmount(staff.out.toString());
    setSettleModalOpen(true);
  };

  const handleConfirmSettlement = () => {
    // In a real app, dispatch to backend here.
    setSettleModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Staff & Payroll</h2>
          <p className="text-slate-500 text-sm mt-1">Manage employee salaries, advances, and settlements.</p>
        </div>
        <Button variant="secondary" icon={Users}>Manage Staff</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-slate-500 text-sm font-medium mb-1">Total Monthly Bill</div>
          <div className="text-2xl font-bold text-slate-800">{APP_CONFIG.currencySymbol} 24,000</div>
        </Card>
        <Card>
          <div className="text-emerald-600 text-sm font-medium mb-1">Paid This Month</div>
          <div className="text-2xl font-bold text-emerald-700">{APP_CONFIG.currencySymbol} 8,500</div>
        </Card>
        <Card>
          <div className="text-amber-600 text-sm font-medium mb-1">Outstanding</div>
          <div className="text-2xl font-bold text-amber-700">{APP_CONFIG.currencySymbol} 15,500</div>
        </Card>
      </div>

      <Card noPadding>
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Current Payroll Roster</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Monthly Salary</th>
                <th className="py-3 px-4 text-right">Advances/Paid</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{row.name}</td>
                  <td className="py-3 px-4 text-slate-600">{row.role}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{APP_CONFIG.currencySymbol} {row.salary.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-emerald-600">{APP_CONFIG.currencySymbol} {row.paid.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{APP_CONFIG.currencySymbol} {row.out.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    {row.out > 0 ? (
                      <Button variant="secondary" onClick={() => handleSettleClick(row)} className="h-8 px-3 text-xs">Settle</Button>
                    ) : (
                      <StatusBadge status="Settled" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Settle Salary Modal */}
      {settleModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md shadow-xl border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Settle Salary</h3>
              <button onClick={() => setSettleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <Input label="Employee" value={selectedStaff.name} readOnly />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Outstanding" value={`${APP_CONFIG.currencySymbol} ${selectedStaff.out.toLocaleString()}`} readOnly />
                <Input label="Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <Select label="Payment Account" options={Object.values(APP_CONFIG.defaultAccounts)} />
              <Input label="Settlement Amount" type="number" prefix={APP_CONFIG.currencySymbol} value={settlementAmount} onChange={(e) => setSettlementAmount(e.target.value)} />
              <Input label="Note" placeholder="e.g. October partial settlement" />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSettleModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmSettlement}>Confirm Settlement</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const Stock = () => (
  <div className="animate-in fade-in duration-500 pb-10">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Inventory & Stock</h2>
        <p className="text-slate-500 text-sm mt-1">Daily material counting and consumption.</p>
      </div>
      <Button variant="primary" icon={Plus}>New Stock Entry</Button>
    </div>

    {/* Enhanced Stock Status Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
       <Card className="p-4 flex flex-col justify-center">
         <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Opening Stock</div>
         <div className="flex items-center text-emerald-600 font-semibold text-lg"><CheckCircle2 size={18} className="mr-1.5"/> Completed</div>
       </Card>
       <Card className="p-4 flex flex-col justify-center">
         <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Closing Stock</div>
         <div className="flex items-center text-amber-500 font-semibold text-lg"><Clock size={18} className="mr-1.5"/> Pending</div>
       </Card>
       <Card className="p-4 flex flex-col justify-center">
         <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Last Updated</div>
         <div className="text-lg font-bold text-slate-800">Today, 08:30 AM</div>
       </Card>
       <Card className="p-4 flex flex-col justify-center bg-rose-50 border-rose-100">
         <div className="text-xs text-rose-600 font-semibold uppercase tracking-wider mb-1">Est. Variance</div>
         <div className="text-lg font-bold text-rose-700">- {APP_CONFIG.currencySymbol} 120.00</div>
       </Card>
    </div>

    <Card noPadding>
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Today's Consumption Draft</h3>
        <Button variant="ghost" className="h-8 px-2 text-xs">Load from Recipe</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">UoM</th>
              <th className="py-3 px-4 text-right">Opening</th>
              <th className="py-3 px-4 text-right">Closing</th>
              <th className="py-3 px-4 text-right text-indigo-600">Consumed</th>
              <th className="py-3 px-4 text-right text-rose-500">Wastage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { item: 'Beef Patties (Frozen)', uom: 'Box', open: 12, close: 8, cons: 4, waste: 0 },
              { item: 'Burger Buns', uom: 'Pack', open: 30, close: 10, cons: 18, waste: 2 },
              { item: 'French Fries', uom: 'Kg', open: 50, close: 25, cons: 24, waste: 1 },
              { item: 'Cheddar Cheese', uom: 'Slice', open: 200, close: 80, cons: 115, waste: 5 },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900">{row.item}</td>
                <td className="py-3 px-4 text-slate-500">{row.uom}</td>
                <td className="py-3 px-4 text-right text-slate-600">{row.open}</td>
                <td className="py-3 px-4 text-right font-semibold">
                  <input type="number" defaultValue={row.close} className="w-16 text-right border border-slate-200 rounded px-1 py-0.5 text-sm outline-none focus:border-indigo-500" />
                </td>
                <td className="py-3 px-4 text-right font-bold text-indigo-600">{row.cons}</td>
                <td className="py-3 px-4 text-right text-rose-500">
                   <input type="number" defaultValue={row.waste} className="w-16 text-right border border-slate-200 rounded px-1 py-0.5 text-sm outline-none focus:border-rose-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
         <Button variant="primary" className="px-6">Submit Stock Entry</Button>
      </div>
    </Card>
  </div>
);

const Reports = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Reports & ROI</h2>
          <p className="text-slate-500 text-sm mt-1">Exportable P&L, Projections, and Asset Valuation.</p>
        </div>
        <Button variant="secondary" icon={Download}>Export Data</Button>
      </div>

      {/* Excel-like P&L Preview */}
      <Card noPadding className="mb-6 border-indigo-100 shadow-md">
        <div className="p-4 border-b border-indigo-100 bg-indigo-50 flex justify-between items-center">
           <h3 className="font-bold text-indigo-900 flex items-center"><FileText className="mr-2" size={18}/> ROI & Profitability Summary (October 2026)</h3>
           <span className="text-xs font-medium text-indigo-700 bg-white px-2 py-1 rounded border border-indigo-200 shadow-sm">Generated Live</span>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-slate-50/50">
                <td className="p-3 pl-6 font-medium text-slate-500">Initial Investment</td><td className="p-3 text-right font-medium text-slate-600">{APP_CONFIG.currencySymbol} {APP_CONFIG.initialInvestment.toLocaleString()}</td>
              </tr>
              <tr className="bg-white font-semibold text-slate-800 text-base">
                <td className="p-4 pl-6">1. Gross Revenue</td><td className="p-4 text-right">{APP_CONFIG.currencySymbol} 45,000.00</td>
              </tr>
              <tr><td className="p-3 pl-10 text-slate-600">Less: Cost of Goods Sold (COGS)</td><td className="p-3 text-right text-rose-600">({APP_CONFIG.currencySymbol} 12,500.00)</td></tr>
              <tr className="bg-slate-50 font-semibold text-slate-800">
                <td className="p-3 pl-6">2. Gross Profit</td><td className="p-3 text-right">{APP_CONFIG.currencySymbol} 32,500.00</td>
              </tr>
              <tr><td className="p-3 pl-10 text-slate-600">Less: Operations (Rent, Utilities, Gas)</td><td className="p-3 text-right text-rose-600">({APP_CONFIG.currencySymbol} 8,200.00)</td></tr>
              <tr><td className="p-3 pl-10 text-slate-600">Less: Payroll & Salaries</td><td className="p-3 text-right text-rose-600">({APP_CONFIG.currencySymbol} 9,500.00)</td></tr>
              <tr><td className="p-3 pl-10 text-slate-600">Less: Marketing & Admin</td><td className="p-3 text-right text-rose-600">({APP_CONFIG.currencySymbol} 1,800.00)</td></tr>
              <tr className="bg-emerald-50 font-bold text-slate-900 text-base border-t-2 border-emerald-200">
                <td className="p-4 pl-6">3. Net Profit (EBITDA Approximation)</td><td className="p-4 text-right text-emerald-700">{APP_CONFIG.currencySymbol} 13,000.00</td>
              </tr>
              
              {/* Owner/Operator Split */}
              <tr><td className="p-3 pl-10 text-slate-600">Less: Management/Royalty Fee (5%)</td><td className="p-3 text-right text-rose-600">({APP_CONFIG.currencySymbol} 2,250.00)</td></tr>
              <tr className="bg-indigo-50 font-bold text-slate-900 text-base border-t border-indigo-100">
                <td className="p-4 pl-6">4. Net Distributable Profit</td><td className="p-4 text-right text-indigo-700">{APP_CONFIG.currencySymbol} 10,750.00</td>
              </tr>
              <tr><td className="p-3 pl-10 font-medium text-slate-700">Owner Return (70%)</td><td className="p-3 text-right font-semibold text-slate-800">{APP_CONFIG.currencySymbol} 7,525.00</td></tr>
              <tr><td className="p-3 pl-10 font-medium text-slate-700">Operator/Franchisee Return (30%)</td><td className="p-3 text-right font-semibold text-slate-800">{APP_CONFIG.currencySymbol} 3,225.00</td></tr>

              <tr className="bg-white">
                <td className="p-3 pl-6 font-medium text-slate-600 flex justify-between"><span>Profit Margin</span></td>
                <td className="p-3 text-right font-bold text-indigo-600">28.8%</td>
              </tr>
              <tr className="bg-slate-50 border-t border-slate-200">
                 <td colSpan="2" className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                       <div><div className="text-xs text-slate-500 uppercase">Rev / SqFt</div><div className="font-semibold">{APP_CONFIG.currencySymbol} {(45000/APP_CONFIG.sqft).toFixed(0)}</div></div>
                       <div><div className="text-xs text-slate-500 uppercase">Profit / SqFt</div><div className="font-semibold text-emerald-600">{APP_CONFIG.currencySymbol} {(13000/APP_CONFIG.sqft).toFixed(0)}</div></div>
                       <div><div className="text-xs text-slate-500 uppercase">Ann. ROI</div><div className="font-semibold text-indigo-600">{( (13000*12) / APP_CONFIG.initialInvestment * 100 ).toFixed(1)}%</div></div>
                       <div><div className="text-xs text-slate-500 uppercase">Est. Payback</div><div className="font-semibold text-indigo-600">{(APP_CONFIG.initialInvestment / 13000).toFixed(1)} mo</div></div>
                    </div>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Building2 className="mr-2 text-indigo-600" size={20}/> 5-Year Valuation Projection
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { year: 'Y0 (Init)', value: APP_CONFIG.initialInvestment },
                { year: 'Y1', value: 650000 },
                { year: 'Y2', value: 780000 },
                { year: 'Y3', value: 940000 },
                { year: 'Y4', value: 1100000 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <YAxis tickFormatter={(val) => `${val/1000}k`} tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <Tooltip formatter={(val) => `${APP_CONFIG.currencySymbol} ${val.toLocaleString()}`} />
                <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} dot={{r:4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">ERPNext Standard Reports</h3>
          <div className="space-y-2 h-64 overflow-y-auto pr-2">
            {[
              { name: 'Monthly Profit & Loss (P&L)', icon: FileText, desc: 'Detailed income and expense breakdown.' },
              { name: 'Vendor Credit Aging', icon: Clock, desc: 'Outstanding payables sorted by due date.' },
              { name: 'Stock Consumption Report', icon: Boxes, desc: 'Theoretical vs actual variance.' },
              { name: 'Food Wastage Analysis', icon: AlertCircle, desc: 'Cost of goods wasted per week/month.' },
              { name: 'Salary & Payroll Summary', icon: Users, desc: 'Advances, pending dues, and settled totals.' },
              { name: 'Account Balance Summary', icon: Landmark, desc: 'Cash, bank, and partner ledgers.' }
            ].map((report, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mr-4 group-hover:bg-indigo-50 transition-colors">
                    <report.icon size={18} className="text-slate-500 group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{report.name}</div>
                    <div className="text-xs text-slate-500">{report.desc}</div>
                  </div>
                </div>
                <ChevronDown size={16} className="text-slate-400 -rotate-90 group-hover:text-indigo-600" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'daily', label: 'Daily Entry', icon: PenTool },
    { id: 'expenses', label: 'Payables & Ledgers', icon: Receipt },
    { id: 'staff', label: 'Staff & Payroll', icon: Users },
    { id: 'stock', label: 'Stock & Inventory', icon: Boxes },
    { id: 'reports', label: 'ROI & Reports', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'daily': return <DailyEntry />;
      case 'expenses': return <Expenses />;
      case 'staff': return <StaffPayroll />;
      case 'stock': return <Stock />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Fixed Left */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
               <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight truncate">{APP_CONFIG.companyName}</h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">ERPNext ROI</p>
            </div>
          </div>
          <Settings size={16} className="text-slate-400 hover:text-slate-600 cursor-pointer"/>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={`mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl flex items-center border border-slate-100">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mr-3 text-sm font-bold shadow-sm border border-indigo-200">
              FD
            </div>
            <div className="text-sm overflow-hidden text-left">
              <p className="font-semibold text-slate-900 truncate">Founder Desk</p>
              <p className="text-slate-500 text-xs truncate">Admin Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 bg-white border-b border-slate-200 p-4 z-30 flex justify-between items-center">
           <div className="flex items-center">
             <TrendingUp className="text-indigo-600 mr-2" size={20} />
             <h1 className="font-bold text-slate-900">{APP_CONFIG.companyName}</h1>
           </div>
           <select 
             className="bg-slate-50 border border-slate-200 rounded p-1 text-sm outline-none"
             value={activeTab}
             onChange={(e) => setActiveTab(e.target.value)}
           >
             {navItems.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
           </select>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 z-10 justify-between items-center">
           <h1 className="text-xl font-bold text-slate-800 capitalize">
             {activeTab === 'daily' ? 'End of Day Operations' : activeTab.replace('-', ' ')}
           </h1>
           <div className="flex items-center space-x-4">
              <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                ERPNext Connected
              </span>
           </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;