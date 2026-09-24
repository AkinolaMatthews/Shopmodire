interface BlobProps {
  variant?: 'hero' | 'section'
}

/** Soft decorative gradient blobs used sparingly behind sections. */
export default function BackgroundBlobs({ variant = 'section' }: BlobProps) {
  if (variant === 'hero') {
    return (
      <>
        <div
          className="blob"
          style={{
            width: 420, height: 420, top: -140, right: -100,
            background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
            animation: 'drift 14s ease-in-out infinite',
          }}
        />
        <div
          className="blob"
          style={{
            width: 320, height: 320, bottom: -120, left: -80,
            background: 'radial-gradient(circle, var(--burgundy) 0%, transparent 70%)',
            opacity: 0.18,
            animation: 'drift 18s ease-in-out infinite reverse',
          }}
        />
      </>
    )
  }
  return (
    <div
      className="blob"
      style={{
        width: 300, height: 300, top: '10%', right: '-6%',
        background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
        opacity: 0.2,
        animation: 'drift 16s ease-in-out infinite',
      }}
    />
  )
}
