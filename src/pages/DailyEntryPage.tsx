import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, TrendingUp, Package, Receipt, Users, AlertCircle } from 'lucide-react';
import { APP_CONFIG } from '@/utils/constants';
import { Card, Input, Select, Button, SectionHeader } from '@/components';
import { useSettings } from '@/utils/useSettings';

// Shared row type for all expenses
interface ExpenseRow {
  id: number;
  amount: string;
  account: string;
  isCredit: boolean;
  settledAmount: string;
}

const DailyEntryPage = () => {
  const getToday = () => new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(getToday());
  const [activeTab, setActiveTab] = useState('revenue');
  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const [totalSalesInput, setTotalSalesInput] = useState('');

  const accountOptions = ['Cash', 'Emirates NBD Bank', 'Credit Card POS', 'Petty Cash'];

  const defaultExpRow = (): Omit<ExpenseRow, 'id'> => ({
    amount: '', account: 'Cash', isCredit: false, settledAmount: ''
  });

  // Revenue stays as before (fixed accounts)
  const [revenue, setRevenue] = useState([
    { id: 1, account: 'Cash', amount: '' },
    { id: 2, account: 'Emirates NBD Bank', amount: '' },
    { id: 3, account: 'Deliveroo (Partner)', amount: '' },
  ]);

  // Purchases
  const [purchases, setPurchases] = useState([
    { id: Date.now(), item: '', vendor: '', ...defaultExpRow() }
  ]);

  // OpEx rows: category + expense fields
  const [opex, setOpex] = useState([
    { id: Date.now(), category: 'Rent', ...defaultExpRow() }
  ]);

  // Gas rows
  const [gas, setGas] = useState([
    { id: 1, type: 'Gas - Store', ...defaultExpRow() },
    { id: 2, type: 'Gas - Staff (Transport)', ...defaultExpRow() }
  ]);

  // Royalty rows
  const [royalty, setRoyalty] = useState([
    { id: Date.now(), type: 'Management Fee', ...defaultExpRow() }
  ]);

  // Marketing rows
  const [marketing, setMarketing] = useState([
    { id: Date.now(), campaign: 'Meta Ads', ...defaultExpRow() }
  ]);

  // Other / Misc
  const [otherExp, setOtherExp] = useState([
    { id: Date.now(), description: '', ...defaultExpRow() }
  ]);

  // Salary settlements
  const [salaries, setSalaries] = useState([
    { id: Date.now(), employee: '', ...defaultExpRow() }
  ]);

  // Wastage
  const [wastageRaw, setWastageRaw] = useState([{ id: Date.now(), item: '', qty: '', value: '' }]);
  const [wastageCooked, setWastageCooked] = useState([{ id: Date.now(), item: '', qty: '', value: '' }]);

  const { staffList, totalDailyFixedCost, isLoaded } = useSettings();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (isLoaded && attendance.length === 0 && staffList.length > 0) {
      setAttendance(staffList.map(staff => ({ ...staff, status: 'Present' })));
    }
  }, [isLoaded, staffList]);

  // Generic handlers
  const addRow = (setter: any, defaultObj: any) => setter((prev: any) => [...prev, { id: Date.now(), ...defaultObj }]);
  const removeRow = (setter: any, id: number) => setter((prev: any) => prev.filter((row: any) => row.id !== id));
  const updateRow = (setter: any, id: number, field: string, value: any) => setter((prev: any) =>
    prev.map((row: any) => row.id === id ? { ...row, [field]: value } : row)
  );

  // Calculations
  const parseAmt = (val: string | number) => parseFloat(val as string) || 0;

  const totalSalesExpected = parseAmt(totalSalesInput);
  const totalRevenue = revenue.reduce((sum, r) => sum + parseAmt(r.amount), 0);

  const totalPurchases = purchases.reduce((sum, p) => sum + parseAmt(p.amount), 0);
  const totalPurchaseCredit = purchases.reduce((sum, p) => sum + (p.isCredit ? (parseAmt(p.amount) - parseAmt(p.settledAmount)) : 0), 0);

  const sumExpList = (list: any[]) => list.reduce((sum, item) => sum + parseAmt(item.amount), 0);
  const totalOpex = sumExpList(opex) + sumExpList(royalty) + sumExpList(gas) + sumExpList(marketing) + sumExpList(otherExp);

  const totalAccruedWages = attendance.reduce((sum, emp) => {
    if (emp.status === 'Present') return sum + emp.dailyRate;
    if (emp.status === 'Half-day') return sum + (emp.dailyRate / 2);
    return sum;
  }, 0);

  const totalSalarySettlements = sumExpList(salaries);
  const totalExpenses = totalPurchases + totalOpex + totalAccruedWages + totalDailyFixedCost;
  const estNetProfit = totalRevenue - totalExpenses;
  const totalCreditAccrued = totalPurchaseCredit;

  // Save payload
  const handleSave = () => {
    let newErrors: string[] = [];
    if (!date) newErrors.push('Date is required.');
    if (totalSalesExpected > 0 && Math.abs(totalSalesExpected - totalRevenue) > 0.01) {
      newErrors.push(`Total Sales (${totalSalesExpected}) does not match Revenue split (${totalRevenue}).`);
    }
    purchases.forEach((p, i) => {
      if (p.isCredit && !p.vendor) newErrors.push(`Purchase row ${i + 1}: Vendor required for credit.`);
      if (p.isCredit && parseAmt(p.settledAmount) > parseAmt(p.amount)) newErrors.push(`Purchase row ${i + 1}: Settled > Total.`);
    });
    const rawNames = wastageRaw.map(w => w.item).filter(n => n);
    if (new Set(rawNames).size !== rawNames.length) newErrors.push('Duplicate items in Raw Wastage.');
    const cookedNames = wastageCooked.map(w => w.item).filter(n => n);
    if (new Set(cookedNames).size !== cookedNames.length) newErrors.push('Duplicate items in Cooked Wastage.');
    setErrors(newErrors);

    const mapExpToJournal = (list: any[], type: string, catField: string) =>
      list.filter(r => parseAmt(r.amount) > 0).map(r => ({
        type, category: r[catField], amount: parseAmt(r.amount),
        account: r.isCredit ? 'Accounts Payable' : r.account,
        isCredit: r.isCredit, settledAmount: parseAmt(r.settledAmount)
      }));

    const payload = {
      docType: 'Daily End of Day',
      date,
      salesInvoices: revenue.filter(r => parseAmt(r.amount) > 0).map(r => ({ account: r.account, amount: parseAmt(r.amount), is_pos: 1 })),
      purchaseInvoices: purchases.filter(p => parseAmt(p.amount) > 0).map(p => ({
        item: p.item, vendor: p.vendor, total: parseAmt(p.amount),
        credit: p.isCredit, paidAmount: p.isCredit ? parseAmt(p.settledAmount) : parseAmt(p.amount), account: p.account
      })),
      journalEntries: [
        ...mapExpToJournal(opex, 'OpEx', 'category'),
        ...mapExpToJournal(royalty, 'Royalty', 'type'),
        ...mapExpToJournal(gas, 'Gas', 'type'),
        ...mapExpToJournal(marketing, 'Marketing', 'campaign'),
        ...mapExpToJournal(otherExp, 'Other', 'description'),
      ],
      salarySlips: salaries.filter(s => parseAmt(s.amount) > 0).map(s => ({
        employee: s.employee, amount: parseAmt(s.amount), account: s.account
      })),
      stockEntries: [
        ...wastageRaw.map(w => ({ type: 'Wastage (Raw)', item: w.item, qty: w.qty, value: parseAmt(w.value) })),
        ...wastageCooked.map(w => ({ type: 'Wastage (Cooked)', item: w.item, qty: w.qty, value: parseAmt(w.value) }))
      ].filter(s => s.qty || s.value),
      attendanceLog: attendance.map(a => ({ employee: a.name, status: a.status, accruedWage: a.status === 'Present' ? a.dailyRate : (a.status === 'Half-day' ? a.dailyRate / 2 : 0) })),
      notes,
    };

    console.log('ERPNext Mapping Payload:', payload);
    setPreviewData(payload);
    setShowPreview(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // Reusable credit row renderer for all expense sections
  const renderExpenseRow = (
    row: any,
    setter: any,
    labelField: string,
    labelOptions?: string[],
    labelPlaceholder?: string,
    canDelete?: boolean
  ) => (
    <div key={row.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 relative">
      {/* Label field: either a select or a text input */}
      <div className="mb-2 pr-8">
        {labelOptions ? (
          <Select
            options={labelOptions}
            value={row[labelField]}
            onChange={(e) => updateRow(setter, row.id, labelField, e.target.value)}
          />
        ) : (
          <Input
            placeholder={labelPlaceholder || 'Description'}
            value={row[labelField]}
            onChange={(e) => updateRow(setter, row.id, labelField, e.target.value)}
          />
        )}
      </div>

      {/* Amount + account + credit row */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded border border-slate-100">
        <Input
          type="number"
          prefix={APP_CONFIG.currencySymbol}
          placeholder="Amount"
          className="w-36"
          value={row.amount}
          onChange={(e) => updateRow(setter, row.id, 'amount', e.target.value)}
        />
        {!row.isCredit && (
          <Select
            options={accountOptions}
            value={row.account}
            onChange={(e) => updateRow(setter, row.id, 'account', e.target.value)}
            className="w-44"
          />
        )}
        <label className="flex items-center cursor-pointer text-sm font-medium text-slate-600 ml-1">
          <input
            type="checkbox"
            className="w-4 h-4 mr-2 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
            checked={row.isCredit}
            onChange={(e) => updateRow(setter, row.id, 'isCredit', e.target.checked)}
          />
          On Credit
        </label>
        {row.isCredit && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              prefix={APP_CONFIG.currencySymbol}
              placeholder="Settled Now"
              className="w-36"
              value={row.settledAmount}
              onChange={(e) => updateRow(setter, row.id, 'settledAmount', e.target.value)}
            />
            <Select
              options={accountOptions}
              value={row.account}
              onChange={(e) => updateRow(setter, row.id, 'account', e.target.value)}
              className="w-44"
            />
          </div>
        )}
      </div>

      {canDelete && (
        <button
          onClick={() => removeRow(setter, row.id)}
          className="absolute top-3 right-2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

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
          <div className="font-semibold flex items-center mb-2"><AlertCircle size={16} className="mr-2" /> Please fix the following errors:</div>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'revenue', label: 'Revenue & Sales' },
          { id: 'purchases', label: 'Purchases & COGS' },
          { id: 'operations', label: 'Operations & Admin' },
          { id: 'payroll', label: 'Payroll' },
          { id: 'wastage', label: 'Wastage & Notes' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === t.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">

        {/* ── REVENUE ── */}
        {activeTab === 'revenue' && (
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
        )}

        {/* ── PURCHASES ── */}
        {activeTab === 'purchases' && (
          <Card>
            <SectionHeader title="Purchases (Inventory & COGS)" icon={Package} colorClass="text-blue-600" subtitle="Raw materials, packaging, etc." />
            <div className="space-y-3">
              {purchases.map((row) => (
                <div key={row.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 pr-8">
                    <Input placeholder="Item / Category" value={row.item} onChange={(e) => updateRow(setPurchases, row.id, 'item', e.target.value)} />
                    <Input placeholder="Vendor Name" value={row.vendor} onChange={(e) => updateRow(setPurchases, row.id, 'vendor', e.target.value)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded border border-slate-100">
                    <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Total Amount" className="w-36" value={row.amount} onChange={(e) => updateRow(setPurchases, row.id, 'amount', e.target.value)} />
                    {!row.isCredit && (
                      <Select options={accountOptions} value={row.account} onChange={(e) => updateRow(setPurchases, row.id, 'account', e.target.value)} className="w-44" />
                    )}
                    <label className="flex items-center cursor-pointer text-sm font-medium text-slate-600 ml-1">
                      <input type="checkbox" className="w-4 h-4 mr-2 rounded border-slate-300 text-amber-500 focus:ring-amber-400" checked={row.isCredit} onChange={(e) => updateRow(setPurchases, row.id, 'isCredit', e.target.checked)} />
                      On Vendor Credit
                    </label>
                    {row.isCredit && (
                      <div className="flex items-center gap-2">
                        <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Settled Now" className="w-36" value={row.settledAmount} onChange={(e) => updateRow(setPurchases, row.id, 'settledAmount', e.target.value)} />
                        <Select options={accountOptions} value={row.account} onChange={(e) => updateRow(setPurchases, row.id, 'account', e.target.value)} className="w-44" />
                      </div>
                    )}
                  </div>
                  {purchases.length > 1 && (
                    <button onClick={() => removeRow(setPurchases, row.id)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><Trash2 size={16} /></button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="ghost" onClick={() => addRow(setPurchases, { item: '', vendor: '', ...defaultExpRow() })} className="mt-3 text-blue-600">
              <Plus size={16} className="mr-1" /> Add Purchase Item
            </Button>
          </Card>
        )}

        {/* ── OPERATIONS ── */}
        {activeTab === 'operations' && (
          <Card>
            <SectionHeader title="Operations & Admin" icon={Receipt} colorClass="text-amber-600" />
            <div className="space-y-6">

              {/* Standard Expenses */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Standard Expenses</h4>
                <div className="space-y-3">
                  {opex.map((row) => renderExpenseRow(
                    row, setOpex, 'category',
                    ['Rent', 'Electricity', 'Water', 'Internet', 'Maintenance', 'Cleaning', 'Pest Control'],
                    undefined, true
                  ))}
                </div>
                <Button variant="ghost" onClick={() => addRow(setOpex, { category: 'Maintenance', ...defaultExpRow() })} className="mt-2 text-amber-600 h-8 text-xs">
                  <Plus size={14} className="mr-1" /> Add OpEx
                </Button>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Auto-Accrued */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Auto-Accrued Fixed Costs</h4>
                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-slate-50 p-2 rounded">
                  <div className="w-full md:w-48 font-medium text-sm text-slate-600">Fixed Monthly Expenses</div>
                  <div className="w-full md:w-32 text-slate-500 text-sm">{APP_CONFIG.currencySymbol} {totalDailyFixedCost.toFixed(2)} / day</div>
                  <div className="text-xs text-amber-600">Configured in Settings</div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Gas */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Gas Expenses</h4>
                <div className="space-y-3">
                  {gas.map((row) => renderExpenseRow(
                    row, setGas, 'type',
                    ['Gas - Store', 'Gas - Staff (Transport)', 'Gas - Other'],
                    undefined, true
                  ))}
                </div>
                <Button variant="ghost" onClick={() => addRow(setGas, { type: 'Gas - Store', ...defaultExpRow() })} className="mt-2 text-amber-600 h-8 text-xs">
                  <Plus size={14} className="mr-1" /> Add Gas
                </Button>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Fees & Marketing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Fees & Royalties</h4>
                  <div className="space-y-3 mb-2">
                    {royalty.map((row) => renderExpenseRow(
                      row, setRoyalty, 'type',
                      ['Management Fee', 'Franchise Royalty', 'Software Sub'],
                      undefined, true
                    ))}
                  </div>
                  <Button variant="ghost" onClick={() => addRow(setRoyalty, { type: 'Management Fee', ...defaultExpRow() })} className="p-0 h-auto text-xs text-amber-600">
                    <Plus size={14} className="mr-1" /> Add Fee
                  </Button>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Marketing</h4>
                  <div className="space-y-3 mb-2">
                    {marketing.map((row) => renderExpenseRow(
                      row, setMarketing, 'campaign',
                      undefined, 'Campaign Name', true
                    ))}
                  </div>
                  <Button variant="ghost" onClick={() => addRow(setMarketing, { campaign: '', ...defaultExpRow() })} className="p-0 h-auto text-xs text-amber-600">
                    <Plus size={14} className="mr-1" /> Add Campaign
                  </Button>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Other */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Other / Misc Expenses</h4>
                <div className="space-y-3">
                  {otherExp.map((row) => renderExpenseRow(
                    row, setOtherExp, 'description',
                    undefined, 'Description', true
                  ))}
                </div>
                <Button variant="ghost" onClick={() => addRow(setOtherExp, { description: '', ...defaultExpRow() })} className="mt-2 text-amber-600 h-8 text-xs">
                  <Plus size={14} className="mr-1" /> Add Misc
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ── PAYROLL ── */}
        {activeTab === 'payroll' && (
          <Card>
            <SectionHeader title="Attendance & Daily Wage Accrual" icon={Users} colorClass="text-indigo-600" subtitle="Cost is accrued based on attendance" />
            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
              {attendance.map((emp) => (
                <div key={emp.id} className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-200 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-[150px]">
                    <div className="font-semibold text-slate-800">{emp.name}</div>
                    <div className="text-xs text-slate-500">{emp.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      options={['Present', 'Half-day', 'Absent']}
                      value={emp.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as 'Present' | 'Half-day' | 'Absent';
                        setAttendance(prev => prev.map(a => a.id === emp.id ? { ...a, status: newStatus } : a));
                      }}
                      className="w-32"
                    />
                    <div className="w-24 text-right font-medium text-slate-700">
                      {APP_CONFIG.currencySymbol} {(emp.status === 'Present' ? emp.dailyRate : (emp.status === 'Half-day' ? emp.dailyRate / 2 : 0)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-3 flex justify-between items-center border-t border-slate-200">
                <span className="font-semibold text-slate-700">Total Accrued Today:</span>
                <span className="text-lg font-bold text-indigo-700">{APP_CONFIG.currencySymbol} {totalAccruedWages.toFixed(2)}</span>
              </div>
            </div>

            <SectionHeader title="Salary Settlements (Advances/Payments)" icon={Receipt} colorClass="text-emerald-600" subtitle="Cash given to staff today" />
            <div className="space-y-3">
              {salaries.map((row) => (
                <div key={row.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 relative">
                  <div className="mb-2 pr-8">
                    <Select
                      options={['', ...staffList.map(s => s.name), 'Other']}
                      value={row.employee}
                      onChange={(e) => updateRow(setSalaries, row.id, 'employee', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded border border-slate-100">
                    <Input type="number" prefix={APP_CONFIG.currencySymbol} placeholder="Amount" className="w-36" value={row.amount} onChange={(e) => updateRow(setSalaries, row.id, 'amount', e.target.value)} />
                    <Select options={accountOptions} value={row.account} onChange={(e) => updateRow(setSalaries, row.id, 'account', e.target.value)} className="w-44" />
                  </div>
                  <button onClick={() => removeRow(setSalaries, row.id)} className="absolute top-3 right-2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><Trash2 size={16} /></button>
                </div>
              ))}
              <Button variant="ghost" onClick={() => addRow(setSalaries, { employee: '', ...defaultExpRow() })} className="text-emerald-600 h-8 px-2 text-sm bg-emerald-50">
                <Plus size={14} className="mr-1" /> Add Payment
              </Button>
            </div>
          </Card>
        )}

        {/* ── WASTAGE ── */}
        {activeTab === 'wastage' && (
          <div className="space-y-6">
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
                    <Button variant="ghost" onClick={() => addRow(setWastageRaw, { item: '', qty: '', value: '' })} className="p-0 h-auto text-xs text-slate-500"><Plus size={14} className="mr-1" /> Add Raw</Button>
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
                    <Button variant="ghost" onClick={() => addRow(setWastageCooked, { item: '', qty: '', value: '' })} className="p-0 h-auto text-xs text-slate-500"><Plus size={14} className="mr-1" /> Add Cooked</Button>
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <Input label="Day Notes (Issues, Weather, Comments)" type="text" placeholder="e.g. Heavy rain affected evening deliveries..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Card>
          </div>
        )}

        {/* Save preview */}
        {showPreview && previewData && (
          <Card className="border-emerald-200 bg-emerald-50/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-emerald-800 flex items-center"><CheckCircle2 className="mr-2" size={20} /> Data Saved & Mapped to ERPNext</h3>
              <Button variant="ghost" onClick={() => setShowPreview(false)} className="h-8 px-2 text-xs">Close</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-mono bg-white p-4 rounded-lg border border-slate-200 overflow-x-auto">
              <div><div className="font-bold text-slate-700 mb-1">Sales/POS Invoices</div><div className="text-slate-600">{previewData.salesInvoices.length} docs</div></div>
              <div><div className="font-bold text-slate-700 mb-1">Purchase Invoices</div><div className="text-slate-600">{previewData.purchaseInvoices.length} docs</div></div>
              <div><div className="font-bold text-slate-700 mb-1">Journal Entries</div><div className="text-slate-600">{previewData.journalEntries.length} docs</div></div>
              <div><div className="font-bold text-slate-700 mb-1">Stock Entries</div><div className="text-slate-600">{previewData.stockEntries.length} docs</div></div>
              <div><div className="font-bold text-slate-700 mb-1">Salary Slips</div><div className="text-slate-600">{previewData.salarySlips.length} docs</div></div>
              <div><div className="font-bold text-slate-700 mb-1">Attendance</div><div className="text-slate-600">{previewData.attendanceLog.length} records</div></div>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-mono">Console logged full payload details.</p>
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
              <span className="font-bold text-amber-600">{APP_CONFIG.currencySymbol} {totalCreditAccrued.toFixed(0)}</span>
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

export default DailyEntryPage;
