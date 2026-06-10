import React, { useState } from 'react';
import { Settings, Plus, Trash2, Users, Receipt } from 'lucide-react';
import { APP_CONFIG } from '@/utils/constants';
import { Card, Input, Button, SectionHeader } from '@/components';
import { useSettings } from '@/utils/useSettings';

const SettingsPage = () => {
  const { 
    staffList, fixedExpenses, addStaff, removeStaff, 
    addFixedExpense, removeFixedExpense, totalMonthlyFixedExpenses, totalDailyFixedCost 
  } = useSettings();

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffSalary, setNewStaffSalary] = useState('');

  const [newExpName, setNewExpName] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');

  const handleAddStaff = () => {
    if (!newStaffName || !newStaffSalary) return;
    addStaff({
      name: newStaffName,
      role: newStaffRole || 'Staff',
      monthlySalary: parseFloat(newStaffSalary)
    });
    setNewStaffName('');
    setNewStaffRole('');
    setNewStaffSalary('');
  };

  const handleAddExpense = () => {
    if (!newExpName || !newExpAmount) return;
    addFixedExpense({
      name: newExpName,
      monthlyAmount: parseFloat(newExpAmount)
    });
    setNewExpName('');
    setNewExpAmount('');
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center mr-4">
          <Settings className="text-slate-700" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Business Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Configure staff, fixed costs, and operational constants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fixed Expenses Section */}
        <Card className="flex flex-col">
          <SectionHeader title="Monthly Fixed Costs" icon={Receipt} colorClass="text-amber-600" subtitle="Rent, subscriptions, etc." />
          
          <div className="space-y-3 mb-6 flex-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
            {fixedExpenses.map(exp => (
              <div key={exp.id} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0 last:pb-0">
                <div className="font-medium text-slate-800">{exp.name}</div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold">{APP_CONFIG.currencySymbol} {exp.monthlyAmount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{APP_CONFIG.currencySymbol} {(exp.monthlyAmount/30).toFixed(1)} / day</div>
                  </div>
                  <button onClick={() => removeFixedExpense(exp.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {fixedExpenses.length === 0 && <div className="text-sm text-slate-500 text-center py-4">No fixed expenses configured.</div>}
            
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <div>
                 <div className="font-semibold text-slate-700">Total Auto-Accrued:</div>
                 <div className="text-xs text-amber-600 font-medium">Added to daily expenses automatically</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{APP_CONFIG.currencySymbol} {totalMonthlyFixedExpenses.toLocaleString()} <span className="text-sm font-normal text-slate-500">/mo</span></div>
                <div className="text-sm font-bold text-amber-600">{APP_CONFIG.currencySymbol} {totalDailyFixedCost.toFixed(2)} <span className="text-xs font-normal">/day</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            <Input placeholder="Expense Name" className="flex-1" value={newExpName} onChange={(e) => setNewExpName(e.target.value)} />
            <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Monthly Amt" className="w-32" value={newExpAmount} onChange={(e) => setNewExpAmount(e.target.value)} />
            <Button variant="primary" onClick={handleAddExpense} className="px-3"><Plus size={18} /></Button>
          </div>
        </Card>

        {/* Staff Management Section */}
        <Card className="flex flex-col">
          <SectionHeader title="Staff Roster" icon={Users} colorClass="text-indigo-600" subtitle="Manage employees and salaries" />
          
          <div className="space-y-3 mb-6 flex-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
            {staffList.map(staff => (
              <div key={staff.id} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium text-slate-800">{staff.name}</div>
                  <div className="text-xs text-slate-500">{staff.role}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold">{APP_CONFIG.currencySymbol} {staff.monthlySalary.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{APP_CONFIG.currencySymbol} {staff.dailyRate.toFixed(1)} / day</div>
                  </div>
                  <button onClick={() => removeStaff(staff.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {staffList.length === 0 && <div className="text-sm text-slate-500 text-center py-4">No staff configured.</div>}
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            <div className="w-full flex gap-2">
              <Input placeholder="Staff Name" className="flex-1" value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} />
              <Input placeholder="Role" className="flex-1" value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} />
            </div>
            <div className="w-full flex gap-2">
               <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Monthly Salary" className="flex-1" value={newStaffSalary} onChange={(e) => setNewStaffSalary(e.target.value)} />
               <Button variant="primary" onClick={handleAddStaff} className="px-6">Add Staff</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
