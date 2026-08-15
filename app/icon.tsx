import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Image metadata
export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'

// Icon generator for Next.js App Router (/icon)
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <div
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '90px',
            background: 'linear-gradient(135deg, #D9825B 0%, #B05F39 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(176, 95, 57, 0.4)',
          }}
        >
          {/* Spark star in ivory */}
          <svg width="100" height="100" viewBox="0 0 64 64" fill="none">
            <path
              d="M32 8 C32 20, 20 32, 8 32 C20 32, 32 44, 32 56 C32 44, 44 32, 56 32 C44 32, 32 20, 32 8 Z"
              fill="#FDFAF6"
            />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
