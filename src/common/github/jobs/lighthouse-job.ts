import type {Job} from 'projen/lib/github/workflows-model'
import {job} from './job'
import type {NodeJobOptions} from './node-job-options'
import {setupNode} from './setup-node'

/**
 * Create GitHub workflow job which runs a node.js script with a given setup.
 */
export const lighthouseJob = (options: NodeJobOptions): Job => {
  const {runsOn, runScriptCommand, workingDirectory} = options
  const steps = setupNode(options)

  steps.push(
    {name: 'Copy environment variables', run: 'cp .env.development .env.local', workingDirectory},
    {name: 'Build Next.js application', run: `${runScriptCommand} build`, workingDirectory},
    {name: 'Run Lighthouse audit', run: `${runScriptCommand} lighthouse`, workingDirectory},
    {
      name: 'Save Lighthouse report as an artifact',
      uses: 'actions/upload-artifact@v4',
      if: 'always()',
      with: {name: 'lighthouse-report', path: '.lighthouseci/'},
      workingDirectory,
    },
  )

  return job(steps, runsOn)
}
