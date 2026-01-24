import { Link } from 'react-router';
import { useAuth } from '@/contexts/authContextValue';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ticket } from 'lucide-react';
import { TransactionCardSkeleton } from '@/features/checkout/components/TransactionCardSkeleton';
import TransactionCard from '@/features/checkout/components/TransactionCard';
import Layout from '@/components/layout/Layout';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { transactions, uploadPaymentProof, isLoading } = useTransactions(
    user?.id,
  );

  return (
    <Layout>
      <div className="container mx-auto bg-background">
        <header>
          <div className="container flex items-center gap-4 h-16">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <h1 className="font-semibold text-lg">My Transactions</h1>
          </div>
        </header>

        <main className="container py-6">
          {isLoading ? (
            <div className="space-y-4">
              <TransactionCardSkeleton />
              <TransactionCardSkeleton />
              <TransactionCardSkeleton />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-20">
              <Ticket className="size-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                No transactions yet
              </h2>
              <p className="text-muted-foreground mb-4">
                Start by browsing events and booking tickets
              </p>
              <Link to="/">
                <Button className="rounded-full">Browse Events</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  onUploadPaymentProof={(url) => uploadPaymentProof(tx.id, url)}
                  isUploading={isLoading}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
