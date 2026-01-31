/**
 * Generator Module
 * 
 * Generates React components and Next.js project scaffolding from AST.
 */

export {
  ReactGenerator,
  createReactGenerator,
  type GeneratorConfig,
  type GeneratedComponent,
  type ImportStatement,
} from './react-generator.js'

export {
  NextjsScaffolder,
  createNextjsScaffolder,
  scaffoldNextjsProject,
  type ScaffoldResult,
  type TailwindConfigData,
  type PackageJsonData,
} from './nextjs-scaffold.js'
