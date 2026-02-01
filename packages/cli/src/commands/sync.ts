/**
 * Sync command - Downloads Framer components using Unframer
 * 
 * This is a convenience wrapper around the Unframer CLI that adds:
 * - Better progress feedback
 * - Integration with Unframe runtime
 * - TypeScript improvements
 */

import { Command } from 'commander'
import { spawn } from 'child_process'
import ora from 'ora'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

interface SyncOptions {
  outDir: string
  watch: boolean
  verbose: boolean
  jsx: boolean
}

export function createSyncCommand(): Command {
  const command = new Command('sync')
    .description('Sync Framer components to your project (powered by Unframer)')
    .argument('<projectId>', 'Framer project ID (from unframer.co after plugin export)')
    .option('-o, --outDir <dir>', 'Output directory', './framer')
    .option('-w, --watch', 'Watch for changes', false)
    .option('-v, --verbose', 'Verbose output', false)
    .option('--jsx', 'Output JSX code instead of minified JS', true)
    .addHelpText('after', `
Prerequisites:
  1. Install the React Export plugin in Framer:
     https://www.framer.com/marketplace/plugins/react-export/

  2. Open the plugin in Framer and select components to export
     This registers your components with Unframer's service

  3. Get your project ID from the plugin (shown after export)

Examples:
  $ unframe sync abc123def456           Sync to ./framer
  $ unframe sync abc123 -o ./components Sync to custom directory
  $ unframe sync abc123 --watch         Watch for changes

Note: The sync command uses Unframer under the hood. 
For advanced options, you can also use: npx unframer <projectId>
`)
    .action(async (projectId: string, options: SyncOptions) => {
      const spinner = ora('Syncing Framer components...').start()
      
      try {
        // Ensure output directory exists
        if (!existsSync(options.outDir)) {
          mkdirSync(options.outDir, { recursive: true })
        }
        
        spinner.text = 'Downloading components via Unframer...'
        
        // Build unframer command args
        const args = [projectId, '--outDir', options.outDir]
        if (options.jsx) args.push('--jsx')
        if (options.watch) args.push('--watch')
        if (options.verbose) args.push('--debug')
        
        // Run unframer CLI
        const unframer = spawn('npx', ['unframer', ...args], {
          stdio: options.verbose ? 'inherit' : 'pipe',
          shell: true,
        })
        
        let output = ''
        
        if (!options.verbose && unframer.stdout) {
          unframer.stdout.on('data', (data) => {
            output += data.toString()
            // Update spinner with progress
            const lines = output.split('\n')
            const lastLine = lines.filter(l => l.trim()).pop()
            if (lastLine) {
              spinner.text = lastLine.substring(0, 60) + (lastLine.length > 60 ? '...' : '')
            }
          })
        }
        
        if (unframer.stderr) {
          unframer.stderr.on('data', (data) => {
            if (options.verbose) {
              console.error(data.toString())
            }
          })
        }
        
        // Wait for completion
        const exitCode = await new Promise<number>((resolve) => {
          unframer.on('close', resolve)
        })
        
        if (exitCode !== 0) {
          spinner.fail('Sync failed. Run with --verbose for details.')
          console.log(`
Troubleshooting:
  1. Make sure you've exported components using the Framer React Export plugin
  2. Verify the project ID is correct
  3. Check your internet connection
  
For more help, visit: https://github.com/remorses/unframer
`)
          process.exit(1)
        }
        
        // Write additional Unframe files
        const unframeIndexContent = `// Unframe wrapper - re-exports all Framer components
export * from './index.js'

// Usage with UnframeProvider:
// import { UnframeProvider } from '@unframe/runtime'
// import { MyComponent } from './framer'
// 
// <UnframeProvider>
//   <MyComponent />
// </UnframeProvider>
`
        writeFileSync(join(options.outDir, 'unframe.js'), unframeIndexContent)
        
        spinner.succeed(`Synced components to ${options.outDir}`)
        
        console.log(`
  ✅ Components synced successfully!

  Next steps:

    1. Import styles in your app:
       import '${options.outDir}/styles.css'

    2. Import components:
       import { YourComponent } from '${options.outDir}'

    3. (Optional) Use UnframeProvider for navigation/locale:
       import { UnframeProvider } from '@unframe/runtime'
       
       <UnframeProvider navigate={router.push}>
         <YourComponent />
       </UnframeProvider>

  For responsive variants:
       <YourComponent.Responsive
         variants={{
           lg: 'Desktop',
           md: 'Tablet',
           base: 'Mobile',
         }}
       />
`)
        
        if (options.watch) {
          spinner.start('Watching for changes... (Ctrl+C to stop)')
        }
        
      } catch (error) {
        spinner.fail(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        process.exit(1)
      }
    })
  
  return command
}
