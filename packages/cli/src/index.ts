#!/usr/bin/env node

/**
 * @unframe/cli
 * 
 * CLI tool for exporting Framer projects to production-ready Next.js code.
 * 
 * @example
 * ```bash
 * # Initialize configuration
 * npx unframe init
 * 
 * # Export a project
 * npx unframe export --project <id> --output ./my-app
 * 
 * # Use config file
 * npx unframe export --config ./unframe.config.json
 * ```
 */

import { Command } from 'commander'
import { initCommand } from './commands/init.js'
import { exportCommand } from './commands/export.js'

// ============================================
// CLI Setup
// ============================================

const program = new Command()

program
  .name('unframe')
  .description('Export Framer projects to production-ready Next.js code')
  .version('0.1.0')

// ============================================
// Init Command
// ============================================

program
  .command('init')
  .description('Create a .unframerc configuration file')
  .option('-p, --project <id>', 'Framer project ID to pre-configure')
  .option('-f, --force', 'Overwrite existing configuration', false)
  .option('-q, --quiet', 'Suppress output', false)
  .action(async (options) => {
    await initCommand(options)
  })

// ============================================
// Export Command
// ============================================

program
  .command('export')
  .description('Export a Framer project to Next.js')
  .option('-p, --project <id>', 'Framer project ID')
  .option('-u, --mcp-url <url>', 'MCP server URL (overrides project ID)')
  .option('-o, --output <dir>', 'Output directory', './out')
  .option('-c, --config <path>', 'Path to config file')
  .option('-v, --verbose', 'Enable verbose output', false)
  .option('-q, --quiet', 'Suppress non-essential output', false)
  .option('--dry-run', 'Preview what would be generated without writing files', false)
  .action(async (options) => {
    await exportCommand(options)
  })

// ============================================
// Parse Arguments
// ============================================

program.parse()

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
