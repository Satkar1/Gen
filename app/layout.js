import { Inter } from 'next/font/google'
import './styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aura AI - Mental Wellness Companion',
  description: 'A confidential, empathetic behavioral-change companion for youth mental wellness',
  keywords: 'mental health, wellness, AI companion, youth mental health, counseling, support',
  authors: [{ name: 'Aura AI Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'noindex, nofollow', // For privacy since this is a mental health app
  themeColor: '#3B82F6',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnect to external services for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured data for better accessibility */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Aura AI",
              "description": "A confidential, empathetic behavioral-change companion for youth mental wellness",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web Browser",
              "permissions": "microphone",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full bg-gray-50`}>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          Skip to content
        </a>
        
        <div id="main-content" className="h-full">
          {children}
        </div>
        
        {/* Crisis modal portal */}
        <div id="crisis-modal"></div>
        
        {/* Audio element for crisis sounds */}
        <audio id="crisis-audio" preload="auto">
          <source src="/audio/calming-tone.mp3" type="audio/mpeg" />
        </audio>
      </body>
    </html>
  )
}