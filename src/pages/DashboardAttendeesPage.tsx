import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

const attendees = [
  {
    name: "John Doe",
    email: "john@example.com",
    event: "Jakarta Tech Summit 2025",
    ticket: "Regular",
    qty: 2,
    totalPaid: "Rp 500.000",
    purchaseDate: "Jan 8, 2026",
  },
];

export default function DashboardAttendeesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold">Attendees</h1>
          <p className="text-sm text-muted-foreground">
            View and manage attendees for your events.
          </p>
        </div>

        {/* Card */}
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Attendees</CardTitle>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="jakarta-tech">
                    Jakarta Tech Summit 2025
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name or email..."
                  className="pl-8 w-[220px]"
                />
              </div>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Ticket</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Purchase Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {attendees.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.event}</TableCell>
                      <TableCell>{item.ticket}</TableCell>
                      <TableCell className="text-center">{item.qty}</TableCell>
                      <TableCell>{item.totalPaid}</TableCell>
                      <TableCell>{item.purchaseDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Showing {attendees.length} of {attendees.length} attendees
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
