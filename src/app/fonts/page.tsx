import Link from 'next/link';

const combos = [
  { id: 1, heading: 'DM Serif Display', body: 'IBM Plex Sans', vibe: 'Warm editorial + Swiss precision', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'DM+Serif+Display:wght@400', bUrl: 'IBM+Plex+Sans:wght@400;500' },
  { id: 2, heading: 'Fraunces', body: 'Work Sans', vibe: 'Soft old-style + geometric clean', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Fraunces:opsz,wght@9..144,400;9..144,700', bUrl: 'Work+Sans:wght@400;500' },
  { id: 3, heading: 'Instrument Serif', body: 'Space Grotesk', vibe: 'Film credits + tech catalog', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Instrument+Serif:ital@0;1', bUrl: 'Space+Grotesk:wght@400;500' },
  { id: 4, heading: 'Libre Caslon Text', body: 'Karla', vibe: 'Classic letterpress + friendly geometry', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Libre+Caslon+Text:wght@400;700', bUrl: 'Karla:wght@400;500' },
  { id: 5, heading: 'Syne', body: 'Inter', vibe: 'Y2K display + modern Swiss', hFallback: 'sans-serif', bFallback: 'sans-serif', hUrl: 'Syne:wght@400;700;800', bUrl: 'Inter:wght@400;500' },
  { id: 6, heading: 'Anybody', body: 'Source Sans 3', vibe: 'Stretched 90s rave flyer', hFallback: 'sans-serif', bFallback: 'sans-serif', hUrl: 'Anybody:wght@400;700;900', bUrl: 'Source+Sans+3:wght@400;500' },
  { id: 7, heading: 'Young Serif', body: 'Outfit', vibe: 'Vintage softness + modern geometry', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Young+Serif', bUrl: 'Outfit:wght@400;500' },
  { id: 8, heading: 'Bricolage Grotesque', body: 'Lora', vibe: 'Hand-drawn grotesque + bookish warmth', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Bricolage+Grotesque:wght@400;700;800', bUrl: 'Lora:wght@400;500' },
  { id: 9, heading: 'Crimson Pro', body: 'Jost', vibe: 'Old-world elegance + Bauhaus clarity', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Crimson+Pro:wght@400;700', bUrl: 'Jost:wght@400;500' },
  { id: 10, heading: 'Space Mono', body: 'DM Sans', vibe: 'Terminal aesthetic + friendly UI', hFallback: 'monospace', bFallback: 'sans-serif', hUrl: 'Space+Mono:wght@400;700', bUrl: 'DM+Sans:wght@400;500' },
  { id: 11, heading: 'Darker Grotesque', body: 'Spectral', vibe: 'Tall condensed 90s zine + literary body', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Darker+Grotesque:wght@400;700;900', bUrl: 'Spectral:wght@400;500' },
  { id: 12, heading: 'Cormorant Garamond', body: 'Nunito Sans', vibe: 'High-fashion serif + rounded friendliness', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Cormorant+Garamond:wght@400;600;700', bUrl: 'Nunito+Sans:wght@400;500' },
  { id: 13, heading: 'Archivo Black', body: 'Lora', vibe: 'Bold 90s magazine cover + warm serif', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Archivo+Black', bUrl: 'Lora:wght@400;500' },
  { id: 14, heading: 'Newsreader', body: 'Public Sans', vibe: 'Broadsheet nostalgia + government clarity', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Newsreader:wght@400;700', bUrl: 'Public+Sans:wght@400;500' },
  { id: 15, heading: 'Familjen Grotesk', body: 'Bitter', vibe: 'Swedish mid-century + slab-serif texture', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Familjen+Grotesk:wght@400;700', bUrl: 'Bitter:wght@400;500' },
  { id: 16, heading: 'Bodoni Moda', body: 'Figtree', vibe: 'Italian high-contrast glamour + soft sans', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Bodoni+Moda:opsz,wght@6..96,400;6..96,700;6..96,900', bUrl: 'Figtree:wght@400;500' },
  { id: 17, heading: 'JetBrains Mono', body: 'Plus Jakarta Sans', vibe: 'Code editor + SaaS polish', hFallback: 'monospace', bFallback: 'sans-serif', hUrl: 'JetBrains+Mono:wght@400;700', bUrl: 'Plus+Jakarta+Sans:wght@400;500' },
  { id: 18, heading: 'Vollkorn', body: 'Cabin', vibe: 'German book type + humanist warmth', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Vollkorn:wght@400;700;900', bUrl: 'Cabin:wght@400;500' },
  { id: 19, heading: 'Sorts Mill Goudy', body: 'Rubik', vibe: 'Arts & Crafts revival + bouncy geometry', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Sorts+Mill+Goudy:ital@0;1', bUrl: 'Rubik:wght@400;500' },
  { id: 20, heading: 'Playfair Display', body: 'Source Code Pro', vibe: 'Classic editorial + monospace grit', hFallback: 'serif', bFallback: 'monospace', hUrl: 'Playfair+Display:wght@400;700;900', bUrl: 'Source+Code+Pro:wght@400;500' },
  { id: 21, heading: 'Outfit', body: 'Crimson Text', vibe: 'Clean geometric + old-style reading', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Outfit:wght@400;700;800', bUrl: 'Crimson+Text:wght@400;600' },
  { id: 22, heading: 'Spline Sans Mono', body: 'Alegreya', vibe: 'Techy monospace + literary Spanish serif', hFallback: 'monospace', bFallback: 'serif', hUrl: 'Spline+Sans+Mono:wght@400;700', bUrl: 'Alegreya:wght@400;500' },
  { id: 23, heading: 'Chivo', body: 'Merriweather', vibe: '2000s grotesque + screen-optimized serif', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Chivo:wght@400;700;900', bUrl: 'Merriweather:wght@400;700' },
  { id: 24, heading: 'Literata', body: 'Manrope', vibe: 'Google Books serif + geometric modern', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Literata:opsz,wght@7..72,400;7..72,700', bUrl: 'Manrope:wght@400;500' },
  { id: 25, heading: 'Bebas Neue', body: 'Libre Franklin', vibe: 'All-caps impact poster + clean workhorse', hFallback: 'sans-serif', bFallback: 'sans-serif', hUrl: 'Bebas+Neue', bUrl: 'Libre+Franklin:wght@400;500' },
  { id: 26, heading: 'Eczar', body: 'Fira Sans', vibe: 'Heavy Devanagari-inspired + Mozilla clarity', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Eczar:wght@400;700;800', bUrl: 'Fira+Sans:wght@400;500' },
  { id: 27, heading: 'Albert Sans', body: 'Cardo', vibe: 'Soft geometric + Renaissance text', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Albert+Sans:wght@400;700;800', bUrl: 'Cardo:wght@400;700' },
  { id: 28, heading: 'Azeret Mono', body: 'Atkinson Hyperlegible', vibe: 'Retro terminal + max-legibility body', hFallback: 'monospace', bFallback: 'sans-serif', hUrl: 'Azeret+Mono:wght@400;700;900', bUrl: 'Atkinson+Hyperlegible:wght@400;700' },
  { id: 29, heading: 'Lexend', body: 'Cormorant', vibe: 'Readability-first + tall fashion serif', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Lexend:wght@400;700;800', bUrl: 'Cormorant:wght@400;500' },
  { id: 30, heading: 'Prata', body: 'Geologica', vibe: 'Russian didone + variable geometric', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Prata', bUrl: 'Geologica:wght@400;500' },
  { id: 31, heading: 'Josefin Sans', body: 'Merriweather Sans', vibe: '1920s geometric + screen-friendly humanist', hFallback: 'sans-serif', bFallback: 'sans-serif', hUrl: 'Josefin+Sans:wght@400;700', bUrl: 'Merriweather+Sans:wght@400;500' },
  { id: 32, heading: 'Unna', body: 'Overpass', vibe: 'Transitional serif + highway signage vibes', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Unna:wght@400;700', bUrl: 'Overpass:wght@400;500' },
  { id: 33, heading: 'Red Hat Display', body: 'Red Hat Text', vibe: 'Matched display/text from same family', hFallback: 'sans-serif', bFallback: 'sans-serif', hUrl: 'Red+Hat+Display:wght@400;700;900', bUrl: 'Red+Hat+Text:wght@400;500' },
  { id: 34, heading: 'Unbounded', body: 'Noto Serif', vibe: 'Rounded futuristic + universal serif', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Unbounded:wght@400;700;900', bUrl: 'Noto+Serif:wght@400;500' },
  { id: 35, heading: 'Libre Baskerville', body: 'Raleway', vibe: 'British book type + thin elegant sans', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Libre+Baskerville:wght@400;700', bUrl: 'Raleway:wght@400;500' },
  { id: 36, heading: 'IBM Plex Serif', body: 'IBM Plex Sans', vibe: 'Corporate mono-brand serif/sans system', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'IBM+Plex+Serif:wght@400;700', bUrl: 'IBM+Plex+Sans:wght@400;500' },
  { id: 37, heading: 'Arvo', body: 'Lato', vibe: 'Geometric slab + warm humanist sans', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Arvo:wght@400;700', bUrl: 'Lato:wght@400;700' },
  { id: 38, heading: 'Dela Gothic One', body: 'Noto Sans', vibe: 'Heavy Japanese gothic + universal sans', hFallback: 'sans-serif', bFallback: 'sans-serif', hUrl: 'Dela+Gothic+One', bUrl: 'Noto+Sans:wght@400;500' },
  { id: 39, heading: 'Spectral', body: 'Space Grotesk', vibe: 'Google Docs serif + techy grotesk', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Spectral:wght@400;700', bUrl: 'Space+Grotesk:wght@400;500' },
  { id: 40, heading: 'Oswald', body: 'Source Serif 4', vibe: 'Condensed impact heading + Adobe reading serif', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Oswald:wght@400;700', bUrl: 'Source+Serif+4:wght@400;500' },
  { id: 41, heading: 'Gloock', body: 'Inter', vibe: 'Chunky retro didone + clean modern', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Gloock', bUrl: 'Inter:wght@400;500' },
  { id: 42, heading: 'Courier Prime', body: 'Nunito', vibe: 'Screenplay typewriter + bubbly rounded', hFallback: 'monospace', bFallback: 'sans-serif', hUrl: 'Courier+Prime:wght@400;700', bUrl: 'Nunito:wght@400;500' },
  { id: 43, heading: 'DM Serif Text', body: 'DM Sans', vibe: 'Matched DM serif/sans system', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'DM+Serif+Text', bUrl: 'DM+Sans:wght@400;500' },
  { id: 44, heading: 'Sabon (Libre Caslon Display)', body: 'Fira Code', vibe: 'Sabon-adjacent display + dev monospace', hFallback: 'serif', bFallback: 'monospace', hUrl: 'Libre+Caslon+Display', bUrl: 'Fira+Code:wght@400;500' },
  { id: 45, heading: 'Bitter', body: 'Karla', vibe: 'Slab-serif warmth + geometric clarity', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Bitter:wght@400;700', bUrl: 'Karla:wght@400;500' },
  { id: 46, heading: 'Lora', body: 'Poppins', vibe: 'Calligraphic serif + geometric pop', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Lora:wght@400;700', bUrl: 'Poppins:wght@400;500' },
  { id: 47, heading: 'Inconsolata', body: 'Alegreya Sans', vibe: 'Humanist mono + literary sans', hFallback: 'monospace', bFallback: 'sans-serif', hUrl: 'Inconsolata:wght@400;700;900', bUrl: 'Alegreya+Sans:wght@400;500' },
  { id: 48, heading: 'Signika', body: 'Crimson Pro', vibe: 'Wayfinding signage + refined old-style', hFallback: 'sans-serif', bFallback: 'serif', hUrl: 'Signika:wght@400;700', bUrl: 'Crimson+Pro:wght@400;500' },
  { id: 49, heading: 'Antic Didone', body: 'Work Sans', vibe: 'Retro high-contrast + clean geometric', hFallback: 'serif', bFallback: 'sans-serif', hUrl: 'Antic+Didone', bUrl: 'Work+Sans:wght@400;500' },
  { id: 50, heading: 'Bungee', body: 'IBM Plex Mono', vibe: 'Sign-painting display + corporate mono', hFallback: 'sans-serif', bFallback: 'monospace', hUrl: 'Bungee', bUrl: 'IBM+Plex+Mono:wght@400;500' },
];

/* Brand colors */
const light = { bg: '#faf8f5', fg: '#2d2d2d', muted: '#8a8580', accent: '#4a5940', card: '#ffffff', border: '#e5e0d5' };
const dark = { bg: '#1a1e17', fg: '#e8e6e1', muted: '#8a8a80', accent: '#8ba677', card: '#252920', border: '#3a3e35' };

export default function FontCombosPage() {
  const googleFamilies = combos.map((c) => `family=${c.hUrl}&family=${c.bUrl}`).join('&');
  const masterUrl = `https://fonts.googleapis.com/css2?${googleFamilies}&display=swap`;

  return (
    <div style={{ background: light.bg, color: light.fg }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={masterUrl} />

      <header
        className="sticky top-0 z-50 border-b px-6 py-4"
        style={{ borderColor: light.border, background: 'rgba(250,248,245,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: light.muted }}>
            &larr; Back
          </Link>
          <h1 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Font Combos
          </h1>
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(74,89,64,0.08)', color: light.accent }}>
            {combos.length} pairings
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: light.accent }}>Gridshot</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {combos.length} Font Pairings &mdash; Light &amp; Dark
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: light.muted }}>
            Slightly analog. A little off-grid. Each combo shown in both modes with brand colors.
          </p>
        </div>

        <div className="space-y-8">
          {combos.map((combo) => {
            const hFont = `'${combo.heading}', ${combo.hFallback}`;
            const bFont = `'${combo.body}', ${combo.bFallback}`;

            return (
              <div
                key={combo.id}
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: light.border }}
              >
                {/* Combo label */}
                <div className="px-6 py-3 flex items-center justify-between" style={{ background: light.bg, borderBottom: `1px solid ${light.border}` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold tracking-widest" style={{ color: light.accent }}>
                      #{String(combo.id).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium">
                      {combo.heading} + {combo.body}
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: light.muted }}>{combo.vibe}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Light mode */}
                  <div className="p-8" style={{ background: light.card }}>
                    <span className="text-[10px] uppercase tracking-widest font-medium block mb-4" style={{ color: light.muted }}>Light</span>
                    <h3
                      className="text-[28px] font-bold mb-3"
                      style={{ fontFamily: hFont, color: light.fg, lineHeight: 1 }}
                    >
                      Your photos should work for you
                    </h3>
                    <p
                      className="text-[14px]"
                      style={{ fontFamily: bFont, color: light.muted, lineHeight: 1 }}
                    >
                      Smarter social content on autopilot. Consistent marketing across every channel.
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <span
                        className="text-xs font-semibold px-3 py-1.5 rounded"
                        style={{ background: light.accent, color: '#fff', fontFamily: bFont, lineHeight: 1 }}
                      >
                        Get Started
                      </span>
                      <span
                        className="text-xs px-3 py-1.5 rounded border"
                        style={{ borderColor: light.border, color: light.fg, fontFamily: bFont, lineHeight: 1 }}
                      >
                        Learn More
                      </span>
                    </div>
                  </div>

                  {/* Dark mode */}
                  <div className="p-8" style={{ background: dark.card }}>
                    <span className="text-[10px] uppercase tracking-widest font-medium block mb-4" style={{ color: dark.muted }}>Dark</span>
                    <h3
                      className="text-[28px] font-bold mb-3"
                      style={{ fontFamily: hFont, color: dark.fg, lineHeight: 1 }}
                    >
                      Your photos should work for you
                    </h3>
                    <p
                      className="text-[14px]"
                      style={{ fontFamily: bFont, color: dark.muted, lineHeight: 1 }}
                    >
                      Smarter social content on autopilot. Consistent marketing across every channel.
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <span
                        className="text-xs font-semibold px-3 py-1.5 rounded"
                        style={{ background: dark.accent, color: dark.bg, fontFamily: bFont, lineHeight: 1 }}
                      >
                        Get Started
                      </span>
                      <span
                        className="text-xs px-3 py-1.5 rounded border"
                        style={{ borderColor: dark.border, color: dark.fg, fontFamily: bFont, lineHeight: 1 }}
                      >
                        Learn More
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
