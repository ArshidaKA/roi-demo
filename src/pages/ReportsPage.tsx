import React from 'react';
import { Download, FileText, Building2, Clock, Boxes, AlertCircle, Users, Landmark, ChevronDown } from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { APP_CONFIG } from '@/utils/constants';
import { Card, Button } from '@/components';

const ReportsPage = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Reports & ROI</h2>
          <p className="text-slate-500 text-sm mt-1">Exportable P&L, Projections, and Asset Valuation.</p>
        </div>
        <Button variant="secondary" icon={Download} onClick={() => alert('Downloading reports zip...')}>Export Data</Button>
      </div>

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
                 <td colSpan={2} className="p-4">
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
                <RechartsTooltip formatter={(val: number) => `${APP_CONFIG.currencySymbol} ${val.toLocaleString()}`} />
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

export default ReportsPage;
