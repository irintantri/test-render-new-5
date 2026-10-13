type Level = "debug" | "info" | "warn" | "error";

function emit(level: Level, scope: string, message: string, meta?: unknown) {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} [${scope}] ${message}`;
  const out = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  meta === undefined ? out(line) : out(line, meta);
}

export function createLogger(scope: string) {
  return {
    debug: (m: string, meta?: unknown) => emit("debug", scope, m, meta),
    info: (m: string, meta?: unknown) => emit("info", scope, m, meta),
    warn: (m: string, meta?: unknown) => emit("warn", scope, m, meta),
    error: (m: string, meta?: unknown) => emit("error", scope, m, meta),
  };
}

export const logger = createLogger("app");
