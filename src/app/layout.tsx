import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/site';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  keywords: ['J.P. Edwin Chelliah', 'Edwin Chelliah', 'memorial', 'family archive', 'tribute', 'legacy', 'Chelliah family'],
  authors: [{ name: 'Edwin Chelliah Family' }],
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/images/icon-192.png'
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'J.P. Edwin Chelliah — digital memorial and family archive'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: '/images/og-image.svg',
        alt: 'J.P. Edwin Chelliah — digital memorial and family archive'
      }
    ]
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0e8ff' },
    { media: '(prefers-color-scheme: dark)', color: '#171225' }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const connectSrc = supabaseUrl ? `'self' ${supabaseUrl}` : "'self'";
  // blob: covers photo preview object URLs; data: is excluded to reduce attack surface
  const imgSrc = supabaseUrl
    ? `'self' blob: ${supabaseUrl}`
    : "'self' blob:";
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    `connect-src ${connectSrc}`,
    "font-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        {/* X-Content-Type-Options must be an HTTP header — configure at CDN/hosting level */}
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="edwinchelliah" />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
