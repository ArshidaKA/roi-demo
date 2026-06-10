import React from 'react';

export const Card = ({ children, className = '', noPadding = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; noPadding?: boolean }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`} {...props}>
    {children}
  </div>
);
