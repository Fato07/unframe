/**
 * Sync command - Downloads Framer components using Unframer-style approach
 * 
 * This command fetches compiled Framer component bundles and makes them
 * available in your React project with full fidelity.
 */

import { Command } from 'commander'
import ora from 'ora'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

interface SyncOptions {
  outDir: string
  watch: boolean
  verbose: boolean
}

/**
 * Fetch component bundles from Framer
 */
async function fetchFramerComponents(projectId: string, mcpUrl?: string): Promise<Map<string, string>> {
  const components = new Map<string, string>()
  
  // If MCP URL provided, use it to get component list
  if (mcpUrl) {
    // TODO: Implement MCP-based component fetching
    // This will use the Framer MCP to get component data
    console.log('MCP-based sync not yet implemented. Use project ID with Framer plugin.')
  }
  
  // For now, we'll use the same approach as Unframer:
  // Components are pre-exported via the Framer React Export plugin
  // and we fetch them from the Unframer database
  
  const response = await fetch(`https://api.unframer.co/v1/projects/${projectId}/components`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch components: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  for (const component of data.components) {
    components.set(component.name, component.code)
  }
  
  return components
}

/**
 * Generate TypeScript types from component controls
 */
function generateTypes(componentName: string, controls: any): string {
  const props: string[] = []
  
  for (const [key, control] of Object.entries(controls || {})) {
    const ctrl = control as any
    let type = 'any'
    
    switch (ctrl.type) {
      case 'string':
        type = 'string'
        break
      case 'number':
        type = 'number'
        break
      case 'boolean':
        type = 'boolean'
        break
      case 'enum':
        type = ctrl.options?.map((o: string) => `'${o}'`).join(' | ') || 'string'
        break
      case 'color':
        type = 'string'
        break
      case 'image':
        type = '{ src: string; srcSet?: string; alt?: string }'
        break
      case 'link':
        type = 'string'
        break
      case 'componentInstance':
        type = 'React.ReactNode'
        break
    }
    
    props.push(`  ${key}?: ${type}`)
  }
  
  return `export interface ${componentName}Props {
${props.join('\n')}
  className?: string
  style?: React.CSSProperties
}`
}

/**
 * Write component files to disk
 */
async function writeComponents(
  components: Map<string, string>,
  outDir: string,
  spinner: ora.Ora
): Promise<void> {
  // Ensure output directory exists
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }
  
  // Write each component
  for (const [name, code] of components) {
    const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}.js`
    const filePath = join(outDir, fileName)
    
    writeFileSync(filePath, code)
    spinner.text = `Writing ${fileName}...`
  }
  
  // Write index file that exports all components
  const indexContent = Array.from(components.keys())
    .map(name => {
      const fileName = name.toLowerCase().replace(/\s+/g, '-')
      return `export { default as ${name} } from './${fileName}.js'`
    })
    .join('\n')
  
  writeFileSync(join(outDir, 'index.js'), indexContent)
  
  // Write base styles
  const stylesContent = `/* Unframe Framer Styles */
@import '@unframe/runtime/styles.css';

/* Component-specific styles will be injected at runtime */
`
  writeFileSync(join(outDir, 'styles.css'), stylesContent)
}

export function createSyncCommand(): Command {
  const command = new Command('sync')
    .description('Sync Framer components to your project')
    .argument('<projectId>', 'Framer project ID')
    .option('-o, --outDir <dir>', 'Output directory', './framer')
    .option('-w, --watch', 'Watch for changes', false)
    .option('-v, --verbose', 'Verbose output', false)
    .action(async (projectId: string, options: SyncOptions) => {
      const spinner = ora('Syncing Framer components...').start()
      
      try {
        // Fetch components
        spinner.text = 'Fetching component list...'
        const components = await fetchFramerComponents(projectId)
        
        if (components.size === 0) {
          spinner.warn('No components found. Make sure you\'ve exported components using the Framer React Export plugin.')
          return
        }
        
        spinner.text = `Found ${components.size} components`
        
        // Write to disk
        await writeComponents(components, options.outDir, spinner)
        
        spinner.succeed(`Synced ${components.size} components to ${options.outDir}`)
        
        console.log(`
  Next steps:

    1. Import styles in your app:
       import '${options.outDir}/styles.css'

    2. Import and use components:
       import { MyComponent } from '${options.outDir}'

    3. Wrap your app with UnframeProvider:
       import { UnframeProvider } from '@unframe/runtime'
       
       <UnframeProvider>
         <MyComponent />
       </UnframeProvider>
`)
        
        if (options.watch) {
          spinner.start('Watching for changes...')
          // TODO: Implement watch mode
        }
        
      } catch (error) {
        spinner.fail(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        process.exit(1)
      }
    })
  
  return command
}
