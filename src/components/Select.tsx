import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (string | { label: string; value: string })[];
}

export const Select = ({ label, options, value, onChange, className = '', ...props }: SelectProps) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1.5 text-sm font-medium text-slate-700">{label}</label>}
    <select
      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm appearance-none"
      value={value}
      onChange={onChange}
      {...props}
    >
      {options.map((opt, i) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const lbl = typeof opt === 'string' ? opt : opt.label;
        return <option key={i} value={val}>{lbl}</option>;
      })}
    </select>
  </div>
);
