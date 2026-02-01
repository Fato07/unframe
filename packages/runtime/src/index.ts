/**
 * @unframe/runtime
 * 
 * Runtime wrapper for using Framer components in React applications.
 * This embeds Framer's runtime to ensure pixel-perfect rendering.
 */

import * as React from 'react'
import { createContext, useContext, ReactNode, ComponentType } from 'react'

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
export interface UnframeProviderProps extends UnframeConfig {
  children: ReactNode
}

export function UnframeProvider({
  children,
  assetBasePath = '/framer',
  locale,
  navigate,
  darkMode = false,
}: UnframeProviderProps): React.ReactElement {
  return React.createElement(
    UnframeContext.Provider,
    { value: { assetBasePath, locale, navigate, darkMode } },
    React.createElement('div', { className: darkMode ? 'dark' : '' }, children)
  )
}

/**
 * Hook to access Unframe configuration
 */
export function useUnframe(): UnframeConfig {
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
  component: ComponentType<{ variant?: V } & Record<string, unknown>>
  /** Additional props to pass to the component */
  [key: string]: unknown
}

export function Responsive<V extends string>({
  variants,
  component: Component,
  ...props
}: ResponsiveProps<V>): React.ReactElement {
  // This will be enhanced with actual breakpoint detection
  // For now, render desktop variant
  const variant = variants.lg || variants.md || variants.base
  
  return React.createElement(Component, { variant, ...props })
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
export type FramerComponentProps<P = Record<string, unknown>> = P & {
  className?: string
  style?: React.CSSProperties
}
