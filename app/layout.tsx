import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import './globals.css';

// Google Fonts: Playfair Display for headings, Inter for body
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Casa Bella Ristorante',
    template: '%s | Casa Bella Ristorante',
  },
  description: 'Authentic Italian flavors in an elegant setting. Experience Casa Bella Ristorante in the heart of the city.',
  openGraph: {
    title: 'Casa Bella Ristorante',
    description: 'Authentic Italian flavors in an elegant setting. Experience Casa Bella Ristorante in the heart of the city.',
    url: 'https://www.casabellaristorante.com',
    siteName: 'Casa Bella Ristorante',
    images: [
      {
        url: '/images/hero.png',
        width: 1200,
        height: 630,
        alt: 'Casa Bella Ristorante Hero Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL('https://www.casabellaristorante.com'),
  icons: {
    icon: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#8B0000',
};

// Structured Data (JSON-LD)
const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Casa Bella Ristorante',
  image: 'https://www.casabellaristorante.com/images/hero.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Bella Ave',
    addressLocality: 'Cityville',
    addressRegion: 'CA',
    postalCode: '90000',
    addressCountry: 'US',
  },
  telephone: '+1-555-123-4567',
  servesCuisine: ['Italian'],
  url: 'https://www.casabellaristorante.com',
  priceRange: '$$'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
      </head>
      <body className="bg-[#FAF3E0] text-gray-900 font-sans min-h-screen flex flex-col">
        <div className="flex flex-col min-h-screen">
          <header>
            <Navbar />
          </header>
          <main className="flex-1 w-full">
            {children}
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
