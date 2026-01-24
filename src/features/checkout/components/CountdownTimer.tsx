import { useCountdown } from '@/hooks/useCountdown';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const { hours, minutes, seconds, isExpired, totalSeconds } = useCountdown(
    expiresAt,
    onExpire,
  );

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
        <AlertTriangle className="size-5" />
        <span className="font-medium">Payment time expired</span>
      </div>
    );
  }

  const isUrgent = totalSeconds < 30 * 60; // Less than 30 minutes

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
        isUrgent ? 'bg-warning/10 text-warning' : 'bg-muted'
      }`}
    >
      <Clock className={`size-5 ${isUrgent ? 'animate-pulse' : ''}`} />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">
          Time remaining to pay
        </span>
        <div className="flex items-center gap-1 font-mono font-bold text-lg">
          <TimeUnit value={hours} label="h" />
          <span className="text-muted-foreground">:</span>
          <TimeUnit value={minutes} label="m" />
          <span className="text-muted-foreground">:</span>
          <TimeUnit value={seconds} label="s" isUrgent={isUrgent} />
        </div>
      </div>
    </div>
  );
}

function TimeUnit({
  value,
  label,
  isUrgent = false,
}: {
  value: number;
  label: string;
  isUrgent?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-baseline ${
        isUrgent && label === 's' ? 'text-destructive animate-pulse-soft' : ''
      }`}
    >
      {String(value).padStart(2, '0')}
      <span className="text-xs text-muted-foreground ml-0.5">{label}</span>
    </span>
  );
}
