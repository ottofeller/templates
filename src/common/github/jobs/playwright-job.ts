import {Job} from 'projen/lib/github/workflows-model'
import {job} from './job'
import {NodeJobOptions} from './node-job-options'
import {setupNode} from './setup-node'

/**
 * Create GitHub workflow job which runs a node.js script with a given setup.
 */
export const playwrightJob = (options: NodeJobOptions): Job => {
  const {runsOn, runScriptCommand, workingDirectory} = options
  const steps = setupNode(options)

  steps.push(
    {name: 'Install dependencies', run: 'npm install', workingDirectory},
    {name: 'Copy environment variables', run: 'cp .env.development .env.local', workingDirectory},
    {name: 'Build Next.js application', run: `${runScriptCommand} build`, workingDirectory},
    {name: 'Run end-to-end tests', run: `${runScriptCommand} test:e2e`, workingDirectory},
  )

  return job(steps, runsOn)
}
