"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="error-boundary">
      <div className="error-boundary-card">
        <div className="error-boundary-icon">!</div>
        <h1>Something went wrong</h1>
        <p>An unexpected error occurred. Our team has been notified.</p>
        {error.digest && <code>Error ID: {error.digest}</code>}
        <button type="button" onClick={reset} className="admin-btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
