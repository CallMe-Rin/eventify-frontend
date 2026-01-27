import { Link, useLocation } from 'react-router';
import { Home, Compass, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Dashboard', icon: Home, href: '/' },
  { label: 'Create Event', icon: CalendarPlus, href: '/create-event' },
  { label: 'Discover', icon: Compass, href: '/discover' },
];

export default function MobileTabBar() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
