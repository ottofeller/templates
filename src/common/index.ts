export {MaybePlural} from './MaybePlural'
export {WithDocker} from './docker/with-docker'
export {AssetFile, AssetFileOptions, AssetFileTemplate} from './files/AssetFile'
export {CheckCargoOptions, HuskyRule, WithGitHooks, addHusky, extendGitignore} from './git'
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
