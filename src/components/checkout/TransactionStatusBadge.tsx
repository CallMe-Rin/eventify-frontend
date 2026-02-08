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
  WAITING_PAYMENT: <Clock className="size-3.5" />,
  WAITING_CONFIRMATION: <HourglassIcon className="size-3.5" />,
  DONE: <CheckCircle2 className="size-3.5" />,
  REJECTED: <XCircle className="size-3.5" />,
  EXPIRED: <AlertTriangle className="size-3.5" />,
  CANCELED: <Ban className="size-3.5" />,
};

export function TransactionStatusBadge({
  status,
  size = 'md',
}: TransactionStatusBadgeProps) {
  const sizeClasses = {
    sm: 'sm:text-xs sm:px-2 sm:py-0.5',
    md: 'sm:text-sm sm:px-2.5 sm:py-1',
    lg: 'sm:text-base sm:px-3 sm:py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full sm:border',
        getStatusColor(status),
        sizeClasses[size],
      )}
    >
      {statusIcons[status]}
      <span className="hidden sm:inline">{getStatusLabel(status)}</span>
    </span>
  );
}
