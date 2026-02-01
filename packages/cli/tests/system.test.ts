/**
 * System Utilities Tests
 * 
 * Tests for system checks and URL parsing.
 */

import { describe, it, expect } from 'vitest'
import { runSystemChecks, checkNodeVersion, checkNpm, parseFramerUrl } from '../src/utils/system.js'

describe('System Utilities', () => {
  describe('runSystemChecks', () => {
    it('should check node and npm', () => {
      const { checks, allPassed } = runSystemChecks()
      
      expect(checks).toHaveLength(2)
      expect(checks.find(c => c.name === 'node')).toBeDefined()
      expect(checks.find(c => c.name === 'npm')).toBeDefined()
      
      // In test environment, these should be available
      expect(allPassed).toBe(true)
    })
  })

  describe('checkNodeVersion', () => {
    it('should detect node is installed', () => {
      const check = checkNodeVersion()
      expect(check.ok).toBe(true)
      expect(check.version).toBeDefined()
    })

    it('should fail for unreasonably high version requirement', () => {
      const check = checkNodeVersion(999)
      expect(check.ok).toBe(false)
      expect(check.error).toContain('required')
    })
  })

  describe('checkNpm', () => {
    it('should detect npm is installed', () => {
      const check = checkNpm()
      expect(check.ok).toBe(true)
      expect(check.version).toBeDefined()
    })
  })

  describe('parseFramerUrl', () => {
    it('should accept a bare project ID', () => {
      const result = parseFramerUrl('abc123')
      expect(result.isValid).toBe(true)
      expect(result.projectId).toBe('abc123')
    })

    it('should accept a project ID with hyphens', () => {
      const result = parseFramerUrl('my-cool-project-123')
      expect(result.isValid).toBe(true)
      expect(result.projectId).toBe('my-cool-project-123')
    })

    it('should extract project ID from Framer URL', () => {
      const result = parseFramerUrl('https://framer.com/projects/abc123')
      expect(result.isValid).toBe(true)
      expect(result.projectId).toBe('abc123')
    })

    it('should extract project ID from Framer URL with trailing path', () => {
      const result = parseFramerUrl('https://framer.com/projects/my-project-xyz/edit')
      expect(result.isValid).toBe(true)
      expect(result.projectId).toBe('my-project-xyz')
    })

    it('should handle framer.app URLs', () => {
      const result = parseFramerUrl('https://my-project.framer.app/')
      expect(result.isValid).toBe(true)
      expect(result.projectId).toBe('my-project')
    })

    it('should reject non-Framer URLs', () => {
      const result = parseFramerUrl('https://example.com/projects/abc123')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Framer')
    })

    it('should reject invalid format', () => {
      const result = parseFramerUrl('not a url and has spaces')
      expect(result.isValid).toBe(false)
    })
  })
})
