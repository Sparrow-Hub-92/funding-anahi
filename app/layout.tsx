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
  title: 'Talento Ecuador | Impulsando a nuestros atletas y artistas al podio',
  description:
    'Plataforma de apoyo y recaudación para atletas y artistas ecuatorianos. Conoce sus historias, apoya sus eventos y ayúdalos a representar al país en el mundo.',
  keywords:
    'talento ecuador, recaudación deporte ecuador, apoyo deportistas ecuador, donaciones arte y danza ecuador, competencias internacionales ecuador',
  openGraph: {
    title: 'Talento Ecuador — El impulso que nuestro talento necesita para llegar a la cima',
    description:
      'Ecuador es grande en disciplinas que merecen ser vistas. Conoce a nuestras delegaciones, participa en eventos benéficos y súmate con tu donación directa.',
    url: 'https://talentoecuador.com',
    siteName: 'Talento Ecuador',
    images: [
      {
        url: 'https://talentoecuador.com/media/final-01.jpg',
        width: 1200,
        height: 630,
        alt: 'Talento Ecuador - Impulsando a nuestros atletas y artistas',
      },
    ],
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talento Ecuador — El impulso que nuestro talento necesita para llegar a la cima',
    description:
      'Ecuador es grande en disciplinas que merecen ser vistas. Conoce a nuestras delegaciones, participa en eventos benéficos y súmate con tu donación directa.',
    images: ['https://talentoecuador.com/media/final-01.jpg'],
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
