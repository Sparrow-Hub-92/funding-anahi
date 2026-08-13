'use client'

import { useEffect, useRef } from 'react'

interface DonationModalProps {
  onClose: () => void
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
      <div className="modal-card">
        <div className="modal-header">
          <h2 id="modal-title" className="font-display">Hacer una Donación</h2>
          <button
            id="modal-close-btn"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Tu donación va directamente al fondo de viaje del grupo. Realiza tu
            transferencia a la siguiente cuenta y guarda tu comprobante.
          </p>

          <div className="bank-info-grid">
            <div className="bank-info-row">
              <span className="bank-info-label">Banco</span>
              <span className="bank-info-value">Banco [Nombre del Banco]</span>
            </div>
            <div className="bank-info-row">
              <span className="bank-info-label">Titular</span>
              <span className="bank-info-value">[Nombre del Titular]</span>
            </div>
            <div className="bank-info-row">
              <span className="bank-info-label">N° de Cuenta</span>
              <span className="bank-info-value">[Número de Cuenta]</span>
            </div>
            <div className="bank-info-row">
              <span className="bank-info-label">Tipo</span>
              <span className="bank-info-value">[Ahorros / Corriente]</span>
            </div>
            <div className="bank-info-row">
              <span className="bank-info-label">Cédula / RUC</span>
              <span className="bank-info-value">[Número de Cédula]</span>
            </div>
          </div>

          <div className="qr-section">
            <div className="qr-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h2v2h-2zM16 16h2v2h-2zM14 18h2v2h-2zM18 14h2v2h-2zM20 16h2v2h-2zM18 18h2v2h-2zM20 20h2v2h-2z" fill="currentColor" stroke="none"/>
              </svg>
              <span style={{marginTop: '0.4rem'}}>QR próximamente</span>
            </div>
            <p className="qr-caption">Escanea el código QR para pagar directamente</p>
          </div>

          <div className="modal-note">
            💛 <strong>¡Gracias por tu apoyo!</strong> Cada dólar nos acerca más al sueño de
            representar a Ecuador en Perú. Si tienes dudas, escríbenos.
          </div>
        </div>
      </div>
    </div>
  )
}
