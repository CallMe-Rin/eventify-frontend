import React from "react";
import {
  Compass,
  Ticket,
  // User,
  Info,
  Settings,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  href: string;
  active?: boolean;
};

const mainMenu: MenuItem[] = [
  { label: "Jelajah Event", icon: Compass, href: "#" },
  { label: "Tiket Saya", icon: Ticket, href: "#" },
];

const accountMenu: MenuItem[] = [
  { label: "Informasi Dasar", icon: Info, href: "#" },
  { label: "Pengaturan", icon: Settings, href: "#" },
];

export default function SidebarUser() {
  return (
    <aside className="flex w-64 flex-col bg-emerald-500 text-white self-stretch">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 bg-emerald-600 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
          <Ticket className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-wide">Eventify</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3">
        <MenuSection items={mainMenu} />

        <div className="my-4 border-t border-white/10" />

        <p className="px-3 py-2 text-xs uppercase tracking-wide text-white/60">
          Akun
        </p>

        <MenuSection items={accountMenu} />
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <SidebarItem icon={Repeat} label="Beralih Ke Event Creator" href="#" />
      </div>
    </aside>
  );
}

function MenuSection({ items }: { items: MenuItem[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <SidebarItem key={item.label} {...item} />
      ))}
    </ul>
  );
}

function SidebarItem({ icon: Icon, label, href, active }: MenuItem) {
  return (
    <li>
      <a
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
          active
            ? "bg-blue-600 text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white",
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </a>
    </li>
  );
}
