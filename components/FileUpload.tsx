'use client'

import { useState, useCallback, useRef } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  error?: string
}

export default function FileUpload({ onFileSelect, error }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (selected: File | null) => {
      if (!selected) return
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
      if (!allowed.includes(selected.type)) {
        alert('Solo se permiten imágenes (JPG, PNG, WebP) o archivos PDF.')
        return
      }
      if (selected.size > 5 * 1024 * 1024) {
        alert('El archivo no puede superar los 5 MB.')
        return
      }
      setFile(selected)
      onFileSelect(selected)
    },
    [onFileSelect]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files?.[0] ?? null)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div
        id="file-upload-zone"
        className={`file-upload-zone ${isDragging ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Zona de carga de comprobante"
      >
        <input
          ref={inputRef}
          id="comprobante-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={handleChange}
          aria-required="true"
        />
        <div className="file-upload-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <p className="file-upload-text">
          <strong>Haz clic para adjuntar</strong> o arrastra tu comprobante aquí
        </p>
        <p className="file-upload-hint">JPG, PNG, WebP o PDF — máx. 5 MB</p>
      </div>

      {file && (
        <div className="file-selected">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Eliminar archivo"
            style={{ color: 'inherit', opacity: 0.7, flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
