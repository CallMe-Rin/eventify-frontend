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
import { AlertTriangle, Loader2 } from 'lucide-react';

interface CancelTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CancelTransactionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: CancelTransactionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-xl">
        <AlertDialogHeader>
          <div className="mx-auto size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center">
            Cancel Transaction?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to cancel this transaction? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
          <p className="text-muted-foreground">
            If you cancel this transaction:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Your ticket reservation will be released</li>
            <li>Any points used will be refunded</li>
            <li>Your coupon usage will be restored</li>
          </ul>
        </div>

        <AlertDialogFooter className="sm:flex-col sm:space-x-0 gap-2">
          <AlertDialogCancel className="w-full rounded-xl py-5 hover:cursor-pointer">
            Keep Transaction
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full rounded-xl py-5 hover:cursor-pointer bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Yes, Cancel Transaction'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
