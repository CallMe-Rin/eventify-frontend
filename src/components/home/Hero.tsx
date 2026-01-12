import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const heroImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-muted/50 to-background">
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <div
            key={img}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentImage ? "opacity-20" : "opacity-0"
            )}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="flex w-full relative z-10 py-20 md:py-32 px-4 sm:px-0">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Discover 1000+ Events Near You</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
            Find Your Next
            <span className="relative mx-3 inline-block">
              <span className="relative z-10 text-primary">Unforgettable</span>
              <svg
                className="absolute -bottom-2 left-0 z-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 4 150 4 198 10"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.3"
                />
              </svg>
            </span>
            Experience
          </h1>

          {/* Subheadline */}
          <p
            className="mb-10 text-lg text-muted-foreground sm:text-xl animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            From electrifying concerts to inspiring conferences, discover events
            that match your passion. Book tickets instantly with just a few
            clicks.
          </p>

          {/* Search Bar */}
          <div
            className="mx-auto max-w-2xl animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex flex-col gap-3 rounded-2xl bg-card p-3 shadow-premium sm:flex-row sm:rounded-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-full border-0 bg-muted/50 pl-12 text-base focus-visible:ring-1"
                />
              </div>
              <Button size="lg" className="h-12 gap-2 rounded-full px-8">
                Search Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Music", "Tech", "Food", "Sports"].map((tag) => (
                <button
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { value: "10K+", label: "Events" },
              { value: "500K+", label: "Tickets Sold" },
              { value: "50+", label: "Cities" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary sm:text-3xl">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === currentImage
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}
