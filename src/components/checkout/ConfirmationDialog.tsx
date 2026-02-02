import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatIDR } from '@/types';
import type { PriceBreakdown } from '@/types/api';
import { Loader2, ShieldCheck } from 'lucide-react';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  eventTitle: string;
  ticketName: string;
  quantity: number;
  priceBreakdown: PriceBreakdown;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  eventTitle,
  ticketName,
  quantity,
  priceBreakdown,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-xl">
        <AlertDialogHeader>
          <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-center">
            Confirm Your Purchase
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Please review your order details before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted rounded-lg p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Event</span>
            <span className="font-semibold text-right max-w-[60%] truncate">
              {eventTitle}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ticket</span>
            <span className="font-semibold">{ticketName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-semibold">{quantity}</span>
          </div>
          {priceBreakdown.totalDiscount > 0 && (
            <>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatIDR(priceBreakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatIDR(priceBreakdown.totalDiscount)}</span>
              </div>
            </>
          )}
          <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
            <span>Total</span>
            <span className="text-primary">
              {formatIDR(priceBreakdown.total)}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          You will have 2 hours to complete the payment after checkout.
        </p>

        <AlertDialogFooter className="sm:flex-col sm:space-x-0 gap-2">
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full rounded-xl py-5 hover:cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm & Proceed to Payment'
            )}
          </AlertDialogAction>
          <AlertDialogCancel className="w-full rounded-xl py-5 hover:cursor-pointer hover:bg-destructive/20 hover:border-destructive/10 hover:text-destructive">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
