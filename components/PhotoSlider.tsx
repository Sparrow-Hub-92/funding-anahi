'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

export interface PhotoItem {
  src: string
  alt: string
  position?: string
}

export type SlideLayout =
  | {
      type: 'dual-portrait'
      items: [PhotoItem, PhotoItem]
    }
  | {
      type: 'trio-mix'
      horizontal: PhotoItem
      verticals: [PhotoItem, PhotoItem]
    }
  | {
      type: 'dual-landscape'
      items: [PhotoItem, PhotoItem]
    }

interface PhotoSliderProps {
  slides?: SlideLayout[]
  mobileSlides?: PhotoItem[]
  intervalMs?: number
}

const DESKTOP_SLIDES: SlideLayout[] = [
  // Slide 1: 2 Verticals — Dancers in full competition pose & costume
  {
    type: 'dual-portrait',
    items: [
      { src: '/media/final-01.jpg', alt: 'Bailarines en competencia', position: 'center 20%' },
      { src: '/media/final-08.jpg', alt: 'Bailarina en pose de competencia', position: 'center top' },
    ],
  },
  // Slide 2: 1 Horizontal (Full stage presentation) + 2 Verticals (Stage solos)
  {
    type: 'trio-mix',
    horizontal: { src: '/media/final-04.jpg', alt: 'Presentación grupal en escenario', position: 'center 25%' },
    verticals: [
      { src: '/media/final-05.jpg', alt: 'Bailarina en escenario', position: 'center top' },
      { src: '/media/final-06.jpg', alt: 'Bailarina solista en pose', position: 'center top' },
    ],
  },
  // Slide 3: 2 Horizontals — Stage choreographies (16:9 expansive landscape)
  {
    type: 'dual-landscape',
    items: [
      { src: '/media/final-09.jpg', alt: 'Actuación grupal en escenario', position: 'center 30%' },
      { src: '/media/final-10.jpg', alt: 'Dúo en competencia de baile', position: 'center' },
    ],
  },
  // Slide 4: 2 Verticals — Full Team portrait & Academy training
  {
    type: 'dual-portrait',
    items: [
      { src: '/media/final-11.jpg', alt: 'Equipo de baile I Dance', position: 'center top' },
      { src: '/media/final-03.jpg', alt: 'Academia I Dance', position: 'center' },
    ],
  },
]

const MOBILE_SLIDES: PhotoItem[] = [
  { src: '/media/final-01.jpg', alt: 'Bailarines en competencia', position: 'center 20%' },
  { src: '/media/final-08.jpg', alt: 'Bailarina en pose', position: 'center top' },
  { src: '/media/final-04.jpg', alt: 'Presentación grupal', position: 'center 25%' },
  { src: '/media/final-05.jpg', alt: 'Bailarina en escenario', position: 'center top' },
  { src: '/media/final-09.jpg', alt: 'Actuación grupal', position: 'center 30%' },
  { src: '/media/final-06.jpg', alt: 'Bailarina solista', position: 'center top' },
  { src: '/media/final-10.jpg', alt: 'Dúo en competencia', position: 'center' },
  { src: '/media/final-11.jpg', alt: 'Equipo de baile', position: 'center top' },
  { src: '/media/final-03.jpg', alt: 'Academia I Dance', position: 'center' },
]

export default function PhotoSlider({
  slides = DESKTOP_SLIDES,
  mobileSlides = MOBILE_SLIDES,
  intervalMs = 4500,
}: PhotoSliderProps) {
  // Desktop state
  const [currentDesktop, setCurrentDesktop] = useState(0)
  // Mobile state
  const [currentMobile, setCurrentMobile] = useState(0)

  const [isPaused, setIsPaused] = useState(false)
  const timerDesktopRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerMobileRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)

  // Desktop navigation
  const nextDesktop = useCallback(() => {
    setCurrentDesktop((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevDesktop = useCallback(() => {
    setCurrentDesktop((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Mobile navigation
  const nextMobile = useCallback(() => {
    setCurrentMobile((prev) => (prev + 1) % mobileSlides.length)
  }, [mobileSlides.length])

  const prevMobile = useCallback(() => {
    setCurrentMobile((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length)
  }, [mobileSlides.length])

  // Auto-advance desktop
  useEffect(() => {
    if (isPaused) return
    timerDesktopRef.current = setTimeout(nextDesktop, intervalMs)
    return () => {
      if (timerDesktopRef.current) clearTimeout(timerDesktopRef.current)
    }
  }, [currentDesktop, nextDesktop, intervalMs, isPaused])

  // Auto-advance mobile
  useEffect(() => {
    if (isPaused) return
    timerMobileRef.current = setTimeout(nextMobile, 3800)
    return () => {
      if (timerMobileRef.current) clearTimeout(timerMobileRef.current)
    }
  }, [currentMobile, nextMobile, isPaused])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false)
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextMobile()
        nextDesktop()
      } else {
        prevMobile()
        prevDesktop()
      }
    }
    touchStartX.current = null
  }

  return (
    <div
      className="photo-slider-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Galería de fotos en escena"
    >
      {/* ────────────────────────────────────────────────────────────
          DESKTOP & TABLET: Open Multi-Photo Showcase (No container box)
          ──────────────────────────────────────────────────────────── */}
      <div className="photo-slider--desktop">
        <div className="photo-stage-desktop">
          {slides.map((slide, i) => {
            const isActive = i === currentDesktop
            return (
              <div
                key={`desktop-slide-${i}`}
                className={`photo-slide-wrapper ${isActive ? 'photo-slide-wrapper--active' : ''}`}
                aria-hidden={!isActive}
              >
                {slide.type === 'dual-portrait' && (
                  <div className="slide-grid slide-grid--dual-portrait">
                    {slide.items.map((item, idx) => (
                      <div key={idx} className="slide-card slide-card--portrait">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 1200px) 50vw, 550px"
                          style={{
                            objectFit: 'cover',
                            objectPosition: item.position ?? 'center',
                          }}
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                          priority={i === 0}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {slide.type === 'trio-mix' && (
                  <div className="slide-grid slide-grid--trio-mix">
                    <div className="slide-card slide-card--landscape">
                      <Image
                        src={slide.horizontal.src}
                        alt={slide.horizontal.alt}
                        fill
                        sizes="(max-width: 1200px) 50vw, 550px"
                        style={{
                          objectFit: 'cover',
                          objectPosition: slide.horizontal.position ?? 'center',
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        priority={i === 0}
                      />
                    </div>
                    {slide.verticals.map((item, idx) => (
                      <div key={idx} className="slide-card slide-card--portrait">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 1200px) 25vw, 300px"
                          style={{
                            objectFit: 'cover',
                            objectPosition: item.position ?? 'center',
                          }}
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                          priority={i === 0}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {slide.type === 'dual-landscape' && (
                  <div className="slide-grid slide-grid--dual-landscape">
                    {slide.items.map((item, idx) => (
                      <div key={idx} className="slide-card slide-card--landscape">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 1200px) 50vw, 550px"
                          style={{
                            objectFit: 'cover',
                            objectPosition: item.position ?? 'center',
                          }}
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                          priority={i === 0}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Desktop Controls */}
        <button
          type="button"
          className="photo-slider-arrow photo-slider-arrow--prev"
          onClick={prevDesktop}
          aria-label="Colección anterior"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          className="photo-slider-arrow photo-slider-arrow--next"
          onClick={nextDesktop}
          aria-label="Siguiente colección"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Desktop Dots */}
        <div className="photo-slider-dots" role="tablist" aria-label="Seleccionar colección">
          {slides.map((_, i) => (
            <button
              type="button"
              key={`dot-desktop-${i}`}
              role="tab"
              aria-selected={i === currentDesktop}
              aria-label={`Colección ${i + 1}`}
              className={`photo-slider-dot ${i === currentDesktop ? 'photo-slider-dot--active' : ''}`}
              onClick={() => setCurrentDesktop(i)}
            />
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          MOBILE: 1-by-1 Native Mobile Carousel
          ──────────────────────────────────────────────────────────── */}
      <div className="photo-slider--mobile">
        <div className="photo-stage-mobile">
          {mobileSlides.map((slide, i) => {
            const isActive = i === currentMobile
            return (
              <div
                key={`mobile-slide-${i}`}
                className={`photo-slide-wrapper-mobile ${isActive ? 'photo-slide-wrapper-mobile--active' : ''}`}
                aria-hidden={!isActive}
              >
                <div className="slide-card-mobile">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: slide.position ?? 'center',
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                    priority={i === 0 || i === 1}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile Controls */}
        <button
          type="button"
          className="photo-slider-arrow photo-slider-arrow--prev"
          onClick={prevMobile}
          aria-label="Foto anterior"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          className="photo-slider-arrow photo-slider-arrow--next"
          onClick={nextMobile}
          aria-label="Siguiente foto"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Mobile Dots */}
        <div className="photo-slider-dots" role="tablist" aria-label="Seleccionar foto">
          {mobileSlides.map((_, i) => (
            <button
              type="button"
              key={`dot-mobile-${i}`}
              role="tab"
              aria-selected={i === currentMobile}
              aria-label={`Foto ${i + 1}`}
              className={`photo-slider-dot ${i === currentMobile ? 'photo-slider-dot--active' : ''}`}
              onClick={() => setCurrentMobile(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
