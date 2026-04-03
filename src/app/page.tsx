import Link from 'next/link';
import { Diamond, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Diamond className="w-6 h-6 text-accent" />
          <span className="font-heading text-lg font-bold text-foreground">
            PhotoFlow Studio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-2xl text-center">
          <h1 className="font-heading text-5xl font-bold text-foreground leading-tight mb-6">
            Beautiful social slides for your photography brand
          </h1>
          <p className="text-lg text-muted mb-8 max-w-lg mx-auto font-body">
            Upload your photos, let AI craft the perfect copy, and post directly to Instagram, Threads, and more. All in your brand&apos;s unique voice.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Start Creating
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border text-center text-xs text-muted">
        PhotoFlow Studio &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
