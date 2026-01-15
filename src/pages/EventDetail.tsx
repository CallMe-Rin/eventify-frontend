import { useState, useMemo, useEffect } from "react"; // Added useEffect
import { useParams, useNavigate } from "react-router";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Calendar,
  MapPin,
  ChevronDown,
  Ticket,
  ArrowLeft,
  FileText,
  Link2,
} from "lucide-react";
import { SocialIcon } from "react-social-icons";

import { eventsWithTiers } from "@/data/mockEvents";
import { formatIDR, EVENT_CATEGORIES } from "@/types";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description"); // Track active section

  const event = useMemo(() => {
    return eventsWithTiers.find((e) => e.id === id);
  }, [id]);

  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({});

  // Auto-update active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["description", "tickets", "terms"];
      const scrollPosition = window.scrollY + 100; // Offset for the sticky nav

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveTab(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const groupedTiers = useMemo(() => {
    if (!event?.ticketTiers) return {};
    const groups: Record<string, typeof event.ticketTiers> = {};
    event.ticketTiers.forEach((tier) => {
      const groupKey = tier.name.split("-")[0]?.trim() || "General";
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(tier);
    });
    return groups;
  }, [event]);

  const startingPrice = useMemo(() => {
    if (!event?.ticketTiers?.length) return 0;
    const prices = event.ticketTiers.map((t) => t.price).filter((p) => p >= 0);
    return Math.min(...prices);
  }, [event]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 70; // Height of the sticky nav
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: "smooth",
      });
    }
  };

  if (!event) return null;

  const category = EVENT_CATEGORIES.find((c) => c.value === event.category);

  const formatDateRange = () => {
    const start = new Date(event.date);
    const end = event.endDate ? new Date(event.endDate) : null;
    const startStr = start.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    if (end) {
      const endStr = end.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `${startStr} - ${endStr}`;
    }
    return startStr;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header Section */}
        <div className="relative text-primary-foreground overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${event.coverImage})` }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
          </div>

          <div className="container mx-auto py-16 relative z-10">
            <div className="max-w-3xl space-y-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foretext-primary-foreground/10 -ml-2 rounded-full"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {event.title}
              </h1>
              <div className="flex flex-col gap-4 text-lg text-primary-foreground/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>
                    {event.venue}, {event.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>{formatDateRange()} • 15:00 - 23:00 WIB</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  <span>{category?.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Left Column: Sections */}
            <div className="relative">
              {/* STICKY NAVIGATION - Fixed to top on scroll */}
              <nav className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b flex gap-8 mb-8 mt-1">
                {[
                  { id: "description", label: "Description" },
                  { id: "tickets", label: "Ticket" },
                  { id: "terms", label: "Terms & Conditions" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`py-4 text-sm font-semibold border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="space-y-8">
                {/* Description Section */}
                <section id="description" className="scroll-mt-20">
                  <div className="prose prose-blue max-w-none text-muted-foreground leading-relaxed">
                    <p>{event.description}</p>
                  </div>
                </section>

                {/* Tickets Section */}
                <section id="tickets" className="scroll-mt-20">
                  <div className="flex items-center gap-2 mb-6 border-none py-0">
                    <Ticket className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">
                      Ticket
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(groupedTiers).map(([groupName, tiers]) => (
                      <Collapsible
                        key={groupName}
                        open={openTiers[groupName] ?? true}
                        onOpenChange={(open) =>
                          setOpenTiers((prev) => ({
                            ...prev,
                            [groupName]: open,
                          }))
                        }
                      >
                        <Card className="overflow-hidden border shadow-sm">
                          <div className="flex items-center justify-between p-4 bg-primary-foretext-primary-foreground">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-foreground uppercase">
                                {groupName}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {tiers.length} ticket category • Prices start
                                from{" "}
                                {formatIDR(
                                  Math.min(...tiers.map((t) => t.price))
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Button className="bg-primary hover:bg-primary/90 px-4 font-bold h-10 rounded-2xl">
                                Buy Ticket
                              </Button>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-8 w-8"
                                >
                                  <ChevronDown
                                    className={`h-5 w-5 text-primary transition-transform duration-200 ${
                                      openTiers[groupName] ? "rotate-180" : ""
                                    }`}
                                  />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          </div>

                          <CollapsibleContent>
                            <div className="divide-y border-t bg-card-background">
                              {tiers.map((tier) => (
                                <div
                                  key={tier.id}
                                  className="p-5 flex justify-between items-center"
                                >
                                  <div className="space-y-1">
                                    <p className="font-bold text-lg text-foreground">
                                      {tier.price === 0
                                        ? "Free"
                                        : formatIDR(tier.price)}
                                    </p>
                                    <h4 className="font-medium text-sm text-gray-700">
                                      {tier.name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                      Sales end on: {formatDateRange()} • 15:00
                                      WIB
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="bg-accent/50 text-primary border-accent text-xs px-2 mt-4 -mb-1"
                                  >
                                    Available
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))}
                  </div>
                </section>

                {/* Terms Section */}
                <section id="terms" className="scroll-mt-20">
                  <div className="flex items-center gap-2 mb-6 pb-0 pt-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">
                      Terms & Conditions
                    </h2>
                  </div>
                  <ul className="space-y-4 text-muted-foreground list-disc pl-5">
                    <li>
                      Tickets that have been purchased cannot be exchanged or
                      refunded.
                    </li>
                    <li>
                      You must bring a valid original ID that matches the
                      purchase details.
                    </li>
                    <li>
                      The organizer reserves the right to deny entry if security
                      protocols are violated.
                    </li>
                    <li>
                      E-tickets will be sent via email after the payment has
                      been verified.
                    </li>
                  </ul>
                </section>
              </div>
            </div>

            {/* Right Column: Floating Sidebar */}
            <aside className="lg:-mt-32 lg:sticky lg:top-8 lg:self-start z-20">
              <Card className="shadow-2xl border-none overflow-hidden rounded-xl pt-0">
                {/* ... existing card content ... */}
                <div className="aspect-auto overflow-hidden">
                  <img
                    src={event.coverImage}
                    className="w-full h-full object-cover"
                    alt={event.title}
                  />
                </div>
                <CardContent className="p-6 space-y-6 bg-primary-foretext-primary-foreground">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Prices start from
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {formatIDR(startingPrice)}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 px-4 font-bold rounded-2xl"
                    >
                      Buy Ticket
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-2xl text-foreground leading-tight">
                      {event.title}
                    </h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex gap-3 items-start text-sm">
                        <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          {event.venue}, {event.location}
                        </span>
                      </div>
                      <div className="flex gap-3 items-start text-sm">
                        <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{formatDateRange()}, 15:00 - 23:00 WIB</span>
                      </div>
                      <div className="flex gap-3 items-start text-sm">
                        <Ticket className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{category?.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <h3 className="font-bold text-lg text-foreground leading-tight">
                      Share event
                    </h3>
                    <div className="flex gap-2">
                      <a
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-muted-foreground transition-colors hover:bg-accent/50 hover:text-primary border hover:border-ring/10"
                      >
                        <Link2 className="h-4 w-4" />
                      </a>
                      <SocialIcon
                        url="https://whatsapp.com"
                        network="whatsapp"
                        style={{ height: 35, width: 35 }}
                      />
                      <SocialIcon
                        url="https://instagram.com"
                        network="instagram"
                        style={{ height: 35, width: 35 }}
                      />
                      <SocialIcon
                        url="https://facebook.com"
                        network="facebook"
                        style={{ height: 35, width: 35 }}
                      />

                      <SocialIcon
                        url="https://x.com"
                        network="x"
                        style={{ height: 35, width: 35 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
