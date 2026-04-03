import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Gridshot',
  description: 'Terms of Service for Gridshot',
};

export default function TermsPage() {
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
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover"
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
            Terms of Service
          </h1>
          <p className="text-sm text-muted mb-12">Last updated: April 3, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Gridshot (&quot;the Service&quot;), operated by Gridshot
                (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, do not use the Service.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                2. Description of Service
              </h2>
              <p>
                Gridshot is an AI-powered carousel creation platform that helps photographers,
                content creators, and businesses create branded social media content. The Service includes
                AI-generated copy, brand profile management, image upload and processing, carousel creation,
                and social media publishing integrations.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                3. User Accounts
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>You must be at least 18 years old to use the Service.</li>
                <li>One person or entity may not maintain more than one free account.</li>
                <li>You are responsible for all activity that occurs under your account.</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                4. User Content
              </h2>
              <p className="mb-3">
                &quot;User Content&quot; means any photos, images, text, brand information, or other materials
                you upload, submit, or create through the Service.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You retain all ownership rights to your User Content.</li>
                <li>
                  By uploading content, you grant us a limited, non-exclusive license to process,
                  store, and display your content solely to provide the Service to you.
                </li>
                <li>You represent that you own or have the necessary rights to all content you upload.</li>
                <li>
                  You must not upload content that infringes on third-party intellectual property rights,
                  contains illegal material, or violates any applicable law.
                </li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                5. AI-Generated Content
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  The Service uses artificial intelligence to generate text copy (headlines, body text)
                  based on your brand profile and selected parameters.
                </li>
                <li>AI-generated content is provided as suggestions. You are responsible for reviewing
                  and approving all content before publishing.</li>
                <li>We do not guarantee the accuracy, originality, or appropriateness of AI-generated content.</li>
                <li>You are solely responsible for any content you publish through the Service or export from it.</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                6. Acceptable Use
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the Service for any unlawful purpose or in violation of any applicable laws.</li>
                <li>Upload or distribute malware, viruses, or other harmful code.</li>
                <li>Attempt to gain unauthorized access to the Service or its related systems.</li>
                <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                <li>Use automated tools to scrape, crawl, or extract data from the Service.</li>
                <li>Resell, sublicense, or redistribute the Service without our written consent.</li>
                <li>Use the Service to generate spam, misleading content, or content designed to deceive.</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                7. Third-Party Integrations
              </h2>
              <p>
                The Service integrates with third-party platforms (Instagram, Threads, X, Facebook, TikTok,
                Bluesky, LinkedIn, Pinterest) for social media publishing. Your use of these platforms is
                subject to their respective terms of service and privacy policies. We are not responsible
                for the availability, accuracy, or policies of third-party services.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                8. Subscription and Billing
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>The Service offers free and paid subscription tiers.</li>
                <li>Paid subscriptions are billed in advance on a recurring basis (monthly or annually).</li>
                <li>You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.</li>
                <li>We reserve the right to change pricing with 30 days notice to existing subscribers.</li>
                <li>Refunds are handled on a case-by-case basis at our discretion.</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                9. Intellectual Property
              </h2>
              <p>
                The Service, including its design, features, code, and branding, is owned by Gridshot
                and protected by intellectual property laws. You may not copy, modify, distribute, or create
                derivative works based on the Service without our written permission.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                10. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, Gridshot shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, including loss of
                profits, data, or business opportunities, arising from your use of the Service. Our total
                liability for any claim shall not exceed the amount you paid us in the 12 months preceding
                the claim.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                11. Disclaimer of Warranties
              </h2>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties
                of any kind, either express or implied. We do not warrant that the Service will be
                uninterrupted, error-free, or free of harmful components.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                12. Termination
              </h2>
              <p>
                We may suspend or terminate your account at any time for violation of these Terms or for
                any other reason at our discretion, with or without notice. Upon termination, your right
                to use the Service ceases immediately. You may request export of your data within 30 days
                of account termination.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                13. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material
                changes via email or in-app notification. Continued use of the Service after changes
                constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                14. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                United States. Any disputes arising from these Terms shall be resolved in the courts
                of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                15. Contact
              </h2>
              <p>
                If you have questions about these Terms, please contact us at{' '}
                <span className="font-medium">support@gridshot.app</span>.
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
