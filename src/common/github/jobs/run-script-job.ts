import type {Job} from 'projen/lib/github/workflows-model'
import {job} from './job'
import type {NodeJobOptions} from './node-job-options'
import {setupNode} from './setup-node'

export interface RunScriptJobOptions extends NodeJobOptions {
  /**
   * Script name to run. E.g. command === "build" will result in "npm run build"
   */
  readonly command: string
}

/**
 * Create GitHub workflow job which runs a node.js script with a given setup.
 */
export const runScriptJob = (options: RunScriptJobOptions): Job => {
  const {command, runsOn, runScriptCommand, workingDirectory} = options
  const steps = setupNode(options)
  steps.push({name: 'Execute the command', run: `${runScriptCommand} ${command}`, workingDirectory})
  return job(steps, runsOn)
}
