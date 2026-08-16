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

export default function PhotoSlider({ slides, intervalMs = 3500 }: PhotoSliderProps) {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return
      setIsAnimating(true)
      setCurrent(index)
      setTimeout(() => setIsAnimating(false), 600)
    },
    [isAnimating]
  )

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, slides.length, goTo])

  // Auto-advance
  useEffect(() => {
    timerRef.current = setTimeout(next, intervalMs)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, next, intervalMs])

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div
      className="photo-slider"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Galería de fotos"
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`photo-slider-slide ${i === current ? 'photo-slider-slide--active' : ''}`}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            style={{
              objectFit: 'cover',
              objectPosition: slide.position ?? 'center',
            }}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            priority={i === 0}
          />
          {/* Ken Burns subtle zoom on active */}
          <div className={`photo-slider-zoom ${i === current ? 'photo-slider-zoom--active' : ''}`} />
        </div>
      ))}

      {/* Prev / Next arrows */}
      <button
        className="photo-slider-arrow photo-slider-arrow--prev"
        onClick={prev}
        aria-label="Foto anterior"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        className="photo-slider-arrow photo-slider-arrow--next"
        onClick={next}
        aria-label="Siguiente foto"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="photo-slider-dots" role="tablist" aria-label="Seleccionar foto">
        {slides.map((_, i) => (
          <button
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
