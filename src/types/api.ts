export * from './location';
export * from './event';
export * from './checkout';
export * from './user';
export * from './transaction';
export * from './review';

// Helper to format IDR currency
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to format date
export const formatEventDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatEventTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};

export function formatDateTime(dateString: string | Date): string {
  if (!dateString) return 'Invalid date';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error('Invalid date string:', dateString);
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
