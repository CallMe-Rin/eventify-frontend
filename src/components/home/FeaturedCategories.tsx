import { Link } from 'react-router';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

const categoryImages: Record<string, string> = {
  cat_music:
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
  cat_tech:
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
  cat_sports:
    'https://images.unsplash.com/photo-1585032083927-c7b26d6c1d07?w=400&q=80',
  cat_art:
    'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400&q=80',
  cat_food:
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
  cat_business:
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80',
  cat_education:
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80',
  cat_health:
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80',
};

export default function FeaturedCategories() {
  const { data: categories = [], isLoading } = useCategories();

  const featuredCategories = categories.slice(0, 6);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="bg-muted/30 py-16">
      <div className="max-w-7xl px-4 mx-auto">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Browse by Category
          </h2>
          <p className="text-muted-foreground">
            Find events that match your interests
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              to={`/discover?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl"
            >
              {/* Background Image */}
              <div className="aspect-2/1 overflow-hidden">
                <img
                  src={categoryImages[category.id] || categoryImages.cat_music}
                  alt={category.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="mb-1 block text-3xl">{category.icon}</span>
                    <h3 className="text-xl font-bold text-primary-foreground">
                      {category.label}
                    </h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-primary-foreground backdrop-blur-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
