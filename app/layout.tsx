import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { FocusToolsProvider } from '@/lib/focus-context'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: {
    default: "Fetch — What you're about to forget.",
    template: '%s · Fetch',
  },
  description:
    'Adaptive flashcards, FSRS spaced repetition, focused study sessions, and momentum that lasts. Never let a card go unretrieved.',
  applicationName: 'Fetch',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fetch',
  },
  icons: {
    icon: [
      { url: '/icon.png?v=fetch-main-3', type: 'image/png' },
      { url: '/favicon.ico?v=fetch-main-3', sizes: 'any' },
      { url: '/icon.svg?v=fetch-main-3', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png?v=fetch-main-3',
    shortcut: '/icon.png?v=fetch-main-3',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F9FC' },
    { media: '(prefers-color-scheme: dark)', color: '#0C1426' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png?v=fetch-main-3" type="image/png" />
        <link rel="shortcut icon" href="/icon.png?v=fetch-main-3" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=fetch-main-3" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <FocusToolsProvider>
          {children}
        </FocusToolsProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
