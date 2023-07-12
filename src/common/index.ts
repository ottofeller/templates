export {MaybePlural} from './MaybePlural'
export * from './codegen'
export {WithDocker} from './docker/with-docker'
export {AssetFile, AssetFileOptions, AssetFileTemplate} from './files/AssetFile'
export {WithGitHooks, addHusky, extendGitignore} from './git'
export {
  NodeJobOptions,
  RunScriptJobOptions,
  SetupNodeOptions,
  WithDefaultWorkflow,
  runScriptJob,
  setupNode,
} from './github'
export {WithCustomLintPaths, addLinters} from './lint'
export {addVsCode} from './vscode-settings'
