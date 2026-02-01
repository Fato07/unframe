/**
 * Transformer Module
 * 
 * Converts Framer styles and structures to web-native formats.
 */

export {
  StyleExtractor,
  createStyleExtractor,
  classesToString,
  extractResponsiveClasses,
  extractElementResponsiveClasses,
  type TailwindClass,
  type ExtractedStyles,
  type StyleExtractorConfig,
  type ResponsiveStyles,
} from './style-extractor.js'
