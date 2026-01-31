/**
 * Init Command Tests
 * 
 * Tests for the config template generation and validation.
 * Note: Full init command tests require integration testing.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { existsSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { getConfigTemplate } from '../src/utils/config.js'

describe('Init Command', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(tmpdir(), `unframe-init-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(testDir, { recursive: true })

    // Suppress console output
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
    vi.restoreAllMocks()
  })

  describe('config template generation', () => {
    it('should create a valid JSON config', () => {
      const template = getConfigTemplate()
      
      // Should not throw
      expect(() => JSON.parse(template)).not.toThrow()
    })

    it('should include all required fields', () => {
      const template = getConfigTemplate()
      const config = JSON.parse(template)

      expect(config).toHaveProperty('project')
      expect(config).toHaveProperty('output')
      expect(config).toHaveProperty('export')
      expect(config).toHaveProperty('mcp')
    })

    it('should include export configuration', () => {
      const template = getConfigTemplate()
      const config = JSON.parse(template)

      expect(config.export).toHaveProperty('framework')
      expect(config.export).toHaveProperty('styling')
      expect(config.export).toHaveProperty('features')
      expect(config.export).toHaveProperty('codeStyle')
    })

    it('should include feature flags', () => {
      const template = getConfigTemplate()
      const config = JSON.parse(template)

      expect(config.export.features).toHaveProperty('animations')
      expect(config.export.features).toHaveProperty('cms')
      expect(config.export.features).toHaveProperty('responsive')
      expect(config.export.features).toHaveProperty('darkMode')
    })

    it('should include code style options', () => {
      const template = getConfigTemplate()
      const config = JSON.parse(template)

      expect(config.export.codeStyle).toHaveProperty('typescript')
      expect(config.export.codeStyle).toHaveProperty('semicolons')
      expect(config.export.codeStyle).toHaveProperty('singleQuote')
      expect(config.export.codeStyle).toHaveProperty('tabWidth')
    })

    it('should pre-populate project ID when provided', () => {
      const template = getConfigTemplate('my-test-project')
      const config = JSON.parse(template)

      expect(config.project).toBe('my-test-project')
    })

    it('should use placeholder when no project ID provided', () => {
      const template = getConfigTemplate()
      const config = JSON.parse(template)

      expect(config.project).toBe('<your-framer-project-id>')
    })
  })

  describe('config file writing', () => {
    it('should write valid JSON to file', () => {
      const configPath = join(testDir, '.unframerc')
      const template = getConfigTemplate('test-project')

      writeFileSync(configPath, template, 'utf-8')

      expect(existsSync(configPath)).toBe(true)

      const content = readFileSync(configPath, 'utf-8')
      const config = JSON.parse(content)

      expect(config.project).toBe('test-project')
    })

    it('should be readable after writing', () => {
      const configPath = join(testDir, '.unframerc')
      const template = getConfigTemplate()

      writeFileSync(configPath, template, 'utf-8')
      const content = readFileSync(configPath, 'utf-8')

      expect(content).toBe(template)
    })
  })

  describe('MCP configuration', () => {
    it('should include MCP timeout', () => {
      const template = getConfigTemplate()
      const config = JSON.parse(template)

      expect(config.mcp.timeout).toBe(60000)
    })

    it('should include MCP retries', () => {
      const template = getConfigTemplate()
      const config = JSON.parse(template)

      expect(config.mcp.retries).toBe(3)
    })
  })
})
