import React from 'react';
import { Plus, CheckCircle2, Clock } from 'lucide-react';
import { APP_CONFIG } from '@/utils/constants';
import { Card, Button } from '@/components';

const StockPage = () => (
  <div className="animate-in fade-in duration-500 pb-10">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Inventory & Stock</h2>
        <p className="text-slate-500 text-sm mt-1">Daily material counting and consumption.</p>
      </div>
      <Button variant="primary" icon={Plus} onClick={() => alert('New Stock Entry clicked')}>New Stock Entry</Button>
    </div>

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
        <Button variant="ghost" className="h-8 px-2 text-xs" onClick={() => alert('Load from Recipe clicked')}>Load from Recipe</Button>
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
         <Button variant="primary" className="px-6" onClick={() => alert('Stock Entry Submitted')}>Submit Stock Entry</Button>
      </div>
    </Card>
  </div>
);

export default StockPage;
