export {MaybePlural} from './MaybePlural'
export {WithDocker} from './docker/with-docker'
export {AssetFile, AssetFileOptions, AssetFileTemplate} from './files/AssetFile'
export {
  CheckCargoOptions,
  CustomRuleOptions,
  GitHook,
  HuskyRule,
  WithGitHooks,
  WithIgnoreBranches,
  addHusky,
  extendGitignore,
} from './git'
export {
  CodeOwners,
  CodeOwnersOptions,
  NodeJobOptions,
  PatternOwners,
  RunScriptJobOptions,
  RustTestWorkflow,
  RustTestWorkflowOptions,
  SetupNodeOptions,
  WithCodeOwners,
  WithDefaultWorkflow,
  WithRustTestWorkflow,
  runScriptJob,
  setupNode,
} from './github'
export {WithGraphql} from './graphql/with-graphql'
export {WithCustomLintPaths, addLinters} from './lint'
export {renderReadme} from './readme'
export {addTaskOrScript} from './tasks'
export {IWithTelemetryReportUrl, TelemetryOptions, WithTelemetry, collectTelemetry, setupTelemetry} from './telemetry'
export {addVsCode} from './vscode-settings'
