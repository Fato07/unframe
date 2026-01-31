/**
 * Logger Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Logger, createLogger } from '../src/utils/logger.js'

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createLogger', () => {
    it('should create a logger instance', () => {
      const logger = createLogger()
      expect(logger).toBeInstanceOf(Logger)
    })

    it('should accept options', () => {
      const logger = createLogger({ verbose: true, quiet: false })
      expect(logger).toBeInstanceOf(Logger)
    })
  })

  describe('logging methods', () => {
    it('should log info messages', () => {
      const logger = createLogger()
      logger.info('Test info message')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy.mock.calls[0][0]).toContain('[INFO]')
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Test info message')
    })

    it('should log warn messages', () => {
      const logger = createLogger()
      logger.warn('Test warning')

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN]')
    })

    it('should log error messages', () => {
      const logger = createLogger()
      logger.error('Test error')

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]')
    })

    it('should log success messages', () => {
      const logger = createLogger()
      logger.success('Test success')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy.mock.calls[0][0]).toContain('[SUCCESS]')
    })
  })

  describe('debug logging', () => {
    it('should not log debug by default', () => {
      const logger = createLogger()
      logger.debug('Debug message')

      expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    it('should log debug when verbose is true', () => {
      const logger = createLogger({ verbose: true })
      logger.debug('Debug message')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy.mock.calls[0][0]).toContain('[DEBUG]')
    })
  })

  describe('quiet mode', () => {
    it('should suppress info in quiet mode', () => {
      const logger = createLogger({ quiet: true })
      logger.info('Should not appear')

      expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    it('should still log errors in quiet mode', () => {
      const logger = createLogger({ quiet: true })
      logger.error('Should appear')

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })

    it('should suppress debug even with verbose in quiet mode', () => {
      const logger = createLogger({ verbose: true, quiet: true })
      logger.debug('Should not appear')

      expect(consoleLogSpy).not.toHaveBeenCalled()
    })
  })

  describe('formatting methods', () => {
    it('should print header', () => {
      const logger = createLogger()
      logger.header('Test Header')

      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should print step', () => {
      const logger = createLogger()
      logger.step(1, 5, 'Step description')

      expect(consoleLogSpy).toHaveBeenCalled()
      expect(consoleLogSpy.mock.calls[0][0]).toContain('[1/5]')
    })

    it('should print file actions', () => {
      const logger = createLogger()

      logger.file('create', 'src/index.ts')
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)

      logger.file('update', 'src/utils.ts')
      expect(consoleLogSpy).toHaveBeenCalledTimes(2)

      logger.file('delete', 'src/old.ts')
      expect(consoleLogSpy).toHaveBeenCalledTimes(3)
    })

    it('should print summary', () => {
      const logger = createLogger()
      logger.summary('Export Summary', {
        'Files': 10,
        'Components': 5,
      })

      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should print banner', () => {
      const logger = createLogger()
      logger.banner()

      expect(consoleLogSpy).toHaveBeenCalled()
      // Should have multiple lines for the banner box
      expect(consoleLogSpy.mock.calls.length).toBeGreaterThan(1)
    })
  })

  describe('error formatting', () => {
    it('should print error with details', () => {
      const logger = createLogger()
      logger.errorWithDetails('Title', 'Details', 'Hint')

      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should print error without hint', () => {
      const logger = createLogger()
      logger.errorWithDetails('Title', 'Details')

      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })

  describe('export complete message', () => {
    it('should print export complete with stats', () => {
      const logger = createLogger()
      logger.exportComplete(15, './out')

      expect(consoleLogSpy).toHaveBeenCalled()
      // Should contain file count and output dir
      const allOutput = consoleLogSpy.mock.calls.map(c => c[0]).join('\n')
      expect(allOutput).toContain('15')
      expect(allOutput).toContain('./out')
    })
  })
})
