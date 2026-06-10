import React, { useState } from 'react';
import { Card, Button, Input, Select } from '@/components';
import { APP_CONFIG } from '@/utils/constants';
import { Package, X, CheckCircle2, TrendingDown, ArrowRightLeft } from 'lucide-react';

const initialAggregators = [
  { id: '1', name: 'Deliveroo (Partner)', pendingBalance: 4500, logo: Package, status: 'Active', commissionRate: 30 },
  { id: '2', name: 'Talabat', pendingBalance: 12000, logo: Package, status: 'Active', commissionRate: 25 },
  { id: '3', name: 'Noon Food', pendingBalance: 2300, logo: Package, status: 'Active', commissionRate: 20 },
  { id: '4', name: 'Corporate Catering (B2B)', pendingBalance: 8500, logo: Package, status: 'Net-30', commissionRate: 5 },
];

const AggregatorsPage = () => {
  const [aggregators, setAggregators] = useState(initialAggregators);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [settlementForm, setSettlementForm] = useState({
    grossAmount: '',
    commissionAmount: '',
    commissionOverridden: false,
    depositAccount: 'bank'
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const grossNum = parseFloat(settlementForm.grossAmount) || 0;
  const commNum = parseFloat(settlementForm.commissionAmount) || 0;
  const netReceived = grossNum - commNum;

  // Auto-calculate commission when gross amount changes
  const handleGrossChange = (value: string) => {
    const gross = parseFloat(value) || 0;
    const autoComm = selectedPartner
      ? parseFloat(((gross * selectedPartner.commissionRate) / 100).toFixed(2))
      : 0;
    setSettlementForm(prev => ({
      ...prev,
      grossAmount: value,
      // Only auto-fill commission if user hasn't manually overridden it
      commissionAmount: prev.commissionOverridden ? prev.commissionAmount : (gross > 0 ? String(autoComm) : ''),
    }));
  };

  const handleCommissionChange = (value: string) => {
    setSettlementForm(prev => ({ ...prev, commissionAmount: value, commissionOverridden: value !== '' }));
  };

  const handleSettle = () => {
    if (!selectedPartner) return;
    
    // Update local state to reflect settlement
    setAggregators(prev => prev.map(a => {
      if (a.id === selectedPartner.id) {
        return { ...a, pendingBalance: Math.max(0, a.pendingBalance - grossNum) };
      }
      return a;
    }));

    setToastMessage(`Settled ${APP_CONFIG.currencySymbol} ${grossNum} from ${selectedPartner.name}. ${APP_CONFIG.currencySymbol} ${netReceived} deposited to ${settlementForm.depositAccount === 'bank' ? 'Bank' : 'Cash'}, ${APP_CONFIG.currencySymbol} ${commNum} recorded as commission expense.`);
    
    setTimeout(() => setToastMessage(null), 5000);
    setSelectedPartner(null);
    setSettlementForm({ grossAmount: '', commissionAmount: '', commissionOverridden: false, depositAccount: 'bank' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Aggregators & Debtors</h2>
        <p className="text-sm text-slate-500">Manage pending receivables, settle aggregator payouts, and log commissions.</p>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-start">
          <CheckCircle2 className="shrink-0 mr-3 mt-0.5 text-emerald-500" size={18} />
          <p className="text-sm">{toastMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aggregators.map(partner => (
          <Card key={partner.id} className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mr-3 text-indigo-600">
                  <partner.logo size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{partner.name}</h3>
                  <span className="text-xs text-slate-500">{partner.status}</span>
                </div>
              </div>
              <span className="text-xs bg-rose-50 text-rose-600 border border-rose-100 rounded-full px-2 py-0.5 font-medium">
                {partner.commissionRate}% commission
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-1">Pending Balance (Receivable)</p>
              <p className="text-2xl font-bold text-slate-900">
                {APP_CONFIG.currencySymbol} {partner.pendingBalance.toLocaleString()}
              </p>
            </div>

            <Button 
              variant="primary" 
              className="w-full justify-center"
              onClick={() => {
                setSelectedPartner(partner);
                setSettlementForm({ grossAmount: '', commissionAmount: '', commissionOverridden: false, depositAccount: 'bank' });
              }}
              disabled={partner.pendingBalance === 0}
            >
              Receive Payment
            </Button>
          </Card>
        ))}
      </div>

      {/* Settlement Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Settle: {selectedPartner.name}</h3>
              <button onClick={() => setSelectedPartner(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Current Outstanding:</span>
                <span className="font-semibold text-slate-900">{APP_CONFIG.currencySymbol} {selectedPartner.pendingBalance.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gross Settled Amount</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 2000"
                    value={settlementForm.grossAmount}
                    onChange={(e) => handleGrossChange(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">Amount to deduct from pending.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Commission Taken
                    <span className="ml-1 text-xs font-normal text-rose-500">({selectedPartner?.commissionRate}% auto)</span>
                  </label>
                  <Input 
                    type="number" 
                    placeholder="Auto-calculated"
                    value={settlementForm.commissionAmount}
                    onChange={(e) => handleCommissionChange(e.target.value)}
                  />
                  <p className="text-xs text-rose-500 mt-1 flex items-center"><TrendingDown size={12} className="mr-1"/> Deducted from gross. Recorded as Expense.</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-900">Net Amount Received</p>
                  <p className="text-xs text-indigo-700">Gross - Commission</p>
                </div>
                <div className="text-xl font-bold text-indigo-700">
                  {APP_CONFIG.currencySymbol} {netReceived > 0 ? netReceived.toLocaleString() : '0'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deposit Net Amount To</label>
                <Select 
                  value={settlementForm.depositAccount}
                  onChange={(e) => setSettlementForm({...settlementForm, depositAccount: e.target.value})}
                  options={[
                    { value: 'bank', label: 'Bank Account (Emirates NBD)' },
                    { value: 'cash', label: 'Cash in Hand' }
                  ]}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelectedPartner(null)}>Cancel</Button>
              <Button 
                variant="primary" 
                onClick={handleSettle}
                disabled={grossNum <= 0 || grossNum > selectedPartner.pendingBalance || commNum > grossNum}
              >
                Confirm Settlement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AggregatorsPage;
