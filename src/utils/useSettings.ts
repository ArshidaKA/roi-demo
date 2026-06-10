import { useState, useEffect } from 'react';

export interface Staff {
  id: string;
  name: string;
  role: string;
  monthlySalary: number;
  dailyRate: number;
}

export interface FixedExpense {
  id: string;
  name: string;
  monthlyAmount: number;
}

const DEFAULT_STAFF: Staff[] = [
  { id: 'S001', name: 'Ahmed Ali', role: 'Head Chef', monthlySalary: 8000, dailyRate: 266.67 },
  { id: 'S002', name: 'Sarah Khan', role: 'Manager', monthlySalary: 6000, dailyRate: 200.00 },
  { id: 'S003', name: 'John Doe', role: 'Waiter', monthlySalary: 3500, dailyRate: 116.67 },
  { id: 'S004', name: 'Ravi P.', role: 'Kitchen Helper', monthlySalary: 2500, dailyRate: 83.33 }
];

const DEFAULT_EXPENSES: FixedExpense[] = [
  { id: 'E001', name: 'Rent', monthlyAmount: 6000 },
  { id: 'E002', name: 'Software Subs', monthlyAmount: 300 }
];

export const useSettings = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedStaff = localStorage.getItem('roi_staff');
    const savedExpenses = localStorage.getItem('roi_expenses');
    
    if (savedStaff) {
      setStaffList(JSON.parse(savedStaff));
    } else {
      setStaffList(DEFAULT_STAFF);
      localStorage.setItem('roi_staff', JSON.stringify(DEFAULT_STAFF));
    }

    if (savedExpenses) {
      setFixedExpenses(JSON.parse(savedExpenses));
    } else {
      setFixedExpenses(DEFAULT_EXPENSES);
      localStorage.setItem('roi_expenses', JSON.stringify(DEFAULT_EXPENSES));
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('roi_staff', JSON.stringify(staffList));
      localStorage.setItem('roi_expenses', JSON.stringify(fixedExpenses));
    }
  }, [staffList, fixedExpenses, isLoaded]);

  const addStaff = (staff: Omit<Staff, 'id' | 'dailyRate'>) => {
    const newStaff: Staff = {
      ...staff,
      id: `S${Date.now()}`,
      dailyRate: staff.monthlySalary / 30
    };
    setStaffList(prev => [...prev, newStaff]);
  };

  const removeStaff = (id: string) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
  };

  const addFixedExpense = (expense: Omit<FixedExpense, 'id'>) => {
    const newExpense: FixedExpense = {
      ...expense,
      id: `E${Date.now()}`
    };
    setFixedExpenses(prev => [...prev, newExpense]);
  };

  const removeFixedExpense = (id: string) => {
    setFixedExpenses(prev => prev.filter(e => e.id !== id));
  };

  const totalMonthlyFixedExpenses = fixedExpenses.reduce((sum, e) => sum + e.monthlyAmount, 0);
  const totalDailyFixedCost = totalMonthlyFixedExpenses / 30;

  return {
    staffList,
    fixedExpenses,
    addStaff,
    removeStaff,
    addFixedExpense,
    removeFixedExpense,
    totalMonthlyFixedExpenses,
    totalDailyFixedCost,
    isLoaded
  };
};
