"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import AdminLayout from "@/components/layout/AdminLayout";

/* ================= MOCK DATA ================= */

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  revenue: Math.floor(Math.random() * 5_000_000) + 1_000_000,
}));

const ticketSalesData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  tickets: Math.floor(Math.random() * 30) + 5,
}));

const eventPerformance = [{ name: "Jakarta Tech Summit", value: 78_000_000 }];

/* ================= COMPONENT ================= */

export default function StatisticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Statistics</h1>
            <p className="text-sm text-muted-foreground">
              Analyze your event performance and revenue trends.
            </p>
          </div>

          <Select defaultValue="month">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">By Year</SelectItem>
              <SelectItem value="month">By Month</SelectItem>
              <SelectItem value="day">By Day</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Top Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Daily revenue performance</CardDescription>
            </CardHeader>

            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[260px]"
              >
                <BarChart data={revenueData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Ticket Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales</CardTitle>
              <CardDescription>Tickets sold per day</CardDescription>
            </CardHeader>

            <CardContent>
              <ChartContainer
                config={{
                  tickets: {
                    label: "Tickets",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[260px]"
              >
                <LineChart data={ticketSalesData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Event Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Event Performance</CardTitle>
            <CardDescription>Top performing event</CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[120px]"
            >
              <BarChart data={eventPerformance} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={160} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={6} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
