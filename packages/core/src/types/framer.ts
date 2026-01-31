/**
 * Framer Project Types
 * 
 * These types represent the structure of a Framer project
 * as returned by the MCP API (getProjectXml, getNodeXml, etc.)
 */

// ============================================
// Project Structure
// ============================================

export interface FramerProject {
  pages: FramerPage[];
  components: FramerComponentDef[];
  codeFiles: FramerCodeFile[];
  codeOverrides: FramerCodeOverride[];
  colorStyles: FramerColorStyle[];
  textStyles: FramerTextStyle[];
}

export interface FramerPage {
  nodeId: string;
  path: string;
}

export interface FramerComponentDef {
  nodeId: string;
  name: string;
}

export interface FramerCodeFile {
  codeFileId: string;
  path: string;
}

export interface FramerCodeOverride {
  codeFileId: string;
  path: string;
}

// ============================================
// Styles
// ============================================

export interface FramerColorStyle {
  path: string;
  light: string;
  dark?: string;
}

export interface FramerTextStyle {
  path: string;
  font: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  paragraphSpacing: string;
  transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  alignment: 'left' | 'center' | 'right' | 'justify';
  decoration: 'none' | 'underline' | 'line-through';
  balance: boolean;
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

// ============================================
// Nodes (XML Elements)
// ============================================

export type FramerNodeType = 
  | 'Frame'
  | 'Text'
  | 'Image'
  | 'SVG'
  | 'ComponentInstance'
  | 'Stack'
  | 'Page'
  | 'Desktop'
  | 'Tablet'
  | 'Mobile';

export interface FramerNode {
  nodeId: string;
  type: FramerNodeType;
  name: string;
  attributes: FramerNodeAttributes;
  children: FramerNode[];
}

export interface FramerNodeAttributes {
  // Positioning
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  centerX?: string;
  centerY?: string;
  
  // Sizing
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  aspectRatio?: number;
  
  // Visual
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  rotation?: number;
  backgroundColor?: string;
  borderRadius?: string;
  backgroundImage?: string;
  
  // Layout
  layout?: 'stack' | 'grid';
  gap?: string;
  padding?: string;
  stackDirection?: 'horizontal' | 'vertical';
  stackDistribution?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  stackAlignment?: 'start' | 'center' | 'end';
  stackWrap?: boolean;
  
  // Grid
  gridColumns?: number | 'auto-fill';
  gridRows?: number;
  gridGap?: string;
  
  // Text
  font?: string;
  inlineTextStyle?: string;
  
  // Links
  link?: string;
  linkOpenInNewTab?: boolean;
  
  // Component Instance
  componentId?: string;
  variant?: string;
  
  // SVG
  svg?: string;
  
  // Custom props (component controls)
  [key: string]: unknown;
}

// ============================================
// CMS
// ============================================

export interface FramerCMSCollection {
  id: string;
  name: string;
  managedBy: 'user' | 'plugin';
  readonly: boolean;
  fields: FramerCMSField[];
}

export interface FramerCMSField {
  id: string;
  name: string;
  type: FramerCMSFieldType;
  required: boolean;
  comment?: string;
  collectionId?: string; // For reference fields
}

export type FramerCMSFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'date'
  | 'image'
  | 'link'
  | 'formattedText'
  | 'file'
  | 'enum'
  | 'collectionReference'
  | 'multiCollectionReference';

export interface FramerCMSItem {
  id: string;
  slug: string;
  draft: boolean;
  fieldData: Record<string, FramerCMSFieldValue>;
}

export interface FramerCMSFieldValue {
  type: FramerCMSFieldType;
  value: unknown;
}
