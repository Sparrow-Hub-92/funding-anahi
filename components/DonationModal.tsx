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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          ¡Copiado!
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copiar número
        </>
      )}
    </button>
  )
}

const DONACION = {
  banco: 'Banco Pichincha',
  tipo: 'Cuenta de Ahorros',
  numero: '2215523478',
  titular: 'Samantha Morales',
  ci: '1722539341',
}

export default function DonationModal({ onClose }: DonationModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
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
      <div className="modal-card modal-card--minimal">
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">Aporte voluntario</span>
            <h2 id="modal-title" className="font-display">Donación directa</h2>
          </div>
          <button id="modal-close-btn" className="modal-close" onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Minimal 2-column info grid */}
          <div className="donation-info-card">
            <div className="donation-info-grid">
              <div className="donation-info-item">
                <span className="donation-info-label">Banco</span>
                <span className="donation-info-val">{DONACION.banco}</span>
              </div>
              <div className="donation-info-item">
                <span className="donation-info-label">Tipo</span>
                <span className="donation-info-val">{DONACION.tipo}</span>
              </div>
              <div className="donation-info-item">
                <span className="donation-info-label">Titular</span>
                <span className="donation-info-val">{DONACION.titular}</span>
              </div>
              <div className="donation-info-item">
                <span className="donation-info-label">Cédula</span>
                <span className="donation-info-val">{DONACION.ci}</span>
              </div>
            </div>

            <div className="donation-account-highlight">
              <div className="donation-acc-left">
                <span className="donation-info-label">N° de Cuenta</span>
                <strong className="donation-acc-number">{DONACION.numero}</strong>
              </div>
              <CopyButton text={DONACION.numero} />
            </div>
          </div>

          <div className="modal-note-minimal">
            💛 <strong>¡Gracias por apoyar a nuestros bailarines!</strong> Cada aporte ayuda a cubrir su viaje al campeonato internacional en Perú.
          </div>
        </div>
      </div>
    </div>
  )
}
