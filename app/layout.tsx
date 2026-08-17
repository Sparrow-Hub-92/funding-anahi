import type { Metadata } from 'next'
import './globals.css'

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
        url: 'https://talentoecuador.com/og-image.jpg',
        width: 1600,
        height: 900,
        alt: 'Talento Ecuador - I Dance rumbo a la PLF Latin Dance World Competition',
        type: 'image/jpeg',
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
    images: ['https://talentoecuador.com/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
