/**
 * Output Types
 * 
 * Represents the generated files and export result.
 */

// ============================================
// Export Configuration
// ============================================

export interface ExportConfig {
  // Output settings
  outputDir: string;
  framework: 'nextjs-app' | 'nextjs-pages' | 'astro' | 'remix';
  styling: 'tailwind' | 'css' | 'css-modules';
  
  // Feature flags
  features: {
    animations: boolean;
    cms: boolean;
    responsive: boolean;
    darkMode: boolean;
  };
  
  // Code style
  codeStyle: {
    typescript: boolean;
    semicolons: boolean;
    singleQuote: boolean;
    tabWidth: number;
  };
  
  // CMS options
  cms?: {
    provider: 'contentlayer' | 'mdx' | 'sanity' | 'none';
    contentDir: string;
  };
}

export const defaultExportConfig: ExportConfig = {
  outputDir: './out',
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
  cms: {
    provider: 'contentlayer',
    contentDir: 'content',
  },
};

// ============================================
// Output Files
// ============================================

export type OutputFileType = 
  | 'tsx'
  | 'ts'
  | 'jsx'
  | 'js'
  | 'css'
  | 'mdx'
  | 'md'
  | 'json'
  | 'yaml';

export interface OutputFile {
  path: string;
  content: string;
  type: OutputFileType;
  description?: string;
}

export interface OutputDirectory {
  path: string;
  description?: string;
}

// ============================================
// Asset Downloads
// ============================================

export interface AssetDownload {
  url: string;
  localPath: string;
  type: 'image' | 'video' | 'font' | 'svg' | 'other';
  status: 'pending' | 'downloading' | 'complete' | 'failed';
  error?: string;
}

// ============================================
// Export Result
// ============================================

export interface ExportResult {
  success: boolean;
  outputDir: string;
  
  // Generated content
  files: OutputFile[];
  directories: OutputDirectory[];
  assets: AssetDownload[];
  
  // Statistics
  stats: ExportStats;
  
  // Issues
  warnings: ExportWarning[];
  errors: ExportError[];
  
  // Timing
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

export interface ExportStats {
  pages: number;
  components: number;
  styles: number;
  contentItems: number;
  assets: number;
  totalFiles: number;
  totalBytes: number;
}

export interface ExportWarning {
  code: string;
  message: string;
  location?: string;
  suggestion?: string;
}

export interface ExportError {
  code: string;
  message: string;
  location?: string;
  stack?: string;
}

// ============================================
// Progress Tracking
// ============================================

export type ExportPhase = 
  | 'connecting'
  | 'fetching'
  | 'parsing'
  | 'transforming'
  | 'generating'
  | 'downloading'
  | 'writing'
  | 'complete';

export interface ExportProgress {
  phase: ExportPhase;
  percent: number;
  message: string;
  details?: {
    current: number;
    total: number;
    item?: string;
  };
}

export type ProgressCallback = (progress: ExportProgress) => void;
