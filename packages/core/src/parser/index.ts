/**
 * @unframe/core/parser
 *
 * XML parsing and AST building for Framer projects.
 */

export {
  parseProjectXml,
  parseNodeXml,
  extractFocusedNodeId,
  parseColorValue,
  parseFontValue,
  type ParsedColor,
  type ParsedFont,
} from './xml-parser.js'

export {
  ASTBuilder,
  createASTBuilder,
  type ASTBuilderOptions,
} from './ast-builder.js'
