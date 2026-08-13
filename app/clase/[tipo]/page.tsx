'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import FileUpload from '@/components/FileUpload'

const CLASES: Record<
  string,
  {
    titulo: string
    ritmo: string
    fecha: string
    lugar: string
    precio: number
    imagen: string
    descripcion: string
  }
> = {
  'clase-1': {
    titulo: 'Clase de Baile Solidaria — Ritmo 1',
    ritmo: 'Ritmo 1',
    fecha: 'Fecha por confirmar',
    lugar: 'Lugar por confirmar',
    precio: 3,
    imagen: '/banner-salsa.jpg',
    descripcion:
      'Únete a una clase especial de baile donde aprenderás los pasos básicos y disfrutarás de una tarde llena de música y movimiento. Todos los fondos van al viaje del grupo.',
  },
  'clase-2': {
    titulo: 'Clase de Baile Solidaria — Ritmo 2',
    ritmo: 'Ritmo 2',
    fecha: 'Fecha por confirmar',
    lugar: 'Lugar por confirmar',
    precio: 3,
    imagen: '/banner-bachata.jpg',
    descripcion:
      'Una experiencia única de baile en un ambiente cálido y acogedor. Aprende, disfruta y apoya a nuestras bailadoras a llegar a Perú.',
  },
}

export default function ClasePage() {
  const params = useParams()
  const tipo = params.tipo as string
  const clase = CLASES[tipo]

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cantidad, setCantidad] = useState(1)
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

    setIsLoading(true)

    const formData = new FormData()
    formData.append('tipo_clase', tipo)
    formData.append('nombre', nombre)
    formData.append('email', email)
    formData.append('telefono', telefono)
    formData.append('cantidad_personas', String(cantidad))
    formData.append('monto_total', String(monto))
    formData.append('comprobante', file)

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        body: formData,
      })

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
              Gracias, <strong>{nombre}</strong>. Tu inscripción a{' '}
              <strong>{clase.titulo}</strong> ha sido registrada exitosamente.
              Verificaremos tu comprobante de pago y te confirmaremos por correo.
            </p>
            <Link href="/" className="btn-outline">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="form-page">
      <div className="form-container">
        {/* Back */}
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
            style={{ objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(44,36,32,0.5) 0%, transparent 60%)'
          }} />
        </div>

        {/* Title */}
        <h1 className="form-title font-display">{clase.titulo}</h1>

        <div className="form-meta">
          <span className="form-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {clase.fecha}
          </span>
          <span className="form-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {clase.lugar}
          </span>
          <span className="form-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            ${clase.precio} por persona
          </span>
        </div>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {clase.descripcion}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-card">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label form-label-required">
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                className="form-input"
                placeholder="Tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label form-label-required">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono" className="form-label form-label-required">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  className="form-input"
                  placeholder="0999 000 000"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">
                Número de personas
              </label>
              <div className="qty-control">
                <button
                  id="qty-decrease-btn"
                  type="button"
                  className="qty-btn"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="qty-display" aria-live="polite">{cantidad}</span>
                <button
                  id="qty-increase-btn"
                  type="button"
                  className="qty-btn"
                  onClick={() => setCantidad((c) => Math.min(20, c + 1))}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="total-box">
              <span className="total-label">Total a pagar</span>
              <span className="total-amount">${monto.toFixed(2)}</span>
            </div>

            {/* Upload */}
            <div className="form-group">
              <label className="form-label form-label-required">
                Comprobante de pago
              </label>
              <FileUpload
                onFileSelect={(f) => {
                  setFile(f)
                  if (f) setFileError('')
                }}
                error={fileError}
              />
            </div>

            {apiError && (
              <p className="form-error" style={{ marginBottom: '1rem' }}>
                {apiError}
              </p>
            )}

            <button
              id="submit-registro-btn"
              type="submit"
              className="submit-btn"
              disabled={isLoading || !nombre || !email || !telefono}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Enviando...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Confirmar inscripción
                </>
              )}
            </button>

            <p style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              marginTop: '0.75rem',
              lineHeight: 1.5
            }}>
              Al enviar, confirmas que realizaste el pago correspondiente.<br/>
              Tu inscripción será verificada por los organizadores.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
