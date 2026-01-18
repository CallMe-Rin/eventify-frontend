import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, Gift, Check, Copy } from "lucide-react";

const CURRENT_USER_ID = "user-001";

export default function DashboardUser() {
  const [copied, setCopied] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /* FETCH MOCK DB */
  useEffect(() => {
    fetch("/mock-db.json")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setEvents(data.events);
        setTransactions(data.transactions);
      });
  }, []);

  /* CURRENT USER */
  const currentUser = users.find((u) => u.id === CURRENT_USER_ID);

  /* USER TRANSACTIONS */
  const myTransactions = useMemo(
    () => transactions.filter((t) => t.user_id === CURRENT_USER_ID),
    [transactions],
  );

  /* STATS */
  const myTickets = myTransactions.reduce((sum, t) => sum + t.quantity, 0);

  const pendingCount = myTransactions.filter(
    (t) => t.status === "waiting_payment",
  ).length;

  const referralCode = currentUser?.referral_code ?? "—";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        <main className="max-w-7xl mx-auto py-10 px-4 space-y-10">
          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {currentUser?.name ?? "User"}
            </h1>
            <p className="text-muted-foreground">
              Manage your tickets and rewards
            </p>
          </div>

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
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="font-semibold">Your Referral Code</h2>
                <p className="text-sm text-muted-foreground">
                  Share and earn 10,000 points per referral!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-white font-semibold">
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
              <h2 className="text-xl font-semibold mb-6">Purchase History</h2>

              {myTransactions.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">
                    No transactions yet
                  </p>
                  <Button className="rounded-full">Discover Events</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myTransactions.map((tx) => {
                    const event = events.find((e) => e.id === tx.event_id);

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between border rounded-xl p-4"
                      >
                        <div>
                          <p className="font-semibold">
                            {event?.title ?? "Event"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            Rp {tx.total_amount.toLocaleString("id-ID")}
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
    </Layout>
  );
}

/* ================= STAT COMPONENT ================= */
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
    <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
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
