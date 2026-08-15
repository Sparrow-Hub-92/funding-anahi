import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #D9825B 0%, #B05F39 100%)',
        }}
      >
        <svg width="100" height="100" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 8 C32 20, 20 32, 8 32 C20 32, 32 44, 32 56 C32 44, 44 32, 56 32 C44 32, 32 20, 32 8 Z"
            fill="#FDFAF6"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
