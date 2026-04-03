import Link from 'next/link';
import { Crosshair, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Crosshair className="w-5 h-5 text-accent" />
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground uppercase">
            Gridshot
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-2xl text-center">
          {/* Viewfinder bracket decoration */}
          <div className="inline-block relative mb-8">
            <div className="absolute -top-3 -left-4 w-5 h-5 border-t-2 border-l-2 border-accent" />
            <div className="absolute -top-3 -right-4 w-5 h-5 border-t-2 border-r-2 border-accent" />
            <div className="absolute -bottom-3 -left-4 w-5 h-5 border-b-2 border-l-2 border-accent" />
            <div className="absolute -bottom-3 -right-4 w-5 h-5 border-b-2 border-r-2 border-accent" />
            <h1 className="font-heading text-5xl font-bold text-foreground leading-tight tracking-tight px-6 py-2">
              Frame your brand.<br />Post everywhere.
            </h1>
          </div>
          <p className="text-lg text-muted mb-8 max-w-lg mx-auto">
            Upload your photos, let AI write the copy, and publish to Instagram, Threads, X, and more. All in your brand&apos;s voice.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-base font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Start Shooting
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border text-center text-xs text-muted">
        Gridshot &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
