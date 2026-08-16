'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import DonationModal from '@/components/DonationModal'
import PhotoSlider from '@/components/PhotoSlider'

interface CuposData {
  ocupados: number
  capacidad: number
  maxPorBailarina?: number
  cuposBailarina?: Record<string, number>
}

interface CuposState {
  'clase-1': CuposData
  'clase-2': CuposData
}

function CapacityBar({ data }: { data: CuposData | undefined }) {
  if (!data) return null
  const { ocupados, capacidad } = data
  const pct = Math.min((ocupados / capacidad) * 100, 100)
  const libres = Math.max(capacidad - ocupados, 0)
  const colorClass = pct >= 80 ? 'cap-bar--red' : pct >= 50 ? 'cap-bar--amber' : 'cap-bar--green'

  return (
    <div className="cap-bar-wrap" aria-label={`${libres} cupos disponibles de ${capacidad}`}>
      <div className="cap-bar-track">
        <div className={`cap-bar-fill ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="cap-bar-labels">
        <span className="cap-bar-count">
          <strong>{libres}</strong> cupos disponibles
        </span>
        {libres <= 10 && libres > 0 && (
          <span className="cap-bar-warning">⚠️ ¡Últimos cupos!</span>
        )}
        {libres === 0 && (
          <span className="cap-bar-full">🔴 ¡Agotado!</span>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [showModal, setShowModal] = useState(false)
  const [cupos, setCupos] = useState<CuposState | null>(null)

  const fetchCupos = useCallback(async () => {
    try {
      const res = await fetch('/api/cupos', { cache: 'no-store' })
      if (res.ok) setCupos(await res.json())
    } catch {
      // fail silently
    }
  }, [])

  useEffect(() => {
    fetchCupos()
    const interval = setInterval(fetchCupos, 30_000)
    return () => clearInterval(interval)
  }, [fetchCupos])

  return (
    <>
      {/* ── NAVBAR ──────────────────────────────────────── */}
      <nav className="navbar">
        <span className="navbar-logo">
          Talento <span>Ecuador</span>
        </span>
        <button id="navbar-donar-btn" className="navbar-cta" onClick={() => setShowModal(true)}>
          Donar
        </button>
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero" aria-label="Sección principal">
        <div className="hero-bg">
          <Image
            src="/media/final-01.jpg"
            alt="Bailarines del grupo en competencia"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🇪🇨 Ecuador → 🇵🇪 PLF Latin Dance World Competition</div>
          <h1 className="hero-title">
            Ayúdanos a llevar nuestro <em>talento</em> a la competencia de baile más importante de Sudamérica
          </h1>
          <p className="hero-subtitle">
            Los mejores bailarines de I Dance Ecuador van a representar al país en la
            <strong> PLF Latin Dance World Competition</strong>. Grupos, dúos y solistas de
            distintas categorías y edades. Dona o asiste a uno de nuestros talleres benéficos
            para recaudar fondos, y llevar el nombre de Ecuador por lo alto.
          </p>
          <div className="hero-actions">
            <button id="hero-donar-btn" className="btn-primary" onClick={() => setShowModal(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              Donar ahora
            </button>
            <a href="#eventos" className="btn-secondary">
              Ver talleres
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── STORY / MANIFESTO ─────────────────────────────── */}
      <section className="story-section" aria-label="Nuestro propósito">
        <div className="story-inner">
          <div className="story-text">
            <span className="section-label" style={{ textAlign: 'left' }}>Nuestro propósito</span>
            <h2 className="font-display">El impulso que nuestro talento necesita</h2>
            <p>
              Detrás de cada medalla internacional hay deportistas y familias cubriendo viajes
              y entrenamientos a puro esfuerzo propio.
            </p>
            <p>
              <strong>TalentoEcuador.com</strong> conecta a nuestros representantes con quienes
              creemos en ellos. Hoy apoyamos a las bailarinas de I Dance en su camino a la{' '}
              <strong>PLF Latin Dance World Competition</strong> en Perú.
            </p>
            <p>
              Participa en sus talleres o súmate con una donación directa para llevarlas al podio.
            </p>
            <div className="story-flags">
              <span>🇪🇨</span>
              <svg width="20" height="16" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M14 2l6 4-6 4"/>
              </svg>
              <span>🇵🇪</span>
              <span>PLF Latin Dance World Competition</span>
            </div>
          </div>

          <div className="story-image-frame">
            <Image
              src="/media/final-02.jpg"
              alt="Bailarines en escenario"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* ── PHOTO SLIDER ───────────────────────────────── */}
      <section className="video-section" aria-label="Nuestras actuaciones">
        <div className="video-inner">
          <div className="section-header">
            <span className="section-label">Míranos en acción</span>
            <h2 className="section-title font-display">En escena</h2>
            <p className="section-subtitle">
              Momentos capturados que muestran la pasión y el talento de nuestros bailarines.
            </p>
          </div>
          <PhotoSlider
            slides={[
              { src: '/media/final-01.jpg', alt: 'Bailarines en competencia', position: 'center 25%' },
              { src: '/media/final-03.jpg', alt: 'Academia I Dance', position: 'center' },
              { src: '/media/final-04.jpg', alt: 'Presentación', position: 'center 20%' },
              { src: '/media/final-05.jpg', alt: 'Bailarina en escenario', position: 'center top' },
              { src: '/media/final-06.jpg', alt: 'Bailarina en pose', position: 'center top' },
              { src: '/media/final-08.jpg', alt: 'Bailarina en pose', position: 'center top' },
              { src: '/media/final-09.jpg', alt: 'Actuación grupal', position: 'center 30%' },
              { src: '/media/final-10.jpg', alt: 'Competencia', position: 'center' },
              { src: '/media/final-11.jpg', alt: 'Equipo de baile', position: 'center top' },
            ]}
            intervalMs={4000}
          />
        </div>
      </section>

      {/* ── EVENTS ────────────────────────────────────────── */}
      <section id="eventos" className="events-section" aria-label="Talleres solidarios">
        <div className="events-inner">
          <div className="section-header">
            <span className="section-label">Apóyanos asistiendo</span>
            <h2 className="section-title font-display">Talleres de baile solidarios</h2>
            <p className="section-subtitle">
              Ritmos mixtos para todos los niveles · 50 cupos por taller
            </p>
          </div>

          <div className="events-grid">
            {/* Clase 1 — 22 ago */}
            <div className="event-card-wrapper">
              <a id="evento-clase1-card" href="/clase/clase-1" className="event-card" aria-label="Inscribirse al taller del 22 de agosto">
                <Image className="event-card-img" src="/media/promo-01.jpg" alt="Taller 22 de agosto" fill style={{ objectFit: 'cover', objectPosition: 'center 20%' }} />
                <div className="event-card-overlay" />
                <div className="event-card-content">
                  <span className="event-card-tag">Taller 1</span>
                  <h3 className="event-card-title">Ritmos Mixtos</h3>
                  <p className="event-card-date">📅 Sáb 22 de agosto · 16:00 a 17:00 · I Dance</p>
                  <div className="event-card-price">
                    <strong>$5</strong>
                    <span>por persona</span>
                  </div>
                  <span className="event-card-cta">
                    Inscríbete
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </a>
              <CapacityBar data={cupos?.['clase-1']} />
            </div>

            {/* Clase 2 — 29 ago */}
            <div className="event-card-wrapper">
              <a id="evento-clase2-card" href="/clase/clase-2" className="event-card" aria-label="Inscribirse al taller del 29 de agosto">
                <Image className="event-card-img" src="/media/promo-02.jpg" alt="Taller 29 de agosto" fill style={{ objectFit: 'cover', objectPosition: 'center 20%' }} />
                <div className="event-card-overlay" />
                <div className="event-card-content">
                  <span className="event-card-tag">Taller 2</span>
                  <h3 className="event-card-title">Ritmos Mixtos</h3>
                  <p className="event-card-date">📅 Sáb 29 de agosto · 16:00 a 17:00 · I Dance</p>
                  <div className="event-card-price">
                    <strong>$5</strong>
                    <span>por persona</span>
                  </div>
                  <span className="event-card-cta">
                    Inscríbete
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </a>
              <CapacityBar data={cupos?.['clase-2']} />
            </div>
          </div>
        </div>
      </section>

      {/* ── DONATION CTA ──────────────────────────────────── */}
      <section className="section donation-cta-section" aria-label="Donación directa">
        <span className="section-label">¿Prefieres donar directamente?</span>
        <h2 className="section-title font-display" style={{ marginBottom: '0.75rem' }}>
          Transferencia bancaria
        </h2>
        <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
          Si quieres hacer una donación directa, haz clic y te mostramos los datos de la cuenta.
        </p>
        <button id="section-donar-btn" className="btn-primary" onClick={() => setShowModal(true)} style={{ margin: '0 auto' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          Ver datos de donación
        </button>
      </section>

      {/* ── I DANCE PROMO ─────────────────────────────────── */}
      <section className="idance-section" aria-label="Academia I Dance">
        <div className="idance-inner">
          <div className="idance-image-col">
            <div className="idance-img-grid">
              <div className="idance-img-frame idance-img-frame--tall">
                <Image src="/media/promo-03.jpg" alt="Academia I Dance" fill style={{ objectFit: 'cover' }} onContextMenu={(e) => e.preventDefault()} draggable={false} />
              </div>
              <div className="idance-img-frame">
                <Image src="/media/final-07.jpg" alt="Bailarina solista" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} onContextMenu={(e) => e.preventDefault()} draggable={false} />
              </div>
              <div className="idance-img-frame">
                <Image src="/media/final-10.jpg" alt="Competencia" fill style={{ objectFit: 'cover', objectPosition: 'center' }} onContextMenu={(e) => e.preventDefault()} draggable={false} />
              </div>
            </div>
          </div>

          <div className="idance-content">
            <div className="idance-logo-wrap">
              <Image
                src="/media/idance-logo.svg"
                alt="I Dance Ecuador"
                width={360}
                height={177}
                style={{ width: '100%', maxWidth: '360px', height: 'auto', display: 'block' }}
                priority
              />
            </div>
            <p className="idance-desc">
              Conoce más de I Dance, la academia donde se forman y entrenan nuestras representantes del país.
            </p>

            <div className="idance-styles">
              {['Salsa', 'Bachata', 'Urbano', 'K-Pop', 'Acrobacias', 'Ballet'].map((s) => (
                <span key={s} className="idance-style-tag">{s}</span>
              ))}
            </div>

            <div className="idance-actions">
              <a
                id="idance-instagram-btn"
                href="https://www.instagram.com/idance_ecuador/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary idance-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                Seguir en Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="footer">
        <p className="footer-logo">Talento <span>Ecuador</span></p>
        <p className="footer-tagline">Ecuador → PLF Latin Dance World Competition · Perú 2026</p>
        <div className="footer-divider" />
        <p className="footer-bottom">
          Campaña de recaudación de fondos · Hecho con 💛 para apoyar a nuestros bailarines
        </p>
      </footer>

      {showModal && <DonationModal onClose={() => setShowModal(false)} />}
    </>
  )
}
