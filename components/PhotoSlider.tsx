'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

export interface CollageItem {
  src: string
  alt: string
  position?: string
}

export interface CollageSlide {
  topLeft: CollageItem
  topRight: CollageItem
  bottomLeft: CollageItem
  bottomRight: CollageItem
}

export interface SingleSlide {
  src: string
  alt: string
  position?: string
}

interface PhotoSliderProps {
  collages?: CollageSlide[]
  singleSlides?: SingleSlide[]
  intervalMs?: number
}

const DEFAULT_COLLAGES: CollageSlide[] = [
  {
    topLeft: { src: '/media/final-01.jpg', alt: 'Bailarines en competencia', position: 'center 25%' },
    topRight: { src: '/media/final-03.jpg', alt: 'Academia I Dance', position: 'center' },
    bottomLeft: { src: '/media/final-08.jpg', alt: 'Bailarina en pose', position: 'center top' },
    bottomRight: { src: '/media/final-04.jpg', alt: 'Presentación en escenario', position: 'center 20%' },
  },
  {
    topLeft: { src: '/media/final-09.jpg', alt: 'Actuación grupal', position: 'center 30%' },
    topRight: { src: '/media/final-06.jpg', alt: 'Bailarina en pose', position: 'center top' },
    bottomLeft: { src: '/media/final-05.jpg', alt: 'Bailarina en escenario', position: 'center top' },
    bottomRight: { src: '/media/final-10.jpg', alt: 'Competencia', position: 'center' },
  },
  {
    topLeft: { src: '/media/final-04.jpg', alt: 'Presentación en escenario', position: 'center 20%' },
    topRight: { src: '/media/final-11.jpg', alt: 'Equipo de baile', position: 'center top' },
    bottomLeft: { src: '/media/final-08.jpg', alt: 'Bailarina solista', position: 'center top' },
    bottomRight: { src: '/media/final-01.jpg', alt: 'Bailarines en competencia', position: 'center 25%' },
  },
]

const DEFAULT_SINGLES: SingleSlide[] = [
  { src: '/media/final-01.jpg', alt: 'Bailarines en competencia', position: 'center 25%' },
  { src: '/media/final-08.jpg', alt: 'Bailarina en pose', position: 'center top' },
  { src: '/media/final-09.jpg', alt: 'Actuación grupal', position: 'center 30%' },
  { src: '/media/final-05.jpg', alt: 'Bailarina en escenario', position: 'center top' },
  { src: '/media/final-04.jpg', alt: 'Presentación', position: 'center 20%' },
  { src: '/media/final-06.jpg', alt: 'Bailarina en pose', position: 'center top' },
  { src: '/media/final-10.jpg', alt: 'Competencia', position: 'center' },
  { src: '/media/final-11.jpg', alt: 'Equipo de baile', position: 'center top' },
  { src: '/media/final-03.jpg', alt: 'Academia I Dance', position: 'center' },
]

export default function PhotoSlider({
  collages = DEFAULT_COLLAGES,
  singleSlides = DEFAULT_SINGLES,
  intervalMs = 4500,
}: PhotoSliderProps) {
  // Desktop state
  const [currentCollage, setCurrentCollage] = useState(0)
  // Mobile state
  const [currentSingle, setCurrentSingle] = useState(0)

  const [isPaused, setIsPaused] = useState(false)
  const timerDesktopRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerMobileRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)

  // Desktop navigation
  const nextCollage = useCallback(() => {
    setCurrentCollage((prev) => (prev + 1) % collages.length)
  }, [collages.length])

  const prevCollage = useCallback(() => {
    setCurrentCollage((prev) => (prev - 1 + collages.length) % collages.length)
  }, [collages.length])

  // Mobile navigation
  const nextSingle = useCallback(() => {
    setCurrentSingle((prev) => (prev + 1) % singleSlides.length)
  }, [singleSlides.length])

  const prevSingle = useCallback(() => {
    setCurrentSingle((prev) => (prev - 1 + singleSlides.length) % singleSlides.length)
  }, [singleSlides.length])

  // Desktop auto-advance
  useEffect(() => {
    if (isPaused) return
    timerDesktopRef.current = setTimeout(nextCollage, intervalMs)
    return () => {
      if (timerDesktopRef.current) clearTimeout(timerDesktopRef.current)
    }
  }, [currentCollage, nextCollage, intervalMs, isPaused])

  // Mobile auto-advance
  useEffect(() => {
    if (isPaused) return
    timerMobileRef.current = setTimeout(nextSingle, 3800)
    return () => {
      if (timerMobileRef.current) clearTimeout(timerMobileRef.current)
    }
  }, [currentSingle, nextSingle, isPaused])

  // Mobile touch swipe
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
        nextSingle()
        nextCollage()
      } else {
        prevSingle()
        prevCollage()
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
          DESKTOP & TABLET: Editorial Mosaic Collage Slider
          ──────────────────────────────────────────────────────────── */}
      <div className="photo-slider--desktop">
        <div className="photo-slider-container">
          {collages.map((slide, i) => {
            const isActive = i === currentCollage
            return (
              <div
                key={`collage-${i}`}
                className={`photo-collage-slide ${isActive ? 'photo-collage-slide--active' : ''}`}
                aria-hidden={!isActive}
              >
                <div className="photo-mosaic-grid">
                  {/* Top Row: Wide Landscape (left) + Portrait (right) */}
                  <div className="photo-mosaic-row photo-mosaic-row--top">
                    <div className="photo-mosaic-item photo-mosaic-item--wide">
                      <Image
                        src={slide.topLeft.src}
                        alt={slide.topLeft.alt}
                        fill
                        sizes="(max-width: 1200px) 60vw, 700px"
                        style={{
                          objectFit: 'cover',
                          objectPosition: slide.topLeft.position ?? 'center',
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        priority={i === 0}
                      />
                    </div>
                    <div className="photo-mosaic-item photo-mosaic-item--portrait">
                      <Image
                        src={slide.topRight.src}
                        alt={slide.topRight.alt}
                        fill
                        sizes="(max-width: 1200px) 40vw, 400px"
                        style={{
                          objectFit: 'cover',
                          objectPosition: slide.topRight.position ?? 'center',
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        priority={i === 0}
                      />
                    </div>
                  </div>

                  {/* Bottom Row: Portrait (left) + Wide Landscape (right) */}
                  <div className="photo-mosaic-row photo-mosaic-row--bottom">
                    <div className="photo-mosaic-item photo-mosaic-item--portrait">
                      <Image
                        src={slide.bottomLeft.src}
                        alt={slide.bottomLeft.alt}
                        fill
                        sizes="(max-width: 1200px) 40vw, 400px"
                        style={{
                          objectFit: 'cover',
                          objectPosition: slide.bottomLeft.position ?? 'center',
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        priority={i === 0}
                      />
                    </div>
                    <div className="photo-mosaic-item photo-mosaic-item--wide">
                      <Image
                        src={slide.bottomRight.src}
                        alt={slide.bottomRight.alt}
                        fill
                        sizes="(max-width: 1200px) 60vw, 700px"
                        style={{
                          objectFit: 'cover',
                          objectPosition: slide.bottomRight.position ?? 'center',
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        priority={i === 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Desktop Controls */}
          <button
            type="button"
            className="photo-slider-arrow photo-slider-arrow--prev"
            onClick={prevCollage}
            aria-label="Colección anterior"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="photo-slider-arrow photo-slider-arrow--next"
            onClick={nextCollage}
            aria-label="Siguiente colección"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Desktop Dots */}
          <div className="photo-slider-dots" role="tablist" aria-label="Seleccionar colección">
            {collages.map((_, i) => (
              <button
                type="button"
                key={`dot-collage-${i}`}
                role="tab"
                aria-selected={i === currentCollage}
                aria-label={`Colección ${i + 1}`}
                className={`photo-slider-dot ${i === currentCollage ? 'photo-slider-dot--active' : ''}`}
                onClick={() => setCurrentCollage(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          MOBILE: Clean 1-by-1 Full-Frame Carousel
          ──────────────────────────────────────────────────────────── */}
      <div className="photo-slider--mobile">
        <div className="photo-slider-container photo-slider-container--mobile">
          {singleSlides.map((slide, i) => {
            const isActive = i === currentSingle
            return (
              <div
                key={`single-${i}`}
                className={`photo-single-slide ${isActive ? 'photo-single-slide--active' : ''}`}
                aria-hidden={!isActive}
              >
                {/* Ambient blur backdrop */}
                <div className="photo-slider-bg-ambient">
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    aria-hidden="true"
                    priority={i === 0 || i === 1}
                  />
                  <div className="photo-slider-bg-overlay" />
                </div>

                {/* Contained full foreground photo (never cropped) */}
                <div className="photo-single-foreground">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: 'contain',
                      objectPosition: slide.position ?? 'center',
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                    priority={i === 0 || i === 1}
                    className="photo-single-main-img"
                  />
                </div>
              </div>
            )
          })}

          {/* Mobile Controls */}
          <button
            type="button"
            className="photo-slider-arrow photo-slider-arrow--prev"
            onClick={prevSingle}
            aria-label="Foto anterior"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="photo-slider-arrow photo-slider-arrow--next"
            onClick={nextSingle}
            aria-label="Siguiente foto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Mobile Dots */}
          <div className="photo-slider-dots" role="tablist" aria-label="Seleccionar foto">
            {singleSlides.map((_, i) => (
              <button
                type="button"
                key={`dot-single-${i}`}
                role="tab"
                aria-selected={i === currentSingle}
                aria-label={`Foto ${i + 1}`}
                className={`photo-slider-dot ${i === currentSingle ? 'photo-slider-dot--active' : ''}`}
                onClick={() => setCurrentSingle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
