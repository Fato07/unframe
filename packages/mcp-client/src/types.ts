/**
 * MCP Client Types
 *
 * Types for interacting with Framer via MCP protocol
 */

// ============================================
// Configuration
// ============================================

export interface MCPClientConfig {
  /** MCP SSE endpoint URL (from Framer plugin) */
  baseUrl: string
  /** Request timeout in milliseconds (default: 60000) */
  timeout?: number
  /** Number of retry attempts on failure (default: 3) */
  retries?: number
  /** Delay between retries in milliseconds (default: 1000) */
  retryDelay?: number
  /** Enable debug logging */
  debug?: boolean
}

export interface MCPToolCallOptions {
  /** Override timeout for this specific call */
  timeout?: number
  /** Override retries for this specific call */
  retries?: number
}

// ============================================
// MCP Response Types
// ============================================

export interface MCPToolResult {
  content: Array<{
    type: 'text'
    text: string
  }>
  isError?: boolean
}

// ============================================
// Framer API Response Types
// ============================================

export interface ProjectXMLResponse {
  /** Full XML string of project structure */
  xml: string
  /** Currently focused page/component ID */
  focusedNodeId?: string
}

export interface NodeXMLResponse {
  /** XML string of the node and its children */
  xml: string
  /** Node ID that was requested */
  nodeId: string
}

export interface CMSCollectionsResponse {
  message: string
  collections: CMSCollection[]
}

export interface CMSCollection {
  id: string
  name: string
  managedBy: 'user' | 'plugin'
  readonly: boolean
  fields: CMSField[]
}

export interface CMSField {
  id: string
  name: string
  type: CMSFieldType
  comment?: string
  required: boolean
  collectionId?: string // For reference fields
}

export type CMSFieldType =
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
  | 'multiCollectionReference'

export interface CMSItemsResponse {
  message: string
  items: CMSItem[]
  total: number
  hasMore: boolean
}

export interface CMSItem {
  id: string
  slug: string
  draft: boolean
  fieldData: Record<string, CMSFieldValue>
}

export interface CMSFieldValue {
  type: CMSFieldType
  value: unknown
}

// ============================================
// Error Types
// ============================================

export class MCPClientError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'MCPClientError'
  }
}

export class MCPTimeoutError extends MCPClientError {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`, 'TIMEOUT')
    this.name = 'MCPTimeoutError'
  }
}

export class MCPConnectionError extends MCPClientError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONNECTION_ERROR', details)
    this.name = 'MCPConnectionError'
  }
}

export class MCPToolError extends MCPClientError {
  constructor(toolName: string, message: string, details?: unknown) {
    super(`Tool '${toolName}' failed: ${message}`, 'TOOL_ERROR', details)
    this.name = 'MCPToolError'
  }
}
