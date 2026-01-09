export default function App() {
  return (
    <div className="min-h-screen bg-background text-text font-[var(--font-sans)] flex items-center justify-center p-6">
      {/* Card */}
      <div className="w-full max-w-md bg-card text-card-text rounded-[var(--border-radius)] shadow-lg p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-primary">
            Tailwind v4 Theme
          </h1>
          <p className="mt-2 text-muted-text">
            Contoh penggunaan color & font dari index.css
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-accent text-accent-text p-4 rounded">
            Accent section
          </div>

          <div className="bg-muted text-muted-text p-4 rounded">
            Muted section
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 bg-primary text-primary-text py-2 rounded hover:opacity-90 transition">
            Primary
          </button>

          <button className="flex-1 bg-secondary text-secondary-text py-2 rounded hover:opacity-90 transition">
            Secondary
          </button>
        </div>

        {/* Destructive */}
        <button className="w-full bg-destructive text-destructive-text py-2 rounded hover:opacity-90 transition">
          Delete
        </button>
      </div>
    </div>
  );
}
