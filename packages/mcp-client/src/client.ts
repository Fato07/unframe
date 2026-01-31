/**
 * MCP Client for Framer
 *
 * Wrapper for calling Framer MCP tools with retry logic and timeout handling.
 * Uses the StreamableHTTP transport from MCP SDK.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import {
  MCPClientConfig,
  MCPToolCallOptions,
  MCPToolResult,
  ProjectXMLResponse,
  NodeXMLResponse,
  CMSCollectionsResponse,
  CMSItemsResponse,
  CMSCollection,
  CMSItem,
  MCPClientError,
  MCPTimeoutError,
  MCPConnectionError,
  MCPToolError,
} from './types.js'

const DEFAULT_CONFIG: Required<Omit<MCPClientConfig, 'baseUrl'>> = {
  timeout: 60000,
  retries: 3,
  retryDelay: 1000,
  debug: false,
}

export class MCPClient {
  private config: Required<MCPClientConfig>
  private client: Client | null = null
  private transport: StreamableHTTPClientTransport | null = null
  private connected = false

  constructor(config: MCPClientConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[MCP Client]', ...args)
    }
  }

  /**
   * Connect to the MCP server
   */
  async connect(): Promise<void> {
    if (this.connected) {
      return
    }

    this.log('Connecting to', this.config.baseUrl)

    try {
      // Convert SSE URL to MCP endpoint
      const url = new URL(this.config.baseUrl)
      if (url.pathname.endsWith('/sse')) {
        url.pathname = url.pathname.replace(/\/sse$/, '/mcp')
      }

      this.transport = new StreamableHTTPClientTransport(url)
      this.client = new Client({
        name: 'unframe-mcp-client',
        version: '0.1.0',
      })

      await this.client.connect(this.transport)
      this.connected = true
      this.log('Connected successfully')
    } catch (error) {
      throw new MCPConnectionError(
        'Failed to connect to MCP server',
        error
      )
    }
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect(): Promise<void> {
    if (!this.connected) {
      return
    }

    this.log('Disconnecting')

    try {
      await this.client?.close()
    } catch {
      // Ignore disconnect errors
    }

    this.client = null
    this.transport = null
    this.connected = false
  }

  /**
   * Call an MCP tool with retry logic
   */
  private async callTool(
    toolName: string,
    args: Record<string, unknown> = {},
    options: MCPToolCallOptions = {}
  ): Promise<MCPToolResult> {
    if (!this.connected || !this.client) {
      await this.connect()
    }

    const timeout = options.timeout ?? this.config.timeout
    const retries = options.retries ?? this.config.retries
    const retryDelay = this.config.retryDelay

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        this.log(`Calling tool: ${toolName}`, args, `(attempt ${attempt + 1}/${retries + 1})`)

        const result = await Promise.race([
          this.client!.callTool({ name: toolName, arguments: args }),
          this.createTimeout(timeout),
        ])

        if (!result || typeof result !== 'object') {
          throw new MCPToolError(toolName, 'Invalid response from tool')
        }

        const toolResult = result as MCPToolResult

        if (toolResult.isError) {
          const errorText = toolResult.content?.[0]?.text ?? 'Unknown error'
          throw new MCPToolError(toolName, errorText)
        }

        this.log(`Tool ${toolName} succeeded`)
        return toolResult
      } catch (error) {
        lastError = error as Error

        if (error instanceof MCPTimeoutError) {
          this.log(`Tool ${toolName} timed out`)
        } else {
          this.log(`Tool ${toolName} failed:`, error)
        }

        // Reconnect on connection errors
        if (error instanceof MCPConnectionError || 
            (error instanceof Error && error.message.includes('connect'))) {
          this.connected = false
          await this.connect()
        }

        if (attempt < retries) {
          this.log(`Retrying in ${retryDelay}ms...`)
          await this.sleep(retryDelay)
        }
      }
    }

    throw lastError ?? new MCPToolError(toolName, 'Unknown error after retries')
  }

  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new MCPTimeoutError(ms)), ms)
    })
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Extract text content from MCP tool result
   */
  private extractText(result: MCPToolResult): string {
    const textContent = result.content?.find((c) => c.type === 'text')
    if (!textContent) {
      throw new MCPClientError('No text content in response', 'NO_CONTENT')
    }
    return textContent.text
  }

  // ============================================
  // Framer API Methods
  // ============================================

  /**
   * Get the full project XML structure
   */
  async getProjectXml(options?: MCPToolCallOptions): Promise<string> {
    const result = await this.callTool('getProjectXml', {}, options)
    return this.extractText(result)
  }

  /**
   * Get XML for a specific node (page or component)
   */
  async getNodeXml(
    nodeId: string,
    options?: MCPToolCallOptions
  ): Promise<string> {
    const result = await this.callTool('getNodeXml', { nodeId }, options)
    return this.extractText(result)
  }

  /**
   * Get all CMS collections and their field definitions
   */
  async getCMSCollections(
    options?: MCPToolCallOptions
  ): Promise<CMSCollection[]> {
    const result = await this.callTool('getCMSCollections', {}, options)
    const text = this.extractText(result)

    // Parse JSON from the response text
    // The response includes description text before the JSON
    const jsonMatch = text.match(/\{[\s\S]*"collections"[\s\S]*\}/)
    if (!jsonMatch) {
      throw new MCPClientError('Failed to parse CMS collections response', 'PARSE_ERROR')
    }

    const data = JSON.parse(jsonMatch[0]) as CMSCollectionsResponse
    return data.collections
  }

  /**
   * Get CMS items from a collection
   */
  async getCMSItems(
    collectionId: string,
    options?: MCPToolCallOptions & { limit?: number; offset?: number }
  ): Promise<CMSItem[]> {
    const { limit = 100, offset = 0, ...callOptions } = options ?? {}

    const result = await this.callTool(
      'getCMSItems',
      { collectionId, limit, offset },
      callOptions
    )
    const text = this.extractText(result)

    // Parse JSON from the response text
    const jsonMatch = text.match(/\{[\s\S]*"items"[\s\S]*\}/)
    if (!jsonMatch) {
      throw new MCPClientError('Failed to parse CMS items response', 'PARSE_ERROR')
    }

    const data = JSON.parse(jsonMatch[0]) as CMSItemsResponse
    return data.items
  }

  /**
   * Get all CMS items (handles pagination)
   */
  async getAllCMSItems(
    collectionId: string,
    options?: MCPToolCallOptions
  ): Promise<CMSItem[]> {
    const allItems: CMSItem[] = []
    let offset = 0
    const limit = 100

    while (true) {
      const items = await this.getCMSItems(collectionId, {
        ...options,
        limit,
        offset,
      })

      allItems.push(...items)

      if (items.length < limit) {
        break
      }

      offset += limit
    }

    return allItems
  }
}

/**
 * Create an MCP client from a configuration object
 */
export function createMCPClient(config: MCPClientConfig): MCPClient {
  return new MCPClient(config)
}

/**
 * Create an MCP client from a config file (mcporter.json format)
 */
export function createMCPClientFromConfig(
  config: { baseUrl: string; timeout?: number },
  options?: Partial<MCPClientConfig>
): MCPClient {
  return new MCPClient({
    baseUrl: config.baseUrl,
    timeout: config.timeout,
    ...options,
  })
}
