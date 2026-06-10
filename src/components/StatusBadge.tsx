import React from 'react';
import { theme } from '@/utils/constants';
import { CheckCircle2, Clock, AlertCircle, Percent } from 'lucide-react';

export const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { icon: React.ElementType, cls: any }> = {
    'Paid': { icon: CheckCircle2, cls: theme.success },
    'Settled': { icon: CheckCircle2, cls: theme.success },
    'Completed': { icon: CheckCircle2, cls: theme.success },
    'Pending': { icon: Clock, cls: theme.warning },
    'Overdue': { icon: AlertCircle, cls: theme.danger },
    'Partial': { icon: Percent, cls: theme.info }
  };
  const { icon: Icon, cls } = config[status] || config['Pending'];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls.bg} ${cls.text} ${cls.border} border`}>
      <Icon size={12} className="mr-1" /> {status}
    </span>
  );
};
