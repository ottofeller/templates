export * from './codegen'
export {WithDocker} from './docker/with-docker'
export {AssetFile, AssetFileOptions, AssetFileTemplate} from './files/AssetFile'
export {addHusky, extendGitignore, WithGitHooks} from './git'
export {
  NodeJobOptions,
  runScriptJob,
  RunScriptJobOptions,
  setupNode,
  SetupNodeOptions,
  WithDefaultWorkflow,
} from './github'
export {addLinters, WithCustomLintPaths} from './lint'
export {MaybePlural} from './MaybePlural'
export {VsCodeSettings, WithVSCode} from './vscode-settings'
