import Link from 'next/link';

const vibes = [
  { name: 'Authentic', desc: 'Genuine, real, honest' },
  { name: 'Cinematic', desc: 'Dramatic, visual, story-driven' },
  { name: 'Editorial', desc: 'Sophisticated, magazine-style' },
  { name: 'Bold', desc: 'Confident, daring, powerful' },
  { name: 'Minimal', desc: 'Clean, sparse, refined' },
  { name: 'Romantic', desc: 'Intimate, dreamy, sensual' },
  { name: 'Emotional', desc: 'Heart-centered, vulnerable' },
  { name: 'Documentary', desc: 'Observational, journalistic' },
];

const platforms = [
  'Instagram',
  'Threads',
  'X / Twitter',
  'Facebook',
  'TikTok',
  'Bluesky',
  'LinkedIn',
  'Pinterest',
];

const buyerTypes = [
  {
    title: 'Photographers',
    pain: "You're incredible behind the lens. But writing captions and posting consistently? That's a different skill entirely.",
    solution:
      'PhotoFlow writes copy that matches your visual style. Upload your shots, pick a vibe, and get scroll-stopping carousels ready to post.',
  },
  {
    title: 'Content Creators',
    pain: "You know you need to post more carousels. They get more saves, more shares. But building them slide-by-slide takes forever.",
    solution:
      'Go from photos to a full branded carousel in minutes. AI handles the copy. You keep creative control over every detail.',
  },
  {
    title: 'Small Business Owners',
    pain: "You can't afford a designer and a copywriter for every post. But your feed still needs to look professional.",
    solution:
      'Set up your brand once (colors, fonts, voice) and create on-brand content whenever you need it. No design skills required.',
  },
  {
    title: 'Social Media Managers',
    pain: "Managing multiple brands means multiple style guides, multiple voices, multiple logins. It's a lot.",
    solution:
      'Create and switch between unlimited brand profiles. Each one remembers its own colors, fonts, tone, and audience.',
  },
];

const features = [
  {
    title: 'AI-Written Copy',
    desc: 'The AI analyzes your brand voice and photos, then writes headlines and body text that actually sound like you.',
  },
  {
    title: 'Full Brand Control',
    desc: 'Your colors, your fonts, your voice. Set it once and apply it everywhere. Save presets for different content styles.',
  },
  {
    title: '8 Creative Vibes',
    desc: 'From Cinematic to Minimal, pick the mood that fits your content. The AI adapts its writing style to match.',
  },
  {
    title: 'Granular Text Editing',
    desc: 'Control every text element: font, size, weight, alignment, spacing, color, position. Per slide. Your way.',
  },
  {
    title: 'Multi-Slide Carousels',
    desc: 'Build 1 to 10 slide carousels with unique photos and copy per slide. Swipe indicators included.',
  },
  {
    title: 'Post Everywhere',
    desc: 'Connect your accounts and publish to Instagram, Threads, X, Facebook, TikTok, Bluesky, LinkedIn, and Pinterest.',
  },
];

function Check() {
  return (
    <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ───── Header ───── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            PhotoFlow Studio
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors hidden sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ───── Hero ───── */}
      <section className="px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent mb-8">
            AI-powered carousel creator for photographers &amp; creators
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Your photos should
            <br />
            <span className="text-accent">work for you</span> on
            <br />
            <span className="text-accent">every platform.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Smarter social content on autopilot. PhotoFlow turns your photos
            into branded carousels with AI-written copy and publishes to
            Instagram, Threads, X, and 5 more platforms. Consistent marketing
            across every channel without the busywork.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-accent-hover shadow-lg shadow-accent/20"
            >
              Start Creating Free
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <span className="text-sm text-muted">
              No credit card required
            </span>
          </div>
        </div>
      </section>

      {/* ───── Social-proof bar ───── */}
      <section className="border-y border-border px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted">
          {[
            '8 creative vibes',
            '8 platforms supported',
            '12+ premium fonts',
            'Unlimited brands',
            'Export as JPEG',
          ].map((text) => (
            <span key={text} className="flex items-center gap-2">
              <Check />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Three steps. That&apos;s it.
            </h2>
            <p className="text-lg text-muted">
              From raw photos to published carousels in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload your photos',
                desc: 'Drop in your images. Pick from your library or upload new ones. Assign them to slides however you want.',
              },
              {
                step: '02',
                title: 'AI writes the copy',
                desc: "Choose a vibe. The AI analyzes your brand, your photos, and your audience, then writes headlines and body text that sound like you.",
              },
              {
                step: '03',
                title: 'Post everywhere',
                desc: 'Export as JPEGs or publish directly to Instagram, Threads, X, Facebook, TikTok, Bluesky, LinkedIn, and Pinterest.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl bg-card border border-border p-8 transition-all hover:shadow-md"
              >
                <span className="text-xs font-bold tracking-widest uppercase text-accent mb-4 block">
                  Step {item.step}
                </span>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features Grid ───── */}
      <section className="px-6 py-20 sm:py-28 bg-card-hover">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Everything you need to create and publish
            </h2>
            <p className="text-lg text-muted">
              Professional carousel creation without the professional price tag.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl bg-card border border-border p-6 transition-all hover:shadow-md"
              >
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Vibes ───── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Pick a vibe. Set the tone.
            </h2>
            <p className="text-lg text-muted">
              8 creative vibes that shape how the AI writes your copy.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {vibes.map((v) => (
              <div
                key={v.name}
                className="rounded-xl bg-card border border-border p-5 text-center transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <h3
                  className="text-base font-bold mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {v.name}
                </h3>
                <p className="text-xs text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Who It's For ───── */}
      <section className="px-6 py-20 sm:py-28 bg-card-hover">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Built for people who create visually
            </h2>
            <p className="text-lg text-muted">
              If you have great images but struggle with the rest, this is for
              you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buyerTypes.map((b) => (
              <div
                key={b.title}
                className="rounded-xl bg-card border border-border p-8"
              >
                <h3
                  className="text-xl font-bold text-accent mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {b.title}
                </h3>
                <p className="text-sm text-muted mb-4 leading-relaxed">
                  {b.pain}
                </p>
                <p className="text-sm leading-relaxed font-medium">
                  {b.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Platforms ───── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            One carousel. Eight platforms.
          </h2>
          <p className="text-lg text-muted mb-12">
            Connect your accounts and publish directly from PhotoFlow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {platforms.map((p) => (
              <span
                key={p}
                className="rounded-full bg-card border border-border px-5 py-2.5 text-sm font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Brand Setup ───── */}
      <section className="px-6 py-20 sm:py-28 bg-card-hover">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Set up your brand in seconds
              </h2>
              <p className="text-base text-muted leading-relaxed mb-6">
                Paste your website URL and PhotoFlow extracts your colors, fonts,
                and brand voice automatically. Or set everything manually. Either
                way, your brand stays consistent across every piece of content
                you create.
              </p>
              <ul className="space-y-3">
                {[
                  'Auto-extract brand from your website',
                  'Custom colors, fonts, and voice per brand',
                  'Save reusable brand presets',
                  'Switch between unlimited brands instantly',
                  '12 heading fonts + 10 body fonts included',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check />
                    <span className="mt-px">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* mini brand-card mockup */}
            <div className="rounded-xl bg-card border border-border p-8 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                    Your Brand
                  </div>
                  <div className="text-xs text-muted">yourbrand.com</div>
                </div>
              </div>
              <div className="flex gap-2">
                {['#4a5940', '#2d2d2d', '#faf8f5', '#8a8580'].map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded-md border border-border"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className="text-xs text-muted space-y-1">
                <div>Heading: Playfair Display</div>
                <div>Body: Lora</div>
                <div>Voice: Warm, confident, approachable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Editor Power ───── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* mockup */}
            <div className="rounded-xl bg-card border border-border p-6 space-y-3 order-2 md:order-1">
              {[
                { label: 'Headline', value: 'Playfair Display, 32px, Bold' },
                { label: 'Body', value: 'Lora, 16px, Italic' },
                { label: 'Footer', value: 'Brand tagline, centered' },
                { label: 'Swipe', value: 'Circle arrow, bottom-right' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm font-medium">{row.label}</span>
                  <span className="text-xs text-muted">{row.value}</span>
                </div>
              ))}
              <p className="text-xs text-muted pt-2">
                Font, size, weight, alignment, spacing, color, position
              </p>
            </div>

            <div className="order-1 md:order-2">
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Total control over every text element
              </h2>
              <p className="text-base text-muted leading-relaxed mb-6">
                AI writes the first draft. You fine-tune everything. Adjust
                fonts, sizes, weights, colors, alignment, and positioning for
                each text element on each slide. Or just hit publish and let the
                AI handle it.
              </p>
              <ul className="space-y-3">
                {[
                  'Per-slide headline, body, footer, and swipe indicator',
                  '10+ swipe indicator styles',
                  'Re-generate copy for any individual slide',
                  'Export individual slides or the full carousel as JPEG',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check />
                    <span className="mt-px">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="px-6 py-24 sm:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Stop spending hours
            <br />
            on carousel posts.
          </h2>
          <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
            Your photos are already great. Let PhotoFlow handle the copy, the
            layout, and the publishing.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-accent-hover shadow-lg shadow-accent/20"
          >
            Get Started Free
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <p className="text-sm text-muted mt-4">
            Free to start. No credit card needed.
          </p>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-sm font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            PhotoFlow Studio
          </span>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Get Started
            </Link>
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} PhotoFlow Studio
          </p>
        </div>
      </footer>
    </div>
  );
}
