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
  title: 'Apoya a Nuestras Bailadoras | Ecuador a Perú 2025',
  description:
    'Ayúdanos a llevar a nuestro grupo de baile a competir internacionalmente en Perú, representando a Ecuador con orgullo. Dona, compra una entrada y sé parte de este sueño.',
  keywords: 'crowdfunding, baile, Ecuador, Perú, fundraising, donación',
  openGraph: {
    title: 'Apoya a Nuestras Bailadoras | Ecuador a Perú 2025',
    description:
      'Ayúdanos a llevar a nuestro grupo de baile a competir internacionalmente en Perú.',
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
