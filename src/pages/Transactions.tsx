import { Link, useNavigate } from 'react-router';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ticket } from 'lucide-react';
import { TransactionCardSkeleton } from '@/components/checkout/TransactionCardSkeleton';
import TransactionCard from '@/components/checkout/TransactionCard';
import Layout from '@/components/layout/Layout';

export default function TransactionsPage() {
  const { transactions, uploadPaymentProof, isLoading } = useTransactions();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 2xl:px-35 bg-background py-6">
        <header>
          <div className="container flex items-center gap-2 h-16">
            <Link to="/">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-0 gap-1 rounded-full hover:bg-secondary hover:cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
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
