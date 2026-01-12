import { useState } from "react";
import { Search, Ticket, Menu, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-muted bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo Start */}
        <div className="flex items-center gap-3">
          <Badge className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-text">
            <Ticket className="h-6 w-6" strokeWidth={2.2} />
          </Badge>
          <span className="text-lg font-semibold">Eventify</span>
        </div>
        {/* Logo End */}

        {/* Navbar Start */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-muted-text hover:text-primary transition"
          >
            Discover
          </a>
          <a
            href="#"
            className="text-sm font-medium text-muted-text hover:text-primary transition"
          >
            All Events
          </a>
          <a
            href="#"
            className="text-sm font-medium text-muted-text hover:text-primary transition"
          >
            Categories
          </a>
        </nav>
        {/* Navbar End */}

        <div className="hidden md:flex items-center gap-3">
          {/* Search Start*/}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-text" />
            <Input
              placeholder="Search events..."
              className="w-44 rounded-full pl-9"
            />
          </div>
          {/* Search End */}

          {/* Create Event Start */}
          <Button variant="outline" className="rounded-full cursor-pointer">
            + Create Event
          </Button>
          {/* Create Event End */}

          {/* Login And Signup Buttons Start */}
          <Button
            variant="ghost"
            className="
              rounded-full
              text-text
              hover:bg-accent
              hover:text-accent-text
              cursor-pointer
            "
          >
            Sign In
          </Button>

          {/* Get Started */}
          <Button className="rounded-full bg-primary text-primary-text cursor-pointer">
            Get Started
          </Button>
        </div>
        {/* Login And Signup Buttons End */}

        {/* MOBILE MENU BUTTON */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-muted bg-background px-6 py-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-text" />
            <Input
              placeholder="Search events..."
              className="w-full rounded-full pl-9"
            />
          </div>

          {/* Nav */}
          <nav className="space-y-2">
            <a
              href="#"
              className="block text-sm font-medium hover:text-primary transition"
            >
              Discover
            </a>
            <a
              href="#"
              className="block text-sm font-medium hover:text-primary transition"
            >
              All Events
            </a>
            <a
              href="#"
              className="block text-sm font-medium hover:text-primary transition"
            >
              Categories
            </a>
          </nav>

          <Button variant="outline" className="w-full rounded-full">
            + Create Event
          </Button>

          <Button
            variant="ghost"
            className="w-full hover:bg-accent hover:text-accent-text"
          >
            Sign In
          </Button>

          <Button className="w-full rounded-full bg-primary text-primary-text">
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
}
