import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, Gift, Check, Copy } from "lucide-react";
import axios from "axios";

/* ================= TYPES ================= */
type User = {
  id: string;
  name: string;
  points: number;
  referral_code: string;
};

type Event = {
  id: string;
  title: string;
};

type Transaction = {
  id: string;
  user_id: string;
  event_id: string;
  quantity: number;
  total_amount: number;
  status: "done" | "waiting_payment";
  created_at: string;
};

type MockDB = {
  users: User[];
  events: Event[];
  transactions: Transaction[];
};

const CURRENT_USER_ID = "user-001";

const fetchMockDB = async (): Promise<MockDB> => {
  const { data } = await axios.get("/mock-db.json");
  return data;
};

export default function DashboardTiket() {
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["mock-db"],
    queryFn: fetchMockDB,
  });

  const currentUser = data?.users.find(
    (u) => u.id === CURRENT_USER_ID
  );

  const myTransactions = useMemo(
    () =>
      data?.transactions.filter(
        (t) => t.user_id === CURRENT_USER_ID
      ) ?? [],
    [data]
  );

  const myTickets = myTransactions.reduce(
    (sum, t) => sum + t.quantity,
    0
  );

  const pendingCount = myTransactions.filter(
    (t) => t.status === "waiting_payment"
  ).length;

  const referralCode = currentUser?.referral_code ?? "—";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="p-10 text-center">Loading...</div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-muted/30">
        <main className="max-w-7xl mx-auto py-10 px-4 space-y-10">
          {/* HEADER */}
          {/* <div>
            <h1 className="text-3xl font-bold">
              Welcome, {currentUser?.name}
            </h1>
            <p className="text-muted-foreground">
              Manage your tickets and rewards
            </p>
          </div> */}

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Stat
              icon={<Ticket className="h-6 w-6" />}
              title="My Tickets"
              value={String(myTickets)}
              color="green"
            />
            <Stat
              icon={<Clock className="h-6 w-6" />}
              title="Pending"
              value={String(pendingCount)}
              color="orange"
            />
            <Stat
              icon={<Gift className="h-6 w-6" />}
              title="Points"
              value={String(currentUser?.points ?? 0)}
              color="green"
            />
          </div>

          {/* REFERRAL */}
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <h2 className="font-semibold">Your Referral Code</h2>
                <p className="text-sm text-muted-foreground">
                  Share and earn 10,000 points per referral!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white rounded-xl font-semibold">
                  {referralCode}
                </div>
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PURCHASE HISTORY */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6">
                Purchase History
              </h2>

              {myTransactions.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">
                    No transactions yet
                  </p>
                  <Button className="rounded-full">
                    Discover Events
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myTransactions.map((tx) => {
                    const event = data?.events.find(
                      (e) => e.id === tx.event_id
                    );

                    return (
                      <div
                        key={tx.id}
                        className="flex justify-between items-center border rounded-xl p-4"
                      >
                        <div>
                          <p className="font-semibold">
                            {event?.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            Rp{" "}
                            {tx.total_amount.toLocaleString("id-ID")}
                          </p>
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              tx.status === "done"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {tx.status === "done"
                              ? "Completed"
                              : "Waiting Payment"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </UserLayout>
  );
}

/* ================= STAT ================= */
function Stat({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: "green" | "orange";
}) {
  const colors = {
    green: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white border rounded-xl p-5 flex gap-4 items-center">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}