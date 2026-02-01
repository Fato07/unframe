/**
 * @unframe/core
 * 
 * Core parsing and transformation logic for Framer exports.
 * 
 * @packageDocumentation
 */

// Types
export * from './types/index.js'

// Parser
export * from './parser/index.js'

// Transformer
export * from './transformer/index.js'

// Generator
export * from './generator/index.js'

// High-level conversion API
export {
  convert,
  convertNode,
  convertComponent,
  type ConvertOptions,
  type ConvertedProject,
  type GeneratedPageOutput,
  type GeneratedComponentOutput,
} from './convert.js'

// Version
export const VERSION = '0.0.1'
