'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Download, Diamond } from 'lucide-react';

interface RightPanelProps {
  brandId: string | null;
  vibe: string;
  headline: string;
  bodyText: string;
  onHeadlineChange: (val: string) => void;
  onBodyChange: (val: string) => void;
  onExport: () => void;
  exporting: boolean;
}

export function RightPanel({
  brandId,
  vibe,
  headline,
  bodyText,
  onHeadlineChange,
  onBodyChange,
  onExport,
  exporting,
}: RightPanelProps) {
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    if (!brandId) return;
    setGenerating(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, vibe }),
      });

      if (res.ok) {
        const data = await res.json();
        onHeadlineChange(data.headline);
        onBodyChange(data.body);
      }
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="w-80 bg-card border-l border-border p-6 space-y-6 overflow-y-auto">
      {/* AI Engine Header */}
      <div>
        <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-4">
          AI Engine
        </h2>
        <div className="rounded-lg border border-border p-4 flex items-center gap-3">
          <Diamond className="w-8 h-8 text-accent" />
          <div>
            <p className="text-sm font-medium text-foreground">Opus 4.6</p>
            <p className="text-xs text-muted">Powered by Kie.ai</p>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating || !brandId}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
      >
        {generating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Text
          </>
        )}
      </button>

      {/* Generated Title */}
      <div>
        <label className="text-xs font-medium text-foreground uppercase tracking-wider">
          Layout Generation
        </label>
        <p className="text-xs text-muted mt-1 mb-2">Generated Title</p>
        <input
          type="text"
          value={headline}
          onChange={(e) => onHeadlineChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Your headline here"
        />
        <button
          onClick={handleGenerate}
          disabled={generating || !brandId}
          className="mt-2 w-full rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-card-hover disabled:opacity-50 transition-colors"
        >
          Regenerate
        </button>
      </div>

      {/* Generated Body */}
      <div>
        <p className="text-xs text-muted mb-2">Generated Body</p>
        <textarea
          value={bodyText}
          onChange={(e) => onBodyChange(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Your body text here"
        />
        <button
          onClick={handleGenerate}
          disabled={generating || !brandId}
          className="mt-2 w-full rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-card-hover disabled:opacity-50 transition-colors"
        >
          Regenerate
        </button>
      </div>

      {/* Export Button */}
      <button
        onClick={onExport}
        disabled={exporting}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-foreground px-4 py-3 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
      >
        {exporting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export Layout
          </>
        )}
      </button>
    </div>
  );
}
