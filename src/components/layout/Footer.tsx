import { Facebook, Instagram, Ticket, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Ticket className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Eventify</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover and book amazing events. From concerts to conferences,
              find your next unforgettable experience.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h4 className="mb-4 font-semibold">About Us</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/events"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Discover
                </Link>
              </li>
              <li>
                <Link
                  to="/events?filter=today"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/events?filter=free"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/events?filter=today"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Security & Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Location */}
          <div>
            <h4 className="mb-4 font-semibold">Event Location</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/create-event"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Jakarta
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Bandung
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Yogyakarta
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Surabaya
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Solo
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Medan
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Bali
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-foreground"
                >
                  All Locations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Eventify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
