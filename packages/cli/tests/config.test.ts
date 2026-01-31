/**
 * Config Loader Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  loadConfigFromPath,
  mergeConfig,
  getConfigTemplate,
  DEFAULT_CONFIG,
  type ResolvedConfig,
} from '../src/utils/config.js'

describe('Config Loader', () => {
  let testDir: string

  beforeEach(() => {
    // Create a temp directory for tests
    testDir = join(tmpdir(), `unframe-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    // Cleanup
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  describe('loadConfigFromPath', () => {
    it('should load config from specific path', async () => {
      const configPath = join(testDir, 'custom-config.json')
      const configContent = JSON.stringify({
        project: 'specific-project',
        output: './specific-out',
      })
      writeFileSync(configPath, configContent)

      const config = await loadConfigFromPath(configPath)

      expect(config.project).toBe('specific-project')
      expect(config.output).toBe('./specific-out')
      // Should have defaults merged in
      expect(config.export?.framework).toBe('nextjs-app')
    })

    it('should merge with defaults', async () => {
      const configPath = join(testDir, 'partial-config.json')
      const configContent = JSON.stringify({
        project: 'my-project',
        export: {
          features: {
            darkMode: true,
          },
        },
      })
      writeFileSync(configPath, configContent)

      const config = await loadConfigFromPath(configPath)

      // Custom value
      expect(config.export?.features?.darkMode).toBe(true)
      // Default values preserved
      expect(config.export?.features?.animations).toBe(true)
      expect(config.export?.codeStyle?.typescript).toBe(true)
    })

    it('should throw on invalid config file', async () => {
      const configPath = join(testDir, 'invalid.json')
      writeFileSync(configPath, 'not valid json {{{')

      await expect(loadConfigFromPath(configPath)).rejects.toThrow()
    })
  })

  describe('mergeConfig', () => {
    it('should override config with CLI options', () => {
      const baseConfig: ResolvedConfig = {
        project: 'base-project',
        output: './base-out',
        export: DEFAULT_CONFIG.export,
        mcp: DEFAULT_CONFIG.mcp,
      }

      const merged = mergeConfig(baseConfig, {
        project: 'cli-project',
        output: './cli-out',
      })

      expect(merged.project).toBe('cli-project')
      expect(merged.output).toBe('./cli-out')
    })

    it('should not override undefined CLI options', () => {
      const baseConfig: ResolvedConfig = {
        project: 'base-project',
        output: './base-out',
        export: DEFAULT_CONFIG.export,
        mcp: DEFAULT_CONFIG.mcp,
      }

      const merged = mergeConfig(baseConfig, {})

      expect(merged.project).toBe('base-project')
      expect(merged.output).toBe('./base-out')
    })

    it('should merge nested export options', () => {
      const baseConfig: ResolvedConfig = {
        project: 'test',
        output: './out',
        export: {
          ...DEFAULT_CONFIG.export,
          features: {
            ...DEFAULT_CONFIG.export?.features,
            darkMode: false,
          },
        },
        mcp: DEFAULT_CONFIG.mcp,
      }

      const merged = mergeConfig(baseConfig, {
        export: {
          features: {
            darkMode: true,
          },
        },
      })

      expect(merged.export?.features?.darkMode).toBe(true)
    })
  })

  describe('getConfigTemplate', () => {
    it('should return valid JSON template', () => {
      const template = getConfigTemplate()
      const parsed = JSON.parse(template)

      expect(parsed.output).toBe('./out')
      expect(parsed.export.framework).toBe('nextjs-app')
      expect(parsed.project).toBe('<your-framer-project-id>')
    })

    it('should include project ID when provided', () => {
      const template = getConfigTemplate('my-custom-id')
      const parsed = JSON.parse(template)

      expect(parsed.project).toBe('my-custom-id')
    })

    it('should include all default export options', () => {
      const template = getConfigTemplate()
      const parsed = JSON.parse(template)

      expect(parsed.export.styling).toBe('tailwind')
      expect(parsed.export.features.animations).toBe(true)
      expect(parsed.export.codeStyle.typescript).toBe(true)
    })
  })

  describe('DEFAULT_CONFIG', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_CONFIG.output).toBe('./out')
      expect(DEFAULT_CONFIG.export?.framework).toBe('nextjs-app')
      expect(DEFAULT_CONFIG.export?.styling).toBe('tailwind')
      expect(DEFAULT_CONFIG.mcp?.timeout).toBe(60000)
      expect(DEFAULT_CONFIG.mcp?.retries).toBe(3)
    })
  })
})
