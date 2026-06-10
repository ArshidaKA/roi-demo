import React from 'react';

export const SectionHeader = ({ title, icon: Icon, colorClass, subtitle }: { title: string; icon: React.ElementType; colorClass: string; subtitle?: string }) => (
  <div className="flex items-start pb-3 mb-4 border-b border-slate-100">
    <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('600', '100')} bg-opacity-50 mr-3 shrink-0`}>
      <Icon size={20} className={colorClass} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);
