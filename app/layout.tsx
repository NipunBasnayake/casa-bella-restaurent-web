import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'Casa Bella Ristorante | Authentic Italian Dining',
    template: '%s | Casa Bella Ristorante',
  },
  description: 'Experience authentic Italian flavors in an elegant setting. Casa Bella Ristorante offers premium fine dining in the heart of the city.',
  openGraph: {
    title: 'Casa Bella Ristorante',
    description: 'Authentic Italian flavors in an elegant setting.',
    url: 'https://www.casabellaristorante.com',
    siteName: 'Casa Bella Ristorante',
    locale: 'en_US',
    type: 'website',
  },
};

const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Casa Bella Ristorante',
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
  priceRange: '$$$'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"> 
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
      </head>
      <body>
        {/* Hidden Google Translate Element */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        <Script id="google-translate-config" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en', 
                includedLanguages: 'en,it,es,fr,de',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>

        <div className="layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: '1', width: '100%' }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
