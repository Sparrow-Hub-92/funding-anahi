import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Talento Ecuador | Rumbo a la PLF Latin Dance World Competition',
  description:
    'Ayúdanos a llevar a las mejores bailadoras de Ecuador a competir internacionalmente en Perú. Dona, compra una entrada y sé parte de este sueño.',
  keywords: 'crowdfunding, baile, Talento Ecuador, Perú, PLF, donación',
  openGraph: {
    title: 'Talento Ecuador | Rumbo a la PLF Latin Dance World Competition',
    description:
      'Ayúdanos a llevar a las mejores bailadoras de Ecuador a competir internacionalmente en Perú.',
    url: 'https://talentoecuador.com',
    siteName: 'Talento Ecuador',
    images: [
      {
        url: 'https://talentoecuador.com/media/final-01.jpg',
        width: 1200,
        height: 630,
        alt: 'Bailadoras de Talento Ecuador',
      },
    ],
    locale: 'es_EC',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${inter.variable}`}>{children}</body>
    </html>
  )
}
