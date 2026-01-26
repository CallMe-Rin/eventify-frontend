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
    <div className="bg-card border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <img
            src={eventWithTiers.coverImage}
            alt={eventWithTiers.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold">{eventWithTiers.title}</h3>
            <p className="text-sm text-muted-foreground">
              {tier?.name} × {transaction.quantity}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="size-3" />
              <span>{formatDateTime(transaction.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <TransactionStatusBadge status={transaction.status} />
          <p className="font-bold text-lg mt-2">
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
