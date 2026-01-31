/**
 * Init Command
 * 
 * Creates a .unframerc configuration file in the current directory.
 */

import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import chalk from 'chalk'
import { getConfigTemplate } from '../utils/config.js'
import { createLogger } from '../utils/logger.js'

// ============================================
// Types
// ============================================

export interface InitOptions {
  project?: string
  force?: boolean
  quiet?: boolean
}

// ============================================
// Init Command Handler
// ============================================

export async function initCommand(options: InitOptions): Promise<void> {
  const logger = createLogger({ quiet: options.quiet })
  const configPath = resolve(process.cwd(), '.unframerc')

  logger.banner()
  logger.header('Initialize Unframe Configuration')

  // Check if config already exists
  if (existsSync(configPath) && !options.force) {
    logger.errorWithDetails(
      'Configuration file already exists',
      `File: ${configPath}`,
      'Use --force to overwrite the existing configuration'
    )
    process.exit(1)
  }

  // Generate config content
  const configContent = getConfigTemplate(options.project)

  try {
    // Write config file
    writeFileSync(configPath, configContent, 'utf-8')
    
    logger.newline()
    logger.success('Configuration file created!')
    logger.newline()
    logger.file('create', '.unframerc')
    logger.newline()

    // Show next steps
    console.log(chalk.gray('  Next steps:'))
    console.log()
    console.log(chalk.white('  1. Edit .unframerc and add your Framer project ID'))
    console.log(chalk.gray('     The project ID is the last part of your Framer URL:'))
    console.log(chalk.gray('     https://framer.com/projects/') + chalk.cyan('<project-id>'))
    console.log()
    console.log(chalk.white('  2. Run the export command:'))
    console.log(chalk.cyan('     npx unframe export'))
    console.log()

    if (options.project) {
      console.log(chalk.gray('  Project ID already set to: ') + chalk.cyan(options.project))
      console.log()
    }

  } catch (error) {
    logger.errorWithDetails(
      'Failed to create configuration file',
      error instanceof Error ? error.message : String(error),
      'Check that you have write permissions in this directory'
    )
    process.exit(1)
  }
}
