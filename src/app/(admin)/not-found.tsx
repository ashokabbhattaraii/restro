export default function AdminNotFound() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        padding: 24,
        background: 'var(--background)',
        color: 'var(--body)',
        fontFamily: 'var(--font-body), Inter, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'var(--primary)',
            lineHeight: 1,
            marginBottom: 8,
            fontFamily: 'var(--font-display, "Playfair Display", serif)',
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            margin: '0 0 8px',
            color: 'var(--body)',
          }}
        >
          Page not found
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
      </div>
    </div>
  )
}
