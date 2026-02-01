/**
 * Layout Analyzer
 * 
 * Analyzes Framer elements to determine the optimal CSS layout strategy.
 * This helps decide when to use absolute positioning vs flex/grid/flow layouts.
 * 
 * Key principle: Elements should only use absolute positioning when truly needed:
 * - Overlapping siblings intentionally
 * - Pinned to a corner/edge of the container
 * - Parent explicitly uses absolute positioning
 */

import type { ElementAST, StyleRule } from '../types/ast.js'

// ============================================
// Types
// ============================================

export type LayoutType = 'flex' | 'grid' | 'absolute' | 'flow'
export type ParentLayoutType = 'stack' | 'grid' | 'none'

export interface LayoutAnalysis {
  /** The recommended layout type for this element */
  layoutType: LayoutType
  /** Whether the element should use absolute positioning */
  shouldUseAbsolute: boolean
  /** Human-readable reason for the decision */
  reason?: string
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface LayoutAnalyzerOptions {
  /** Minimum overlap area (in pixels squared) to consider as intentional overlap */
  minOverlapArea?: number
  /** Whether to consider partial overlaps (edges touching) */
  includeEdgeOverlaps?: boolean
}

const DEFAULT_OPTIONS: Required<LayoutAnalyzerOptions> = {
  minOverlapArea: 1,
  includeEdgeOverlaps: false,
}

// ============================================
// Main Analysis Function
// ============================================

/**
 * Analyzes an element and determines the optimal layout strategy.
 * 
 * @param element - The element to analyze
 * @param siblings - Sibling elements (for overlap detection)
 * @param parentLayout - The parent's layout type ('stack', 'grid', or 'none')
 * @param options - Optional configuration
 * @returns Layout analysis result
 */
export function analyzeLayout(
  element: ElementAST,
  siblings: ElementAST[],
  parentLayout: ParentLayoutType,
  options: LayoutAnalyzerOptions = {}
): LayoutAnalysis {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Rule 1: Stack children should NEVER use absolute positioning
  // Stack containers manage their children's positions via flexbox
  if (parentLayout === 'stack') {
    return {
      layoutType: 'flex',
      shouldUseAbsolute: false,
      reason: 'Child of Stack container - position managed by flex layout',
    }
  }

  // Rule 2: Grid children should NEVER use absolute positioning
  // Grid containers manage their children's positions via CSS grid
  if (parentLayout === 'grid') {
    return {
      layoutType: 'grid',
      shouldUseAbsolute: false,
      reason: 'Child of Grid container - position managed by grid layout',
    }
  }

  // Rule 3: Check if element overlaps with siblings
  const elementBox = extractBoundingBox(element)
  if (elementBox && siblings.length > 0) {
    const siblingBoxes = siblings
      .map(s => extractBoundingBox(s))
      .filter((box): box is BoundingBox => box !== null)

    if (siblingBoxes.length > 0) {
      const allBoxes = [elementBox, ...siblingBoxes]
      if (detectOverlap(allBoxes, opts)) {
        return {
          layoutType: 'absolute',
          shouldUseAbsolute: true,
          reason: 'Element overlaps with siblings - requires absolute positioning',
        }
      }
    }
  }

  // Rule 4: Check if element is pinned to a corner/edge
  if (isPinnedElement(element)) {
    return {
      layoutType: 'absolute',
      shouldUseAbsolute: true,
      reason: 'Element is pinned to corner/edge - requires absolute positioning',
    }
  }

  // Rule 5: Check if element has explicit absolute/fixed positioning
  if (hasExplicitAbsolutePosition(element)) {
    return {
      layoutType: 'absolute',
      shouldUseAbsolute: true,
      reason: 'Element has explicit absolute/fixed position',
    }
  }

  // Default: Use normal document flow
  return {
    layoutType: 'flow',
    shouldUseAbsolute: false,
    reason: 'Normal document flow - no absolute positioning needed',
  }
}

// ============================================
// Overlap Detection
// ============================================

/**
 * Detects if any bounding boxes in the array overlap.
 * 
 * @param boxes - Array of bounding boxes to check
 * @param options - Optional configuration
 * @returns True if any two boxes overlap
 */
export function detectOverlap(
  boxes: BoundingBox[],
  options: LayoutAnalyzerOptions = {}
): boolean {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  if (boxes.length < 2) {
    return false
  }

  // Check each pair of boxes
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (boxesOverlap(boxes[i], boxes[j], opts)) {
        return true
      }
    }
  }

  return false
}

/**
 * Checks if two bounding boxes overlap.
 */
function boxesOverlap(
  a: BoundingBox,
  b: BoundingBox,
  options: Required<LayoutAnalyzerOptions>
): boolean {
  // Calculate overlap region
  const overlapLeft = Math.max(a.x, b.x)
  const overlapRight = Math.min(a.x + a.width, b.x + b.width)
  const overlapTop = Math.max(a.y, b.y)
  const overlapBottom = Math.min(a.y + a.height, b.y + b.height)

  if (options.includeEdgeOverlaps) {
    // Include edge touching as overlap (edges exactly touching counts)
    // Boxes touch if overlapLeft <= overlapRight AND overlapTop <= overlapBottom
    if (overlapLeft > overlapRight || overlapTop > overlapBottom) {
      return false
    }
    // When including edges, we just need them to touch (overlap area can be 0)
    return true
  } else {
    // Strict overlap (not just touching edges)
    if (overlapLeft >= overlapRight || overlapTop >= overlapBottom) {
      return false
    }
    // Calculate overlap area
    const overlapWidth = overlapRight - overlapLeft
    const overlapHeight = overlapBottom - overlapTop
    const overlapArea = overlapWidth * overlapHeight
    return overlapArea >= options.minOverlapArea
  }
}

/**
 * Finds all overlapping elements in a group.
 * Returns pairs of overlapping element indices.
 * 
 * @param boxes - Array of bounding boxes
 * @param options - Optional configuration
 * @returns Array of [index1, index2] pairs for overlapping elements
 */
export function findOverlappingPairs(
  boxes: BoundingBox[],
  options: LayoutAnalyzerOptions = {}
): [number, number][] {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const pairs: [number, number][] = []

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (boxesOverlap(boxes[i], boxes[j], opts)) {
        pairs.push([i, j])
      }
    }
  }

  return pairs
}

// ============================================
// Pin Detection
// ============================================

/**
 * Checks if an element is pinned to a corner or edge.
 * An element is considered "pinned" if it has position constraints
 * like top+right, bottom+left, etc.
 * 
 * @param element - The element to check
 * @returns True if the element is pinned
 */
export function isPinnedElement(element: ElementAST): boolean {
  const styles = element.styles || []
  
  // Get position-related styles
  const hasTop = hasStyleProperty(styles, 'top')
  const hasRight = hasStyleProperty(styles, 'right')
  const hasBottom = hasStyleProperty(styles, 'bottom')
  const hasLeft = hasStyleProperty(styles, 'left')

  // Element is pinned if it has corner constraints (two perpendicular edges)
  // Corner pinning patterns:
  // - top + right (top-right corner)
  // - top + left (top-left corner)
  // - bottom + right (bottom-right corner)
  // - bottom + left (bottom-left corner)
  const isPinnedToCorner = (hasTop && hasRight) ||
                           (hasTop && hasLeft) ||
                           (hasBottom && hasRight) ||
                           (hasBottom && hasLeft)

  // Also check for centerX/centerY constraints (Framer-specific)
  const hasCenterX = hasStyleProperty(styles, 'center-x') || 
                     hasStyleProperty(styles, 'centerX') ||
                     element.props?.centerX !== undefined
  const hasCenterY = hasStyleProperty(styles, 'center-y') || 
                     hasStyleProperty(styles, 'centerY') ||
                     element.props?.centerY !== undefined

  // Center constraints also indicate pinned positioning
  const hasCenterConstraint = hasCenterX || hasCenterY

  // Check for all-edge pinning (stretch to fill)
  const isStretchedHorizontal = hasLeft && hasRight
  const isStretchedVertical = hasTop && hasBottom

  return isPinnedToCorner || hasCenterConstraint || 
         (isStretchedHorizontal && !isStretchedVertical) ||
         (isStretchedVertical && !isStretchedHorizontal)
}

/**
 * Determines the pinned position of an element (for debugging/logging).
 * 
 * @param element - The element to analyze
 * @returns Description of the pin position, or null if not pinned
 */
export function getPinPosition(element: ElementAST): string | null {
  const styles = element.styles || []
  
  const hasTop = hasStyleProperty(styles, 'top')
  const hasRight = hasStyleProperty(styles, 'right')
  const hasBottom = hasStyleProperty(styles, 'bottom')
  const hasLeft = hasStyleProperty(styles, 'left')
  const hasCenterX = hasStyleProperty(styles, 'center-x') || 
                     hasStyleProperty(styles, 'centerX') ||
                     element.props?.centerX !== undefined
  const hasCenterY = hasStyleProperty(styles, 'center-y') || 
                     hasStyleProperty(styles, 'centerY') ||
                     element.props?.centerY !== undefined

  if (hasCenterX && hasCenterY) return 'center'
  if (hasCenterX && hasTop) return 'top-center'
  if (hasCenterX && hasBottom) return 'bottom-center'
  if (hasCenterY && hasLeft) return 'center-left'
  if (hasCenterY && hasRight) return 'center-right'
  if (hasTop && hasLeft) return 'top-left'
  if (hasTop && hasRight) return 'top-right'
  if (hasBottom && hasLeft) return 'bottom-left'
  if (hasBottom && hasRight) return 'bottom-right'
  if (hasLeft && hasRight) return 'stretch-horizontal'
  if (hasTop && hasBottom) return 'stretch-vertical'
  
  return null
}

// ============================================
// Explicit Position Detection
// ============================================

/**
 * Checks if an element has explicit absolute or fixed positioning.
 * 
 * @param element - The element to check
 * @returns True if element has position: absolute or position: fixed
 */
export function hasExplicitAbsolutePosition(element: ElementAST): boolean {
  const styles = element.styles || []
  
  const positionStyle = styles.find(s => 
    s.property === 'position' || 
    s.property === 'Position'
  )
  
  if (!positionStyle) {
    // Also check props
    const positionProp = element.props?.position
    if (typeof positionProp === 'string') {
      return positionProp === 'absolute' || positionProp === 'fixed'
    }
    return false
  }
  
  const value = positionStyle.value.toLowerCase()
  return value === 'absolute' || value === 'fixed'
}

// ============================================
// Bounding Box Extraction
// ============================================

/**
 * Extracts a bounding box from an element's styles/props.
 * 
 * @param element - The element to extract bounds from
 * @returns BoundingBox if positional data is available, null otherwise
 */
export function extractBoundingBox(element: ElementAST): BoundingBox | null {
  const styles = element.styles || []
  const props = element.props || {}

  // Try to get position from styles
  const left = parseNumericValue(
    getStyleValue(styles, 'left') || getStyleValue(styles, 'x') || props.left || props.x
  )
  const top = parseNumericValue(
    getStyleValue(styles, 'top') || getStyleValue(styles, 'y') || props.top || props.y
  )
  const width = parseNumericValue(
    getStyleValue(styles, 'width') || props.width
  )
  const height = parseNumericValue(
    getStyleValue(styles, 'height') || props.height
  )

  // Need at least width and height to form a bounding box
  if (width === null || height === null) {
    return null
  }

  return {
    x: left ?? 0,
    y: top ?? 0,
    width,
    height,
  }
}

/**
 * Creates a bounding box from explicit values.
 * Utility function for testing and external use.
 */
export function createBoundingBox(
  x: number,
  y: number,
  width: number,
  height: number
): BoundingBox {
  return { x, y, width, height }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Checks if a style property exists in the style array.
 */
function hasStyleProperty(styles: StyleRule[], property: string): boolean {
  return styles.some(s => 
    s.property.toLowerCase() === property.toLowerCase()
  )
}

/**
 * Gets the value of a style property.
 */
function getStyleValue(styles: StyleRule[], property: string): string | undefined {
  const style = styles.find(s => 
    s.property.toLowerCase() === property.toLowerCase()
  )
  return style?.value
}

/**
 * Parses a numeric value from a style string.
 * Handles px, %, em values - extracts the numeric portion.
 */
function parseNumericValue(value: unknown): number | null {
  if (typeof value === 'number') {
    return value
  }
  
  if (typeof value === 'string') {
    // Handle percentage and other non-numeric values
    if (value === 'auto' || value === 'fit-content' || value.includes('fr')) {
      return null
    }
    
    // Extract numeric portion
    const match = value.match(/^(-?\d+(?:\.\d+)?)/)
    if (match) {
      return parseFloat(match[1])
    }
  }
  
  return null
}

// ============================================
// Batch Analysis
// ============================================

/**
 * Analyzes a group of sibling elements and returns layout decisions for each.
 * 
 * @param elements - Array of sibling elements
 * @param parentLayout - The parent's layout type
 * @param options - Optional configuration
 * @returns Map of element ID to layout analysis
 */
export function analyzeLayoutBatch(
  elements: ElementAST[],
  parentLayout: ParentLayoutType,
  options: LayoutAnalyzerOptions = {}
): Map<string, LayoutAnalysis> {
  const results = new Map<string, LayoutAnalysis>()
  
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    const siblings = elements.filter((_, j) => j !== i)
    const analysis = analyzeLayout(element, siblings, parentLayout, options)
    results.set(element.id, analysis)
  }
  
  return results
}

/**
 * Determines the optimal parent layout type based on children analysis.
 * 
 * @param children - Child elements to analyze
 * @returns Recommended layout type for the container
 */
export function suggestParentLayout(children: ElementAST[]): LayoutType {
  if (children.length === 0) {
    return 'flow'
  }

  // Extract bounding boxes
  const boxes = children
    .map(c => extractBoundingBox(c))
    .filter((box): box is BoundingBox => box !== null)

  // If any children overlap, parent should allow absolute positioning
  if (boxes.length >= 2 && detectOverlap(boxes)) {
    return 'absolute'
  }

  // Check if children are arranged in a line (horizontal or vertical)
  if (boxes.length >= 2) {
    const isHorizontalLine = boxes.every((box, i) => {
      if (i === 0) return true
      const prev = boxes[i - 1]
      // Check if boxes are roughly horizontally aligned
      return Math.abs(box.y - prev.y) < Math.max(box.height, prev.height) * 0.5
    })

    const isVerticalLine = boxes.every((box, i) => {
      if (i === 0) return true
      const prev = boxes[i - 1]
      // Check if boxes are roughly vertically aligned
      return Math.abs(box.x - prev.x) < Math.max(box.width, prev.width) * 0.5
    })

    if (isHorizontalLine || isVerticalLine) {
      return 'flex'
    }
  }

  return 'flow'
}
