import { useState, useEffect } from 'react';

interface UseCountdownReturn {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
}

export function useCountdown(
  expiresAt: string,
  onExpire?: () => void,
): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const expireTime = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expireTime - now) / 1000));
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          onExpire?.();
          clearInterval(interval);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  return {
    hours: Math.floor(timeLeft / 3600),
    minutes: Math.floor((timeLeft % 3600) / 60),
    seconds: timeLeft % 60,
    totalSeconds: timeLeft,
    isExpired: timeLeft <= 0,
  };
}
