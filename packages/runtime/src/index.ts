/**
 * @unframe/runtime
 * 
 * Runtime wrapper for using Framer components in React applications.
 * This embeds Framer's runtime to ensure pixel-perfect rendering.
 */

import { createContext, useContext, ReactNode } from 'react'

// Re-export framer-motion for animations
export * from 'framer-motion'

/**
 * Unframe configuration context
 */
export interface UnframeConfig {
  /** Base path for Framer assets */
  assetBasePath?: string
  /** Locale for localized content */
  locale?: string
  /** Custom link handler for navigation */
  navigate?: (href: string) => void
  /** Enable dark mode */
  darkMode?: boolean
}

const UnframeContext = createContext<UnframeConfig>({})

/**
 * Provider for Unframe configuration
 */
export function UnframeProvider({
  children,
  assetBasePath = '/framer',
  locale,
  navigate,
  darkMode = false,
}: UnframeConfig & { children: ReactNode }) {
  return (
    <UnframeContext.Provider value={{ assetBasePath, locale, navigate, darkMode }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </UnframeContext.Provider>
  )
}

/**
 * Hook to access Unframe configuration
 */
export function useUnframe() {
  return useContext(UnframeContext)
}

/**
 * Responsive component wrapper
 * Renders different variants based on breakpoint
 */
export interface ResponsiveProps<V extends string = string> {
  /** Variants for each breakpoint */
  variants: {
    base?: V    // Mobile (default)
    md?: V      // Tablet (768px+)
    lg?: V      // Desktop (1024px+)
  }
  /** The component to render */
  component: React.ComponentType<{ variant?: V }>
  /** Additional props to pass to the component */
  [key: string]: any
}

export function Responsive<V extends string>({
  variants,
  component: Component,
  ...props
}: ResponsiveProps<V>) {
  // This will be enhanced with actual breakpoint detection
  // For now, render desktop variant
  const variant = variants.lg || variants.md || variants.base
  
  return <Component variant={variant} {...props} />
}

/**
 * Frame styles that should be included globally
 */
export const globalStyles = `
/* Unframe base styles */
.unframe-component {
  position: relative;
}

/* Dark mode support */
.dark {
  color-scheme: dark;
}

/* Framer-specific resets */
.framer-component * {
  box-sizing: border-box;
}
`

/**
 * Type helper for Framer component props
 */
export type FramerComponentProps<P = {}> = P & {
  className?: string
  style?: React.CSSProperties
}
