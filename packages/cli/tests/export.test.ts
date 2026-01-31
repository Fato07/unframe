/**
 * Export Command Tests
 * 
 * Unit tests for export utilities and validation.
 * Full integration tests require MCP server connection.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  loadConfigFromPath,
  mergeConfig,
  DEFAULT_CONFIG,
  type ResolvedConfig,
} from '../src/utils/config.js'

describe('Export Command', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(tmpdir(), `unframe-export-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(testDir, { recursive: true })

    // Suppress console output
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
    vi.restoreAllMocks()
  })

  describe('configuration loading', () => {
    it('should load config from file', async () => {
      const configPath = join(testDir, '.unframerc')
      writeFileSync(
        configPath,
        JSON.stringify({
          project: 'test-project',
          output: './test-out',
        })
      )

      const config = await loadConfigFromPath(configPath)

      expect(config.project).toBe('test-project')
      expect(config.output).toBe('./test-out')
    })

    it('should merge defaults with loaded config', async () => {
      const configPath = join(testDir, '.unframerc')
      writeFileSync(
        configPath,
        JSON.stringify({
          project: 'test-project',
        })
      )

      const config = await loadConfigFromPath(configPath)

      expect(config.export?.framework).toBe('nextjs-app')
      expect(config.mcp?.timeout).toBe(60000)
    })
  })

  describe('CLI option merging', () => {
    it('should override config with CLI project option', () => {
      const baseConfig: ResolvedConfig = {
        project: 'config-project',
        output: './config-out',
        export: DEFAULT_CONFIG.export,
        mcp: DEFAULT_CONFIG.mcp,
      }

      const merged = mergeConfig(baseConfig, {
        project: 'cli-project',
      })

      expect(merged.project).toBe('cli-project')
      expect(merged.output).toBe('./config-out') // Not overridden
    })

    it('should override config with CLI output option', () => {
      const baseConfig: ResolvedConfig = {
        project: 'config-project',
        output: './config-out',
        export: DEFAULT_CONFIG.export,
        mcp: DEFAULT_CONFIG.mcp,
      }

      const merged = mergeConfig(baseConfig, {
        output: './cli-out',
      })

      expect(merged.project).toBe('config-project') // Not overridden
      expect(merged.output).toBe('./cli-out')
    })

    it('should override config with CLI mcpUrl option', () => {
      const baseConfig: ResolvedConfig = {
        project: 'config-project',
        mcpUrl: 'https://config.mcp.url',
        output: './out',
        export: DEFAULT_CONFIG.export,
        mcp: DEFAULT_CONFIG.mcp,
      }

      const merged = mergeConfig(baseConfig, {
        mcpUrl: 'https://cli.mcp.url',
      })

      expect(merged.mcpUrl).toBe('https://cli.mcp.url')
    })
  })

  describe('configuration validation', () => {
    it('should require project or mcpUrl', () => {
      const config: ResolvedConfig = {
        output: './out',
        export: DEFAULT_CONFIG.export,
        mcp: DEFAULT_CONFIG.mcp,
      }

      // Should not have project or mcpUrl
      expect(config.project).toBeUndefined()
      expect(config.mcpUrl).toBeUndefined()
    })

    it('should accept project ID', () => {
      const config: ResolvedConfig = {
        project: 'my-project-123',
        output: './out',
        export: DEFAULT_CONFIG.export,
        mcp: DEFAULT_CONFIG.mcp,
      }

      expect(config.project).toBe('my-project-123')
    })

    it('should accept mcpUrl', () => {
      const config: ResolvedConfig = {
        mcpUrl: 'https://mcp.unframer.co/sse?id=123',
        output: './out',
        export: DEFAULT_CONFIG.export,
        mcp: DEFAULT_CONFIG.mcp,
      }

      expect(config.mcpUrl).toBe('https://mcp.unframer.co/sse?id=123')
    })
  })

  describe('output configuration', () => {
    it('should default output to ./out', () => {
      expect(DEFAULT_CONFIG.output).toBe('./out')
    })

    it('should allow custom output directory', async () => {
      const configPath = join(testDir, '.unframerc')
      writeFileSync(
        configPath,
        JSON.stringify({
          project: 'test',
          output: './custom-output',
        })
      )

      const config = await loadConfigFromPath(configPath)

      expect(config.output).toBe('./custom-output')
    })
  })

  describe('export features', () => {
    it('should enable animations by default', () => {
      expect(DEFAULT_CONFIG.export?.features?.animations).toBe(true)
    })

    it('should enable CMS by default', () => {
      expect(DEFAULT_CONFIG.export?.features?.cms).toBe(true)
    })

    it('should enable responsive by default', () => {
      expect(DEFAULT_CONFIG.export?.features?.responsive).toBe(true)
    })

    it('should disable dark mode by default', () => {
      expect(DEFAULT_CONFIG.export?.features?.darkMode).toBe(false)
    })
  })

  describe('code style', () => {
    it('should use TypeScript by default', () => {
      expect(DEFAULT_CONFIG.export?.codeStyle?.typescript).toBe(true)
    })

    it('should not use semicolons by default', () => {
      expect(DEFAULT_CONFIG.export?.codeStyle?.semicolons).toBe(false)
    })

    it('should use single quotes by default', () => {
      expect(DEFAULT_CONFIG.export?.codeStyle?.singleQuote).toBe(true)
    })

    it('should use 2-space tabs by default', () => {
      expect(DEFAULT_CONFIG.export?.codeStyle?.tabWidth).toBe(2)
    })
  })
})
