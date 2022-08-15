import * as projen from 'projen'
import {JobStep} from 'projen/lib/github/workflows-model'

/**
 * Create basic GitHub workflow job.
 */
export const job = (
  /**
   * An array of one or more steps.
   */
  steps: Array<JobStep>,
) => ({
  runsOn: ['ubuntu-latest'],
  permissions: {contents: projen.github.workflows.JobPermission.READ},
  steps,
})
