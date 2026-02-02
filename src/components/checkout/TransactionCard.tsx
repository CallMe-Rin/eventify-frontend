import { useEventWithTiers } from '@/hooks/useEvents';
import { formatDateTime, formatIDR, type Transaction } from '@/types/api';
import { TransactionCardSkeleton } from './TransactionCardSkeleton';
import { CountdownTimer } from './CountdownTimer';
import { PaymentProofUpload } from './PaymentProofUpload';
import { TransactionStatusBadge } from './TransactionStatusBadge';
import { Calendar } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onUploadPaymentProof: (url: string) => Promise<Transaction | null>;
  isUploading: boolean;
}

export default function TransactionCard({
  transaction,
  onUploadPaymentProof,
  isUploading,
}: TransactionCardProps) {
  const { data: eventWithTiers, isLoading } = useEventWithTiers(
    transaction.event_id,
  );

  if (isLoading) return <TransactionCardSkeleton />;
  if (!eventWithTiers) return null;

  const tier = eventWithTiers.ticketTiers.find(
    (t) => t.id === transaction.ticket_tier_id,
  );

  return (
    <div className="bg-card border rounded-xl p-3 sm:p-5 space-y-3 sm:space-y-4">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Event info */}
        <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
          <img
            src={eventWithTiers.coverImage}
            alt={eventWithTiers.title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-base line-clamp-2">
              {eventWithTiers.title}
            </h3>
            <p className="text-sm sm:text-sm text-muted-foreground truncate">
              {tier?.name} × {transaction.quantity}
            </p>
            <div className="flex items-center gap-2 text-sm sm:text-sm text-muted-foreground mt-1">
              <Calendar className="size-3 shrink-0" />
              <span className="truncate">
                {formatDateTime(transaction.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Badge + Price */}
        <div className="flex flex-col items-end text-right gap-2 shrink-0">
          <TransactionStatusBadge status={transaction.status} />
          <p className="font-bold text-sm sm:text-lg whitespace-nowrap">
            {formatIDR(transaction.total_amount)}
          </p>
        </div>
      </div>

      {transaction.status === 'waiting_payment' && transaction.expires_at && (
        <div className="border-t pt-4 space-y-4">
          {/* Validate expiresAt is a valid date string */}
          {!isNaN(new Date(transaction.expires_at).getTime()) ? (
            <CountdownTimer expiresAt={transaction.expires_at} />
          ) : (
            <div className="text-sm text-muted-foreground">
              Invalid expiration date
            </div>
          )}
          <PaymentProofUpload
            onUpload={onUploadPaymentProof}
            isUploading={isUploading}
          />
        </div>
      )}

      {transaction.status === 'waiting_confirmation' && (
        <div className="border-t pt-4 space-y-3">
          <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm">
            Payment proof submitted. Waiting for organizer confirmation.
          </div>

          {/* Show uploaded proof */}
          {transaction.payment_proof_url && (
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={transaction.payment_proof_url}
                alt="Payment proof"
                className="w-full h-auto max-h-48 object-contain bg-muted"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
