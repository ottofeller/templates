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
  NodeJobOptions,
  RunScriptJobOptions,
  SetupNodeOptions,
  WithDefaultWorkflow,
  runScriptJob,
  setupNode,
} from './github'
export {WithCustomLintPaths, addLinters} from './lint'
export {addTaskOrScript} from './tasks'
export {IWithTelemetryReportUrl, TelemetryOptions, WithTelemetry, collectTelemetry, setupTelemetry} from './telemetry'
export {addVsCode} from './vscode-settings'
