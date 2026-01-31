/**
 * Config Loader
 * 
 * Uses cosmiconfig to load .unframerc configuration files.
 */

import { cosmiconfig, type CosmiconfigResult } from 'cosmiconfig'
import type { ExportConfig } from '@unframe/core'

// ============================================
// Types
// ============================================

export interface UnframeConfig {
  /**
   * Framer project ID or MCP URL
   */
  project?: string

  /**
   * MCP server URL (if not using project ID)
   */
  mcpUrl?: string

  /**
   * Output directory for generated files
   */
  output?: string

  /**
   * Export configuration
   */
  export?: Partial<ExportConfig>

  /**
   * MCP client options
   */
  mcp?: {
    timeout?: number
    retries?: number
    debug?: boolean
  }
}

export interface ResolvedConfig extends UnframeConfig {
  configPath?: string
}

// ============================================
// Default Configuration
// ============================================

export const DEFAULT_CONFIG: UnframeConfig = {
  output: './out',
  export: {
    framework: 'nextjs-app',
    styling: 'tailwind',
    features: {
      animations: true,
      cms: true,
      responsive: true,
      darkMode: false,
    },
    codeStyle: {
      typescript: true,
      semicolons: false,
      singleQuote: true,
      tabWidth: 2,
    },
  },
  mcp: {
    timeout: 60000,
    retries: 3,
    debug: false,
  },
}

// ============================================
// Config Loader
// ============================================

const explorer = cosmiconfig('unframe', {
  searchPlaces: [
    '.unframerc',
    '.unframerc.json',
    '.unframerc.yaml',
    '.unframerc.yml',
    '.unframerc.js',
    '.unframerc.cjs',
    '.unframerc.mjs',
    'unframe.config.js',
    'unframe.config.cjs',
    'unframe.config.mjs',
    'unframe.config.json',
    'package.json',
  ],
})

/**
 * Load configuration from file
 */
export async function loadConfig(searchFrom?: string): Promise<ResolvedConfig> {
  let result: CosmiconfigResult = null

  try {
    result = await explorer.search(searchFrom)
  } catch (error) {
    // Config file parsing error
    if (error instanceof Error) {
      throw new Error(`Failed to parse config file: ${error.message}`)
    }
    throw error
  }

  if (!result || result.isEmpty) {
    return { ...DEFAULT_CONFIG }
  }

  const config = result.config as UnframeConfig

  return {
    ...DEFAULT_CONFIG,
    ...config,
    export: {
      ...DEFAULT_CONFIG.export,
      ...config.export,
      features: {
        ...DEFAULT_CONFIG.export?.features,
        ...config.export?.features,
      },
      codeStyle: {
        ...DEFAULT_CONFIG.export?.codeStyle,
        ...config.export?.codeStyle,
      },
    },
    mcp: {
      ...DEFAULT_CONFIG.mcp,
      ...config.mcp,
    },
    configPath: result.filepath,
  }
}

/**
 * Load configuration from a specific file path
 */
export async function loadConfigFromPath(filepath: string): Promise<ResolvedConfig> {
  try {
    const result = await explorer.load(filepath)

    if (!result || result.isEmpty) {
      return { ...DEFAULT_CONFIG }
    }

    const config = result.config as UnframeConfig

    return {
      ...DEFAULT_CONFIG,
      ...config,
      export: {
        ...DEFAULT_CONFIG.export,
        ...config.export,
        features: {
          ...DEFAULT_CONFIG.export?.features,
          ...config.export?.features,
        },
        codeStyle: {
          ...DEFAULT_CONFIG.export?.codeStyle,
          ...config.export?.codeStyle,
        },
      },
      mcp: {
        ...DEFAULT_CONFIG.mcp,
        ...config.mcp,
      },
      configPath: result.filepath,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config from ${filepath}: ${error.message}`)
    }
    throw error
  }
}

/**
 * Merge CLI options with loaded config
 */
export function mergeConfig(
  config: ResolvedConfig,
  cliOptions: Partial<UnframeConfig>
): ResolvedConfig {
  return {
    ...config,
    project: cliOptions.project ?? config.project,
    mcpUrl: cliOptions.mcpUrl ?? config.mcpUrl,
    output: cliOptions.output ?? config.output,
    export: {
      ...config.export,
      ...cliOptions.export,
    },
    mcp: {
      ...config.mcp,
      ...cliOptions.mcp,
    },
  }
}

/**
 * Get default config template for init command
 */
export function getConfigTemplate(projectId?: string): string {
  const config = {
    $schema: 'https://unframer.co/schema/config.json',
    project: projectId || '<your-framer-project-id>',
    output: './out',
    export: {
      framework: 'nextjs-app',
      styling: 'tailwind',
      features: {
        animations: true,
        cms: true,
        responsive: true,
        darkMode: false,
      },
      codeStyle: {
        typescript: true,
        semicolons: false,
        singleQuote: true,
        tabWidth: 2,
      },
    },
    mcp: {
      timeout: 60000,
      retries: 3,
    },
  }

  return JSON.stringify(config, null, 2) + '\n'
}
