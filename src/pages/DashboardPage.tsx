import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Landmark, Package, Users, Boxes, Calculator, AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG, COLORS } from '@/utils/constants';
import { Card, Button } from '@/components';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [viewStack, setViewStack] = useState<any[]>([]);

  const currentView = viewStack[viewStack.length - 1];

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

      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center text-rose-800">
          <AlertCircle className="mr-3" size={20} />
          <div>
            <span className="font-semibold block sm:inline">Attention: Outstanding Vendor Payments </span>
            <span className="text-sm block sm:inline sm:ml-2">You have {APP_CONFIG.currencySymbol} 12,450.00 overdue this week.</span>
          </div>
        </div>
        <Button variant="danger" className="shrink-0 ml-4" onClick={() => navigate('/expenses')}>View Ledgers</Button>
      </div>

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
          { 
            title: 'Revenue (Net)', 
            val: `${APP_CONFIG.currencySymbol} 42.5k`, 
            trend: '+12%', 
            up: true, 
            subtitle: `~${APP_CONFIG.currencySymbol} ${(42500/APP_CONFIG.sqft).toFixed(1)}/sqft`,
            splitUps: [
              { label: 'Dine-in', value: '25,000' },
              { 
                label: 'Delivery (Aggregators)', 
                value: '12,000',
                subSplitUps: [
                  { label: 'Talabat', value: '7,000' },
                  { label: 'Deliveroo', value: '3,500' },
                  { label: 'Noon Food', value: '1,500' }
                ]
              },
              { label: 'Takeaway', value: '5,500' }
            ]
          },
          { 
            title: 'Net Profit', 
            val: `${APP_CONFIG.currencySymbol} 12.4k`, 
            trend: '+5%', 
            up: true, 
            subtitle: `29.1% Margin`,
            splitUps: [
              { label: 'Gross Profit', value: '30,000' },
              { 
                label: 'Operating Expenses', 
                value: '-17,600',
                subSplitUps: [
                  { label: 'Fixed Costs (Rent, Salaries)', value: '-12,000' },
                  { label: 'Variable Costs (Marketing, Utilities)', value: '-5,600' }
                ]
              }
            ]
          },
          { 
            title: 'Cash Outflow', 
            val: `${APP_CONFIG.currencySymbol} 28.1k`, 
            trend: '-2%', 
            up: false, 
            subtitle: 'Purchases & OpEx',
            splitUps: [
              { 
                label: 'Payroll', 
                value: '14,500',
                subSplitUps: [
                  { label: 'Kitchen Staff', value: '8,000' },
                  { label: 'Service Staff', value: '4,500' },
                  { label: 'Management', value: '2,000' }
                ]
              },
              { 
                label: 'Vendor Payments', 
                value: '8,000',
                subSplitUps: [
                  { label: 'Food Suppliers', value: '5,500' },
                  { label: 'Beverage Suppliers', value: '1,500' },
                  { label: 'Packaging', value: '1,000' }
                ]
              },
              { label: 'Rent & Utilities', value: '5,600' }
            ]
          },
          { 
            title: 'Total Credit', 
            val: `${APP_CONFIG.currencySymbol} 15.2k`, 
            trend: '+4%', 
            up: true, 
            subtitle: 'Pending Receivables',
            splitUps: [
              { 
                label: 'B2B Catering', 
                value: '8,500',
                subSplitUps: [
                  { label: 'Tech Corp Events', value: '5,000' },
                  { label: 'Local Offices', value: '3,500' }
                ]
              },
              { label: 'Corporate Accounts', value: '6,700' }
            ]
          }
        ].map((m, i) => (
          <Card key={i} className="p-5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => setViewStack([{ title: m.title, splitUps: m.splitUps }])}>
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

        <Card className="flex flex-col justify-center items-center text-center bg-slate-50 border-slate-200">
          <Users className="text-indigo-400 mb-2" size={24}/>
          <h3 className="text-sm font-medium text-slate-500 mb-1">Staff Payroll</h3>
          <div className="text-xl font-bold text-slate-900 mb-1">{APP_CONFIG.currencySymbol} 14.5k</div>
          <div className="text-xs text-amber-600 font-medium">Due: {APP_CONFIG.currencySymbol} 4.2k</div>
        </Card>

        <Card className="flex flex-col justify-center items-center text-center bg-slate-50 border-slate-200">
          <Boxes className="text-indigo-400 mb-2" size={24}/>
          <h3 className="text-sm font-medium text-slate-500 mb-1">Closing Stock Est.</h3>
          <div className="text-xl font-bold text-slate-900 mb-1">{APP_CONFIG.currencySymbol} 8.2k</div>
          <div className="text-xs text-emerald-600 font-medium">Healthy Levels</div>
        </Card>
      </div>

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
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(val: number) => `${APP_CONFIG.currencySymbol} ${val}`}/>
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
                <RechartsTooltip formatter={(value: number) => `${value}%`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {currentView && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {viewStack.length > 1 && (
                  <button onClick={() => setViewStack(prev => prev.slice(0, -1))} className="p-1 text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 rounded hover:bg-slate-200">
                    <ChevronLeft size={18} />
                  </button>
                )}
                <h3 className="font-semibold text-slate-900">{currentView.title} Breakdown</h3>
              </div>
              <button onClick={() => setViewStack([])} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {currentView.splitUps.map((item: any, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    if (item.subSplitUps) {
                      setViewStack(prev => [...prev, { title: item.label, splitUps: item.subSplitUps }]);
                    }
                  }}
                  className={`flex justify-between items-center p-3 rounded-lg ${item.subSplitUps ? 'bg-indigo-50/50 cursor-pointer hover:bg-indigo-50 border border-indigo-100/50 transition-colors' : 'bg-slate-50'}`}
                >
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{APP_CONFIG.currencySymbol} {item.value}</span>
                    {item.subSplitUps && <ChevronRight size={16} className="text-indigo-400" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button variant="secondary" onClick={() => setViewStack([])}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
