/**
 * Layout Analyzer Tests
 * 
 * Comprehensive tests for the layout analysis module that determines
 * when elements should use absolute positioning.
 */

import { describe, it, expect } from 'vitest'
import {
  analyzeLayout,
  analyzeLayoutBatch,
  detectOverlap,
  findOverlappingPairs,
  isPinnedElement,
  getPinPosition,
  hasExplicitAbsolutePosition,
  extractBoundingBox,
  createBoundingBox,
  suggestParentLayout,
  type BoundingBox,
} from '../src/analyzer/layout-analyzer'
import type { ElementAST, StyleRule } from '../src/types/ast'

// ============================================
// Test Helpers
// ============================================

function createMockElement(overrides: Partial<ElementAST> = {}): ElementAST {
  return {
    id: overrides.id || 'test-element',
    type: overrides.type || 'div',
    name: overrides.name || 'TestElement',
    props: overrides.props || {},
    styles: overrides.styles || [],
    children: overrides.children || [],
    ...overrides,
  }
}

function createStyleRule(property: string, value: string): StyleRule {
  return { property, value }
}

// ============================================
// analyzeLayout Tests
// ============================================

describe('analyzeLayout', () => {
  describe('Stack children (parentLayout: "stack")', () => {
    it('should NOT use absolute positioning for stack children', () => {
      const element = createMockElement({ id: 'stack-child' })
      const result = analyzeLayout(element, [], 'stack')
      
      expect(result.shouldUseAbsolute).toBe(false)
      expect(result.layoutType).toBe('flex')
      expect(result.reason).toContain('Stack')
    })

    it('should NOT use absolute even if child has position styles', () => {
      const element = createMockElement({
        id: 'stack-child-with-position',
        styles: [
          createStyleRule('position', 'absolute'),
          createStyleRule('top', '0'),
          createStyleRule('left', '0'),
        ],
      })
      const result = analyzeLayout(element, [], 'stack')
      
      expect(result.shouldUseAbsolute).toBe(false)
      expect(result.layoutType).toBe('flex')
    })

    it('should NOT use absolute even if stack children overlap', () => {
      const element1 = createMockElement({
        id: 'child1',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '100px'),
          createStyleRule('left', '0'),
          createStyleRule('top', '0'),
        ],
      })
      const element2 = createMockElement({
        id: 'child2',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '100px'),
          createStyleRule('left', '50px'),  // Overlaps!
          createStyleRule('top', '50px'),
        ],
      })
      
      const result = analyzeLayout(element1, [element2], 'stack')
      
      // Stack layout takes precedence
      expect(result.shouldUseAbsolute).toBe(false)
      expect(result.layoutType).toBe('flex')
    })
  })

  describe('Grid children (parentLayout: "grid")', () => {
    it('should NOT use absolute positioning for grid children', () => {
      const element = createMockElement({ id: 'grid-child' })
      const result = analyzeLayout(element, [], 'grid')
      
      expect(result.shouldUseAbsolute).toBe(false)
      expect(result.layoutType).toBe('grid')
      expect(result.reason).toContain('Grid')
    })

    it('should NOT use absolute even if child has position styles', () => {
      const element = createMockElement({
        id: 'grid-child-with-position',
        styles: [
          createStyleRule('position', 'absolute'),
          createStyleRule('top', '10px'),
          createStyleRule('right', '10px'),
        ],
      })
      const result = analyzeLayout(element, [], 'grid')
      
      expect(result.shouldUseAbsolute).toBe(false)
      expect(result.layoutType).toBe('grid')
    })
  })

  describe('Non-container children (parentLayout: "none")', () => {
    it('should use normal flow for simple elements', () => {
      const element = createMockElement({
        id: 'simple',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '50px'),
        ],
      })
      const result = analyzeLayout(element, [], 'none')
      
      expect(result.shouldUseAbsolute).toBe(false)
      expect(result.layoutType).toBe('flow')
    })

    it('should use absolute for overlapping elements', () => {
      const element1 = createMockElement({
        id: 'overlap1',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '100px'),
          createStyleRule('left', '0'),
          createStyleRule('top', '0'),
        ],
      })
      const element2 = createMockElement({
        id: 'overlap2',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '100px'),
          createStyleRule('left', '50px'),
          createStyleRule('top', '50px'),
        ],
      })
      
      const result = analyzeLayout(element1, [element2], 'none')
      
      expect(result.shouldUseAbsolute).toBe(true)
      expect(result.layoutType).toBe('absolute')
      expect(result.reason).toContain('overlaps')
    })

    it('should use absolute for pinned elements', () => {
      const element = createMockElement({
        id: 'pinned',
        styles: [
          createStyleRule('top', '0'),
          createStyleRule('right', '0'),
          createStyleRule('width', '40px'),
          createStyleRule('height', '40px'),
        ],
      })
      
      const result = analyzeLayout(element, [], 'none')
      
      expect(result.shouldUseAbsolute).toBe(true)
      expect(result.layoutType).toBe('absolute')
      expect(result.reason).toContain('pinned')
    })

    it('should use absolute for elements with explicit position: absolute', () => {
      const element = createMockElement({
        id: 'explicit-absolute',
        styles: [
          createStyleRule('position', 'absolute'),
          createStyleRule('width', '100px'),
          createStyleRule('height', '100px'),
        ],
      })
      
      const result = analyzeLayout(element, [], 'none')
      
      expect(result.shouldUseAbsolute).toBe(true)
      expect(result.layoutType).toBe('absolute')
    })

    it('should use absolute for elements with explicit position: fixed', () => {
      const element = createMockElement({
        id: 'explicit-fixed',
        styles: [
          createStyleRule('position', 'fixed'),
          createStyleRule('width', '100%'),
          createStyleRule('height', '60px'),
        ],
      })
      
      const result = analyzeLayout(element, [], 'none')
      
      expect(result.shouldUseAbsolute).toBe(true)
      expect(result.layoutType).toBe('absolute')
    })
  })
})

// ============================================
// detectOverlap Tests
// ============================================

describe('detectOverlap', () => {
  it('should return false for empty array', () => {
    expect(detectOverlap([])).toBe(false)
  })

  it('should return false for single box', () => {
    const box = createBoundingBox(0, 0, 100, 100)
    expect(detectOverlap([box])).toBe(false)
  })

  it('should detect overlapping boxes', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 100, 100),
      createBoundingBox(50, 50, 100, 100),  // Overlaps first box
    ]
    expect(detectOverlap(boxes)).toBe(true)
  })

  it('should return false for non-overlapping boxes', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 100, 100),
      createBoundingBox(200, 0, 100, 100),  // No overlap
    ]
    expect(detectOverlap(boxes)).toBe(false)
  })

  it('should return false for adjacent boxes (touching edges)', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 100, 100),
      createBoundingBox(100, 0, 100, 100),  // Adjacent, not overlapping
    ]
    expect(detectOverlap(boxes)).toBe(false)
  })

  it('should detect adjacent boxes as overlapping when includeEdgeOverlaps is true', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 100, 100),
      createBoundingBox(100, 0, 100, 100),  // Adjacent
    ]
    expect(detectOverlap(boxes, { includeEdgeOverlaps: true })).toBe(true)
  })

  it('should detect overlap among multiple boxes', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 50, 50),      // A
      createBoundingBox(100, 0, 50, 50),    // B (no overlap with A)
      createBoundingBox(25, 25, 50, 50),    // C (overlaps A!)
    ]
    expect(detectOverlap(boxes)).toBe(true)
  })

  it('should respect minOverlapArea option', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 100, 100),
      createBoundingBox(99, 0, 100, 100),  // Overlaps by only 1px width
    ]
    
    // With default minOverlapArea (1), should detect
    expect(detectOverlap(boxes)).toBe(true)
    
    // With higher threshold, should not detect
    expect(detectOverlap(boxes, { minOverlapArea: 500 })).toBe(false)
  })

  it('should handle partial vertical overlap', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 100, 100),
      createBoundingBox(50, 80, 100, 100),  // Overlaps bottom portion
    ]
    expect(detectOverlap(boxes)).toBe(true)
  })

  it('should handle complete containment', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 200, 200),    // Large outer box
      createBoundingBox(50, 50, 50, 50),    // Smaller box inside
    ]
    expect(detectOverlap(boxes)).toBe(true)
  })
})

// ============================================
// findOverlappingPairs Tests
// ============================================

describe('findOverlappingPairs', () => {
  it('should return empty array for non-overlapping boxes', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 50, 50),
      createBoundingBox(100, 0, 50, 50),
      createBoundingBox(200, 0, 50, 50),
    ]
    expect(findOverlappingPairs(boxes)).toEqual([])
  })

  it('should find single overlapping pair', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 100, 100),
      createBoundingBox(50, 50, 100, 100),
    ]
    expect(findOverlappingPairs(boxes)).toEqual([[0, 1]])
  })

  it('should find multiple overlapping pairs', () => {
    const boxes: BoundingBox[] = [
      createBoundingBox(0, 0, 100, 100),     // 0
      createBoundingBox(50, 0, 100, 100),    // 1 - overlaps 0
      createBoundingBox(100, 0, 100, 100),   // 2 - overlaps 1, not 0
    ]
    const pairs = findOverlappingPairs(boxes)
    expect(pairs).toContainEqual([0, 1])
    expect(pairs).toContainEqual([1, 2])
    expect(pairs).not.toContainEqual([0, 2])
  })
})

// ============================================
// isPinnedElement Tests
// ============================================

describe('isPinnedElement', () => {
  it('should return false for element with no position styles', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('width', '100px'),
        createStyleRule('height', '100px'),
      ],
    })
    expect(isPinnedElement(element)).toBe(false)
  })

  it('should detect top-right pinning', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('top', '0'),
        createStyleRule('right', '0'),
      ],
    })
    expect(isPinnedElement(element)).toBe(true)
  })

  it('should detect top-left pinning', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('top', '10px'),
        createStyleRule('left', '10px'),
      ],
    })
    expect(isPinnedElement(element)).toBe(true)
  })

  it('should detect bottom-right pinning', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('bottom', '20px'),
        createStyleRule('right', '20px'),
      ],
    })
    expect(isPinnedElement(element)).toBe(true)
  })

  it('should detect bottom-left pinning', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('bottom', '0'),
        createStyleRule('left', '0'),
      ],
    })
    expect(isPinnedElement(element)).toBe(true)
  })

  it('should detect centerX constraint from props', () => {
    const element = createMockElement({
      props: { centerX: '50%' },
      styles: [],
    })
    expect(isPinnedElement(element)).toBe(true)
  })

  it('should detect centerY constraint from props', () => {
    const element = createMockElement({
      props: { centerY: '50%' },
      styles: [],
    })
    expect(isPinnedElement(element)).toBe(true)
  })

  it('should NOT detect single edge as pinned', () => {
    const element = createMockElement({
      styles: [createStyleRule('top', '0')],
    })
    expect(isPinnedElement(element)).toBe(false)
  })

  it('should detect horizontal stretch (left+right)', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('left', '0'),
        createStyleRule('right', '0'),
      ],
    })
    expect(isPinnedElement(element)).toBe(true)
  })

  it('should detect vertical stretch (top+bottom)', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('top', '0'),
        createStyleRule('bottom', '0'),
      ],
    })
    expect(isPinnedElement(element)).toBe(true)
  })
})

// ============================================
// getPinPosition Tests
// ============================================

describe('getPinPosition', () => {
  it('should return null for non-pinned element', () => {
    const element = createMockElement({ styles: [] })
    expect(getPinPosition(element)).toBeNull()
  })

  it('should identify top-left position', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('top', '0'),
        createStyleRule('left', '0'),
      ],
    })
    expect(getPinPosition(element)).toBe('top-left')
  })

  it('should identify top-right position', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('top', '0'),
        createStyleRule('right', '0'),
      ],
    })
    expect(getPinPosition(element)).toBe('top-right')
  })

  it('should identify bottom-left position', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('bottom', '0'),
        createStyleRule('left', '0'),
      ],
    })
    expect(getPinPosition(element)).toBe('bottom-left')
  })

  it('should identify bottom-right position', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('bottom', '0'),
        createStyleRule('right', '0'),
      ],
    })
    expect(getPinPosition(element)).toBe('bottom-right')
  })

  it('should identify center position', () => {
    const element = createMockElement({
      props: { centerX: '50%', centerY: '50%' },
      styles: [],
    })
    expect(getPinPosition(element)).toBe('center')
  })

  it('should identify stretch-horizontal', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('left', '0'),
        createStyleRule('right', '0'),
      ],
    })
    expect(getPinPosition(element)).toBe('stretch-horizontal')
  })

  it('should identify stretch-vertical', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('top', '0'),
        createStyleRule('bottom', '0'),
      ],
    })
    expect(getPinPosition(element)).toBe('stretch-vertical')
  })
})

// ============================================
// hasExplicitAbsolutePosition Tests
// ============================================

describe('hasExplicitAbsolutePosition', () => {
  it('should return false for element without position style', () => {
    const element = createMockElement({ styles: [] })
    expect(hasExplicitAbsolutePosition(element)).toBe(false)
  })

  it('should return true for position: absolute', () => {
    const element = createMockElement({
      styles: [createStyleRule('position', 'absolute')],
    })
    expect(hasExplicitAbsolutePosition(element)).toBe(true)
  })

  it('should return true for position: fixed', () => {
    const element = createMockElement({
      styles: [createStyleRule('position', 'fixed')],
    })
    expect(hasExplicitAbsolutePosition(element)).toBe(true)
  })

  it('should return false for position: relative', () => {
    const element = createMockElement({
      styles: [createStyleRule('position', 'relative')],
    })
    expect(hasExplicitAbsolutePosition(element)).toBe(false)
  })

  it('should return false for position: static', () => {
    const element = createMockElement({
      styles: [createStyleRule('position', 'static')],
    })
    expect(hasExplicitAbsolutePosition(element)).toBe(false)
  })

  it('should detect position from props', () => {
    const element = createMockElement({
      props: { position: 'absolute' },
      styles: [],
    })
    expect(hasExplicitAbsolutePosition(element)).toBe(true)
  })

  it('should handle case-insensitive matching', () => {
    const element = createMockElement({
      styles: [createStyleRule('position', 'ABSOLUTE')],
    })
    expect(hasExplicitAbsolutePosition(element)).toBe(true)
  })
})

// ============================================
// extractBoundingBox Tests
// ============================================

describe('extractBoundingBox', () => {
  it('should return null for element without dimensions', () => {
    const element = createMockElement({ styles: [] })
    expect(extractBoundingBox(element)).toBeNull()
  })

  it('should extract bounding box from styles', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('left', '10px'),
        createStyleRule('top', '20px'),
        createStyleRule('width', '100px'),
        createStyleRule('height', '50px'),
      ],
    })
    const box = extractBoundingBox(element)
    expect(box).toEqual({ x: 10, y: 20, width: 100, height: 50 })
  })

  it('should extract bounding box from props', () => {
    const element = createMockElement({
      props: {
        x: 5,
        y: 15,
        width: 200,
        height: 100,
      },
      styles: [],
    })
    const box = extractBoundingBox(element)
    expect(box).toEqual({ x: 5, y: 15, width: 200, height: 100 })
  })

  it('should default position to 0 when not specified', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('width', '100px'),
        createStyleRule('height', '100px'),
      ],
    })
    const box = extractBoundingBox(element)
    expect(box).toEqual({ x: 0, y: 0, width: 100, height: 100 })
  })

  it('should return null for auto/fit-content dimensions', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('width', 'auto'),
        createStyleRule('height', '100px'),
      ],
    })
    expect(extractBoundingBox(element)).toBeNull()
  })

  it('should return null for fr units', () => {
    const element = createMockElement({
      styles: [
        createStyleRule('width', '1fr'),
        createStyleRule('height', '100px'),
      ],
    })
    expect(extractBoundingBox(element)).toBeNull()
  })
})

// ============================================
// analyzeLayoutBatch Tests
// ============================================

describe('analyzeLayoutBatch', () => {
  it('should analyze all elements in batch', () => {
    const elements = [
      createMockElement({ id: 'el1' }),
      createMockElement({ id: 'el2' }),
      createMockElement({ id: 'el3' }),
    ]
    
    const results = analyzeLayoutBatch(elements, 'stack')
    
    expect(results.size).toBe(3)
    expect(results.get('el1')?.shouldUseAbsolute).toBe(false)
    expect(results.get('el2')?.shouldUseAbsolute).toBe(false)
    expect(results.get('el3')?.shouldUseAbsolute).toBe(false)
  })

  it('should detect overlap across batch', () => {
    const elements = [
      createMockElement({
        id: 'el1',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '100px'),
          createStyleRule('left', '0'),
          createStyleRule('top', '0'),
        ],
      }),
      createMockElement({
        id: 'el2',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '100px'),
          createStyleRule('left', '50px'),
          createStyleRule('top', '50px'),
        ],
      }),
    ]
    
    const results = analyzeLayoutBatch(elements, 'none')
    
    // Both should be absolute due to overlap
    expect(results.get('el1')?.shouldUseAbsolute).toBe(true)
    expect(results.get('el2')?.shouldUseAbsolute).toBe(true)
  })
})

// ============================================
// suggestParentLayout Tests
// ============================================

describe('suggestParentLayout', () => {
  it('should return flow for empty children', () => {
    expect(suggestParentLayout([])).toBe('flow')
  })

  it('should return absolute for overlapping children', () => {
    const children = [
      createMockElement({
        id: 'child1',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '100px'),
          createStyleRule('left', '0'),
          createStyleRule('top', '0'),
        ],
      }),
      createMockElement({
        id: 'child2',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '100px'),
          createStyleRule('left', '50px'),
          createStyleRule('top', '50px'),
        ],
      }),
    ]
    
    expect(suggestParentLayout(children)).toBe('absolute')
  })

  it('should return flex for horizontally aligned children', () => {
    const children = [
      createMockElement({
        id: 'child1',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '50px'),
          createStyleRule('left', '0'),
          createStyleRule('top', '0'),
        ],
      }),
      createMockElement({
        id: 'child2',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '50px'),
          createStyleRule('left', '110px'),
          createStyleRule('top', '0'),
        ],
      }),
    ]
    
    expect(suggestParentLayout(children)).toBe('flex')
  })

  it('should return flex for vertically aligned children', () => {
    const children = [
      createMockElement({
        id: 'child1',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '50px'),
          createStyleRule('left', '0'),
          createStyleRule('top', '0'),
        ],
      }),
      createMockElement({
        id: 'child2',
        styles: [
          createStyleRule('width', '100px'),
          createStyleRule('height', '50px'),
          createStyleRule('left', '0'),
          createStyleRule('top', '60px'),
        ],
      }),
    ]
    
    expect(suggestParentLayout(children)).toBe('flex')
  })
})

// ============================================
// Integration / Real-world Scenarios
// ============================================

describe('Real-world scenarios', () => {
  it('Badge overlay on card (should use absolute)', () => {
    // A badge positioned in the corner of a card
    const card = createMockElement({
      id: 'card',
      styles: [
        createStyleRule('width', '300px'),
        createStyleRule('height', '200px'),
        createStyleRule('left', '0'),
        createStyleRule('top', '0'),
      ],
    })
    const badge = createMockElement({
      id: 'badge',
      styles: [
        createStyleRule('width', '40px'),
        createStyleRule('height', '20px'),
        createStyleRule('left', '270px'),  // Top-right of card
        createStyleRule('top', '10px'),
      ],
    })
    
    // Badge overlaps card area
    const result = analyzeLayout(badge, [card], 'none')
    expect(result.shouldUseAbsolute).toBe(true)
  })

  it('Close button in modal (pinned, should use absolute)', () => {
    const closeButton = createMockElement({
      id: 'close-btn',
      styles: [
        createStyleRule('top', '16px'),
        createStyleRule('right', '16px'),
        createStyleRule('width', '24px'),
        createStyleRule('height', '24px'),
      ],
    })
    
    const result = analyzeLayout(closeButton, [], 'none')
    expect(result.shouldUseAbsolute).toBe(true)
    expect(result.reason).toContain('pinned')
  })

  it('Navigation items in flex container (should NOT use absolute)', () => {
    const navItem = createMockElement({
      id: 'nav-item',
      styles: [
        createStyleRule('width', '100px'),
        createStyleRule('height', '40px'),
      ],
    })
    
    const result = analyzeLayout(navItem, [], 'stack')
    expect(result.shouldUseAbsolute).toBe(false)
    expect(result.layoutType).toBe('flex')
  })

  it('Gallery items in grid (should NOT use absolute)', () => {
    const gridItem = createMockElement({
      id: 'gallery-item',
      styles: [
        createStyleRule('width', '200px'),
        createStyleRule('height', '200px'),
      ],
    })
    
    const result = analyzeLayout(gridItem, [], 'grid')
    expect(result.shouldUseAbsolute).toBe(false)
    expect(result.layoutType).toBe('grid')
  })

  it('Hero section with floating CTA button', () => {
    // CTA button centered over hero image
    const heroImage = createMockElement({
      id: 'hero-image',
      styles: [
        createStyleRule('width', '100%'),
        createStyleRule('height', '600px'),
        createStyleRule('left', '0'),
        createStyleRule('top', '0'),
      ],
    })
    const ctaButton = createMockElement({
      id: 'cta-button',
      props: { centerX: '50%', centerY: '50%' },
      styles: [
        createStyleRule('width', '200px'),
        createStyleRule('height', '50px'),
      ],
    })
    
    const result = analyzeLayout(ctaButton, [heroImage], 'none')
    expect(result.shouldUseAbsolute).toBe(true)
    // Can be detected as pinned (due to centerX/Y) or overlapping (due to bounding boxes)
    // Both are valid reasons for absolute positioning
    expect(result.reason).toMatch(/pinned|overlaps/)
  })
})
