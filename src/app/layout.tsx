import type { Metadata } from 'next';
import { Space_Mono, DM_Sans } from 'next/font/google';
import './globals.css';

const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-heading' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' });

export const metadata: Metadata = {
  title: {
    default: 'Gridshot - AI-Powered Carousel Creator',
    template: '%s | Gridshot',
  },
  description:
    'Create branded social media carousels in minutes. Upload your photos, pick a vibe, and let AI write the copy in your brand voice. Publish to Instagram, Threads, X, and 5 more platforms.',
  keywords: [
    'carousel creator',
    'social media carousels',
    'AI content creator',
    'photographer tools',
    'branded content',
    'Instagram carousels',
    'social media publishing',
  ],
  authors: [{ name: 'Gridshot' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Gridshot',
    title: 'Gridshot - AI-Powered Carousel Creator',
    description:
      'Upload your photos, pick a vibe, and let AI write the copy in your brand voice. Publish to 8 platforms.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gridshot - AI-Powered Carousel Creator',
    description:
      'Upload your photos, pick a vibe, and let AI write the copy in your brand voice. Publish to 8 platforms.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
