/**
 * Logger Utility
 * 
 * Pretty console output with colors and formatting.
 */

import chalk from 'chalk'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

export interface LoggerOptions {
  verbose?: boolean
  quiet?: boolean
}

export class Logger {
  private verbose: boolean
  private quiet: boolean

  constructor(options: LoggerOptions = {}) {
    this.verbose = options.verbose ?? false
    this.quiet = options.quiet ?? false
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = chalk.gray(new Date().toISOString().slice(11, 19))
    
    const prefixes: Record<LogLevel, string> = {
      debug: chalk.gray('[DEBUG]'),
      info: chalk.blue('[INFO]'),
      warn: chalk.yellow('[WARN]'),
      error: chalk.red('[ERROR]'),
      success: chalk.green('[SUCCESS]'),
    }

    return `${timestamp} ${prefixes[level]} ${message}`
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.verbose && !this.quiet) {
      console.log(this.formatMessage('debug', message), ...args)
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (!this.quiet) {
      console.log(this.formatMessage('info', message), ...args)
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (!this.quiet) {
      console.warn(this.formatMessage('warn', chalk.yellow(message)), ...args)
    }
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.formatMessage('error', chalk.red(message)), ...args)
  }

  success(message: string, ...args: unknown[]): void {
    if (!this.quiet) {
      console.log(this.formatMessage('success', chalk.green(message)), ...args)
    }
  }

  /**
   * Print a blank line
   */
  newline(): void {
    if (!this.quiet) {
      console.log()
    }
  }

  /**
   * Print a header with styling
   */
  header(text: string): void {
    if (!this.quiet) {
      console.log()
      console.log(chalk.bold.cyan(`  ${text}`))
      console.log(chalk.gray('  ' + '─'.repeat(text.length + 2)))
    }
  }

  /**
   * Print a step in a process
   */
  step(number: number, total: number, message: string): void {
    if (!this.quiet) {
      const stepInfo = chalk.gray(`[${number}/${total}]`)
      console.log(`  ${stepInfo} ${message}`)
    }
  }

  /**
   * Print a file creation/modification message
   */
  file(action: 'create' | 'update' | 'delete', path: string): void {
    if (!this.quiet) {
      const icons: Record<string, string> = {
        create: chalk.green('+'),
        update: chalk.yellow('~'),
        delete: chalk.red('-'),
      }
      console.log(`    ${icons[action]} ${chalk.gray(path)}`)
    }
  }

  /**
   * Print a summary box
   */
  summary(title: string, items: Record<string, string | number>): void {
    if (!this.quiet) {
      console.log()
      console.log(chalk.bold(`  ${title}`))
      for (const [key, value] of Object.entries(items)) {
        console.log(`    ${chalk.gray(key + ':')} ${value}`)
      }
    }
  }

  /**
   * Print the Unframe banner
   */
  banner(): void {
    if (!this.quiet) {
      console.log()
      console.log(chalk.cyan.bold('  ╭─────────────────────────────────╮'))
      console.log(chalk.cyan.bold('  │') + chalk.white.bold('         🖼️  Unframe CLI          ') + chalk.cyan.bold('│'))
      console.log(chalk.cyan.bold('  │') + chalk.gray('   Framer → Next.js Exporter    ') + chalk.cyan.bold('│'))
      console.log(chalk.cyan.bold('  ╰─────────────────────────────────╯'))
      console.log()
    }
  }

  /**
   * Print an error with details
   */
  errorWithDetails(title: string, details: string, hint?: string): void {
    console.log()
    console.log(chalk.red.bold(`  ✖ ${title}`))
    console.log(chalk.gray(`    ${details}`))
    if (hint) {
      console.log()
      console.log(chalk.yellow(`  💡 ${hint}`))
    }
    console.log()
  }

  /**
   * Print a success message with file count
   */
  exportComplete(fileCount: number, outputDir: string): void {
    console.log()
    console.log(chalk.green.bold('  ✓ Export complete!'))
    console.log()
    console.log(`    ${chalk.gray('Files generated:')} ${chalk.white(fileCount)}`)
    console.log(`    ${chalk.gray('Output directory:')} ${chalk.cyan(outputDir)}`)
    console.log()
    console.log(chalk.gray('  Next steps:'))
    console.log(chalk.white(`    cd ${outputDir}`))
    console.log(chalk.white('    npm install'))
    console.log(chalk.white('    npm run dev'))
    console.log()
  }
}

/**
 * Create a logger instance
 */
export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options)
}

/**
 * Default logger instance
 */
export const logger = createLogger()
