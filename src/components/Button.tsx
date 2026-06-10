import React from 'react';
import { theme } from '@/utils/constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  icon?: React.ElementType;
}

export const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon, disabled, ...props }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: `${theme.primary.bg} hover:bg-indigo-700 text-white shadow-sm`,
    secondary: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm",
    ghost: "hover:bg-slate-100 text-slate-600",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={16} className={`mr-2 ${children ? '' : 'mr-0'}`} />}
      {children}
    </button>
  );
};
