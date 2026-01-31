/**
 * @unframe/mcp-client
 *
 * MCP client for interacting with Framer projects via MCP protocol.
 *
 * @example
 * ```typescript
 * import { createMCPClient } from '@unframe/mcp-client'
 *
 * const client = createMCPClient({
 *   baseUrl: 'https://mcp.unframer.co/sse?id=...',
 *   timeout: 60000,
 *   retries: 3,
 * })
 *
 * // Get project structure
 * const projectXml = await client.getProjectXml()
 *
 * // Get specific page/component
 * const nodeXml = await client.getNodeXml('augiA20Il')
 *
 * // Get CMS collections
 * const collections = await client.getCMSCollections()
 *
 * // Get CMS items
 * const articles = await client.getCMSItems('cQn535Ezv')
 *
 * // Don't forget to disconnect
 * await client.disconnect()
 * ```
 */

export { MCPClient, createMCPClient, createMCPClientFromConfig } from './client.js'

export type {
  MCPClientConfig,
  MCPToolCallOptions,
  MCPToolResult,
  ProjectXMLResponse,
  NodeXMLResponse,
  CMSCollectionsResponse,
  CMSCollection,
  CMSField,
  CMSFieldType,
  CMSItemsResponse,
  CMSItem,
  CMSFieldValue,
} from './types.js'

export {
  MCPClientError,
  MCPTimeoutError,
  MCPConnectionError,
  MCPToolError,
} from './types.js'
