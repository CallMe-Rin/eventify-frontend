import {
  House,
  ContactRound,
  Ticket,
  ChartLine,
  Banknote,
  List,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  href: string;
};

type SidebarAdminProps = {
  open: boolean;
  onClose: () => void;
};

const mainMenu: MenuItem[] = [
  { label: "Profile", icon: ContactRound, href: "/dashboard/admin-profile" },
  { label: "Dashboard", icon: House, href: "/dashboard/dashboard-admin" },
  { label: "My Event", icon: Ticket, href: "/dashboard/admin-event" },
  { label: "Analytics", icon: ChartLine, href: "/dashboard/admin-analytics" },
  { label: "Transaction Management", icon: Banknote, href: "#" },
  { label: "Attendee List", icon: List, href: "/dashboard/attentelist" },
];

export default function SidebarAdmin({ open, onClose }: SidebarAdminProps) {
  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-emerald-500 text-white transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "md:static md:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between bg-emerald-600 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <Ticket className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold">Eventify</span>
          </div>

          <button onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {mainMenu.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-3 space-y-1">
          {/* <SidebarItem
            icon={Repeat}
            label="Beralih ke Event Creator"
            href="#"
          /> */}
          <SidebarItem icon={LogOut} label="Log Out" href="#" danger />
        </div>
      </aside>
    </>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  href,
  danger,
}: MenuItem & { danger?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        danger
          ? "text-red-200 hover:bg-red-500/20 hover:text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
    </a>
  );
}
