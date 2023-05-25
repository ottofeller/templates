/* eslint-disable import/no-relative-parent-imports -- types are not bundled and therefore are not correctly exported with path aliases */
import * as projen from 'projen'
import type {Job, JobStep} from 'projen/lib/github/workflows-model'
import type {MaybePlural} from '../../MaybePlural'

/**
 * Create basic GitHub workflow job.
 * @param steps An array of one or more steps.
 * @param runsOn An array of one or more types of machine to run the job on.
 * @default ['ubuntu-latest']
 */
export const job = (steps: MaybePlural<JobStep>, runsOn = ['ubuntu-latest']): Job => ({
  permissions: {contents: projen.github.workflows.JobPermission.READ},
  runsOn,
  steps: Array.isArray(steps) ? steps : [steps],
})
