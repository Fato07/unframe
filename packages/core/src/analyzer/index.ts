/**
 * Layout Analyzer Module
 * 
 * Provides intelligent layout analysis to determine when elements
 * truly need absolute positioning vs flex/grid/flow layouts.
 * 
 * @packageDocumentation
 */

export {
  // Main analysis function
  analyzeLayout,
  analyzeLayoutBatch,
  suggestParentLayout,
  
  // Detection utilities
  detectOverlap,
  findOverlappingPairs,
  isPinnedElement,
  getPinPosition,
  hasExplicitAbsolutePosition,
  
  // Bounding box utilities
  extractBoundingBox,
  createBoundingBox,
  
  // Types
  type LayoutType,
  type ParentLayoutType,
  type LayoutAnalysis,
  type BoundingBox,
  type LayoutAnalyzerOptions,
} from './layout-analyzer.js'
