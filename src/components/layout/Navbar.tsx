import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  CalendarPlus,
  Compass,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Sparkles,
  Ticket,
  User,
  X,
} from 'lucide-react';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchInput.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // Mock authentication state - will be replaced with better-auth later
  const isAuthenticated = true;
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/96 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Ticket className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-xl font-bold tracking-tight sm:inline-block">
            Eventify
          </span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="relative flex-1 w-full mx-8 hidden md:block"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-3xl rounded-full border-muted bg-muted/50 pl-10 focus-visible:ring-primary"
          />
        </form>

        {/* Desktop Action */}
        <div className="hidden items-center gap-3 md:flex">
          <nav className="hidden items-center gap-1 md:flex">
            {/* Create Event Button */}
            <Button
              variant="ghost"
              asChild
              className="rounded-full cursor-pointer gap-2 px-4 hover:bg-transparent hover:text-primary transition-all active:scale-95"
            >
              <Link to="/create-event">
                <CalendarPlus className="h-4 w-4" />
                <span className="text-sm font-medium">Create Event</span>
              </Link>
            </Button>

            {/* Discover Button */}
            <Button
              variant="default"
              asChild
              className="rounded-full cursor-pointer gap-2 px-4 transition-all active:scale-95"
            >
              <Link to="/discover">
                <Compass className="h-4 w-4" />
                <span className="text-sm font-medium">Discover</span>
              </Link>
            </Button>
          </nav>

          {/* Render user menu only when authenticated */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-full"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg hover:cursor-pointer">
                  <Ticket className="mr-2 h-4 w-4" />
                  My Tickets
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg hover:cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive rounded-lg hover:cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" className="rounded-full" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button className="rounded-full" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 md:hidden bg-background px-6',
          isSearchOpen
            ? 'h-16 py-3 opacity-100'
            : 'h-0 opacity-0 pointer-events-none',
        )}
      >
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-full border-muted bg-muted/50 pl-10 focus-visible:ring-primary"
          />
        </form>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'absolute left-0 right-0 top-full overflow-hidden border-b bg-background transition-all duration-400 md:hidden',
          isMenuOpen ? 'h-auto border-border' : 'h-0 border-transparent',
        )}
      >
        {/* Menu Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Auth Section */}
          {!isAuthenticated ? (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Log in to your account
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                To use all features in Eventify
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-full"
                >
                  Register
                </Button>
                <Button size="lg" className="flex-1 rounded-full">
                  Log In
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {user.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button className="w-full rounded-full">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          )}

          {/* Separator */}
          <div className="border-t border-border my-4"></div>

          {/* Menu Section */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking wider mb-3">
              About Eventify
            </p>

            <button className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              Become an Event Creator
            </button>

            <button className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <Search className="h-5 w-5 text-muted-foreground" />
              Discover Events
            </button>

            <button className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <Info className="h-5 w-5 text-muted-foreground" />
              About Us
            </button>

            <button className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              Help Center
            </button>
          </div>

          {/* Sign Out for authenticated users */}
          {isAuthenticated && (
            <>
              <div className="border-t border-border mt-2 mb-0">
                <button className="flex w-full items-center gap-4 rounded-lg px-3 pt-4 mb-0 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
