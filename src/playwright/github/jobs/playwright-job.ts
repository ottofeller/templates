import {Job} from 'projen/lib/github/workflows-model'
import {job} from '../../../common/github/jobs/job'
import {NodeJobOptions} from '../../../common/github/jobs/node-job-options'
import {setupNode} from '../../../common/github/jobs/setup-node'

/**
 * Create GitHub workflow job which runs a node.js script with a given setup.
 */
export const playwrightJob = (options: NodeJobOptions): Job => {
  const {runsOn, workingDirectory} = options
  const steps = setupNode(options)

  steps.push(
    {name: 'Install Playwright browsers', run: 'npx playwright install --with-deps chromium', workingDirectory},
    {name: 'Run tests', run: 'npm run playwright test', workingDirectory},
  )

  return job(steps, runsOn)
}
