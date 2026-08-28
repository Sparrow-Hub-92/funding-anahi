'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
    // ISO timestamp (UTC) after which registrations are blocked
    cierreVenta: string
  }
> = {
  'clase-1': {
    titulo: 'Taller 1: Ritmos Mixtos',
    fecha: 'Sábado 22 de agosto de 2026',
    fechaCorta: 'Sábado 22 de agosto',
    hora: '16:00 a 17:00',
    lugar: 'Academia I Dance',
    mapsUrl: 'https://share.google/rvt1F4rhEEZoeneVk',
    precio: 5,
    imagen: '/media/promo-01.jpg',
    descripcion:
      'Una clase especial de ritmos mixtos donde vivirás la energía del baile junto a nuestros bailarines. Todo lo recaudado va directo al fondo para ir a la PLF Latin Dance World Competition en Perú.',
    // Taller 1 was Aug 22 — closed immediately (set to day-of event end, ECT = UTC-5)
    cierreVenta: '2026-08-22T22:00:00Z', // 17:00 ECT = 22:00 UTC
  },
  'clase-2': {
    titulo: 'Taller 2: Ritmos Mixtos',
    fecha: 'Sábado 29 de agosto de 2026',
    fechaCorta: 'Sábado 29 de agosto',
    hora: '16:00 a 17:00',
    lugar: 'Academia I Dance',
    mapsUrl: 'https://share.google/rvt1F4rhEEZoeneVk',
    precio: 5,
    imagen: '/media/promo-02.jpg',
    descripcion:
      'Una tarde llena de movimiento, música y alegría. Aprende ritmos mixtos con nuestros instructores y apoya el sueño de estos bailarines de llegar a la PLF Latin Dance World Competition.',
    // Taller 2 closes Sunday Aug 31 at midnight ECT (05:00 UTC)
    cierreVenta: '2026-08-31T05:00:00Z',
  },
}

interface CuposClase {
  ocupados: number
  capacidad: number
  maxPorBailarina: number
  cuposBailarina: Record<string, number>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button type="button" onClick={handleCopy} className="copy-btn" aria-label="Copiar número de cuenta">
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ¡Copiado!
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copiar número
        </>
      )}
    </button>
  )
}

// ── Virtual Ticket Component ──────────────────────────────────────────────────
interface TicketProps {
  nombre: string
  cantidad: number
  titulo: string
  fecha: string
  hora: string
  lugar: string
}

function VirtualTicket({ nombre, cantidad, titulo, fecha, hora, lugar }: TicketProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ticketUrl, setTicketUrl] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 900
    const H = 420
    canvas.width = W
    canvas.height = H

    // Background
    ctx.fillStyle = '#1A1210'
    ctx.fillRect(0, 0, W, H)

    // Left accent bar
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#C8724A')
    grad.addColorStop(1, '#8B4E32')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 8, H)

    // Dotted divider at 58% width
    const divX = Math.round(W * 0.58)
    ctx.setLineDash([6, 8])
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(divX, 32)
    ctx.lineTo(divX, H - 32)
    ctx.stroke()
    ctx.setLineDash([])

    // Punch holes on divider
    ;[0.25, 0.5, 0.75].forEach((frac) => {
      const cy = H * frac
      ctx.fillStyle = '#1A1210'
      ctx.beginPath()
      ctx.arc(divX, cy, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // ── LEFT SECTION ───────────────────────────
    const lPad = 44

    // Label pill
    ctx.fillStyle = 'rgba(200,114,74,0.18)'
    roundRect(ctx, lPad, 38, 250, 26, 13)
    ctx.fill()
    ctx.fillStyle = '#C8724A'
    ctx.font = '600 11px -apple-system, sans-serif'
    ctx.fillText('TALENTO ECUADOR · TALLER SOLIDARIO', lPad + 12, 55)

    // Event title
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold 30px Georgia, serif`
    wrapText(ctx, titulo, lPad, 110, divX - lPad - 28, 38)

    // Separator line
    ctx.fillStyle = 'rgba(200,114,74,0.5)'
    ctx.fillRect(lPad, 168, 56, 2)

    // Date row
    const metaY = 200
    ctx.fillStyle = '#C8724A'
    ctx.font = 'bold 14px -apple-system, sans-serif'
    ctx.fillText('📅  ' + fecha, lPad, metaY)

    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '13px -apple-system, sans-serif'
    ctx.fillText('🕓  ' + hora + '   ·   📍  ' + lugar, lPad, metaY + 26)

    // Holder name
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.font = '11px -apple-system, sans-serif'
    ctx.fillText('ASISTENTE', lPad, H - 72)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 22px -apple-system, sans-serif'
    ctx.fillText(nombre, lPad, H - 48)

    // ── RIGHT SECTION ──────────────────────────
    const rPad = divX + 32
    const rW = W - rPad - 32

    // Entries label
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.font = '11px -apple-system, sans-serif'
    ctx.fillText('ENTRADAS', rPad, H / 2 - 46)

    // Big number
    ctx.fillStyle = '#C8724A'
    ctx.font = `bold 88px Georgia, serif`
    ctx.textAlign = 'center'
    ctx.fillText(String(cantidad), rPad + rW / 2, H / 2 + 16)

    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '13px -apple-system, sans-serif'
    ctx.fillText(cantidad === 1 ? 'entrada' : 'entradas', rPad + rW / 2, H / 2 + 42)

    // Total
    ctx.fillStyle = 'rgba(255,255,255,0.28)'
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillText(`$${(cantidad * 5).toFixed(2)} USD`, rPad + rW / 2, H - 44)

    ctx.textAlign = 'left'

    // Subtle bottom tag
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.font = '10px -apple-system, sans-serif'
    ctx.fillText('Comprobante de inscripción · Presentar al ingreso', lPad, H - 18)

    setTicketUrl(canvas.toDataURL('image/png'))
  }, [nombre, cantidad, titulo, fecha, hora, lugar])

  const handleDownload = () => {
    if (!ticketUrl) return
    const a = document.createElement('a')
    a.href = ticketUrl
    a.download = `ticket-${nombre.replace(/\s+/g, '-').toLowerCase()}.png`
    a.click()
  }

  return (
    <div className="ticket-wrapper">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {ticketUrl && (
        <>
          <div className="ticket-preview">
            <img src={ticketUrl} alt="Tu ticket de inscripción" className="ticket-img" />
          </div>
          <button type="button" className="ticket-download-btn" onClick={handleDownload}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar ticket
          </button>
        </>
      )}
    </div>
  )
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const words = text.split(' ')
  let line = ''
  let curY = y
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, curY)
      line = word
      curY += lineH
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, curY)
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ClasePage() {
  const params = useParams()
  const tipo = params.tipo as string
  const clase = CLASES[tipo]
  const bailadoras = BAILADORAS[tipo] ?? []

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [bailadora, setBailadora] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState('')
  const [cupos, setCupos] = useState<CuposClase | null>(null)

  const fetchCupos = useCallback(async () => {
    try {
      const res = await fetch('/api/cupos', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setCupos(data[tipo])
      }
    } catch { /* silent */ }
  }, [tipo])

  useEffect(() => {
    fetchCupos()
    const interval = setInterval(fetchCupos, 20_000)
    return () => clearInterval(interval)
  }, [fetchCupos])

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

  // ── Ventas cerradas ───────────────────────────────────────────────────────
  const ventasCerradas = new Date() >= new Date(clase.cierreVenta)

  const monto = clase.precio * cantidad

  const cuposPorBailarina = cupos?.cuposBailarina ?? {}
  const maxPorBailarina = cupos?.maxPorBailarina ?? 10
  const cuposUsadosBailadora = bailadora ? (cuposPorBailarina[bailadora] ?? 0) : 0
  const cuposRestantesBailadora = Math.max(maxPorBailarina - cuposUsadosBailadora, 0)
  const maxCantidad = bailadora ? cuposRestantesBailadora : maxPorBailarina

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    let formatted = digits
    if (digits.length > 7) {
      formatted = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
    } else if (digits.length > 4) {
      formatted = `${digits.slice(0, 4)} ${digits.slice(4)}`
    }
    setTelefono(formatted)
  }

  const phoneDigits = telefono.replace(/\D/g, '')
  const isPhoneValid = phoneDigits.length === 10

  const handleBailadoraChange = (val: string) => {
    setBailadora(val)
    const usados = cuposPorBailarina[val] ?? 0
    const restantes = Math.max(maxPorBailarina - usados, 0)
    if (cantidad > restantes) setCantidad(Math.max(restantes, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!file) {
      setFileError('Debes adjuntar el comprobante de pago para continuar.')
      return
    }
    if (!isPhoneValid) {
      setApiError('Por favor ingresa un número de celular válido de 10 dígitos.')
      return
    }
    if (!bailadora) {
      setApiError('Por favor selecciona a qué bailarín deseas apoyar.')
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('tipo_clase', tipo)
    formData.append('nombre', nombre.trim())
    formData.append('telefono', phoneDigits)
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
        <div className="form-container form-container--wide">
          <div className="success-card">
            <div className="success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="font-display">¡Inscripción confirmada!</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
              Descarga tu ticket de entrada y preséntalo el día del evento.
            </p>

            <VirtualTicket
              nombre={nombre}
              cantidad={cantidad}
              titulo={clase.titulo}
              fecha={clase.fecha}
              hora={clase.hora}
              lugar={clase.lugar}
            />

            <Link href="/" className="btn-outline" style={{ marginTop: '1.5rem' }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const libres = cupos ? Math.max(cupos.capacidad - cupos.ocupados, 0) : null
  const pct = cupos ? Math.min((cupos.ocupados / cupos.capacidad) * 100, 100) : 0
  const barColor = pct >= 80 ? 'cap-bar--red' : pct >= 50 ? 'cap-bar--amber' : 'cap-bar--green'
  const cupoTexto = libres === 1 ? 'cupo disponible' : 'cupos disponibles'

  return (
    <div className="form-page">
      <div className="form-container">
        <Link href="/" className="form-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Volver al inicio
        </Link>

        {clase.imagen && (
          <div className="form-hero-img">
            <Image
              src={clase.imagen}
              alt={clase.titulo}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              priority
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
          </div>
        )}

        {ventasCerradas ? (
          <div className="closed-notice">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>Las inscripciones para este taller han cerrado.</span>
          </div>
        ) : cupos && (
          <div className="form-cupos">
            <div className="form-cupos-header">
              <span className="form-cupos-count">
                <strong>{libres}</strong> {cupoTexto}
              </span>
              {libres === 0 ? (
                <span className="cap-bar-full">Agotado</span>
              ) : libres !== null && libres <= 10 ? (
                <span className="cap-bar-warning">¡Últimos cupos!</span>
              ) : null}
            </div>
            <div className="cap-bar-track">
              <div className={`cap-bar-fill ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="form-header-group">
          <span className="form-event-tag">Taller Solidario</span>
          <h1 className="form-title font-display">{clase.titulo}</h1>
          <div className="form-date-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="form-date-text">{clase.fecha}</span>
            <span className="form-date-divider">·</span>
            <span className="form-date-time">{clase.hora}</span>
          </div>

          <div className="form-meta">
            <a href={clase.mapsUrl} target="_blank" rel="noopener noreferrer" className="form-meta-item form-meta-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {clase.lugar} — Ver ubicación
            </a>
            <span className="form-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              ${clase.precio} por persona
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {clase.descripcion}
        </p>

        {/* ── DATOS DE TRANSFERENCIA ── */}
        <div className="transfer-card-compact">
          <div className="transfer-card-header">
            <div className="transfer-card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span>Datos de transferencia — Talleres de baile</span>
            </div>
            <span className="transfer-card-hint">💡 Transfiere y adjunta tu comprobante</span>
          </div>

          <div className="transfer-grid-compact">
            <div className="transfer-cell">
              <span className="transfer-cell-label">Banco</span>
              <span className="transfer-cell-val">Banco Pichincha</span>
            </div>
            <div className="transfer-cell">
              <span className="transfer-cell-label">Tipo</span>
              <span className="transfer-cell-val">Cuenta de Ahorros</span>
            </div>
            <div className="transfer-cell">
              <span className="transfer-cell-label">Titular</span>
              <span className="transfer-cell-val">Paola Falconí</span>
            </div>
            <div className="transfer-cell">
              <span className="transfer-cell-label">Cédula</span>
              <span className="transfer-cell-val">1803732328</span>
            </div>
            <div className="transfer-cell transfer-cell--account">
              <span className="transfer-cell-label">N° de Cuenta</span>
              <div className="transfer-acc-row">
                <strong className="transfer-acc-num">2200768515</strong>
                <CopyButton text="2200768515" />
              </div>
            </div>
          </div>
        </div>

        {!ventasCerradas && (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-card">

            <div className="form-group">
              <label htmlFor="nombre" className="form-label form-label-required">Nombre completo</label>
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

            <div className="form-group">
              <label htmlFor="telefono" className="form-label form-label-required">Número de celular</label>
              <input
                id="telefono"
                type="tel"
                inputMode="numeric"
                className="form-input"
                placeholder="0999 000 000"
                maxLength={12}
                value={telefono}
                onChange={(e) => handlePhoneChange(e.target.value)}
                required
                autoComplete="tel"
              />
              {telefono && phoneDigits.length > 0 && phoneDigits.length < 10 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                  Ingresa los 10 dígitos de tu número celular ({phoneDigits.length}/10)
                </p>
              )}
            </div>

            {/* Bailadora dropdown */}
            <div className="form-group">
              <label htmlFor="bailadora" className="form-label form-label-required">
                ¿A qué bailarín quieres apoyar?
              </label>
              <div className="select-wrapper">
                <select
                  id="bailadora"
                  className="form-input form-select"
                  value={bailadora}
                  onChange={(e) => handleBailadoraChange(e.target.value)}
                  required
                >
                  <option value="">Selecciona un bailarín...</option>
                  {bailadoras.map((b) => {
                    const usados = cuposPorBailarina[b] ?? 0
                    const agotada = usados >= maxPorBailarina
                    const restantes = maxPorBailarina - usados
                    return (
                      <option key={b} value={b} disabled={agotada}>
                        {b}{agotada ? ' — Cupos agotados' : usados > 0 ? ` — ${restantes} ${restantes === 1 ? 'cupo restante' : 'cupos restantes'}` : ''}
                      </option>
                    )
                  })}
                </select>
                <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              {bailadora && cuposRestantesBailadora <= 5 && cuposRestantesBailadora > 0 && (
                <p style={{ fontSize: '0.8rem', color: '#FF9800', marginTop: '0.4rem' }}>
                  {cuposRestantesBailadora === 1 ? '⚠️ Solo queda 1 cupo para este bailarín.' : `⚠️ Solo quedan ${cuposRestantesBailadora} cupos para este bailarín.`}
                </p>
              )}
              {bailadora && cuposRestantesBailadora === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-error)', marginTop: '0.4rem' }}>
                  🔴 Este bailarín ya completó sus 10 cupos.
                </p>
              )}
            </div>

            {/* Cantidad */}
            <div className="form-group">
              <label className="form-label form-label-required">Número de entradas</label>
              {bailadora && maxCantidad === 0 ? (
                <p style={{ fontSize: '0.9rem', color: 'var(--color-error)' }}>
                  Este bailarín no tiene cupos disponibles.
                </p>
              ) : (
                <div className="qty-control">
                  <button
                    id="qty-decrease-btn"
                    type="button"
                    className="qty-btn"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    aria-label="Disminuir"
                  >
                    −
                  </button>
                  <span className="qty-display" aria-live="polite">{cantidad}</span>
                  <button
                    id="qty-increase-btn"
                    type="button"
                    className="qty-btn"
                    onClick={() => setCantidad((c) => Math.min(maxCantidad || maxPorBailarina, c + 1))}
                    disabled={cantidad >= (maxCantidad || maxPorBailarina)}
                    aria-label="Aumentar"
                  >
                    +
                  </button>
                </div>
              )}
              {bailadora && maxCantidad > 0 && maxCantidad < maxPorBailarina && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                  {maxCantidad === 1 ? 'Máximo 1 entrada disponible para este bailarín.' : `Máximo ${maxCantidad} entradas disponibles para este bailarín.`}
                </p>
              )}
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
                Adjunta el comprobante de tu transferencia a la cuenta N° <strong>2200768515</strong>.
              </p>
              <FileUpload onFileSelect={(f) => { setFile(f); if (f) setFileError('') }} error={fileError} />
            </div>

            {apiError && <p className="form-error" style={{ marginBottom: '1rem' }}>{apiError}</p>}

            <button
              id="submit-registro-btn"
              type="submit"
              className="submit-btn"
              disabled={isLoading || !nombre.trim() || !isPhoneValid || !bailadora || !file || (bailadora ? cuposRestantesBailadora === 0 : false)}
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
        )}
      </div>
    </div>
  )
}
