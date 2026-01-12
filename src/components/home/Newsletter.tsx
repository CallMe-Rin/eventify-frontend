import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Mock subscription
    setIsSubscribed(true);
  };

  return (
    <section className="bg-primary text-primary-foreground px-4 sm:px-0">
      <div className="flex w-full py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Mail className="h-7 w-7" />
          </div>

          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Never Miss an Event
          </h2>
          <p className="mb-8 text-primary-foreground/80">
            Subscribe to get personalized event recommendations and exclusive
            early-bird offers delivered straight to your inbox.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-6">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">
                Thanks for subscribing!
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:gap-0"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-2xl border-0 bg-white pl-12 text-foreground placeholder:text-muted-foreground sm:rounded-r-none"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 gap-2 rounded-2xl bg-foreground px-8 text-background hover:bg-foreground/90 sm:rounded-l-none"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          <p className="mt-4 text-sm text-primary-foreground/60">
            By subscribing, you agree to our Privacy Policy. Unsubscribe
            anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
