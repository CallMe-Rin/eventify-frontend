import type { TransactionStatus } from '@/types/api';
import { getStatusLabel, getStatusColor } from '@/types/api';
import {
  Clock,
  HourglassIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusIcons: Record<TransactionStatus, React.ReactNode> = {
  waiting_payment: <Clock className="size-3.5" />,
  waiting_confirmation: <HourglassIcon className="size-3.5" />,
  done: <CheckCircle2 className="size-3.5" />,
  rejected: <XCircle className="size-3.5" />,
  expired: <AlertTriangle className="size-3.5" />,
  canceled: <Ban className="size-3.5" />,
};

export function TransactionStatusBadge({
  status,
  size = 'md',
}: TransactionStatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        getStatusColor(status),
        sizeClasses[size],
      )}
    >
      {statusIcons[status]}
      {getStatusLabel(status)}
    </span>
  );
}
