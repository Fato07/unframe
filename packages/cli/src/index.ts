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
import { createRequire } from 'node:module'
import { initCommand } from './commands/init.js'
import { exportCommand } from './commands/export.js'

// Load version from package.json
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

// ============================================
// CLI Setup
// ============================================

const program = new Command()

program
  .name('unframe')
  .description('Export Framer projects to production-ready Next.js code')
  .version(pkg.version)

// ============================================
// Init Command
// ============================================

program
  .command('init')
  .description('Create a .unframerc configuration file')
  .option('-p, --project <id>', 'Framer project ID to pre-configure')
  .option('-f, --force', 'Overwrite existing configuration', false)
  .option('-q, --quiet', 'Suppress output', false)
  .addHelpText('after', `
Examples:
  $ unframe init                    Create config interactively
  $ unframe init -p abc123          Create config with project ID
  $ unframe init --force            Overwrite existing config
`)
  .action(async (options) => {
    await initCommand(options)
  })

// ============================================
// Export Command
// ============================================

program
  .command('export')
  .description('Export a Framer project to Next.js')
  .option('-p, --project <id>', 'Framer project ID (from your Framer URL)')
  .option('-u, --mcp-url <url>', 'MCP server URL (advanced, overrides project)')
  .option('-o, --output <dir>', 'Output directory', './out')
  .option('-c, --config <path>', 'Path to config file')
  .option('-v, --verbose', 'Enable verbose logging', false)
  .option('-q, --quiet', 'Suppress non-essential output', false)
  .option('--dry-run', 'Preview generated files without writing', false)
  .addHelpText('after', `
Examples:
  $ unframe export -p abc123           Export project to ./out
  $ unframe export -p abc123 -o ./app  Export to custom directory
  $ unframe export --dry-run           Preview without writing files
  $ unframe export                     Use .unframerc config file

Project ID:
  Find your project ID in the Framer URL:
  https://framer.com/projects/<project-id>
`)
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
