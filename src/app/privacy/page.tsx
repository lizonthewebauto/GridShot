import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Gridshot',
  description: 'Privacy Policy for Gridshot',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Gridshot
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors hidden sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-accent-warm px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-warm-hover"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-muted mb-12">Last updated: April 3, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                1. Introduction
              </h2>
              <p>
                Gridshot (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy and is committed to
                protecting your personal data. This Privacy Policy explains how we collect, use, store,
                and share your information when you use our AI-powered carousel creation platform
                (&quot;the Service&quot;).
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                2. Information We Collect
              </h2>

              <h3 className="font-semibold mt-4 mb-2">Account Information</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Email address</li>
                <li>Display name</li>
                <li>Profile avatar (optional)</li>
                <li>Password (hashed, never stored in plain text)</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">Brand Profile Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Brand name, tagline, and website URL</li>
                <li>Brand colors, fonts, and style preferences</li>
                <li>Voice description and tone presets</li>
                <li>Target audience and ideal customer profile information</li>
                <li>Social media handles and links</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">Content Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Photos and images you upload</li>
                <li>AI-generated text (headlines, body copy)</li>
                <li>Carousel slides and exported images</li>
                <li>Social media post drafts and publishing history</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">Technical Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Usage patterns and feature interactions</li>
                <li>Authentication tokens and session data</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">Website Extraction Data</h3>
              <p>
                When you use the brand extraction feature, we fetch publicly available HTML from the
                URL you provide to analyze brand elements. We do not store the fetched HTML after
                processing.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Provide the Service:</strong> Process your photos, generate AI copy, create carousels, and publish to social platforms.</li>
                <li><strong>Brand Analysis:</strong> Use your brand profile data to customize AI-generated content to match your voice and style.</li>
                <li><strong>Account Management:</strong> Authenticate your identity, manage your subscription, and communicate about your account.</li>
                <li><strong>Improve the Service:</strong> Analyze usage patterns to fix bugs, improve features, and develop new functionality.</li>
                <li><strong>Security:</strong> Detect and prevent fraud, abuse, and unauthorized access.</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                4. Legal Basis for Processing (EEA/UK Users)
              </h2>
              <p className="mb-3">
                If you are located in the European Economic Area or United Kingdom, we process your
                personal data under the following legal bases:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Contract Performance:</strong> Processing necessary to provide the Service to you, including account management, brand profile storage, content generation, and social media publishing.</li>
                <li><strong>Legitimate Interest:</strong> Analytics and usage monitoring to improve the Service, security measures to protect against fraud and abuse.</li>
                <li><strong>Consent:</strong> Marketing communications (where applicable). You may withdraw consent at any time.</li>
                <li><strong>Legal Obligation:</strong> Processing required to comply with applicable laws, regulations, or legal proceedings.</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                5. AI Processing
              </h2>
              <p className="mb-3">
                We use Kie.ai (a third-party AI service powered by Google Gemini) to generate text content
                based on your brand profile and selected parameters.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your brand voice description, tone presets, and audience information are sent to Kie.ai to generate contextually appropriate copy.</li>
                <li>Photo content is not sent to AI services for text generation. AI copy is generated based on text parameters only.</li>
                <li>We do not use your content to train AI models.</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                6. Data Sharing
              </h2>
              <p className="mb-3">We share your data only in these circumstances:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Social Media Platforms:</strong> When you publish content, we share your carousels and captions with the platforms you select (via Bundle Social).</li>
                <li><strong>AI Providers:</strong> Brand profile text data is sent to our AI provider for content generation.</li>
                <li><strong>Infrastructure Providers:</strong> Your data is stored on Supabase (database and file storage) and served via Vercel (hosting).</li>
                <li><strong>Payment Processors:</strong> If you subscribe to a paid plan, billing information is handled by Stripe. We do not store your full credit card details.</li>
                <li><strong>Legal Requirements:</strong> We may disclose data if required by law, court order, or to protect our rights and safety.</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal data to third parties. We do not share your data with
                advertisers.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                7. Data Storage and Security
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your data is stored on Supabase infrastructure with row-level security (RLS) policies ensuring data isolation between users.</li>
                <li>All data transmission is encrypted via HTTPS/TLS.</li>
                <li>Passwords are hashed using industry-standard algorithms (bcrypt via Supabase Auth).</li>
                <li>Uploaded photos are stored in isolated, user-scoped storage buckets.</li>
                <li>API keys and service credentials are stored as encrypted environment variables, never exposed to clients.</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                8. Data Retention
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Account data is retained for as long as your account is active.</li>
                <li>Uploaded photos and created content are retained until you delete them or close your account.</li>
                <li>Upon account deletion, we will delete your data within 30 days, except where retention is required by law.</li>
                <li>Aggregated, anonymized analytics data may be retained indefinitely.</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                9. Your Rights
              </h2>
              <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
                <li><strong>Portability:</strong> Request your data in a machine-readable format.</li>
                <li><strong>Objection:</strong> Object to certain processing of your data.</li>
                <li><strong>Withdrawal of Consent:</strong> Withdraw consent where processing is based on consent.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{' '}
                <span className="font-medium">privacy@gridshot.app</span>.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                10. Cookies
              </h2>
              <p>
                We use essential cookies for authentication and session management. These cookies are
                strictly necessary for the Service to function and cannot be disabled. We do not use
                advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                11. Children&apos;s Privacy
              </h2>
              <p>
                The Service is not intended for children under 18 years of age. We do not knowingly
                collect personal data from children. If you believe a child has provided us with
                personal data, please contact us and we will delete it promptly.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                12. International Data Transfers
              </h2>
              <p>
                Your data may be processed and stored in the United States or other countries where
                our infrastructure providers operate. For transfers of personal data from the EEA, UK,
                or Switzerland, we rely on Standard Contractual Clauses (SCCs) approved by the European
                Commission and on our processors&apos; own transfer mechanisms (Supabase, Vercel, Stripe)
                to ensure adequate data protection.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                13. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material
                changes via email or in-app notification. The &quot;Last updated&quot; date at the top
                indicates when the policy was last revised.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                14. Contact Us
              </h2>
              <p>
                For privacy-related questions or requests, contact us at{' '}
                <span className="font-medium">privacy@gridshot.app</span>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-sm font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Gridshot
          </span>
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
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Gridshot
          </p>
        </div>
      </footer>
    </div>
  );
}
