/**
 * Export Command
 * 
 * Exports a Framer project to Next.js using the MCP client and core transformer.
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import ora, { type Ora } from 'ora'
import chalk from 'chalk'
import { createMCPClient, type MCPClient } from '@unframe/mcp-client'
import {
  parseProjectXml,
  createASTBuilder,
  scaffoldNextjsProject,
  type UnframeAST,
  type OutputFile,
} from '@unframe/core'
import { loadConfig, mergeConfig, type ResolvedConfig } from '../utils/config.js'
import { createLogger, type Logger } from '../utils/logger.js'

// ============================================
// Types
// ============================================

export interface ExportOptions {
  project?: string
  mcpUrl?: string
  output?: string
  config?: string
  verbose?: boolean
  quiet?: boolean
  dryRun?: boolean
}

interface ExportContext {
  config: ResolvedConfig
  logger: Logger
  spinner: Ora
  mcpClient: MCPClient | null
}

// ============================================
// Export Command Handler
// ============================================

export async function exportCommand(options: ExportOptions): Promise<void> {
  const logger = createLogger({
    verbose: options.verbose,
    quiet: options.quiet,
  })

  const spinner = ora({
    color: 'cyan',
    spinner: 'dots',
  })

  const ctx: ExportContext = {
    config: {} as ResolvedConfig,
    logger,
    spinner,
    mcpClient: null,
  }

  try {
    logger.banner()
    logger.header('Export Framer Project')
    logger.newline()

    // Step 1: Load configuration
    await loadConfiguration(ctx, options)

    // Step 2: Validate configuration
    validateConfig(ctx)

    // Step 3: Connect to MCP server
    await connectToMCP(ctx)

    // Step 4: Fetch project XML
    const projectXml = await fetchProject(ctx)

    // Step 5: Parse and transform
    const ast = await parseAndTransform(ctx, projectXml)

    // Step 6: Generate output files
    const files = await generateProject(ctx, ast)

    // Step 7: Write files (unless dry run)
    if (!options.dryRun) {
      await writeOutput(ctx, files)
    } else {
      logger.info('Dry run mode - no files written')
      logDryRunOutput(ctx, files)
    }

    // Success!
    logger.exportComplete(files.length, ctx.config.output || './out')

  } catch (error) {
    spinner.fail()
    
    if (error instanceof Error) {
      logger.errorWithDetails(
        'Export failed',
        error.message,
        getErrorHint(error)
      )
    } else {
      logger.error('Export failed with unknown error')
    }

    process.exit(1)

  } finally {
    // Cleanup
    if (ctx.mcpClient) {
      try {
        await ctx.mcpClient.disconnect()
      } catch {
        // Ignore disconnect errors
      }
    }
  }
}

// ============================================
// Export Steps
// ============================================

async function loadConfiguration(ctx: ExportContext, options: ExportOptions): Promise<void> {
  ctx.spinner.start('Loading configuration...')

  try {
    // Load from file
    const fileConfig = options.config
      ? await (await import('../utils/config.js')).loadConfigFromPath(options.config)
      : await loadConfig()

    // Merge with CLI options
    ctx.config = mergeConfig(fileConfig, {
      project: options.project,
      mcpUrl: options.mcpUrl,
      output: options.output,
      mcp: {
        debug: options.verbose,
      },
    })

    if (ctx.config.configPath) {
      ctx.spinner.succeed(`Configuration loaded from ${chalk.cyan(ctx.config.configPath)}`)
    } else {
      ctx.spinner.succeed('Using default configuration')
    }

    ctx.logger.debug('Resolved config:', ctx.config)

  } catch (error) {
    ctx.spinner.fail('Failed to load configuration')
    throw error
  }
}

function validateConfig(ctx: ExportContext): void {
  const { config, logger } = ctx

  // Check for project ID or MCP URL
  if (!config.project && !config.mcpUrl) {
    throw new Error(
      'No project specified. Use --project <id> or configure in .unframerc'
    )
  }

  // Validate output directory
  if (!config.output) {
    config.output = './out'
  }

  logger.debug('Configuration validated')
}

async function connectToMCP(ctx: ExportContext): Promise<void> {
  const { config, spinner, logger } = ctx

  spinner.start('Connecting to Framer MCP...')

  try {
    // Determine MCP URL
    let mcpUrl = config.mcpUrl

    if (!mcpUrl && config.project) {
      // Construct URL from project ID
      // This assumes Unframer MCP service format
      mcpUrl = `https://mcp.unframer.co/sse?id=${config.project}`
    }

    if (!mcpUrl) {
      throw new Error('Could not determine MCP URL')
    }

    logger.debug('MCP URL:', mcpUrl)

    // Create client
    ctx.mcpClient = createMCPClient({
      baseUrl: mcpUrl,
      timeout: config.mcp?.timeout || 60000,
      retries: config.mcp?.retries || 3,
      debug: config.mcp?.debug || false,
    })

    // Connect
    await ctx.mcpClient.connect()

    spinner.succeed('Connected to Framer MCP')

  } catch (error) {
    spinner.fail('Failed to connect to MCP server')
    throw error
  }
}

async function fetchProject(ctx: ExportContext): Promise<string> {
  const { mcpClient, spinner, logger } = ctx

  if (!mcpClient) {
    throw new Error('MCP client not initialized')
  }

  spinner.start('Fetching project XML...')

  try {
    const xml = await mcpClient.getProjectXml()

    spinner.succeed(`Project XML fetched (${formatSize(xml.length)})`)
    logger.debug('XML preview:', xml.substring(0, 500) + '...')

    return xml

  } catch (error) {
    spinner.fail('Failed to fetch project')
    throw error
  }
}

async function parseAndTransform(ctx: ExportContext, xml: string): Promise<UnframeAST> {
  const { spinner, logger } = ctx

  spinner.start('Parsing project structure...')

  try {
    // Parse XML to raw structure
    const parsed = parseProjectXml(xml)

    spinner.text = 'Building AST...'

    // Build AST
    const builder = createASTBuilder()
    const ast = builder.build(parsed)

    spinner.succeed(
      `Parsed: ${ast.pages.length} pages, ${ast.components.length} components`
    )

    logger.debug('AST metadata:', ast.metadata)

    return ast

  } catch (error) {
    spinner.fail('Failed to parse project')
    throw error
  }
}

async function generateProject(ctx: ExportContext, ast: UnframeAST): Promise<OutputFile[]> {
  const { config, spinner, logger } = ctx

  spinner.start('Generating Next.js project...')

  try {
    const result = scaffoldNextjsProject(ast, {
      outputDir: config.output,
      ...config.export,
    })

    spinner.succeed(`Generated ${result.files.length} files`)

    // Log file breakdown
    const fileTypes = result.files.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    logger.debug('File types:', fileTypes)

    return result.files

  } catch (error) {
    spinner.fail('Failed to generate project')
    throw error
  }
}

async function writeOutput(ctx: ExportContext, files: OutputFile[]): Promise<void> {
  const { config, spinner, logger } = ctx
  const outputDir = resolve(process.cwd(), config.output || './out')

  spinner.start(`Writing files to ${chalk.cyan(outputDir)}...`)

  try {
    // Create output directory
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // Write each file
    for (const file of files) {
      const filePath = join(outputDir, file.path)
      const fileDir = dirname(filePath)

      // Create parent directories
      if (!existsSync(fileDir)) {
        mkdirSync(fileDir, { recursive: true })
      }

      // Write file
      writeFileSync(filePath, file.content, 'utf-8')
      logger.debug(`Wrote: ${file.path}`)
    }

    spinner.succeed(`Wrote ${files.length} files to ${chalk.cyan(outputDir)}`)

    // Log created files
    logger.newline()
    for (const file of files) {
      logger.file('create', file.path)
    }

  } catch (error) {
    spinner.fail('Failed to write output files')
    throw error
  }
}

function logDryRunOutput(ctx: ExportContext, files: OutputFile[]): void {
  const { logger } = ctx

  logger.newline()
  console.log(chalk.gray('  Files that would be created:'))
  logger.newline()

  for (const file of files) {
    console.log(`    ${chalk.cyan(file.path)} ${chalk.gray(`(${formatSize(file.content.length)})`)}`)
  }

  logger.newline()
}

// ============================================
// Helpers
// ============================================

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getErrorHint(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('connect') || message.includes('network')) {
    return 'Check your internet connection and ensure the Framer MCP server is accessible'
  }

  if (message.includes('timeout')) {
    return 'The MCP server took too long to respond. Try increasing the timeout in your config'
  }

  if (message.includes('project') || message.includes('not found')) {
    return 'Verify your project ID is correct and you have access to this project'
  }

  if (message.includes('parse') || message.includes('xml')) {
    return 'The project XML may be corrupted or in an unexpected format'
  }

  if (message.includes('permission') || message.includes('eacces')) {
    return 'Check that you have write permissions to the output directory'
  }

  return 'Check the error message above for details'
}
