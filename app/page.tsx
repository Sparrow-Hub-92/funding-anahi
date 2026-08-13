'use client'

import { useState } from 'react'
import Image from 'next/image'
import DonationModal from '@/components/DonationModal'

export default function HomePage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {/* ── NAVBAR ──────────────────────────────────────── */}
      <nav className="navbar">
        <span className="navbar-logo">
          Grupo de <span>Baile</span>
        </span>
        <button
          id="navbar-donar-btn"
          className="navbar-cta"
          onClick={() => setShowModal(true)}
        >
          Donar
        </button>
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero" aria-label="Sección principal">
        <div className="hero-bg">
          <Image
            src="/hero.jpg"
            alt="Grupo de bailadoras en escenario"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </div>

        <div className="hero-content">
          <div className="hero-badge">🇪🇨 Ecuador → 🇵🇪 Perú 2025</div>
          <h1 className="hero-title">
            Ayúdanos a llevar nuestro <em>arte</em> al mundo
          </h1>
          <p className="hero-subtitle">
            El grupo de baile de Anahi ha sido seleccionado para competir
            internacionalmente en Perú. Cada aporte nos acerca un paso más al escenario.
          </p>
          <div className="hero-actions">
            <button
              id="hero-donar-btn"
              className="btn-primary"
              onClick={() => setShowModal(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              Donar ahora
            </button>
            <a href="#eventos" className="btn-secondary">
              Ver eventos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── STORY ─────────────────────────────────────────── */}
      <section className="story-section" aria-label="Nuestra historia">
        <div className="story-inner">
          <div className="story-text">
            <h2 className="font-display">Un sueño que merece hacerse realidad</h2>
            <p>
              Nuestro grupo de baile ha trabajado durante meses con dedicación,
              disciplina y mucha pasión. Cada ensayo, cada coreografía y cada
              presentación las ha acercado a este momento.
            </p>
            <p>
              Han sido seleccionadas para representar a Ecuador en una competencia
              internacional en Perú, donde demostrarán el talento y la cultura de
              nuestro país ante el mundo.
            </p>
            <p>
              Pero para llegar, necesitamos tu ayuda. Con tu aporte —grande o
              pequeño— estarás siendo parte de este viaje.
            </p>
            <div className="story-flags">
              <span>🇪🇨</span>
              <svg width="20" height="16" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M14 2l6 4-6 4"/>
              </svg>
              <span>🇵🇪</span>
              <span>Representando a Ecuador con orgullo</span>
            </div>
          </div>

          <div className="story-image-frame">
            <div className="story-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span style={{ fontSize: '0.85rem', textAlign: 'center', padding: '0 1rem' }}>
                Foto del grupo<br/>próximamente
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENTS ────────────────────────────────────────── */}
      <section id="eventos" className="events-section" aria-label="Eventos de recaudación">
        <div className="events-inner">
          <div className="section-header">
            <span className="section-label">Apóyanos asistiendo</span>
            <h2 className="section-title font-display">Eventos solidarios</h2>
            <p className="section-subtitle">
              Vive una experiencia única mientras aportas al sueño de nuestras bailadoras.
              Inscríbete en cualquiera de estas dos clases especiales.
            </p>
          </div>

          <div className="events-grid">
            {/* Clase 1 */}
            <a
              id="evento-clase1-card"
              href="/clase/clase-1"
              className="event-card"
              aria-label="Inscribirse en Clase de Baile 1 - Ritmo 1"
            >
              <Image
                className="event-card-img"
                src="/banner-salsa.jpg"
                alt="Clase de Salsa"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className="event-card-overlay" />
              <div className="event-card-content">
                <span className="event-card-tag">Clase 1</span>
                <h3 className="event-card-title">Clase de Baile — Ritmo 1</h3>
                <p className="event-card-date">📅 Fecha por confirmar · Lugar por confirmar</p>
                <div className="event-card-price">
                  <strong>$3</strong>
                  <span>por persona</span>
                </div>
                <span className="event-card-cta">
                  Inscribirme
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </a>

            {/* Clase 2 */}
            <a
              id="evento-clase2-card"
              href="/clase/clase-2"
              className="event-card"
              aria-label="Inscribirse en Clase de Baile 2 - Ritmo 2"
            >
              <Image
                className="event-card-img"
                src="/banner-bachata.jpg"
                alt="Clase de Bachata"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className="event-card-overlay" />
              <div className="event-card-content">
                <span className="event-card-tag">Clase 2</span>
                <h3 className="event-card-title">Clase de Baile — Ritmo 2</h3>
                <p className="event-card-date">📅 Fecha por confirmar · Lugar por confirmar</p>
                <div className="event-card-price">
                  <strong>$3</strong>
                  <span>por persona</span>
                </div>
                <span className="event-card-cta">
                  Inscribirme
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── DONATION CTA ──────────────────────────────────── */}
      <section
        className="section"
        style={{ textAlign: 'center', borderTop: '1px solid var(--color-border)' }}
        aria-label="Donación directa"
      >
        <span className="section-label">¿Prefieres donar directamente?</span>
        <h2 className="section-title font-display" style={{ marginBottom: '0.75rem' }}>
          Transferencia bancaria
        </h2>
        <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
          Si quieres hacer una donación directa, haz clic en el botón y te
          mostramos los datos de la cuenta y el QR de pago.
        </p>
        <button
          id="section-donar-btn"
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ margin: '0 auto' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          Ver datos de donación
        </button>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="footer">
        <p className="footer-logo">Grupo de <span>Baile</span></p>
        <p className="footer-tagline">Ecuador → Perú 2025</p>
        <div className="footer-divider" />
        <p className="footer-bottom">
          Campaña de recaudación de fondos · Hecho con 💛 para apoyar a nuestras bailadoras
        </p>
      </footer>

      {/* ── MODAL ─────────────────────────────────────────── */}
      {showModal && <DonationModal onClose={() => setShowModal(false)} />}
    </>
  )
}
