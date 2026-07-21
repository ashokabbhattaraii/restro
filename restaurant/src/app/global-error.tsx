"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="error-boundary">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">!</div>
            <h1>Fatal Error</h1>
            <p>A critical error occurred. Please reload the page.</p>
            {error.digest && <code>Error ID: {error.digest}</code>}
            <button type="button" onClick={reset} className="admin-btn-primary">
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
