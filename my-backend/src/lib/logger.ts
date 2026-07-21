type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  method?: string;
  path?: string;
  status?: number;
  duration?: number;
  error?: unknown;
  stack?: string;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV !== "production";

function formatEntry(entry: LogEntry): string {
  if (isDev) {
    const parts = [
      `[${entry.timestamp}]`,
      entry.requestId ? `[${entry.requestId}]` : "",
      `[${entry.level.toUpperCase()}]`,
      entry.method ? `${entry.method}` : "",
      entry.path || "",
      entry.status ? `→ ${entry.status}` : "",
      entry.duration ? `(${entry.duration}ms)` : "",
      entry.message,
      entry.error ? `\n  ${entry.error instanceof Error ? entry.error.message : String(entry.error)}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    return parts;
  }
  return JSON.stringify(entry);
}

function createEntry(level: LogLevel, message: string, meta?: Partial<LogEntry>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
}

function log(level: LogLevel, message: string, meta?: Partial<LogEntry>): void {
  const entry = createEntry(level, message, meta);
  const formatted = formatEntry(entry);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "debug":
      if (isDev) console.debug(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  debug: (message: string, meta?: Partial<LogEntry>) => log("debug", message, meta),
  info: (message: string, meta?: Partial<LogEntry>) => log("info", message, meta),
  warn: (message: string, meta?: Partial<LogEntry>) => log("warn", message, meta),
  error: (message: string, meta?: Partial<LogEntry>) => log("error", message, meta),

  api: {
    request: (method: string, path: string, requestId: string) => {
      logger.info("API request", { method, path, requestId });
    },
    success: (method: string, path: string, status: number, duration: number, requestId: string) => {
      logger.debug("API success", { method, path, status, duration, requestId });
    },
    error: (method: string, path: string, status: number, duration: number, requestId: string, error?: string) => {
      logger.error("API error", { method, path, status, duration, requestId, error });
    },
  },
};