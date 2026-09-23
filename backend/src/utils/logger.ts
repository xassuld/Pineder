import { LogMeta } from "../types/common";

interface LogLevel {
  info: (message: string, meta?: LogMeta) => void;
  error: (message: string, meta?: LogMeta) => void;
  warn: (message: string, meta?: LogMeta) => void;
  debug: (message: string, meta?: LogMeta) => void;
}

class Logger implements LogLevel {
  info(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV === "production") {
      console.log(`✅ ${message}`);
    }
  }

  error(message: string, meta?: LogMeta) {
    console.error(`❌ ${message}`);
  }

  warn(message: string, meta?: LogMeta) {
    // Only log warnings in development, and only for actual issues
    if (process.env.NODE_ENV === "development" && !message.includes("Missing authentication headers")) {
      console.warn(`⚠️ ${message}`);
    }
  }

  debug(message: string, meta?: LogMeta) {
    // Disable debug logging to reduce noise
  }
}

export const logger = new Logger();
