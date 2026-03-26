import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const BASE_URL = 'https://www.payvital.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0066FF',
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PayVital – The Modern Payment Experience Healthcare Needs',
    template: '%s | PayVital',
  },
  description:
    'PayVital helps healthcare providers collect more, reduce staff work, and create a frictionless billing experience. Text-to-pay, digital wallets, EHR integration, payment plans, and auto-posting — all in one platform.',
  keywords: [
    'patient payment',
    'healthcare payment platform',
    'patient billing software',
    'medical billing automation',
    'text to pay healthcare',
    'digital patient payments',
    'EHR payment integration',
    'patient portal payments',
    'healthcare revenue cycle',
    'patient payment plans',
    'reduce patient A/R',
    'healthcare collections',
    'PayVital',
  ],
  authors: [{ name: 'PayVital', url: BASE_URL }],
  creator: 'PayVital',
  publisher: 'PayVital, LLC',
  category: 'Healthcare Technology',
  classification: 'Healthcare Payments',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'PayVital',
    title: 'PayVital – The Modern Payment Experience Healthcare Needs',
    description:
      'Collect more, reduce work, and create less friction for patients and staff. PayVital brings digital-first billing to healthcare practices.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'PayVital – Modern Healthcare Payment Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PayVital – The Modern Payment Experience Healthcare Needs',
    description:
      'Collect more, reduce work, and create less friction for patients and staff. PayVital brings digital-first billing to healthcare practices.',
    images: [`${BASE_URL}/og-image.png`],
    creator: '@payvital',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'PayVital',
  legalName: 'PayVital, LLC',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo.png`,
    width: 200,
    height: 60,
  },
  description:
    'PayVital is a modern patient payment platform that helps healthcare providers collect more, reduce staff work, and create a frictionless billing experience.',
  telephone: '+1-888-730-9374',
  email: 'support@payvital.com',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+1-888-730-9374',
      contactType: 'customer support',
      email: 'support@payvital.com',
      availableLanguage: 'English',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+1-888-730-9374',
      contactType: 'sales',
      email: 'sales@payvital.com',
      availableLanguage: 'English',
    },
  ],
  sameAs: [
    'https://www.youtube.com/@payvital',
    'https://www.facebook.com/payvital',
    'https://www.linkedin.com/company/payvital',
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PayVital',
  applicationCategory: 'HealthApplication',
  applicationSubCategory: 'Healthcare Payment Platform',
  operatingSystem: 'Web',
  description:
    'A modern patient payment platform for healthcare providers featuring text-to-pay, digital wallets, EHR integration, payment plans, and auto-posting.',
  url: BASE_URL,
  publisher: { '@id': `${BASE_URL}/#organization` },
  offers: {
    '@type': 'Offer',
    url: `${BASE_URL}/#contact`,
    description: 'Contact sales for pricing',
  },
  featureList: [
    'EHR Integration (Epic, Cerner, athenahealth, eClinicalWorks)',
    'Text-to-Pay',
    'Digital Wallet',
    'Payment Plans',
    'Auto-Posting & Reconciliation',
    'Multi-Channel Billing (text, email, mail)',
    'Real-Time Performance Insights',
    'Call Center Support',
    'Accelerate™ Insurance Payment Automation',
  ],
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Healthcare Providers',
    name: 'Hospitals, Medical Practices, Clinics',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'PayVital',
  description: 'The Modern Patient Payment Solution for Healthcare Providers',
  publisher: { '@id': `${BASE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans text-brand-700 bg-white antialiased leading-relaxed">
        {children}
      </body>
    </html>
  )
}
