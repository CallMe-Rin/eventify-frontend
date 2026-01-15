// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
import Layout from "@/components/layout/Layout";
import { Calendar, Users, DollarSign, ChartColumn, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHome() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-muted/30">
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Organizer Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your events and track performance
              </p>
            </div>

            <Button className="rounded-full gap-2 bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Stat
              icon={<Calendar className="h-6 w-6 " />}
              title="Total Events"
              value="0"
              color="green"
            />
            <Stat
              icon={<Users className="h-6 w-6" />}
              title="Attendees"
              value="0"
              color="blue"
            />
            <Stat
              icon={<DollarSign className="h-6 w-6" />}
              title="Revenue"
              value="Rp 0"
              color="green"
            />
            <Stat
              icon={<ChartColumn className="h-6 w-6" />}
              title="Pending Review"
              value="0"
              color="orange"
            />
          </div>

          {/* MY EVENTS */}
          <div className="bg-background rounded-2xl border p-10 text-center shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-8 text-left">My Events</h2>

            <div className="flex flex-col items-center justify-center py-14">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <Calendar className="h-7 w-7 text-emerald-500" />
              </div>

              <p className="text-muted-foreground mb-6">
                No events created yet
              </p>

              <Button className="rounded-full gap-2 bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow">
                <Plus className="h-4 w-4" />
                Create Your First Event
              </Button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

function Stat({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: "blue" | "green" | "orange";
}) {
  const colors = {

    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-background rounded-xl border p-5 flex gap-4 items-center shadow-sm hover:shadow-md transition">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
      </div>
    </div>
  );
}
