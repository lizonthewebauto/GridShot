'use client';

import { PlusCircle } from 'lucide-react';

export function CreateButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-create-modal'))}
      className="rounded-lg bg-card border border-border p-6 hover:bg-card-hover transition-colors group text-left w-full"
    >
      <PlusCircle className="w-8 h-8 text-accent mb-3" />
      <h3 className="font-heading text-lg font-bold text-foreground">Create</h3>
      <p className="text-muted text-sm mt-1">Design new social media content</p>
    </button>
  );
}
