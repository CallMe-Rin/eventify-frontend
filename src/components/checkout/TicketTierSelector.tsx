import type { TicketTier } from '@/types';
import { formatIDR } from '@/types';
import { Check, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TicketTierSelectorProps {
  tiers: TicketTier[];
  selectedTier: TicketTier | null;
  onSelect: (tier: TicketTier) => void;
}

export function TicketTierSelector({
  tiers,
  selectedTier,
  onSelect,
}: TicketTierSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Select Ticket Type</h3>
      <div className="grid gap-3">
        {tiers.map((tier) => {
          const isSelected = selectedTier?.id === tier.id;
          const isSoldOut = tier.sold >= tier.quantity;
          const availableSeats = tier.quantity - tier.sold;

          return (
            <button
              key={tier.id}
              onClick={() => !isSoldOut && onSelect(tier)}
              disabled={isSoldOut}
              className={cn(
                'relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border-2 transition-all text-left',
                isSelected
                  ? 'border-primary bg-accent/40 shadow-md hover:cursor-pointer'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:cursor-pointer',
                isSoldOut && 'opacity-60 cursor-not-allowed',
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 size-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="size-4 text-primary-foreground" />
                </div>
              )}

              {/* Ticket Logo */}
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'size-10 rounded-lg flex items-center justify-center',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted',
                  )}
                >
                  <Ticket className="size-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{tier.name}</h4>
                  {tier.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {tier.description}
                    </p>
                  )}
                  {tier.benefits && tier.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tier.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            'inline-flex text-xs px-2 py-0.5 rounded-full',
                            isSelected
                              ? 'bg-accent text-accent-foreground border border-primary/10'
                              : 'bg-muted',
                          )}
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end text-right">
                <span className="font-bold text-lg text-primary">
                  {tier.price === 0 ? 'FREE' : formatIDR(tier.price)}
                </span>
                <span
                  className={cn(
                    'text-xs',
                    isSoldOut ? 'text-destructive' : 'text-muted-foreground',
                  )}
                >
                  {isSoldOut ? 'Sold Out' : `${availableSeats} seats left`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
