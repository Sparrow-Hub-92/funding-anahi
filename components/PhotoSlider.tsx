'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

interface Slide {
  src: string
  alt: string
  position?: string
}

interface PhotoSliderProps {
  slides: Slide[]
  intervalMs?: number
}

export default function PhotoSlider({ slides, intervalMs = 4000 }: PhotoSliderProps) {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return
      setIsAnimating(true)
      setCurrent(index)
      setTimeout(() => setIsAnimating(false), 500)
    },
    [isAnimating]
  )

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, slides.length, goTo])

  // Auto-advance when not paused
  useEffect(() => {
    if (isPaused) return
    timerRef.current = setTimeout(next, intervalMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, next, intervalMs, isPaused])

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false)
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div
      className="photo-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Galería de fotos"
    >
      {/* Slides */}
      {slides.map((slide, i) => {
        const isActive = i === current
        return (
          <div
            key={slide.src}
            className={`photo-slider-slide ${isActive ? 'photo-slider-slide--active' : ''}`}
            aria-hidden={!isActive}
          >
            {/* Ambient blurred background - fills container nicely */}
            <div className="photo-slider-bg-ambient">
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                aria-hidden="true"
                priority={i === 0 || i === 1}
              />
              <div className="photo-slider-bg-overlay" />
            </div>

            {/* Foreground crisp image with natural aspect ratio (contain) */}
            <div className="photo-slider-foreground">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
                priority={i === 0 || i === 1}
                className="photo-slider-main-img"
              />
            </div>
          </div>
        )
      })}

      {/* Prev / Next arrows */}
      <button
        type="button"
        className="photo-slider-arrow photo-slider-arrow--prev"
        onClick={prev}
        aria-label="Foto anterior"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        className="photo-slider-arrow photo-slider-arrow--next"
        onClick={next}
        aria-label="Siguiente foto"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="photo-slider-dots" role="tablist" aria-label="Seleccionar foto">
        {slides.map((_, i) => (
          <button
            type="button"
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Foto ${i + 1}`}
            className={`photo-slider-dot ${i === current ? 'photo-slider-dot--active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
