import { Link, useNavigate } from 'react-router';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Ticket, Clock, History } from 'lucide-react';
import { TransactionCardSkeleton } from '@/components/checkout/TransactionCardSkeleton';
import TransactionCard from '@/components/checkout/TransactionCard';
import Layout from '@/components/layout/Layout';

import { useMemo } from 'react';
import {
  separateTransactions,
  sortTransactionsByDate,
} from '@/lib/transaction-helpers';
import EmptyState from '@/components/transaction/EmptyState';

export default function TransactionsPage() {
  const { transactions, uploadPaymentProof, isLoading } = useTransactions();
  const navigate = useNavigate();

  // Separate and sort transactions
  const { ongoing, history } = useMemo(() => {
    const separated = separateTransactions(transactions);
    return {
      ongoing: sortTransactionsByDate(separated.ongoing),
      history: sortTransactionsByDate(separated.history),
    };
  }, [transactions]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 bg-background py-6">
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
            <Tabs defaultValue="ongoing" className="w-full rounded-xl">
              <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl">
                <TabsTrigger
                  value="ongoing"
                  className="gap-2 rounded-lg hover:cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  Ongoing
                  {ongoing.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                      {ongoing.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="gap-2 rounded-lg hover:cursor-pointer"
                >
                  <History className="w-4 h-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ongoing" className="space-y-4">
                {ongoing.length === 0 ? (
                  <EmptyState
                    icon={Clock}
                    title="No ongoing transactions"
                    description="You don't have any pending transactions at the moment"
                  />
                ) : (
                  ongoing.map((tx) => (
                    <TransactionCard
                      key={tx.id}
                      transaction={tx}
                      onUploadPaymentProof={(url) =>
                        uploadPaymentProof(tx.id, url)
                      }
                      isUploading={isLoading}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {history.length === 0 ? (
                  <EmptyState
                    icon={History}
                    title="No transaction history"
                    description="Your completed transactions will appear here"
                  />
                ) : (
                  history.map((tx) => (
                    <TransactionCard
                      key={tx.id}
                      transaction={tx}
                      onUploadPaymentProof={(url) =>
                        uploadPaymentProof(tx.id, url)
                      }
                      isUploading={isLoading}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </Layout>
  );
}
