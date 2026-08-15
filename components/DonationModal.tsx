'use client'

import { useEffect, useRef, useState } from 'react'

interface DonationModalProps {
  onClose: () => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="copy-btn"
      aria-label="Copiar número de cuenta"
    >
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

const ACCOUNTS = {
  donacion: {
    label: 'Donación directa',
    banco: 'Banco Pichincha',
    tipo: 'Cuenta de Ahorros',
    numero: '2215523478',
    titular: 'Samantha Morales',
    ci: '1722539341',
  },
  taller: {
    label: 'Pago de talleres',
    banco: 'Banco Pichincha',
    tipo: 'Cuenta de Ahorros',
    numero: '2200768515',
    titular: '[Nombre pendiente]',
    ci: '1803732328',
  },
}

export default function DonationModal({ onClose }: DonationModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState<'donacion' | 'taller'>('donacion')
  const cuenta = ACCOUNTS[tab]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  return (
    <div
      id="donation-modal-backdrop"
      className="modal-backdrop"
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <h2 id="modal-title" className="font-display">Datos de transferencia</h2>
          <button id="modal-close-btn" className="modal-close" onClick={onClose} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Selecciona el tipo de pago y realiza tu transferencia. Guarda el comprobante.
          </p>

          {/* Tabs */}
          <div className="modal-tabs">
            <button
              id="tab-donacion"
              className={`modal-tab ${tab === 'donacion' ? 'active' : ''}`}
              onClick={() => setTab('donacion')}
            >
              ❤️ Donación
            </button>
            <button
              id="tab-taller"
              className={`modal-tab ${tab === 'taller' ? 'active' : ''}`}
              onClick={() => setTab('taller')}
            >
              💃 Taller de baile
            </button>
          </div>

          <div className="bank-info-grid">
            <div className="bank-info-row">
              <span className="bank-info-label">Banco</span>
              <span className="bank-info-value">{cuenta.banco}</span>
            </div>
            <div className="bank-info-row">
              <span className="bank-info-label">Tipo</span>
              <span className="bank-info-value">{cuenta.tipo}</span>
            </div>
            <div className="bank-info-row">
              <span className="bank-info-label">Titular</span>
              <span className="bank-info-value">{cuenta.titular}</span>
            </div>
            <div className="bank-info-row">
              <span className="bank-info-label">Cédula</span>
              <span className="bank-info-value">{cuenta.ci}</span>
            </div>
            <div className="bank-info-row bank-info-row--highlight">
              <span className="bank-info-label">N° Cuenta</span>
              <span className="bank-info-value bank-info-value--big">{cuenta.numero}</span>
              <CopyButton text={cuenta.numero} />
            </div>
          </div>

          <div className="modal-note">
            💛 <strong>¡Gracias por tu apoyo!</strong> Cada aporte nos acerca más al sueño de
            representar a Ecuador en Perú. Una vez realizada la transferencia, adjunta el comprobante en el formulario de inscripción.
          </div>
        </div>
      </div>
    </div>
  )
}
