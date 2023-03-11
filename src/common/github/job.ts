import * as projen from 'projen'
import {Job, JobStep} from 'projen/lib/github/workflows-model'

/**
 * Create basic GitHub workflow job.
 * @param steps An array of one or more steps.
 */
export const job = (steps: Array<JobStep>): Job => ({
  runsOn: ['ubuntu-latest'],
  permissions: {contents: projen.github.workflows.JobPermission.READ},
  steps,
})
