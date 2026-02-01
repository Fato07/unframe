/**
 * MCP Client Tests
 * 
 * Placeholder test to prevent vitest from exiting with code 1.
 * TODO: Add actual tests when the client is used in integration.
 */

import { describe, it, expect } from 'vitest'

describe('MCP Client', () => {
  it('should be importable', async () => {
    // Dynamic import to test the module
    const module = await import('../src/index.js')
    expect(module.MCPClient).toBeDefined()
    expect(module.MCPClientError).toBeDefined()
    expect(module.createMCPClient).toBeDefined()
  })

  it('should export correct types', async () => {
    const module = await import('../src/index.js')
    expect(typeof module.MCPClient).toBe('function')
    expect(typeof module.createMCPClient).toBe('function')
  })
})
