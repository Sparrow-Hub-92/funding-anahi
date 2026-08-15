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
        <button id="navbar-donar-btn" className="navbar-cta" onClick={() => setShowModal(true)}>
          Donar
        </button>
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero" aria-label="Sección principal">
        <div className="hero-bg">
          <Image
            src="/media/final-01.jpg"
            alt="Bailadoras del grupo en competencia"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🇪🇨 Ecuador → 🇵🇪 Perú 2025</div>
          <h1 className="hero-title">
            Ayúdanos a llevar nuestro <em>arte</em> al mundo
          </h1>
          <p className="hero-subtitle">
            El grupo de baile de la academia I Dance ha sido seleccionado para competir
            internacionalmente en Perú representando a Ecuador. Cada aporte nos acerca al escenario.
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

      {/* ── STORY ─────────────────────────────────────────── */}
      <section className="story-section" aria-label="Nuestra historia">
        <div className="story-inner">
          <div className="story-text">
            <h2 className="font-display">Un sueño que merece hacerse realidad</h2>
            <p>
              Estas jóvenes bailadoras han entregado meses de dedicación, disciplina y
              pasión en cada ensayo. Hoy, su talento las llevó a ser seleccionadas para
              competir a nivel internacional.
            </p>
            <p>
              Representarán a Ecuador en Perú, llevando nuestra cultura y el orgullo de
              nuestro país a un escenario internacional. Pero para llegar, necesitan tu apoyo.
            </p>
            <p>
              Participa comprando una entrada a nuestros talleres de baile solidarios o
              haciendo una donación directa. Cada dólar cuenta.
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
            <Image
              src="/media/final-02.jpg"
              alt="Bailadoras en escenario"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* ── VIDEO GALLERY ─────────────────────────────────── */}
      <section className="video-section" aria-label="Nuestras actuaciones">
        <div className="video-inner">
          <div className="section-header">
            <span className="section-label">Míranos en acción</span>
            <h2 className="section-title font-display">Actuaciones anteriores</h2>
            <p className="section-subtitle">
              Estos son algunos de los momentos que nos trajeron hasta aquí.
            </p>
          </div>
          <div className="video-grid">
            <div className="video-wrapper">
              <video
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src="/media/video-01.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="video-wrapper">
              <video
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src="/media/video-02.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="video-wrapper video-wrapper--wide">
              <video
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src="/media/video-03.mov" type="video/quicktime" />
                <source src="/media/video-03.mov" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENTS ────────────────────────────────────────── */}
      <section id="eventos" className="events-section" aria-label="Talleres solidarios">
        <div className="events-inner">
          <div className="section-header">
            <span className="section-label">Apóyanos asistiendo</span>
            <h2 className="section-title font-display">Talleres de baile solidarios</h2>
            <p className="section-subtitle">
              Ritmos mixtos para todos los niveles. Vive una tarde de baile y apoya el sueño de nuestras bailadoras.
            </p>
          </div>

          <div className="events-grid">
            {/* Clase 1 — 22 ago */}
            <a id="evento-clase1-card" href="/clase/clase-1" className="event-card" aria-label="Inscribirse al taller del 22 de agosto">
              <Image className="event-card-img" src="/media/promo-01.jpg" alt="Taller 22 de agosto" fill style={{ objectFit: 'cover', objectPosition: 'center 20%' }} />
              <div className="event-card-overlay" />
              <div className="event-card-content">
                <span className="event-card-tag">Taller 1</span>
                <h3 className="event-card-title">Ritmos Mixtos</h3>
                <p className="event-card-date">📅 Sábado 22 de agosto · 16:00 · Academia I Dance</p>
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

            {/* Clase 2 — 29 ago */}
            <a id="evento-clase2-card" href="/clase/clase-2" className="event-card" aria-label="Inscribirse al taller del 29 de agosto">
              <Image className="event-card-img" src="/media/promo-02.jpg" alt="Taller 29 de agosto" fill style={{ objectFit: 'cover', objectPosition: 'center 20%' }} />
              <div className="event-card-overlay" />
              <div className="event-card-content">
                <span className="event-card-tag">Taller 2</span>
                <h3 className="event-card-title">Ritmos Mixtos</h3>
                <p className="event-card-date">📅 Sábado 29 de agosto · 16:00 · Academia I Dance</p>
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
                <Image src="/media/final-01.jpg" alt="Bailadoras en competencia" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} onContextMenu={(e) => e.preventDefault()} draggable={false} />
              </div>
            </div>
          </div>

          <div className="idance-content">
            <div className="idance-logo-wrap">
              <Image src="/media/idance-logo.png" alt="I Dance Ecuador" width={120} height={60} style={{ objectFit: 'contain' }} />
            </div>
            <span className="section-label" style={{ textAlign: 'left' }}>Nuestro espacio</span>
            <h2 className="font-display idance-title">Academia I Dance</h2>
            <p className="idance-desc">
              El material fotográfico y audiovisual de esta campaña fue posible gracias a la
              academia <strong>I Dance</strong>. Si te inspiraste y quieres aprender a bailar,
              escríbeles por WhatsApp — tienen clases para todos los niveles.
            </p>

            <div className="idance-styles">
              {['Salsa', 'Bachata', 'Urbano', 'K-Pop', 'Acrobacias', 'Ballet'].map((s) => (
                <span key={s} className="idance-style-tag">{s}</span>
              ))}
            </div>

            <div className="idance-actions">
              <a
                id="idance-whatsapp-btn"
                href="https://wa.me/593000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary idance-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Escribir por WhatsApp
              </a>
              <a
                id="idance-instagram-btn"
                href="https://www.instagram.com/idance_ecuador/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline idance-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                @idance_ecuador
              </a>
            </div>
          </div>
        </div>
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

      {showModal && <DonationModal onClose={() => setShowModal(false)} />}
    </>
  )
}
