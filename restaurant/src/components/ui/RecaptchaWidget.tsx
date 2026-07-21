"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      render: (
        container: string | HTMLElement,
        parameters: {
          sitekey: string;
          theme?: "light" | "dark";
          size?: "normal" | "compact";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
    ___grecaptcha_cfg?: {
      clients?: Record<string, unknown>;
    };
  }
}

interface RecaptchaWidgetProps {
  siteKey: string;
  onChange?: (token: string | null) => void;
  theme?: "light" | "dark";
  size?: "normal" | "compact";
}

export interface RecaptchaWidgetRef {
  getValue: () => string | null;
  reset: () => void;
}

const RecaptchaWidget = forwardRef<RecaptchaWidgetRef, RecaptchaWidgetProps>(
  ({ siteKey, onChange, theme = "light", size = "normal" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      getValue: () => {
        if (widgetIdRef.current === null || typeof window === "undefined" || !window.grecaptcha) {
          return null;
        }
        const response = window.grecaptcha.getResponse(widgetIdRef.current);
        return response || null;
      },
      reset: () => {
        if (widgetIdRef.current !== null && typeof window !== "undefined" && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
        onChange?.(null);
      },
    }));

    useEffect(() => {
      if (typeof window === "undefined") return;
      if (!siteKey) {
        setError("reCAPTCHA site key is missing");
        return;
      }

      const scriptId = "google-recaptcha-script";
      if (document.getElementById(scriptId)) {
        renderWidget();
        return;
      }

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setLoaded(true);
        renderWidget();
      };

      script.onerror = () => {
        setError("Failed to load reCAPTCHA. Please check your connection.");
      };

      document.body.appendChild(script);

      function renderWidget() {
        if (!containerRef.current || !window.grecaptcha) return;

        window.grecaptcha.ready(() => {
          if (!containerRef.current || widgetIdRef.current !== null) return;
          try {
            widgetIdRef.current = window.grecaptcha!.render(containerRef.current, {
              sitekey: siteKey,
              theme,
              size,
              callback: (token: string) => {
                onChange?.(token);
              },
              "expired-callback": () => {
                onChange?.(null);
              },
              "error-callback": () => {
                setError("reCAPTCHA error. Please try again.");
                onChange?.(null);
              },
            });
          } catch (err) {
            setError("Failed to render reCAPTCHA");
            console.error("reCAPTCHA render error:", err);
          }
        });
      }

      return () => {
        // Do not remove the script on unmount because it may be shared.
        // The widget itself is cleaned up by re-rendering.
      };
    }, [siteKey, theme, size, onChange]);

    if (error) {
      return (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.08)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      );
    }

    return (
      <div
        style={{
          minHeight: size === "compact" ? 120 : 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div ref={containerRef} />
        {!loaded && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              background: "var(--a-surface-2, #eee8df)",
              color: "var(--a-text-3, #99907c)",
              border: "1px solid var(--a-border, rgba(155, 113, 21, 0.15))",
              fontSize: "14px",
            }}
          >
            Loading reCAPTCHA…
          </div>
        )}
      </div>
    );
  }
);

RecaptchaWidget.displayName = "RecaptchaWidget";

export default RecaptchaWidget;
