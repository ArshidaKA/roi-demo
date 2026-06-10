import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
}

export const Input = ({ label, type = 'text', placeholder, value, onChange, className = '', prefix, suffix, error, readOnly, ...props }: InputProps) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1.5 text-sm font-medium text-slate-700">{label}</label>}
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-slate-400 text-sm font-medium">{prefix}</span>}
      <input
        type={type}
        className={`w-full px-3 py-2 bg-slate-50 border ${error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg focus:ring-2 focus:bg-white outline-none transition-all text-sm
          ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-8' : ''} ${readOnly ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        {...props}
      />
      {suffix && <span className="absolute right-3 text-slate-400 text-sm">{suffix}</span>}
    </div>
    {error && <span className="text-xs text-rose-500 mt-1">{error}</span>}
  </div>
);
