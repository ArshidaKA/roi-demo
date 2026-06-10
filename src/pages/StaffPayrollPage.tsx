import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, X } from 'lucide-react';
import { APP_CONFIG } from '@/utils/constants';
import { Card, Input, Select, Button, StatusBadge } from '@/components';
import { useSettings } from '@/utils/useSettings';

const StaffPayrollPage = () => {
  const navigate = useNavigate();
  const { staffList: savedStaffList, isLoaded } = useSettings();
  
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [settlementAmount, setSettlementAmount] = useState('');
  
  const staffList = savedStaffList.map((staff, idx) => {
    const daysPresent = 20 - idx; // Dummy data
    const accrued = daysPresent * staff.dailyRate;
    const paid = idx === 0 ? 2000 : (idx === 1 ? accrued : 0);
    const out = accrued - paid;
    return { ...staff, daysPresent, accrued, paid, out };
  });

  const totalAccrued = staffList.reduce((sum, s) => sum + s.accrued, 0);
  const totalPaid = staffList.reduce((sum, s) => sum + s.paid, 0);
  const totalOut = staffList.reduce((sum, s) => sum + s.out, 0);

  const handleSettleClick = (staff: any) => {
    setSelectedStaff(staff);
    setSettlementAmount(staff.out.toString());
    setSettleModalOpen(true);
  };

  const handleConfirmSettlement = () => {
    setSettleModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Staff & Payroll</h2>
          <p className="text-slate-500 text-sm mt-1">Manage employee salaries, advances, and settlements.</p>
        </div>
        <Button variant="secondary" icon={Users} onClick={() => navigate('/settings')}>Manage Staff</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-slate-500 text-sm font-medium mb-1">Accrued Wages (MTD)</div>
          <div className="text-2xl font-bold text-slate-800">{APP_CONFIG.currencySymbol} {totalAccrued.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
        </Card>
        <Card>
          <div className="text-emerald-600 text-sm font-medium mb-1">Paid This Month</div>
          <div className="text-2xl font-bold text-emerald-700">{APP_CONFIG.currencySymbol} {totalPaid.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
        </Card>
        <Card>
          <div className="text-amber-600 text-sm font-medium mb-1">Outstanding</div>
          <div className="text-2xl font-bold text-amber-700">{APP_CONFIG.currencySymbol} {totalOut.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
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
                <th className="py-3 px-4 text-center">Days Present</th>
                <th className="py-3 px-4 text-right">Daily Rate</th>
                <th className="py-3 px-4 text-right">Accrued Wages</th>
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
                  <td className="py-3 px-4 text-center font-semibold">{row.daysPresent}</td>
                  <td className="py-3 px-4 text-right text-slate-500">{APP_CONFIG.currencySymbol} {row.dailyRate.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{APP_CONFIG.currencySymbol} {row.accrued.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
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

export default StaffPayrollPage;
