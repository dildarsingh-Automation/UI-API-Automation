/**
 * Logger Utility
 * 
 * Provides structured logging for tests with:
 * - Log levels (info, warn, error, debug)
 * - Timestamps
 * - Color-coded output (in console)
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private level: LogLevel = LogLevel.INFO;
  private enableColors: boolean = true;

  constructor() {
    // Set log level from environment
    const envLevel = process.env.LOG_LEVEL;
    if (envLevel === 'DEBUG') this.level = LogLevel.DEBUG;
    else if (envLevel === 'WARN') this.level = LogLevel.WARN;
    else if (envLevel === 'ERROR') this.level = LogLevel.ERROR;
    
    // Disable colors if not in TTY
    if (process.stdout && !process.stdout.isTTY) {
      this.enableColors = false;
    }
  }

  private formatMessage(level: string, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    let formatted = timestamp + ' [' + level + '] ' + message;
    
    if (data !== undefined) {
      formatted = formatted + ' ' + JSON.stringify(data);
    }
    
    return formatted;
  }

  debug(message: string, data?: unknown): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(this.formatMessage('DEBUG', message, data));
    }
  }

  info(message: string, data?: unknown): void {
    if (this.level <= LogLevel.INFO) {
      console.log(this.formatMessage('INFO', message, data));
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  error(message: string, error?: Error | unknown): void {
    if (this.level <= LogLevel.ERROR) {
      let errorData: unknown = error;
      if (error instanceof Error) {
        errorData = { message: error.message };
      }
      console.error(this.formatMessage('ERROR', message, errorData));
    }
  }

  testStart(testName: string, tags?: string[]): void {
    this.info('Starting test: ' + testName, { tags: tags || [] });
  }

  testComplete(testName: string, status: 'passed' | 'failed' | 'skipped'): void {
    console.log('[' + status.toUpperCase() + '] Test: ' + testName);
  }

  step(stepName: string): void {
    this.info('Step: ' + stepName);
  }

  apiRequest(method: string, url: string, status?: number): void {
    this.debug('API: ' + method + ' ' + url, { status: status });
  }
}

export const logger = new Logger();

