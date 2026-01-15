import { type Event, type TicketTier } from "@/types";

const generateTicketTiers = (
  eventId: string,
  isFree: boolean
): TicketTier[] => {
  if (isFree) {
    return [
      {
        id: `${eventId}-free`,
        eventId,
        name: "Free Entry",
        description: "General admission",
        price: 0,
        quantity: 500,
        sold: 234,
      },
    ];
  }

  return [
    {
      id: `${eventId}-early`,
      eventId,
      name: "Early Bird",
      description: "Limited early bird tickets",
      price: 150000,
      quantity: 100,
      sold: 100,
      benefits: ["Priority entry", "Event merchandise"],
    },
    {
      id: `${eventId}-regular`,
      eventId,
      name: "Regular",
      description: "Standard admission",
      price: 250000,
      quantity: 300,
      sold: 187,
      benefits: ["General admission"],
    },
    {
      id: `${eventId}-vip`,
      eventId,
      name: "VIP",
      description: "Premium experience",
      price: 750000,
      quantity: 50,
      sold: 23,
      benefits: [
        "Front row access",
        "Meet & greet",
        "Exclusive lounge",
        "Complimentary drinks",
      ],
    },
  ];
};

export const mockEvents: Event[] = [
  {
    id: "evt-001",
    title: "Jakarta Tech Summit 2025",
    description:
      "Join Indonesia's largest technology conference featuring keynotes from industry leaders, hands-on workshops, and networking opportunities with over 2,000 tech professionals.",
    shortDescription:
      "Indonesia's premier technology conference with industry leaders and workshops.",
    coverImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
    ],
    category: "technology",
    location: "Jakarta",
    venue: "Jakarta Convention Center",
    date: new Date("2025-03-15T09:00:00"),
    endDate: new Date("2025-03-16T18:00:00"),
    organizerId: "org-001",
    ticketTiers: [],
    isFree: false,
    status: "published",
    averageRating: 4.8,
    totalReviews: 156,
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "evt-002",
    title: "Bali Music Festival",
    description:
      "Experience three days of incredible live music on the beautiful beaches of Bali. Featuring international DJs, local bands, and unforgettable sunset performances.",
    shortDescription: "Three days of live music on Bali's stunning beaches.",
    coverImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    ],
    category: "music",
    location: "Bali",
    venue: "Kuta Beach Arena",
    date: new Date("2025-04-20T16:00:00"),
    endDate: new Date("2025-04-22T23:00:00"),
    organizerId: "org-002",
    ticketTiers: [],
    isFree: false,
    status: "published",
    averageRating: 4.9,
    totalReviews: 342,
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-12-10"),
  },
  {
    id: "evt-003",
    title: "Startup Pitch Night",
    description:
      "Watch 10 promising startups pitch their ideas to top investors. Network with founders, VCs, and tech enthusiasts in an inspiring evening of innovation.",
    shortDescription:
      "Watch startups pitch to investors and network with the tech community.",
    coverImage:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    ],
    category: "business",
    location: "Bandung",
    venue: "Creative Hub Bandung",
    date: new Date("2025-02-28T18:00:00"),
    organizerId: "org-003",
    ticketTiers: [],
    isFree: true,
    status: "published",
    averageRating: 4.6,
    totalReviews: 89,
    createdAt: new Date("2024-12-05"),
    updatedAt: new Date("2024-12-18"),
  },
  {
    id: "evt-004",
    title: "Yoga & Wellness Retreat",
    description:
      "A transformative weekend of yoga, meditation, and wellness workshops in the serene mountains of Ubud. Includes healthy meals and accommodation.",
    shortDescription:
      "A weekend of yoga and meditation in Ubud's serene mountains.",
    coverImage:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    ],
    category: "health",
    location: "Bali",
    venue: "Ubud Wellness Center",
    date: new Date("2025-03-08T07:00:00"),
    endDate: new Date("2025-03-10T17:00:00"),
    organizerId: "org-004",
    ticketTiers: [],
    isFree: false,
    status: "published",
    averageRating: 4.9,
    totalReviews: 67,
    createdAt: new Date("2024-11-20"),
    updatedAt: new Date("2024-12-12"),
  },
  {
    id: "evt-005",
    title: "Street Food Festival",
    description:
      "Celebrate Indonesia's culinary diversity with over 50 street food vendors, cooking demos, and eating competitions. A foodie's paradise!",
    shortDescription:
      "50+ street food vendors showcasing Indonesia's culinary diversity.",
    coverImage:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    ],
    category: "food",
    location: "Surabaya",
    venue: "Taman Bungkul",
    date: new Date("2025-02-14T10:00:00"),
    endDate: new Date("2025-02-16T22:00:00"),
    organizerId: "org-005",
    ticketTiers: [],
    isFree: true,
    status: "published",
    averageRating: 4.7,
    totalReviews: 423,
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "evt-006",
    title: "Indonesia Art Biennale",
    description:
      "Explore contemporary Indonesian art from over 100 artists. Featuring installations, paintings, sculptures, and interactive digital art experiences.",
    shortDescription:
      "Contemporary art from 100+ Indonesian artists in one venue.",
    coverImage:
      "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
    ],
    category: "art",
    location: "Yogyakarta",
    venue: "Jogja National Museum",
    date: new Date("2025-04-01T10:00:00"),
    endDate: new Date("2025-04-30T18:00:00"),
    organizerId: "org-006",
    ticketTiers: [],
    isFree: false,
    status: "published",
    averageRating: 4.8,
    totalReviews: 234,
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-12-01"),
  },
  {
    id: "evt-007",
    title: "Marathon Jakarta 2025",
    description:
      "Join thousands of runners in the annual Jakarta Marathon. Choose from 5K, 10K, half marathon, or full marathon distances.",
    shortDescription:
      "Annual Jakarta Marathon with 5K, 10K, half and full distances.",
    coverImage:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80",
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80",
    ],
    category: "sports",
    location: "Jakarta",
    venue: "Monas - National Monument",
    date: new Date("2025-05-18T05:00:00"),
    organizerId: "org-007",
    ticketTiers: [],
    isFree: false,
    status: "published",
    averageRating: 4.6,
    totalReviews: 567,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "evt-008",
    title: "Web3 Developer Workshop",
    description:
      "Hands-on workshop covering blockchain development, smart contracts, and DeFi. Perfect for developers looking to enter the Web3 space.",
    shortDescription:
      "Hands-on blockchain and smart contract development workshop.",
    coverImage:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    ],
    category: "education",
    location: "Jakarta",
    venue: "Block71 Jakarta",
    date: new Date("2025-03-22T09:00:00"),
    endDate: new Date("2025-03-22T17:00:00"),
    organizerId: "org-008",
    ticketTiers: [],
    isFree: false,
    status: "published",
    averageRating: 4.7,
    totalReviews: 45,
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-18"),
  },
];

// Add ticket tiers to each event
export const eventsWithTiers: Event[] = mockEvents.map((event) => ({
  ...event,
  ticketTiers: generateTicketTiers(event.id, event.isFree),
}));

export const LOCATIONS = [
  "All Locations",
  "Jakarta",
  "Bali",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Medan",
  "Semarang",
];
