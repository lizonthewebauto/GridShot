import Link from 'next/link';

const vibes = [
  { name: 'Authentic', desc: 'Genuine, real, honest', sample: { headline: 'The Real Moments Matter', body: 'No filters. No staging. Just the honest beauty of what actually happened that day.' } },
  { name: 'Cinematic', desc: 'Dramatic, visual, story-driven', sample: { headline: 'Every Frame Tells a Story', body: 'Wide open spaces. Golden hour light. A scene that pulls you in and won\'t let go.' } },
  { name: 'Editorial', desc: 'Sophisticated, magazine-style', sample: { headline: 'The Art of the Everyday', body: 'Clean lines meet quiet luxury. A visual essay in restraint and intention.' } },
  { name: 'Bold', desc: 'Confident, daring, powerful', sample: { headline: 'MAKE THEM STOP SCROLLING', body: 'Your work speaks for itself. Time to let it scream.' } },
  { name: 'Minimal', desc: 'Clean, sparse, refined', sample: { headline: 'Less. Always less.', body: 'White space is not empty space. It\'s breathing room for your best work.' } },
  { name: 'Romantic', desc: 'Intimate, dreamy, sensual', sample: { headline: 'Soft Light, Warm Skin', body: 'The kind of photo that makes you feel something you can\'t quite name.' } },
  { name: 'Emotional', desc: 'Heart-centered, vulnerable', sample: { headline: 'She Didn\'t Know I Was Watching', body: 'The laugh was so real it cracked the room open. I just pressed the shutter.' } },
  { name: 'Documentary', desc: 'Observational, journalistic', sample: { headline: 'Tuesday, 6:47 AM', body: 'The fish market opens before the city wakes. Three generations, same corner, same hands.' } },
];

const showcaseExamples: {
  photographer: string;
  template: string;
  templateLayout: 'cinematic' | 'editorial' | 'minimal' | 'split' | 'bold';
  vibe: string;
  brand: { name: string; tagline: string };
  colors: { bg: string; primary: string; accent: string; secondary?: string };
  slides: { headline: string; body: string; footer?: string; hasPhoto: boolean }[];
}[] = [
  {
    photographer: 'Wedding Photographer',
    template: 'Cinematic Overlay',
    templateLayout: 'cinematic',
    vibe: 'Romantic',
    brand: { name: 'Sarah Lane Photo', tagline: 'LOVE, LIGHT, LEGACY' },
    colors: { bg: '#1a1520', primary: '#f5efe8', accent: '#d4a574' },
    slides: [
      { headline: 'A LOVE STORY\nTOLD IN LIGHT', body: 'Sarah & James celebrated their forever at a vineyard in Sonoma. Golden hour. Handwritten vows. The kind of love that fills a room.', footer: 'SARAH LANE PHOTO — LOVE, LIGHT, LEGACY', hasPhoto: true },
      { headline: 'THE FIRST\nLOOK', body: 'He turned around and forgot how to breathe. She was already crying. Some moments don\'t need words. They just need someone watching.', footer: 'October 12, 2025 — Sonoma Valley', hasPhoto: true },
      { headline: 'NOW BOOKING\n2026 WEDDINGS', body: 'Only 12 dates remaining for the 2026 season. Intimate elopements to 300-guest celebrations. Every love story deserves to be told beautifully.', footer: 'DM OR LINK IN BIO TO INQUIRE', hasPhoto: false },
    ],
  },
  {
    photographer: 'Portrait Photographer',
    template: 'Editorial Elegant',
    templateLayout: 'editorial',
    vibe: 'Editorial',
    brand: { name: 'Mira Studios', tagline: 'MIRA STUDIOS' },
    colors: { bg: '#f7f4ef', primary: '#2a2520', accent: '#8b6914', secondary: '#f7f4ef' },
    slides: [
      { headline: 'THE\nCONFIDENCE\nSESSION', body: 'A portrait experience designed to make you feel like the most powerful version of yourself. Professional styling. Expert direction. Magazine-quality results.', footer: 'MIRA STUDIOS — EDITORIAL PORTRAITURE', hasPhoto: true },
      { headline: 'YOUR STORY.\nYOUR FRAME.', body: 'Styled. Directed. Effortless. 90 minutes of you at your absolute best. Hair and makeup included. 40+ retouched images delivered in 48 hours.', footer: 'EVERY SESSION INCLUDES STYLING CONSULTATION', hasPhoto: true },
      { headline: 'SPRING MINI\nSESSIONS\nNOW OPEN', body: '30 minutes. 15 edited images. $350. Limited to 8 spots per weekend. Book your date before they fill. These always sell out.', footer: 'LINK IN BIO — SPOTS ARE LIMITED', hasPhoto: false },
    ],
  },
  {
    photographer: 'Real Estate Photographer',
    template: 'Minimal Centered',
    templateLayout: 'minimal',
    vibe: 'Minimal',
    brand: { name: 'Apex Visuals', tagline: 'APEX VISUALS' },
    colors: { bg: '#fafafa', primary: '#1a1a1a', accent: '#4a5940', secondary: '#fafafa' },
    slides: [
      { headline: 'JUST LISTED\n4 BR  |  3 BA  |  2,400 SQFT', body: 'Modern farmhouse in West Austin. Vaulted ceilings. Chef\'s kitchen with Carrara marble. Private backyard with mature oaks. This one won\'t last.', footer: 'APEX VISUALS — LUXURY REAL ESTATE PHOTOGRAPHY', hasPhoto: true },
      { headline: 'LIGHT-FILLED\nLIVING', body: '12-foot ceilings. Floor-to-ceiling windows. Southern exposure floods every room with natural light from sunrise to sunset. Designed for the way you actually live.', footer: '$1.2M — 1847 LIVE OAK TRAIL, AUSTIN TX', hasPhoto: true },
      { headline: 'SCHEDULE\nA PRIVATE\nTOUR', body: 'Open house Saturday 1-4pm. Or DM for a private showing any day this week. Seller is motivated. Pre-approved buyers move to the front of the line.', footer: 'CONTACT: LINK IN BIO', hasPhoto: false },
    ],
  },
  {
    photographer: 'Food Photographer',
    template: 'Split Story',
    templateLayout: 'split',
    vibe: 'Authentic',
    brand: { name: 'Savory & Co.', tagline: 'SAVORY & CO. — FOOD PHOTOGRAPHY' },
    colors: { bg: '#2c2418', primary: '#f0e8d8', accent: '#c17c3e' },
    slides: [
      { headline: 'FARM\nTO\nFRAME', body: 'Behind the scenes at Aster Kitchen with Chef Mira. Every ingredient sourced within 50 miles. Every plate a work of art. We capture the story from soil to table.', footer: 'SAVORY & CO. — FOOD PHOTOGRAPHY', hasPhoto: true },
      { headline: 'EVERY\nPLATE IS\nA CANVAS', body: 'The autumn tasting menu, shot on location between courses. Steam rising. Sauces glistening. The kind of food photography that makes people book a reservation.', footer: 'SHOT ON LOCATION AT ASTER KITCHEN', hasPhoto: true },
      { headline: 'BOOK\nYOUR\nSHOOT', body: 'Restaurant photography. Menu design. Social content packages. From Michelin-starred kitchens to neighborhood cafes. Packages starting at $800.', footer: 'DM OR EMAIL — HELLO@SAVORYCO.COM', hasPhoto: false },
    ],
  },
  {
    photographer: 'Event Photographer',
    template: 'Bold Showcase',
    templateLayout: 'bold',
    vibe: 'Bold',
    brand: { name: 'Flash Collective', tagline: 'FLASH COLLECTIVE' },
    colors: { bg: '#0a0a0a', primary: '#ffffff', accent: '#ff4d2e' },
    slides: [
      { headline: 'SXSW\n2026', body: '72 hours. 14 stages. 4,000 frames. We embedded with the festival from load-in to last call. This is what three days of controlled chaos looks like through our lens.', footer: 'FLASH COLLECTIVE — EVENT PHOTOGRAPHY', hasPhoto: true },
      { headline: 'THE ENERGY\nWAS ABSOLUTELY\nUNREAL', body: 'When the lights hit and the crowd surged forward, we were already in position. Front row. Backstage. In the pit. Everywhere the moment was happening.', footer: 'AVAILABLE FOR FESTIVALS / CONFERENCES / LAUNCHES', hasPhoto: true },
      { headline: 'HIRE US\nFOR YOUR\nNEXT EVENT', body: 'Concerts. Conferences. Launch parties. Corporate galas. Product reveals. We shoot it all. Same-week turnaround. Full licensing included. Let\'s make something loud.', footer: 'INQUIRIES: LINK IN BIO', hasPhoto: false },
    ],
  },
  {
    photographer: 'Travel Photographer',
    template: 'Cinematic Overlay',
    templateLayout: 'cinematic',
    vibe: 'Documentary',
    brand: { name: 'Atlas Journal', tagline: 'ATLAS JOURNAL' },
    colors: { bg: '#1c2a1c', primary: '#e8e4d8', accent: '#a8b896' },
    slides: [
      { headline: 'KYOTO\n5:47 AM', body: 'The temple opens before the city wakes. Just the monks, the mist, and the sound of raked gravel. We spent three weeks documenting daily rituals most visitors never see.', footer: 'ATLAS JOURNAL — STORIES FROM THE ROAD', hasPhoto: true },
      { headline: 'THREE\nGENERATIONS\nSAME CORNER', body: 'Same hands. Same knife. The Nishiki fish market hasn\'t changed in forty years. Grandfather taught father. Father teaches son. The tourists walk past without stopping.', footer: 'KYOTO, JAPAN — WINTER 2025', hasPhoto: true },
      { headline: 'PRINT SHOP\nNOW LIVE', body: 'Limited edition Japan series. 12 archival pigment prints. Hand-numbered and signed. Printed on Hahnemuhle Photo Rag. Only 50 sets available worldwide.', footer: 'SHOP: ATLASJOURNAL.COM/PRINTS', hasPhoto: false },
    ],
  },
];

const faqs = [
  {
    q: 'How does the AI write copy for my photos?',
    a: 'When you upload photos and select a vibe, Gridshot analyzes your brand voice, your target audience, and the visual content of your images. It generates headlines, body text, and CTAs that match your brand personality. You can regenerate, edit, or rewrite any text on any slide.',
  },
  {
    q: 'Can I use my own fonts and colors?',
    a: 'Yes. You set up your brand with custom colors, heading font, body font, and voice description. Gridshot includes 12+ premium heading fonts and 10 body fonts. Every carousel you create automatically uses your brand settings.',
  },
  {
    q: 'What platforms can I publish to?',
    a: 'Instagram, Threads, X, Facebook, TikTok, Bluesky, LinkedIn, Pinterest, YouTube, Reddit, Google Business, Mastodon, Discord, and Slack. 14 platforms total. Connect your accounts once and publish to any or all of them directly from Gridshot.',
  },
  {
    q: 'Can I export carousels as images instead of publishing?',
    a: 'Yes. Export individual slides or the entire carousel as high-quality JPEGs. Download them and post manually, send to clients for approval, or use them anywhere you want.',
  },
  {
    q: 'How many slides can a carousel have?',
    a: 'Between 1 and 10 slides per carousel. Each slide gets its own photo, headline, body text, and optional footer. You control the layout and text styling per slide.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. Gridshot offers a free trial so you can try everything out. Just enter your card to get started.',
  },
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
  'YouTube',
  'Reddit',
  'Google Business',
  'Mastodon',
  'Discord',
  'Slack',
];

const buyerTypes = [
  {
    title: 'Photographers',
    pain: "You're incredible behind the lens. But writing captions and posting consistently? That's a different skill entirely.",
    solution:
      'Gridshot writes copy that matches your visual style. Upload your shots, pick a vibe, and get scroll-stopping carousels ready to post.',
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
    icon: 'M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z',
  },
  {
    title: 'Full Brand Control',
    desc: 'Your colors, your fonts, your voice. Set it once and apply it everywhere. Save presets for different content styles.',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
  {
    title: '8 Creative Vibes',
    desc: 'From Cinematic to Minimal, pick the mood that fits your content. The AI adapts its writing style to match.',
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Granular Text Editing',
    desc: 'Control every text element: font, size, weight, alignment, spacing, color, position. Per slide. Your way.',
    icon: 'M4 6h16M4 12h16M4 18h7',
  },
  {
    title: 'Multi-Slide Carousels',
    desc: 'Build 1 to 10 slide carousels with unique photos and copy per slide. Swipe indicators included.',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
  {
    title: 'Post Everywhere',
    desc: 'Connect your accounts and publish to Instagram, Threads, X, Facebook, TikTok, Bluesky, LinkedIn, Pinterest, YouTube, Reddit, and more.',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
];

/* Reusable SVG components */
function Crosshair({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  );
}

function ViewfinderBrackets({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -top-2 -left-3 w-5 h-5 border-t-2 border-l-2 border-accent-warm" />
      <div className="absolute -top-2 -right-3 w-5 h-5 border-t-2 border-r-2 border-accent-warm" />
      <div className="absolute -bottom-2 -left-3 w-5 h-5 border-b-2 border-l-2 border-accent-warm" />
      <div className="absolute -bottom-2 -right-3 w-5 h-5 border-b-2 border-r-2 border-accent-warm" />
      {children}
    </div>
  );
}

function Check() {
  return (
    <svg className="w-4 h-4 text-accent-warm shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function FocusRing({ className = '' }: { className?: string }) {
  return (
    <svg className={`text-accent-warm/15 ${className}`} fill="none" viewBox="0 0 120 120" strokeWidth={1}>
      <circle cx="60" cy="60" r="58" stroke="currentColor" />
      <circle cx="60" cy="60" r="40" stroke="currentColor" strokeDasharray="4 4" />
      <circle cx="60" cy="60" r="20" stroke="currentColor" />
      <line x1="60" y1="0" x2="60" y2="20" stroke="currentColor" />
      <line x1="60" y1="100" x2="60" y2="120" stroke="currentColor" />
      <line x1="0" y1="60" x2="20" y2="60" stroke="currentColor" />
      <line x1="100" y1="60" x2="120" y2="60" stroke="currentColor" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Rule-of-thirds grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(74,89,64,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(74,89,64,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '33.333% 33.333%',
        }}
      />

      {/* ───── Header ───── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Crosshair className="w-5 h-5 text-accent" />
            <span
              className="text-lg font-bold tracking-tight uppercase"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Gridshot
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors hidden sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-sm bg-accent-warm px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-warm-hover"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ───── Hero ───── */}
      <section className="relative px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 z-10">
        {/* Decorative focus rings */}
        <FocusRing className="absolute top-8 -right-10 w-48 h-48 hidden lg:block" />
        <FocusRing className="absolute bottom-0 -left-16 w-36 h-36 hidden lg:block" />

        <div className="max-w-4xl mx-auto text-center">
          {/* Camera-style badge */}
          <div className="inline-flex items-center gap-2 rounded-sm border border-accent-warm/20 bg-accent-warm/5 px-4 py-1.5 text-xs font-medium text-accent-warm uppercase tracking-widest mb-8">
            <Crosshair className="w-3.5 h-3.5" />
            AI-powered carousel creator
          </div>

          {/* Viewfinder-framed headline */}
          <ViewfinderBrackets className="inline-block mb-6">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight px-4 py-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Your photos should
              <br />
              <span className="text-accent-warm">work for you</span> on
              <br />
              <span className="text-accent-warm">every platform.</span>
            </h1>
          </ViewfinderBrackets>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Smarter social content on autopilot. Gridshot turns your photos
            into branded carousels with AI-written copy and publishes to
            Instagram, Threads, X, and 11 more platforms. Consistent marketing
            across every channel without the busywork.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-accent-warm px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-accent-warm-hover shadow-lg shadow-accent-warm/20"
            >
              Get Started Free
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <span className="text-sm text-muted">
              Start your free trial today
            </span>
          </div>

          {/* Exposure triangle / camera info strip */}
          <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted font-mono tracking-wider">
            <span>f/2.8</span>
            <span className="w-1 h-1 rounded-full bg-accent/40" />
            <span>1/125s</span>
            <span className="w-1 h-1 rounded-full bg-accent/40" />
            <span>ISO 400</span>
            <span className="w-1 h-1 rounded-full bg-accent/40" />
            <span>14 PLATFORMS</span>
          </div>
        </div>
      </section>

      {/* ───── Social-proof bar ───── */}
      <section className="relative z-10 border-y border-border px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted">
          {[
            '8 creative vibes',
            '14 platforms',
            '12+ premium fonts',
            'Unlimited brands',
            'JPEG export',
          ].map((text) => (
            <span key={text} className="flex items-center gap-2">
              <Check />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">Workflow</p>
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
                icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
              },
              {
                step: '02',
                title: 'AI writes the copy',
                desc: "Choose a vibe. The AI analyzes your brand, your photos, and your audience, then writes headlines and body text that sound like you.",
                icon: 'M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z',
              },
              {
                step: '03',
                title: 'Post everywhere',
                desc: 'Export as JPEGs or publish directly to Instagram, Threads, X, TikTok, LinkedIn, YouTube, and 8 more platforms.',
                icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-sm bg-card border border-border p-8 transition-all hover:shadow-md group"
              >
                {/* Viewfinder corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-warm/30 group-hover:border-accent-warm transition-colors" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-warm/30 group-hover:border-accent-warm transition-colors" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-warm/30 group-hover:border-accent-warm transition-colors" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-warm/30 group-hover:border-accent-warm transition-colors" />

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold tracking-widest uppercase text-accent-warm">
                    {item.step}
                  </span>
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
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

      {/* ───── Carousel Showcase ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28 bg-card-hover">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">Samples</p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              See what you&apos;ll create
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Real carousel examples for different types of photographers. Every slide below was generated by Gridshot.
            </p>
          </div>

          <div className="space-y-16">
            {showcaseExamples.map((example) => (
              <div key={example.photographer} className="space-y-5">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                      {example.photographer}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-accent-warm font-medium">
                      {example.brand.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted px-2.5 py-1 rounded-sm border border-border bg-card">
                      {example.template}
                    </span>
                    <span className="text-xs text-accent-warm px-2.5 py-1 rounded-sm border border-accent-warm/20 bg-accent-warm/5">
                      {example.vibe} vibe
                    </span>
                  </div>
                </div>

                {/* Carousel slides */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {example.slides.map((slide, i) => {
                    const layout = example.templateLayout;
                    const c = example.colors;

                    return (
                      <div
                        key={i}
                        className="relative rounded-sm overflow-hidden border border-border/50"
                        style={{ aspectRatio: '1 / 1' }}
                      >
                        {/* ─── Full background ─── */}
                        <div className="absolute inset-0" style={{ backgroundColor: c.bg }} />

                        {/* ─── Photo simulation area ─── */}
                        {slide.hasPhoto && (
                          <div className="absolute inset-0 overflow-hidden">
                            {/* Base photo gradient */}
                            <div
                              className="absolute inset-0"
                              style={{
                                background: layout === 'split'
                                  ? `linear-gradient(90deg, ${c.accent}18 0%, ${c.accent}08 50%, ${c.bg} 50%)`
                                  : layout === 'bold'
                                  ? `linear-gradient(180deg, ${c.accent}12 0%, ${c.accent}06 60%, ${c.bg} 75%)`
                                  : layout === 'minimal'
                                  ? c.bg
                                  : `linear-gradient(${160 + i * 30}deg, ${c.accent}15 0%, ${c.bg}cc 40%, ${c.bg} 70%)`,
                              }}
                            />
                            {/* Cinematic: full-bleed simulated image */}
                            {layout === 'cinematic' && (
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: `radial-gradient(ellipse at ${i === 0 ? '60% 40%' : '40% 50%'}, ${c.accent}20 0%, transparent 60%), linear-gradient(to bottom, ${c.accent}10 0%, transparent 40%, ${c.bg} 100%)`,
                                }}
                              />
                            )}
                            {/* Bold: photo in top section */}
                            {layout === 'bold' && (
                              <div
                                className="absolute top-[5%] left-[5%] right-[5%] bottom-[30%] rounded"
                                style={{
                                  background: `linear-gradient(${130 + i * 50}deg, ${c.accent}15, ${c.accent}08)`,
                                  border: `1px solid ${c.accent}20`,
                                }}
                              />
                            )}
                            {/* Minimal: centered circle photo */}
                            {layout === 'minimal' && (
                              <div className="absolute inset-0 flex items-start justify-center pt-[10%]">
                                <div
                                  className="w-[40%] aspect-square rounded-full"
                                  style={{
                                    background: `radial-gradient(circle, ${c.accent}18, ${c.accent}08)`,
                                    border: `1px solid ${c.accent}20`,
                                  }}
                                />
                              </div>
                            )}
                            {/* Editorial: faded full image */}
                            {layout === 'editorial' && (
                              <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                  background: `linear-gradient(${140 + i * 40}deg, ${c.accent}30, ${c.accent}10)`,
                                }}
                              />
                            )}
                            {/* Split: left half image */}
                            {layout === 'split' && (
                              <div
                                className="absolute top-0 left-0 w-1/2 h-full"
                                style={{
                                  background: `linear-gradient(${120 + i * 50}deg, ${c.accent}20, ${c.accent}08)`,
                                }}
                              />
                            )}
                            {/* Camera icon */}
                            <div
                              className="absolute flex items-center justify-center opacity-[0.05]"
                              style={
                                layout === 'split' ? { top: 0, left: 0, width: '50%', height: '100%' }
                                : layout === 'bold' ? { top: '5%', left: '5%', right: '5%', bottom: '30%' }
                                : layout === 'minimal' ? { top: '10%', left: '30%', right: '30%', height: '35%' }
                                : { top: 0, left: 0, right: 0, bottom: 0 }
                              }
                            >
                              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke={c.primary} strokeWidth={0.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* ─── CINEMATIC OVERLAY layout ─── */}
                        {layout === 'cinematic' && (
                          <>
                            {/* Gradient scrim from bottom */}
                            <div className="absolute inset-0 z-[1]" style={{ background: `linear-gradient(to top, ${c.bg} 0%, ${c.bg}ee 30%, ${c.bg}88 55%, transparent 75%)` }} />
                            {/* Top brand bar */}
                            <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 z-10 flex justify-between items-center">
                              <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase opacity-70" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                {example.brand.name}
                              </span>
                              <span className="text-[8px] sm:text-[9px] tracking-wider opacity-40" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                {String(i + 1).padStart(2, '0')} / {String(example.slides.length).padStart(2, '0')}
                              </span>
                            </div>
                            {/* Bottom content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-10">
                              <h3
                                className="text-2xl sm:text-3xl font-bold leading-[1.1] mb-2.5 whitespace-pre-line"
                                style={{ color: c.primary, fontFamily: 'var(--font-heading)' }}
                              >
                                {slide.headline}
                              </h3>
                              <p className="text-xs sm:text-sm leading-relaxed opacity-80 mb-3" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                {slide.body}
                              </p>
                              {slide.footer && (
                                <span className="text-[7px] sm:text-[8px] tracking-[0.15em] uppercase opacity-40 block" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                  {slide.footer}
                                </span>
                              )}
                              {/* Swipe dots */}
                              <div className="mt-3 flex gap-1">
                                {example.slides.map((_, di) => (
                                  <div key={di} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: di === i ? c.accent : c.primary, opacity: di === i ? 1 : 0.2 }} />
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {/* ─── EDITORIAL ELEGANT layout ─── */}
                        {layout === 'editorial' && (
                          <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-7">
                            {/* Accent bar */}
                            <div className="w-10 h-[2px] mb-4" style={{ backgroundColor: c.accent }} />
                            <h3
                              className="text-xl sm:text-2xl font-bold leading-[1.15] mb-2.5 whitespace-pre-line"
                              style={{ color: c.primary, fontFamily: 'var(--font-heading)' }}
                            >
                              {slide.headline}
                            </h3>
                            <p className="text-xs sm:text-sm leading-relaxed opacity-75 mb-4" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                              {slide.body}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] sm:text-[9px] font-semibold tracking-wider" style={{ color: c.primary, fontFamily: 'var(--font-heading)' }}>
                                {example.brand.name}
                              </span>
                              <div className="flex gap-1">
                                {example.slides.map((_, di) => (
                                  <div key={di} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: di === i ? c.accent : c.primary, opacity: di === i ? 1 : 0.15 }} />
                                ))}
                              </div>
                            </div>
                            {slide.footer && (
                              <span className="text-[7px] tracking-[0.12em] uppercase opacity-35 mt-2 block" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                {slide.footer}
                              </span>
                            )}
                          </div>
                        )}

                        {/* ─── MINIMAL CENTERED layout ─── */}
                        {layout === 'minimal' && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 sm:px-7" style={{ paddingTop: slide.hasPhoto ? '45%' : '0' }}>
                            <h3
                              className="text-xl sm:text-2xl font-light leading-[1.15] mb-2 whitespace-pre-line"
                              style={{ color: c.primary, fontFamily: 'var(--font-heading)' }}
                            >
                              {slide.headline}
                            </h3>
                            <div className="w-8 h-[1.5px] mb-2.5" style={{ backgroundColor: c.primary, opacity: 0.25 }} />
                            <p className="text-xs sm:text-sm leading-relaxed opacity-60 mb-4 max-w-[90%]" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                              {slide.body}
                            </p>
                            {slide.footer && (
                              <span className="text-[7px] tracking-[0.2em] uppercase opacity-30" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                {slide.footer}
                              </span>
                            )}
                            {/* Bottom brand + dots */}
                            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
                              <span className="text-[7px] tracking-[0.25em] uppercase opacity-25" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                {example.brand.tagline}
                              </span>
                              <div className="flex gap-1">
                                {example.slides.map((_, di) => (
                                  <div key={di} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: di === i ? c.accent : c.primary, opacity: di === i ? 1 : 0.15 }} />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ─── SPLIT STORY layout ─── */}
                        {layout === 'split' && (
                          <>
                            {/* Right half content panel */}
                            <div className="absolute top-0 right-0 w-1/2 h-full z-10 flex flex-col justify-center px-4 sm:px-5" style={{ backgroundColor: c.bg }}>
                              {/* Decorative dot */}
                              <div className="w-4 h-4 rounded-full mb-4 opacity-15" style={{ backgroundColor: c.primary }} />
                              <h3
                                className="text-base sm:text-lg font-bold leading-[1.2] mb-2 whitespace-pre-line"
                                style={{ color: c.primary, fontFamily: 'var(--font-heading)' }}
                              >
                                {slide.headline}
                              </h3>
                              <p className="text-[10px] sm:text-xs leading-relaxed opacity-65 mb-3" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                {slide.body}
                              </p>
                              <span className="text-[7px] sm:text-[8px] font-semibold tracking-wider" style={{ color: c.primary, fontFamily: 'var(--font-heading)' }}>
                                {example.brand.name}
                              </span>
                              {slide.footer && (
                                <span className="text-[6px] sm:text-[7px] tracking-[0.1em] uppercase opacity-35 mt-1 block" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                  {slide.footer}
                                </span>
                              )}
                              {/* Dots */}
                              <div className="mt-3 flex gap-1">
                                {example.slides.map((_, di) => (
                                  <div key={di} className="w-1 h-1 rounded-full" style={{ backgroundColor: di === i ? c.accent : c.primary, opacity: di === i ? 1 : 0.2 }} />
                                ))}
                              </div>
                            </div>
                            {/* Divider line */}
                            <div className="absolute top-[10%] bottom-[10%] left-1/2 w-px z-10" style={{ backgroundColor: c.primary, opacity: 0.08 }} />
                          </>
                        )}

                        {/* ─── BOLD SHOWCASE layout ─── */}
                        {layout === 'bold' && (
                          <>
                            {/* Bottom content block */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                              <h3
                                className="text-2xl sm:text-3xl font-black uppercase leading-[1.05] tracking-tight mb-2 whitespace-pre-line"
                                style={{ color: c.primary, fontFamily: 'var(--font-heading)' }}
                              >
                                {slide.headline}
                              </h3>
                              <p className="text-xs sm:text-sm leading-relaxed opacity-65 mb-3" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                {slide.body}
                              </p>
                              <div className="flex items-center gap-2.5">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.accent }} />
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                  {example.brand.tagline}
                                </span>
                              </div>
                              {slide.footer && (
                                <span className="text-[7px] tracking-[0.1em] uppercase opacity-35 mt-2 block" style={{ color: c.primary, fontFamily: 'var(--font-body)' }}>
                                  {slide.footer}
                                </span>
                              )}
                            </div>
                            {/* Slide counter top-right */}
                            <div className="absolute top-3 right-3 z-10">
                              <span className="text-[9px] font-bold opacity-25" style={{ color: c.primary, fontFamily: 'var(--font-heading)' }}>
                                {String(i + 1).padStart(2, '0')} / {String(example.slides.length).padStart(2, '0')}
                              </span>
                            </div>
                            {/* Accent bar at very bottom */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 z-10" style={{ backgroundColor: c.accent }} />
                          </>
                        )}

                        {/* ─── CTA button on last slide (all layouts) ─── */}
                        {i === example.slides.length - 1 && layout !== 'split' && (
                          <div className="absolute z-20" style={{
                            ...(layout === 'cinematic' ? { bottom: '72px', left: '28px' } :
                              layout === 'editorial' ? { bottom: '56px', left: '28px' } :
                              layout === 'minimal' ? { bottom: '52px', left: '50%', transform: 'translateX(-50%)' } :
                              { bottom: '60px', left: '24px' }),
                          }}>
                            <div
                              className="px-3 py-1.5 rounded-sm text-[9px] sm:text-[10px] font-bold uppercase tracking-widest"
                              style={{ backgroundColor: c.accent, color: c.bg }}
                            >
                              {layout === 'bold' ? 'Book Now' : layout === 'minimal' ? 'View Details' : 'Learn More'}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-sm text-muted mb-6">
              Every example above was generated from a brand profile + vibe selection. The AI wrote all the copy.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-sm bg-accent-warm px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-warm-hover"
            >
              Try it with your photos
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Before / After ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">The Difference</p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              What changes when you use Gridshot
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Without */}
            <div className="rounded-sm border border-border bg-card p-8">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span className="text-sm font-bold uppercase tracking-widest text-muted" style={{ fontFamily: 'var(--font-heading)' }}>
                  Without Gridshot
                </span>
              </div>
              <ul className="space-y-4">
                {[
                  'Open Canva, start from blank, drag photos in one by one',
                  'Stare at a blinking cursor trying to write captions',
                  'Manually match fonts, colors, spacing across slides',
                  'Export, open Instagram, upload, write caption again',
                  'Repeat for Threads, X, Facebook, LinkedIn...',
                  'Total time: 45-90 minutes per carousel',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* With */}
            <div className="rounded-sm border-2 border-accent bg-card p-8 relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-warm" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-warm" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-warm" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-warm" />
              <div className="flex items-center gap-2 mb-6">
                <Crosshair className="w-5 h-5 text-accent" />
                <span className="text-sm font-bold uppercase tracking-widest text-accent" style={{ fontFamily: 'var(--font-heading)' }}>
                  With Gridshot
                </span>
              </div>
              <ul className="space-y-4">
                {[
                  'Upload photos, pick a vibe, hit generate',
                  'AI writes headlines, body text, and CTAs instantly',
                  'Brand colors, fonts, and voice applied automatically',
                  'Tweak anything you want or publish as-is',
                  'One click publishes to all 14 platforms at once',
                  'Total time: 3-5 minutes per carousel',
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

      {/* ───── Features Grid ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28 bg-card-hover">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">Features</p>
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
                className="rounded-sm bg-card border border-border p-6 transition-all hover:shadow-md"
              >
                <svg className="w-6 h-6 text-accent-warm mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
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

      {/* ───── Vibes with Sample Copy ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">Tone</p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Pick a vibe. Set the tone.
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              8 creative vibes that shape how the AI writes your copy.
              Same photo, completely different feel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vibes.map((v) => (
              <div
                key={v.name}
                className="relative rounded-sm bg-card border border-border transition-all hover:shadow-md hover:-translate-y-0.5 group overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 pb-3 border-b border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 opacity-30 group-hover:opacity-60 transition-opacity">
                      <Crosshair className="w-5 h-5 text-accent" />
                    </div>
                    <h3
                      className="text-sm font-bold"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {v.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-muted">{v.desc}</p>
                </div>

                {/* Sample copy preview */}
                <div className="p-4 bg-card-hover/50">
                  <p className="text-xs font-bold mb-1 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
                    &ldquo;{v.sample.headline}&rdquo;
                  </p>
                  <p className="text-[11px] text-muted leading-relaxed">
                    {v.sample.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted mt-8">
            Each vibe changes the AI&apos;s writing style, vocabulary, and emotional register. You pick the mood. It writes the words.
          </p>
        </div>
      </section>

      {/* ───── Who It's For ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28 bg-card-hover">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">For You</p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Built for people who create visually
            </h2>
            <p className="text-lg text-muted">
              If you have great images but struggle with the rest, this is for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buyerTypes.map((b) => (
              <div
                key={b.title}
                className="relative rounded-sm bg-card border border-border p-8 group"
              >
                {/* Viewfinder corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-warm/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-warm/30" />

                <h3
                  className="text-xl font-bold text-accent-warm mb-3"
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
      <section className="relative z-10 px-6 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">Publish</p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            One carousel. <span className="text-accent-warm">14 platforms.</span>
          </h2>
          <p className="text-lg text-muted mb-12">
            Connect your accounts and publish directly from Gridshot. Every major social network, plus YouTube, Reddit, Discord, and more.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {platforms.map((p) => (
              <span
                key={p}
                className="rounded-sm bg-card border border-border px-5 py-2.5 text-sm font-medium hover:border-accent-warm/50 hover:text-accent-warm transition-colors"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Brand Setup ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28 bg-card-hover">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">Brand</p>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Set up your brand in seconds
              </h2>
              <p className="text-base text-muted leading-relaxed mb-6">
                Paste your website URL and Gridshot extracts your colors, fonts,
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

            {/* Brand card mockup with viewfinder frame */}
            <div className="relative">
              <ViewfinderBrackets>
                <div className="rounded-sm bg-card border border-border p-8 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-sm bg-accent-warm flex items-center justify-center text-white font-bold">
                      <Crosshair className="w-5 h-5" />
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
                        className="w-8 h-8 rounded-sm border border-border"
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
              </ViewfinderBrackets>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Editor Power ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Editor mockup */}
            <div className="relative rounded-sm bg-card border border-border overflow-hidden order-2 md:order-1">
              {/* Viewfinder header bar */}
              <div className="px-6 py-3 border-b border-border flex items-center gap-2 bg-card-hover">
                <Crosshair className="w-3.5 h-3.5 text-accent-warm" />
                <span className="text-xs font-medium text-muted uppercase tracking-widest">Slide Editor</span>
              </div>
              <div className="p-6 space-y-3">
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
                <p className="text-xs text-muted pt-2 font-mono">
                  font / size / weight / align / spacing / color / position
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">Control</p>
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

      {/* ───── How the AI Actually Works ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28 bg-card-hover">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">Under the Hood</p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Not just &ldquo;AI-generated text&rdquo;
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Gridshot doesn&apos;t just slap generic copy on your photos. Here&apos;s what happens when you hit Generate.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Reads your brand profile',
                desc: 'Your colors, fonts, voice description, target audience, and brand personality are loaded as context for the AI.',
              },
              {
                step: '02',
                title: 'Analyzes your photos',
                desc: 'The AI looks at your uploaded images to understand subject matter, mood, and visual tone.',
              },
              {
                step: '03',
                title: 'Applies your selected vibe',
                desc: 'Each vibe has its own writing rules: vocabulary, sentence structure, emotional register, and pacing.',
              },
              {
                step: '04',
                title: 'Generates slide-by-slide copy',
                desc: 'Every slide gets a unique headline and body text. The first slide hooks. The middle slides deliver. The last slide converts.',
              },
              {
                step: '05',
                title: 'You refine or publish',
                desc: 'Edit any text, regenerate individual slides, adjust styling, or publish as-is. You always have final say.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 items-start rounded-sm bg-card border border-border p-6 group hover:shadow-sm transition-all"
              >
                <span
                  className="text-xs font-bold tracking-widest text-accent-warm shrink-0 mt-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="relative z-10 px-6 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-warm font-medium mb-3">FAQ</p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Common questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-sm border border-border bg-card p-6">
                <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {faq.q}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="relative z-10 px-6 py-24 sm:py-32 border-t border-border">
        {/* Decorative focus rings */}
        <FocusRing className="absolute top-10 -left-12 w-40 h-40 hidden lg:block" />
        <FocusRing className="absolute bottom-10 -right-8 w-32 h-32 hidden lg:block" />

        <div className="max-w-3xl mx-auto text-center">
          <ViewfinderBrackets className="inline-block mb-6">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight px-4 py-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Stop spending hours
              <br />
              on carousel posts.
            </h2>
          </ViewfinderBrackets>
          <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
            Your photos are already great. Let Gridshot handle the copy, the
            layout, and the publishing.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-sm bg-accent-warm px-8 py-4 text-base font-semibold text-white transition-all hover:bg-accent-warm-hover shadow-lg shadow-accent-warm/20"
          >
            Get Started Free
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <p className="text-sm text-muted mt-4">
            Start your free trial today.
          </p>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="relative z-10 px-6 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-accent" />
            <span
              className="text-sm font-bold tracking-tight uppercase"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Gridshot
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Get Started
            </Link>
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Gridshot
          </p>
        </div>
      </footer>
    </div>
  );
}
