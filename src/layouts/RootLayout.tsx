import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, PenTool, Receipt, Users, Boxes, BarChart3, TrendingUp, Settings, ArrowRightLeft 
} from 'lucide-react';
import { APP_CONFIG } from '@/utils/constants';

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.substring(1); // remove leading slash
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'daily', label: 'Daily Entry', icon: PenTool, path: '/daily' },
    { id: 'expenses', label: 'Payables & Ledgers', icon: Receipt, path: '/expenses' },
    { id: 'staff', label: 'Staff & Payroll', icon: Users, path: '/staff' },
    { id: 'stock', label: 'Stock & Inventory', icon: Boxes, path: '/stock' },
    { id: 'aggregators', label: 'Aggregators & Debtors', icon: ArrowRightLeft, path: '/aggregators' },
    { id: 'reports', label: 'ROI & Reports', icon: BarChart3, path: '/reports' },
  ];

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
          <button onClick={() => navigate('/settings')} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <Settings size={18} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={`mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {item.label}
                  </>
                )}
              </NavLink>
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
        {/* Desktop Header */}
        <header className="hidden md:flex sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 z-10 justify-between items-center">
           <h1 className="text-xl font-bold text-slate-800 capitalize">
             {currentPath === 'daily' ? 'End of Day Operations' : currentPath.replace('-', ' ')}
           </h1>
           <div className="flex items-center space-x-4">
              <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                ERPNext Connected
              </span>
           </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
