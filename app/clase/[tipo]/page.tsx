'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import FileUpload from '@/components/FileUpload'

const BAILADORAS: Record<string, string[]> = {
  'clase-1': [
    'Silvia Quishpe — Danna',
    'Vanessa Arévalo — Sophia',
    'Mafer Orozco — Camy',
    'Paola Falconí — Mari Vi',
    'Samantha Morales — Anahí',
  ],
  'clase-2': [
    'Paola Falconí — Mari Vi',
    'Samantha Morales — Anahí',
    'Yessenia Salazar — Anto',
    'Evelyn Proaño — Cami Pazmiño',
    'Suri',
  ],
}

const CLASES: Record<
  string,
  {
    titulo: string
    fecha: string
    fechaCorta: string
    hora: string
    lugar: string
    mapsUrl: string
    precio: number
    imagen: string
    descripcion: string
  }
> = {
  'clase-1': {
    titulo: 'Taller de Baile Solidario',
    fecha: 'Sábado 22 de agosto de 2025',
    fechaCorta: 'Sáb 22 ago',
    hora: '16:00',
    lugar: 'Academia I Dance',
    mapsUrl: 'https://share.google/rvt1F4rhEEZoeneVk',
    precio: 3,
    imagen: '/media/promo-01.jpg',
    descripcion:
      'Una clase especial de ritmos mixtos donde vivirás la energía del baile junto a nuestras bailadoras. Todo lo recaudado va directo al fondo para representar a Ecuador en Perú.',
  },
  'clase-2': {
    titulo: 'Taller de Baile Solidario',
    fecha: 'Sábado 29 de agosto de 2025',
    fechaCorta: 'Sáb 29 ago',
    hora: '16:00',
    lugar: 'Academia I Dance',
    mapsUrl: 'https://share.google/rvt1F4rhEEZoeneVk',
    precio: 3,
    imagen: '/media/promo-02.jpg',
    descripcion:
      'Una tarde llena de movimiento, música y alegría. Aprende ritmos mixtos con nuestras instructoras y sé parte del viaje de estas increíbles bailadoras.',
  },
}

export default function ClasePage() {
  const params = useParams()
  const tipo = params.tipo as string
  const clase = CLASES[tipo]
  const bailadoras = BAILADORAS[tipo] ?? []

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [bailadora, setBailadora] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState('')

  if (!clase) {
    return (
      <div className="form-page">
        <div className="form-container">
          <h1 className="form-title">Clase no encontrada</h1>
          <Link href="/" className="form-back">← Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const monto = clase.precio * cantidad

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!file) {
      setFileError('Debes adjuntar el comprobante de pago para continuar.')
      return
    }
    if (!bailadora) {
      setApiError('Por favor selecciona a qué bailadora deseas apoyar.')
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('tipo_clase', tipo)
    formData.append('nombre', nombre)
    formData.append('email', email)
    formData.append('telefono', telefono)
    formData.append('cantidad_personas', String(cantidad))
    formData.append('monto_total', String(monto))
    formData.append('bailadora', bailadora)
    formData.append('comprobante', file)

    try {
      const res = await fetch('/api/registro', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error || 'Ocurrió un error. Intenta de nuevo.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setApiError('No se pudo conectar con el servidor. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div className="success-card">
            <div className="success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="font-display">¡Inscripción recibida!</h2>
            <p>
              Gracias, <strong>{nombre}</strong>. Tu inscripción al{' '}
              <strong>{clase.titulo}</strong> del <strong>{clase.fechaCorta}</strong> ha
              sido registrada. Verificaremos tu pago y te confirmaremos por correo.
            </p>
            <Link href="/" className="btn-outline">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <Link href="/" className="form-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Volver al inicio
        </Link>

        {/* Hero Image */}
        <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem' }}>
          <Image
            src={clase.imagen}
            alt={clase.titulo}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,36,32,0.55) 0%, transparent 60%)' }} />
        </div>

        <h1 className="form-title font-display">{clase.titulo}</h1>

        <div className="form-meta">
          <span className="form-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {clase.fecha}
          </span>
          <span className="form-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {clase.hora}
          </span>
          <a href={clase.mapsUrl} target="_blank" rel="noopener noreferrer" className="form-meta-item form-meta-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {clase.lugar} — Ver ubicación
          </a>
          <span className="form-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            ${clase.precio} por persona · Cuenta N° 2200768515
          </span>
        </div>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {clase.descripcion}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-card">

            <div className="form-group">
              <label htmlFor="nombre" className="form-label form-label-required">Nombre completo</label>
              <input id="nombre" type="text" className="form-input" placeholder="Tu nombre completo"
                value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label form-label-required">Correo electrónico</label>
                <input id="email" type="email" className="form-input" placeholder="tu@correo.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="form-group">
                <label htmlFor="telefono" className="form-label form-label-required">Teléfono</label>
                <input id="telefono" type="tel" className="form-input" placeholder="0999 000 000"
                  value={telefono} onChange={(e) => setTelefono(e.target.value)} required autoComplete="tel" />
              </div>
            </div>

            {/* Bailadora dropdown */}
            <div className="form-group">
              <label htmlFor="bailadora" className="form-label form-label-required">
                ¿A qué bailadora quieres apoyar?
              </label>
              <div className="select-wrapper">
                <select
                  id="bailadora"
                  className="form-input form-select"
                  value={bailadora}
                  onChange={(e) => setBailadora(e.target.value)}
                  required
                >
                  <option value="">Selecciona una bailadora...</option>
                  {bailadoras.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            {/* Cantidad */}
            <div className="form-group">
              <label className="form-label form-label-required">Número de entradas</label>
              <div className="qty-control">
                <button id="qty-decrease-btn" type="button" className="qty-btn"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))} aria-label="Disminuir">−</button>
                <span className="qty-display" aria-live="polite">{cantidad}</span>
                <button id="qty-increase-btn" type="button" className="qty-btn"
                  onClick={() => setCantidad((c) => Math.min(20, c + 1))} aria-label="Aumentar">+</button>
              </div>
            </div>

            {/* Total */}
            <div className="total-box">
              <span className="total-label">Total a pagar</span>
              <span className="total-amount">${monto.toFixed(2)}</span>
            </div>

            {/* Upload */}
            <div className="form-group">
              <label className="form-label form-label-required">Comprobante de pago</label>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Transfiere a la cuenta N° <strong>2200768515</strong> (Banco Pichincha) y adjunta el comprobante aquí.
              </p>
              <FileUpload onFileSelect={(f) => { setFile(f); if (f) setFileError('') }} error={fileError} />
            </div>

            {apiError && <p className="form-error" style={{ marginBottom: '1rem' }}>{apiError}</p>}

            <button
              id="submit-registro-btn"
              type="submit"
              className="submit-btn"
              disabled={isLoading || !nombre || !email || !telefono || !bailadora}
            >
              {isLoading ? (
                <><span className="spinner" />Enviando...</>
              ) : (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Confirmar inscripción</>
              )}
            </button>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '0.75rem', lineHeight: 1.5 }}>
              Al enviar confirmas que realizaste el pago. Tu inscripción será verificada por los organizadores.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
