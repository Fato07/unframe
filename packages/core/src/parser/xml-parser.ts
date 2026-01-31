/**
 * XML Parser for Framer Project Structure
 *
 * Parses the XML returned by Framer MCP tools into typed structures.
 */

import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import type {
  FramerProject,
  FramerPage,
  FramerComponentDef,
  FramerCodeFile,
  FramerCodeOverride,
  FramerColorStyle,
  FramerTextStyle,
  FramerNode,
  FramerNodeType,
  FramerNodeAttributes,
} from '../types/framer.js'

// ============================================
// Parser Options
// ============================================

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
  // Keep comment nodes for processing hints
  commentPropName: '#comment',
  // Preserve attribute order
  preserveOrder: false,
  // Handle arrays properly
  isArray: (name: string, jpath: string) => {
    // These elements should always be arrays
    const arrayElements = [
      'Page', 'Component', 'CodeComponent', 'CodeOverride',
      'ColorStyle', 'TextStyle', 'Field'
    ]
    return arrayElements.includes(name)
  },
}

const parser = new XMLParser(parserOptions)

// ============================================
// Project XML Parser
// ============================================

interface RawProjectXML {
  Project: {
    Pages?: { Page?: RawPageDef[] }
    Components?: { Component?: RawComponentDef[] }
    CodeComponents?: { CodeComponent?: RawCodeFileDef[] }
    CodeOverrides?: { CodeOverride?: RawCodeOverrideDef[] }
    ColorStyles?: { ColorStyle?: RawColorStyleDef[] }
    TextStyles?: { TextStyle?: RawTextStyleDef[] }
  }
}

interface RawPageDef {
  nodeId: string
  path: string
}

interface RawComponentDef {
  nodeId: string
  name: string
}

interface RawCodeFileDef {
  codeFileId: string
  path: string
}

interface RawCodeOverrideDef {
  codeFileId: string
  path: string
}

interface RawColorStyleDef {
  path: string
  light: string
  dark?: string
}

interface RawTextStyleDef {
  path: string
  font: string
  fontSize: string
  lineHeight: string
  letterSpacing: string
  paragraphSpacing: string
  transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  alignment: 'left' | 'center' | 'right' | 'justify'
  decoration: 'none' | 'underline' | 'line-through'
  balance: string | boolean
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
}

/**
 * Parse project structure XML into typed FramerProject
 */
export function parseProjectXml(xml: string): FramerProject {
  // Extract just the XML portion (skip the instruction text)
  const xmlStart = xml.indexOf('<Project>')
  if (xmlStart === -1) {
    throw new Error('Invalid project XML: no <Project> element found')
  }

  const xmlEnd = xml.indexOf('</Project>')
  if (xmlEnd === -1) {
    throw new Error('Invalid project XML: no closing </Project> element found')
  }

  const cleanXml = xml.slice(xmlStart, xmlEnd + '</Project>'.length)
  const parsed = parser.parse(cleanXml) as RawProjectXML

  if (!parsed.Project) {
    throw new Error('Invalid project XML: missing Project root')
  }

  const project = parsed.Project

  return {
    pages: normalizeArray(project.Pages?.Page).map(parsePageDef),
    components: normalizeArray(project.Components?.Component).map(parseComponentDef),
    codeFiles: normalizeArray(project.CodeComponents?.CodeComponent).map(parseCodeFileDef),
    codeOverrides: normalizeArray(project.CodeOverrides?.CodeOverride).map(parseCodeOverrideDef),
    colorStyles: normalizeArray(project.ColorStyles?.ColorStyle).map(parseColorStyleDef),
    textStyles: normalizeArray(project.TextStyles?.TextStyle).map(parseTextStyleDef),
  }
}

function normalizeArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function parsePageDef(raw: RawPageDef): FramerPage {
  return {
    nodeId: raw.nodeId,
    path: raw.path,
  }
}

function parseComponentDef(raw: RawComponentDef): FramerComponentDef {
  return {
    nodeId: raw.nodeId,
    name: raw.name,
  }
}

function parseCodeFileDef(raw: RawCodeFileDef): FramerCodeFile {
  return {
    codeFileId: raw.codeFileId,
    path: raw.path,
  }
}

function parseCodeOverrideDef(raw: RawCodeOverrideDef): FramerCodeOverride {
  return {
    codeFileId: raw.codeFileId,
    path: raw.path,
  }
}

function parseColorStyleDef(raw: RawColorStyleDef): FramerColorStyle {
  return {
    path: raw.path,
    light: raw.light,
    dark: raw.dark || undefined,
  }
}

function parseTextStyleDef(raw: RawTextStyleDef): FramerTextStyle {
  return {
    path: raw.path,
    font: raw.font,
    fontSize: raw.fontSize,
    lineHeight: raw.lineHeight,
    letterSpacing: raw.letterSpacing,
    paragraphSpacing: raw.paragraphSpacing,
    transform: raw.transform,
    alignment: raw.alignment,
    decoration: raw.decoration,
    balance: raw.balance === 'true' || raw.balance === true,
    tag: raw.tag,
  }
}

// ============================================
// Node XML Parser
// ============================================

/**
 * Parse node XML into typed FramerNode tree
 */
export function parseNodeXml(xml: string): FramerNode {
  // Find the first element tag (skip any header text)
  const tagMatch = xml.match(/<(\w+)\s/)
  if (!tagMatch) {
    throw new Error('Invalid node XML: no element found')
  }

  const rootTag = tagMatch[1]
  const xmlStart = xml.indexOf(`<${rootTag}`)
  
  // Find the closing tag
  const xmlEnd = xml.lastIndexOf(`</${rootTag}>`)
  if (xmlEnd === -1) {
    throw new Error(`Invalid node XML: no closing </${rootTag}> element found`)
  }

  const cleanXml = xml.slice(xmlStart, xmlEnd + `</${rootTag}>`.length)
  
  // Clean up XML comments before parsing (they have attribute hints)
  const xmlWithoutComments = cleanXml.replace(/<!--[^>]*-->/g, '')
  
  const parsed = parser.parse(xmlWithoutComments)
  const rootKey = Object.keys(parsed)[0]
  const rootData = parsed[rootKey]

  return parseNodeElement(rootKey, rootData)
}

function parseNodeElement(tagName: string, data: unknown): FramerNode {
  if (typeof data === 'string') {
    // Text node
    return {
      nodeId: '',
      type: 'Text',
      name: tagName,
      attributes: {},
      children: [],
      textContent: data,
    } as FramerNode & { textContent: string }
  }

  if (typeof data !== 'object' || data === null) {
    throw new Error(`Invalid node data for ${tagName}`)
  }

  const rawData = data as Record<string, unknown>

  // Extract attributes (primitives) and children (objects/arrays)
  const attributes = extractAttributes(rawData)
  const nodeId = (rawData.nodeId as string) || ''
  const nodeType = inferNodeType(tagName, rawData)
  
  // Extract children - only process objects/arrays as child elements
  const children: FramerNode[] = []
  const textContent = rawData['#text'] as string | undefined

  for (const [key, value] of Object.entries(rawData)) {
    // Skip special keys
    if (key === '#text' || key === '#comment') {
      continue
    }

    // Child elements are objects or arrays
    // Attributes are primitives (already extracted above)
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        for (const item of value) {
          children.push(parseNodeElement(key, item))
        }
      } else {
        children.push(parseNodeElement(key, value))
      }
    }
  }

  const node: FramerNode = {
    nodeId,
    type: nodeType,
    name: tagName,
    attributes,
    children,
  }

  // Add text content if present
  if (textContent) {
    (node as FramerNode & { textContent: string }).textContent = textContent
  }

  return node
}

function extractAttributes(data: Record<string, unknown>): FramerNodeAttributes {
  const attrs: FramerNodeAttributes = {}
  
  for (const [key, value] of Object.entries(data)) {
    // Skip special keys
    if (key === '#text' || key === '#comment') continue
    
    // Only extract primitive values as attributes
    // Objects and arrays are child elements, not attributes
    if (value === null || value === undefined) continue
    if (typeof value === 'object') continue
    
    // Handle boolean strings
    if (value === 'true') {
      attrs[key] = true
    } else if (value === 'false') {
      attrs[key] = false
    } else {
      attrs[key] = value
    }
  }

  return attrs
}

function inferNodeType(tagName: string, data: Record<string, unknown>): FramerNodeType {
  // Check for specific types
  if (tagName === 'Desktop' || tagName === 'Tablet' || tagName === 'Mobile') {
    return tagName as FramerNodeType
  }

  if (tagName === 'Page') {
    return 'Page'
  }

  // Component instances have componentId
  if (data.componentId) {
    return 'ComponentInstance'
  }

  // Text nodes have inlineTextStyle or just text content
  if (data.inlineTextStyle || data.font) {
    return 'Text'
  }

  // SVG nodes
  if (data.svg) {
    return 'SVG'
  }

  // Image nodes
  if (data.backgroundImage && !data.children && !hasChildElements(data)) {
    return 'Image'
  }

  // Stack nodes (has layout="stack")
  if (data.layout === 'stack') {
    return 'Stack'
  }

  // Default to Frame
  return 'Frame'
}

function hasChildElements(data: Record<string, unknown>): boolean {
  for (const key of Object.keys(data)) {
    if (key[0] >= 'A' && key[0] <= 'Z') {
      return true
    }
  }
  return false
}

// ============================================
// Utility Functions
// ============================================

/**
 * Extract the focused node ID from project XML response
 */
export function extractFocusedNodeId(response: string): string | null {
  const match = response.match(/focused page ID is: `([^`]+)`/)
  return match ? match[1] : null
}

/**
 * Parse a color value (could be raw color or style path)
 */
export interface ParsedColor {
  type: 'raw' | 'style'
  value: string
}

export function parseColorValue(value: string): ParsedColor {
  if (value.startsWith('/')) {
    return { type: 'style', value }
  }
  return { type: 'raw', value }
}

/**
 * Parse a font value (GF; or FS; prefix)
 */
export interface ParsedFont {
  source: 'google' | 'framer' | 'custom'
  family: string
  weight?: string
}

export function parseFontValue(value: string): ParsedFont {
  if (value.startsWith('GF;')) {
    const [family, weight] = value.slice(3).split('-')
    return { source: 'google', family, weight }
  }
  if (value.startsWith('FS;')) {
    const [family, weight] = value.slice(3).split('-')
    return { source: 'framer', family, weight }
  }
  return { source: 'custom', family: value }
}
