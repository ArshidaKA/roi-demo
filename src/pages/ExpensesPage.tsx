import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { APP_CONFIG } from '@/utils/constants';
import { Card, Button, StatusBadge, Input, Select } from '@/components';

const ExpensesPage = () => {
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  
  return (
  <div className="animate-in fade-in duration-500 pb-10">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Payables & Ledgers</h2>
        <p className="text-slate-500 text-sm mt-1">Track outstanding vendor credits and expense history.</p>
      </div>
      <Button variant="primary" icon={Plus} onClick={() => setManualEntryOpen(true)}>Manual Entry</Button>
    </div>

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
         <div className="text-xl font-bold text-rose-700">{APP_CONFIG.currencySymbol} 2,100</div>
       </Card>
       <Card className="bg-rose-100 border-rose-200">
         <div className="text-rose-800 text-xs font-semibold uppercase tracking-wider mb-1">&gt; 60 Days</div>
         <div className="text-xl font-bold text-rose-900">{APP_CONFIG.currencySymbol} 4,300</div>
       </Card>
    </div>

    <Card noPadding>
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Recent Purchase Invoices & OpEx</h3>
        <div className="flex gap-2">
          <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => alert('Filter clicked')}>Filter</Button>
        </div>
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
                    <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => alert(`Settle ${row.ref}`)}>Settle</Button>
                  ) : (
                    <Button variant="ghost" className="h-8 px-2 text-xs text-slate-400" onClick={() => alert(`View ${row.ref}`)}>View</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    {manualEntryOpen && (
      <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
        <Card className="w-full max-w-md shadow-xl border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Manual Expense Entry</h3>
            <button onClick={() => setManualEntryOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <Input label="Vendor/Supplier Name" placeholder="e.g. Fresh Produce Co." />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Total Amount" type="number" prefix={APP_CONFIG.currencySymbol} />
              <Input label="Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <Select label="Expense Category" options={['Food/Beverage COGS', 'Rent', 'Utilities', 'Payroll', 'Marketing', 'Other']} />
            <Input label="Reference / Invoice No." placeholder="e.g. INV-2024-001" />
            <Input label="Notes" placeholder="Optional details..." />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setManualEntryOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { alert('Saved manually'); setManualEntryOpen(false); }}>Save Entry</Button>
          </div>
        </Card>
      </div>
    )}
  </div>
  );
};

export default ExpensesPage;
