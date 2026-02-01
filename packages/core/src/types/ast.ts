/**
 * Unframe AST Types
 * 
 * Internal representation of a parsed Framer project,
 * ready for transformation to React code.
 */

// ============================================
// Project AST
// ============================================

export interface UnframeAST {
  type: 'Project';
  metadata: ProjectMetadata;
  pages: PageAST[];
  components: ComponentAST[];
  styles: StylesAST;
  content: ContentAST[];
  assets: AssetAST[];
}

export interface ProjectMetadata {
  name: string;
  productionUrl?: string;
  stagingUrl?: string;
  exportedAt: string;
}

// ============================================
// Pages
// ============================================

export interface PageAST {
  id: string;
  path: string;
  name: string;
  breakpoints: {
    desktop: ElementAST;
    tablet?: ElementAST;
    mobile?: ElementAST;
  };
  seo?: PageSEO;
  cmsCollection?: string; // For dynamic routes like /blog/:slug
}

export interface PageSEO {
  title?: string;
  description?: string;
  ogImage?: string;
}

// ============================================
// Components
// ============================================

export interface ComponentAST {
  id: string;
  name: string;
  originalName: string;
  props: PropDefinition[];
  variants: VariantAST[];
  defaultVariant: string;
  element: ElementAST;
}

export interface PropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'node';
  defaultValue?: unknown;
  enumValues?: string[];
  description?: string;
}

export interface VariantAST {
  id: string;
  name: string;
  element: ElementAST;
}

// ============================================
// Elements (JSX-ready nodes)
// ============================================

export type ElementType = 
  | 'div'
  | 'span'
  | 'p'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'a'
  | 'img'
  | 'svg'
  | 'button'
  | 'component'
  | 'slot';

export interface ElementAST {
  id: string;
  type: ElementType;
  name: string;
  props: Record<string, unknown>;
  styles: StyleRule[];
  responsiveStyles?: {
    tablet?: StyleRule[];
    mobile?: StyleRule[];
  };
  children: (ElementAST | TextAST)[];
  
  // For component instances
  componentRef?: string;
  componentProps?: Record<string, unknown>;
  
  // For animations
  animation?: AnimationAST;
  
  // For interactions
  interactions?: InteractionAST[];
  
  // Parent layout context - used to determine if absolute positioning should be skipped
  // Children of stack/grid containers should NOT have absolute positioning
  parentLayout?: 'stack' | 'grid' | 'none' | 'page-root';
}

export interface TextAST {
  type: 'text';
  content: string;
  styles?: StyleRule[];
}

// ============================================
// Styles
// ============================================

export interface StylesAST {
  colors: ColorStyleAST[];
  typography: TypographyStyleAST[];
  global: StyleRule[];
}

export interface ColorStyleAST {
  name: string;
  path: string;
  light: string;
  dark?: string;
  cssVariable: string;
}

export interface TypographyStyleAST {
  name: string;
  path: string;
  styles: StyleRule[];
  tag: string;
  cssClass: string;
}

export interface StyleRule {
  property: string;
  value: string;
  responsive?: 'desktop' | 'tablet' | 'mobile';
}

// ============================================
// Animations
// ============================================

export interface AnimationAST {
  type: 'entrance' | 'scroll' | 'hover' | 'tap' | 'loop';
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: TransitionAST;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  whileInView?: Record<string, unknown>;
}

export interface TransitionAST {
  duration?: number;
  delay?: number;
  ease?: string | number[];
  type?: 'tween' | 'spring' | 'inertia';
  stiffness?: number;
  damping?: number;
}

// ============================================
// Interactions
// ============================================

export interface InteractionAST {
  trigger: 'click' | 'hover' | 'tap' | 'scroll';
  action: 'navigate' | 'openUrl' | 'scrollTo' | 'toggleVariant';
  target?: string;
  url?: string;
  variant?: string;
}

// ============================================
// Content (CMS)
// ============================================

export interface ContentAST {
  collection: string;
  slug: string;
  fields: Record<string, ContentFieldAST>;
}

export interface ContentFieldAST {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'image' | 'richText' | 'reference';
  value: unknown;
}

// ============================================
// Assets
// ============================================

export interface AssetAST {
  id: string;
  url: string;
  localPath: string;
  type: 'image' | 'video' | 'font' | 'svg';
  width?: number;
  height?: number;
}
