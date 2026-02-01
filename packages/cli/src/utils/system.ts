/**
 * System Utilities
 * 
 * Check for required dependencies and system requirements.
 */

import { execSync } from 'node:child_process'

export interface SystemCheck {
  name: string
  ok: boolean
  version?: string
  error?: string
}

/**
 * Check if a command exists and get its version
 */
function checkCommand(cmd: string, versionArg = '--version'): SystemCheck {
  try {
    const output = execSync(`${cmd} ${versionArg}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim()
    
    // Extract version number (handles "v18.0.0", "9.0.0", "node v18.0.0", etc.)
    const versionMatch = output.match(/v?(\d+\.\d+\.\d+)/)
    const version = versionMatch ? versionMatch[1] : output.split('\n')[0]
    
    return { name: cmd, ok: true, version }
  } catch {
    return { name: cmd, ok: false, error: `${cmd} not found` }
  }
}

/**
 * Check Node.js version meets minimum requirement
 */
export function checkNodeVersion(minMajor = 18): SystemCheck {
  const check = checkCommand('node')
  
  if (!check.ok) {
    return { ...check, error: 'Node.js is not installed' }
  }
  
  const major = parseInt(check.version?.split('.')[0] || '0', 10)
  
  if (major < minMajor) {
    return {
      name: 'node',
      ok: false,
      version: check.version,
      error: `Node.js ${minMajor}+ required (found ${check.version})`,
    }
  }
  
  return check
}

/**
 * Check if npm is available
 */
export function checkNpm(): SystemCheck {
  return checkCommand('npm')
}

/**
 * Run all system checks
 */
export function runSystemChecks(): { checks: SystemCheck[]; allPassed: boolean } {
  const checks = [
    checkNodeVersion(18),
    checkNpm(),
  ]
  
  const allPassed = checks.every(c => c.ok)
  
  return { checks, allPassed }
}

/**
 * Validate Framer URL format and extract project ID
 */
export function parseFramerUrl(urlOrId: string): { projectId: string; isValid: boolean; error?: string } {
  // If it looks like a bare ID (no slashes or dots), accept it
  if (/^[\w-]+$/.test(urlOrId) && !urlOrId.includes('.')) {
    return { projectId: urlOrId, isValid: true }
  }
  
  // Try to parse as URL
  try {
    const url = new URL(urlOrId)
    
    // Check if it's a Framer URL
    if (!url.hostname.includes('framer.com') && !url.hostname.includes('framer.app')) {
      return {
        projectId: '',
        isValid: false,
        error: 'URL does not appear to be a Framer project URL',
      }
    }
    
    // Handle *.framer.app URLs (subdomain is the project)
    if (url.hostname.endsWith('.framer.app')) {
      const subdomain = url.hostname.replace('.framer.app', '')
      if (subdomain && /^[\w-]+$/.test(subdomain)) {
        return { projectId: subdomain, isValid: true }
      }
    }
    
    // Extract project ID from path
    // Formats: /projects/abc123, /abc123
    const pathParts = url.pathname.split('/').filter(Boolean)
    
    if (pathParts.includes('projects') && pathParts.length > pathParts.indexOf('projects') + 1) {
      const projectId = pathParts[pathParts.indexOf('projects') + 1]
      return { projectId, isValid: true }
    }
    
    // Try the last segment
    const lastPart = pathParts[pathParts.length - 1]
    if (lastPart && /^[\w-]+$/.test(lastPart)) {
      return { projectId: lastPart, isValid: true }
    }
    
    return {
      projectId: '',
      isValid: false,
      error: 'Could not extract project ID from URL',
    }
  } catch {
    // Not a valid URL and not a bare ID
    return {
      projectId: '',
      isValid: false,
      error: 'Invalid project ID or URL format',
    }
  }
}
